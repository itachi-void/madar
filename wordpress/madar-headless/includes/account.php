<?php
defined( 'ABSPATH' ) || exit;

/*
 * Customer accounts for a cross-origin storefront.
 * The storefront sends "X-Madar-Token: {user_id}.{secret}". Only a keyed hash of the
 * secret is stored. Tokens expire and are revoked on logout or password reset.
 */

function madar_boot_auth() {
	add_filter( 'determine_current_user', 'madar_determine_current_user', 20 );
	add_filter( 'rest_authentication_errors', 'madar_rest_token_errors', 20 );
}

function madar_request_token() {
	$raw = isset( $_SERVER['HTTP_X_MADAR_TOKEN'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_MADAR_TOKEN'] ) ) : '';
	return preg_match( '/^(\d+)\.([A-Za-z0-9]{48})$/', $raw, $match ) ? array( (int) $match[1], $match[2] ) : null;
}

function madar_is_rest_uri() {
	if ( isset( $_GET['rest_route'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return true;
	}
	$uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	return false !== strpos( $uri, '/' . rest_get_url_prefix() . '/' );
}

function madar_determine_current_user( $user_id ) {
	if ( $user_id || ! madar_is_rest_uri() ) {
		return $user_id;
	}
	$token = madar_request_token();
	if ( ! $token ) {
		if ( isset( $_SERVER['HTTP_X_MADAR_TOKEN'] ) ) {
			$GLOBALS['madar_token_invalid'] = true;
		}
		return $user_id;
	}
	$verified = madar_verify_token( $token[0], $token[1] );
	if ( ! $verified ) {
		$GLOBALS['madar_token_invalid'] = true;
		return $user_id;
	}
	return $verified;
}

function madar_rest_token_errors( $result ) {
	if ( ! empty( $result ) ) {
		return $result;
	}
	if ( ! empty( $GLOBALS['madar_token_invalid'] ) ) {
		return madar_error( 'madar_invalid_token', 'Your session has expired. Please sign in again.', 401 );
	}
	return $result;
}

function madar_token_hash( $secret ) {
	return hash_hmac( 'sha256', $secret, wp_salt( 'auth' ) );
}

function madar_live_tokens( $user_id ) {
	$tokens = get_user_meta( $user_id, '_madar_tokens', true );
	$now    = time();
	return array_values(
		array_filter(
			is_array( $tokens ) ? $tokens : array(),
			static function ( $token ) use ( $now ) {
				return is_array( $token ) && isset( $token['hash'], $token['expires'] ) && (int) $token['expires'] > $now;
			}
		)
	);
}

function madar_issue_token( $user_id ) {
	$secret   = wp_generate_password( 48, false, false );
	$days     = max( 1, min( 365, (int) get_option( 'madar_token_days', 30 ) ) );
	$expires  = time() + $days * DAY_IN_SECONDS;
	$tokens   = madar_live_tokens( $user_id );
	$tokens[] = array(
		'hash'    => madar_token_hash( $secret ),
		'expires' => $expires,
	);
	update_user_meta( $user_id, '_madar_tokens', array_slice( $tokens, -5 ) );
	return array(
		'token'      => $user_id . '.' . $secret,
		'expires_at' => gmdate( 'c', $expires ),
	);
}

function madar_verify_token( $user_id, $secret ) {
	if ( ! get_userdata( $user_id ) ) {
		return 0;
	}
	$hash = madar_token_hash( $secret );
	foreach ( madar_live_tokens( $user_id ) as $token ) {
		if ( hash_equals( (string) $token['hash'], $hash ) ) {
			return $user_id;
		}
	}
	return 0;
}

function madar_revoke_token( $user_id, $secret ) {
	$hash = madar_token_hash( $secret );
	update_user_meta(
		$user_id,
		'_madar_tokens',
		array_values(
			array_filter(
				madar_live_tokens( $user_id ),
				static function ( $token ) use ( $hash ) {
					return ! hash_equals( (string) $token['hash'], $hash );
				}
			)
		)
	);
}

function madar_require_user() {
	return is_user_logged_in() ? true : madar_error( 'madar_auth_required', 'Please sign in.', 401 );
}

function madar_register_account_routes() {
	$open = '__return_true';
	$text = array( 'type' => 'string' );
	$need = array(
		'type'     => 'string',
		'required' => true,
	);
	$routes = array(
		'/auth/register'       => array( 'POST', 'madar_rest_register', $open, array( 'email' => $need, 'password' => $need, 'first_name' => $text, 'last_name' => $text ) ),
		'/auth/login'          => array( 'POST', 'madar_rest_login', $open, array( 'login' => $need, 'password' => $need ) ),
		'/auth/logout'         => array( 'POST', 'madar_rest_logout', 'madar_require_user', array() ),
		'/auth/password/lost'  => array( 'POST', 'madar_rest_password_lost', $open, array( 'login' => $need, 'lang' => $text ) ),
		'/auth/password/reset' => array( 'POST', 'madar_rest_password_reset', $open, array( 'login' => $need, 'key' => $need, 'password' => $need ) ),
		'/me/orders'           => array( 'GET', 'madar_rest_my_orders', 'madar_require_user', array() ),
	);
	foreach ( $routes as $route => $spec ) {
		register_rest_route(
			'madar/v1',
			$route,
			array(
				'methods'             => $spec[0],
				'callback'            => $spec[1],
				'permission_callback' => $spec[2],
				'args'                => $spec[3],
			)
		);
	}
	register_rest_route(
		'madar/v1',
		'/me',
		array(
			array(
				'methods'             => 'GET',
				'callback'            => 'madar_rest_me',
				'permission_callback' => 'madar_require_user',
			),
			array(
				'methods'             => 'PUT',
				'callback'            => 'madar_rest_update_me',
				'permission_callback' => 'madar_require_user',
			),
		)
	);
	register_rest_route(
		'madar/v1',
		'/me/wardrobe',
		array(
			array(
				'methods'             => 'GET',
				'callback'            => 'madar_rest_wardrobe',
				'permission_callback' => 'madar_require_user',
			),
			array(
				'methods'             => 'PUT',
				'callback'            => 'madar_rest_update_wardrobe',
				'permission_callback' => 'madar_require_user',
			),
		)
	);
}

function madar_user_payload( $user_id ) {
	$customer = new WC_Customer( $user_id );
	return array(
		'id'         => $user_id,
		'email'      => $customer->get_email(),
		'first_name' => $customer->get_first_name(),
		'last_name'  => $customer->get_last_name(),
		'billing'    => $customer->get_billing(),
		'shipping'   => $customer->get_shipping(),
	);
}

function madar_rest_register( WP_REST_Request $request ) {
	if ( madar_rate_limited( 'register', 5, HOUR_IN_SECONDS ) ) {
		return madar_error( 'madar_rate_limited', 'Too many attempts. Please try again later.', 429 );
	}
	$email    = sanitize_email( (string) $request['email'] );
	$password = (string) $request['password'];
	if ( ! is_email( $email ) ) {
		return madar_error( 'madar_invalid_email', 'Enter a valid email address.', 400 );
	}
	if ( strlen( $password ) < 8 ) {
		return madar_error( 'madar_weak_password', 'Use at least 8 characters.', 400 );
	}
	if ( email_exists( $email ) ) {
		return madar_error( 'madar_account_exists', 'An account already exists for this email. Sign in or reset your password.', 409 );
	}
	$user_id = wc_create_new_customer(
		$email,
		wc_create_new_customer_username( $email ),
		$password,
		array(
			'first_name' => sanitize_text_field( (string) $request['first_name'] ),
			'last_name'  => sanitize_text_field( (string) $request['last_name'] ),
		)
	);
	if ( is_wp_error( $user_id ) ) {
		return madar_error( 'madar_register_failed', wp_strip_all_tags( $user_id->get_error_message() ), 400 );
	}
	return new WP_REST_Response( madar_issue_token( $user_id ) + array( 'user' => madar_user_payload( $user_id ) ), 201 );
}

function madar_rest_login( WP_REST_Request $request ) {
	$login = sanitize_text_field( (string) $request['login'] );
	if ( madar_rate_limited( 'login|' . strtolower( $login ), 8, 15 * MINUTE_IN_SECONDS ) ) {
		return madar_error( 'madar_rate_limited', 'Too many attempts. Please try again later.', 429 );
	}
	$user = wp_authenticate( $login, (string) $request['password'] );
	if ( is_wp_error( $user ) ) {
		return madar_error( 'madar_invalid_login', 'The email or password is incorrect.', 401 );
	}
	return rest_ensure_response( madar_issue_token( $user->ID ) + array( 'user' => madar_user_payload( $user->ID ) ) );
}

function madar_rest_logout() {
	$token = madar_request_token();
	if ( $token ) {
		madar_revoke_token( $token[0], $token[1] );
	}
	return rest_ensure_response( array( 'signed_out' => true ) );
}

function madar_rest_password_lost( WP_REST_Request $request ) {
	if ( madar_rate_limited( 'lost', 5, HOUR_IN_SECONDS ) ) {
		return madar_error( 'madar_rate_limited', 'Too many attempts. Please try again later.', 429 );
	}
	$GLOBALS['madar_reset_lang'] = madar_lang( (string) $request['lang'] );
	retrieve_password( sanitize_text_field( (string) $request['login'] ) );
	// Same answer whether or not the account exists.
	return rest_ensure_response( array( 'sent' => true ) );
}

function madar_rest_password_reset( WP_REST_Request $request ) {
	$password = (string) $request['password'];
	if ( strlen( $password ) < 8 ) {
		return madar_error( 'madar_weak_password', 'Use at least 8 characters.', 400 );
	}
	$user = check_password_reset_key( (string) $request['key'], sanitize_text_field( (string) $request['login'] ) );
	if ( is_wp_error( $user ) && is_email( (string) $request['login'] ) ) {
		$by_email = get_user_by( 'email', sanitize_email( (string) $request['login'] ) );
		$user     = $by_email ? check_password_reset_key( (string) $request['key'], $by_email->user_login ) : $user;
	}
	if ( is_wp_error( $user ) ) {
		return madar_error( 'madar_invalid_reset_key', 'This reset link is invalid or has expired.', 400 );
	}
	reset_password( $user, $password );
	delete_user_meta( $user->ID, '_madar_tokens' );
	return rest_ensure_response( array( 'reset' => true ) );
}

function madar_rest_me() {
	return rest_ensure_response( madar_user_payload( get_current_user_id() ) );
}

function madar_rest_update_me( WP_REST_Request $request ) {
	$customer = new WC_Customer( get_current_user_id() );
	foreach ( array( 'first_name', 'last_name' ) as $field ) {
		if ( null !== $request[ $field ] ) {
			$customer->{'set_' . $field}( sanitize_text_field( (string) $request[ $field ] ) );
		}
	}
	$fields = array( 'first_name', 'last_name', 'company', 'address_1', 'address_2', 'city', 'state', 'postcode', 'country', 'phone' );
	foreach ( array( 'billing', 'shipping' ) as $group ) {
		$values = $request[ $group ];
		if ( ! is_array( $values ) ) {
			continue;
		}
		foreach ( $fields as $field ) {
			$setter = 'set_' . $group . '_' . $field;
			if ( array_key_exists( $field, $values ) && is_callable( array( $customer, $setter ) ) ) {
				$customer->{$setter}( sanitize_text_field( (string) $values[ $field ] ) );
			}
		}
	}
	$customer->save();
	return rest_ensure_response( madar_user_payload( $customer->get_id() ) );
}

function madar_rest_my_orders() {
	$orders = wc_get_orders(
		array(
			'customer_id' => get_current_user_id(),
			'limit'       => 20,
			'orderby'     => 'date',
			'order'       => 'DESC',
		)
	);
	return rest_ensure_response( array_map( 'madar_order_payload', $orders ) );
}

function madar_sanitize_wardrobe( $data ) {
	$data  = is_array( $data ) ? $data : array();
	$items = array();
	$seen  = array();
	foreach ( array_slice( is_array( $data['items'] ?? null ) ? $data['items'] : array(), 0, 200 ) as $item ) {
		$product_id   = absint( is_array( $item ) ? ( $item['product_id'] ?? 0 ) : 0 );
		$variation_id = absint( is_array( $item ) ? ( $item['variation_id'] ?? 0 ) : 0 );
		$key          = $product_id . ':' . $variation_id;
		if ( ! $product_id || isset( $seen[ $key ] ) ) {
			continue;
		}
		$seen[ $key ] = true;
		$items[]      = array(
			'product_id'   => $product_id,
			'variation_id' => $variation_id ? $variation_id : null,
			'added_at'     => madar_iso_date( $item['added_at'] ?? '' ),
		);
	}
	$looks = array();
	foreach ( array_slice( is_array( $data['looks'] ?? null ) ? $data['looks'] : array(), 0, 50 ) as $look ) {
		if ( ! is_array( $look ) ) {
			continue;
		}
		$products = array_slice( madar_int_list( $look['product_ids'] ?? array() ), 0, 12 );
		if ( ! $products ) {
			continue;
		}
		$id      = preg_replace( '/[^A-Za-z0-9-]/', '', (string) ( $look['id'] ?? '' ) );
		$looks[] = array(
			'id'          => $id ? substr( $id, 0, 40 ) : wp_generate_uuid4(),
			'name'        => mb_substr( sanitize_text_field( (string) ( $look['name'] ?? '' ) ), 0, 80 ),
			'product_ids' => $products,
			'created_at'  => madar_iso_date( $look['created_at'] ?? '' ),
		);
	}
	return array(
		'items'      => $items,
		'looks'      => $looks,
		'updated_at' => gmdate( 'c' ),
	);
}

function madar_rest_wardrobe() {
	$stored = get_user_meta( get_current_user_id(), '_madar_wardrobe', true );
	return rest_ensure_response(
		is_array( $stored ) ? $stored : array(
			'items'      => array(),
			'looks'      => array(),
			'updated_at' => null,
		)
	);
}

function madar_rest_update_wardrobe( WP_REST_Request $request ) {
	$clean = madar_sanitize_wardrobe(
		array(
			'items' => $request->get_param( 'items' ),
			'looks' => $request->get_param( 'looks' ),
		)
	);
	update_user_meta( get_current_user_id(), '_madar_wardrobe', $clean );
	return rest_ensure_response( $clean );
}
