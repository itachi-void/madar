<?php
defined( 'ABSPATH' ) || exit;

function madar_register_form_routes() {
	$text = array( 'type' => 'string' );
	register_rest_route(
		'madar/v1',
		'/stock-alerts',
		array(
			'methods'             => 'POST',
			'callback'            => 'madar_rest_stock_alert',
			'permission_callback' => '__return_true',
			'args'                => array(
				'email'        => array(
					'type'     => 'string',
					'required' => true,
				),
				'product_id'   => array(
					'type'     => 'integer',
					'required' => true,
				),
				'variation_id' => array( 'type' => 'integer' ),
				'lang'         => $text,
				'consent'      => array( 'type' => 'boolean' ),
				'website'      => $text,
			),
		)
	);
	register_rest_route(
		'madar/v1',
		'/concierge',
		array(
			'methods'             => 'POST',
			'callback'            => 'madar_rest_concierge',
			'permission_callback' => '__return_true',
			'args'                => array(
				'name'       => $text,
				'email'      => array(
					'type'     => 'string',
					'required' => true,
				),
				'question'   => array(
					'type'     => 'string',
					'required' => true,
				),
				'product_id' => array( 'type' => 'integer' ),
				'lang'       => $text,
				'consent'    => array( 'type' => 'boolean' ),
				'website'    => $text,
			),
		)
	);
}

function madar_form_guard( WP_REST_Request $request, $bucket, $limit ) {
	if ( true !== rest_sanitize_boolean( $request['consent'] ) ) {
		return madar_error( 'madar_consent_required', 'Please confirm that we may email you about this request.', 400 );
	}
	if ( madar_rate_limited( $bucket, $limit, HOUR_IN_SECONDS ) ) {
		return madar_error( 'madar_rate_limited', 'Too many requests. Please try again later.', 429 );
	}
	if ( ! is_email( sanitize_email( (string) $request['email'] ) ) ) {
		return madar_error( 'madar_invalid_email', 'Enter a valid email address.', 400 );
	}
	return true;
}

function madar_rest_stock_alert( WP_REST_Request $request ) {
	if ( '' !== (string) $request['website'] ) {
		return rest_ensure_response( array( 'subscribed' => true ) );
	}
	$guard = madar_form_guard( $request, 'stock', 10 );
	if ( is_wp_error( $guard ) ) {
		return $guard;
	}
	$email   = sanitize_email( (string) $request['email'] );
	$product = wc_get_product( absint( $request['product_id'] ) );
	if ( ! $product || 'publish' !== $product->get_status() ) {
		return madar_error( 'madar_product_not_found', 'Product not found.', 404 );
	}
	$target       = $product;
	$variation_id = absint( $request['variation_id'] );
	if ( $variation_id ) {
		$target = wc_get_product( $variation_id );
		if ( ! $target || $target->get_parent_id() !== $product->get_id() ) {
			return madar_error( 'madar_invalid_option', 'This option does not belong to the product.', 400 );
		}
	}
	if ( $target->is_in_stock() ) {
		return madar_error( 'madar_in_stock', 'This option is available now.', 409 );
	}
	$existing = get_posts(
		array(
			'post_type'   => 'madar_stock_alert',
			'post_status' => 'private',
			'numberposts' => 1,
			'fields'      => 'ids',
			'meta_query'  => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				array(
					'key'   => '_madar_email',
					'value' => $email,
				),
				array(
					'key'   => '_madar_target_id',
					'value' => $target->get_id(),
				),
				array(
					'key'   => '_madar_status',
					'value' => 'pending',
				),
			),
		)
	);
	if ( ! $existing ) {
		wp_insert_post(
			array(
				'post_type'   => 'madar_stock_alert',
				'post_status' => 'private',
				'post_title'  => $email . ' — ' . $target->get_name(),
				'meta_input'  => array(
					'_madar_email'      => $email,
					'_madar_product_id' => $product->get_id(),
					'_madar_target_id'  => $target->get_id(),
					'_madar_lang'       => madar_lang( (string) $request['lang'] ),
					'_madar_status'     => 'pending',
				),
			)
		);
	}
	return new WP_REST_Response( array( 'subscribed' => true ), 201 );
}

function madar_rest_concierge( WP_REST_Request $request ) {
	if ( '' !== (string) $request['website'] ) {
		return rest_ensure_response( array( 'received' => true ) );
	}
	$guard = madar_form_guard( $request, 'concierge', 5 );
	if ( is_wp_error( $guard ) ) {
		return $guard;
	}
	$email    = sanitize_email( (string) $request['email'] );
	$name     = mb_substr( sanitize_text_field( (string) $request['name'] ), 0, 80 );
	$question = sanitize_textarea_field( (string) $request['question'] );
	$length   = mb_strlen( $question );
	if ( $length < 10 || $length > 2000 ) {
		return madar_error( 'madar_invalid_question', 'Write between 10 and 2000 characters.', 400 );
	}
	$product = absint( $request['product_id'] ) ? wc_get_product( absint( $request['product_id'] ) ) : null;
	$subject = $product ? $product->get_name() : 'General';
	wp_insert_post(
		array(
			'post_type'    => 'madar_question',
			'post_status'  => 'private',
			'post_title'   => ( $name ? $name : $email ) . ' — ' . $subject,
			'post_content' => $question,
			'meta_input'   => array(
				'_madar_email'      => $email,
				'_madar_name'       => $name,
				'_madar_product_id' => $product ? $product->get_id() : 0,
				'_madar_lang'       => madar_lang( (string) $request['lang'] ),
				'_madar_status'     => 'new',
			),
		)
	);
	$to = sanitize_email( (string) get_option( 'madar_concierge_email', '' ) );
	wp_mail(
		$to ? $to : get_option( 'admin_email' ),
		'[Madar] Concierge question — ' . $subject,
		"From: {$name} <{$email}>\nProduct: {$subject}\nLanguage: " . madar_lang( (string) $request['lang'] ) . "\n\n{$question}\n",
		array( 'Reply-To: ' . ( $name ? $name : $email ) . ' <' . $email . '>' )
	);
	return new WP_REST_Response( array( 'received' => true ), 201 );
}

function madar_boot_stock_alerts() {
	add_action( 'woocommerce_product_set_stock_status', 'madar_send_stock_alerts', 10, 2 );
	add_action( 'woocommerce_variation_set_stock_status', 'madar_send_stock_alerts', 10, 2 );
}

function madar_stock_alert_copy( $lang ) {
	$copy = array(
		'eg' => array( 'رجع متاح: %s', "القطعة اللي طلبت نبلغك بيها رجعت متاحة:\n%s\n\nالكمية محدودة بالمخزون الفعلي، والطلب بيتأكد عند الدفع." ),
		'sa' => array( 'متوفر الآن: %s', "القطعة التي طلبت إشعارك بها متوفرة الآن:\n%s\n\nالتوفر حسب المخزون الفعلي، ويتأكد الطلب عند الدفع." ),
		'en' => array( 'Back in stock: %s', "The piece you asked about is available again:\n%s\n\nAvailability depends on actual stock and is confirmed at checkout." ),
		'fr' => array( 'De retour : %s', "La pièce que vous attendiez est de nouveau disponible :\n%s\n\nLa disponibilité dépend du stock réel et est confirmée au paiement." ),
		'es' => array( 'De nuevo disponible: %s', "La prenda que esperabas vuelve a estar disponible:\n%s\n\nLa disponibilidad depende del stock real y se confirma al pagar." ),
	);
	return $copy[ madar_lang( (string) $lang ) ];
}

function madar_send_stock_alerts( $product_id, $status ) {
	if ( 'instock' !== $status ) {
		return;
	}
	$alerts = get_posts(
		array(
			'post_type'   => 'madar_stock_alert',
			'post_status' => 'private',
			'numberposts' => 200,
			'fields'      => 'ids',
			'meta_query'  => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				array(
					'key'   => '_madar_target_id',
					'value' => $product_id,
				),
				array(
					'key'   => '_madar_status',
					'value' => 'pending',
				),
			),
		)
	);
	foreach ( $alerts as $alert_id ) {
		$parent  = wc_get_product( (int) get_post_meta( $alert_id, '_madar_product_id', true ) );
		$target  = wc_get_product( (int) $product_id );
		$lang    = (string) get_post_meta( $alert_id, '_madar_lang', true );
		$slug    = $parent ? urldecode( $parent->get_slug() ) : '';
		$link    = madar_frontend_url( madar_locale_prefix( $lang ) . 'product/' . $slug . '/' );
		$link    = $link ? $link : ( $parent ? get_permalink( $parent->get_id() ) : home_url( '/' ) );
		$copy    = madar_stock_alert_copy( $lang );
		$name    = $target ? wp_strip_all_tags( $target->get_name() ) : '';
		$sent    = wp_mail( (string) get_post_meta( $alert_id, '_madar_email', true ), sprintf( $copy[0], $name ), sprintf( $copy[1], $link ) );
		update_post_meta( $alert_id, '_madar_status', $sent ? 'sent' : 'failed' );
		update_post_meta( $alert_id, '_madar_sent_at', gmdate( 'c' ) );
	}
}
