<?php
defined( 'ABSPATH' ) || exit;

function madar_boot_headless() {
	add_action( 'template_redirect', 'madar_headless_redirect', 1 );
	add_filter( 'retrieve_password_message', 'madar_reset_message', 10, 4 );
	add_filter( 'woocommerce_get_checkout_order_received_url', 'madar_order_received_url', 10, 2 );
	add_action( 'woocommerce_store_api_checkout_update_order_from_request', 'madar_store_order_lang', 10, 2 );
}

/** Optional: sends storefront visitors from WordPress pages to the React storefront. */
function madar_headless_redirect() {
	$front = madar_frontend_base();
	if ( 'yes' !== get_option( 'madar_headless_redirect', 'no' ) || ! $front ) {
		return;
	}
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || is_preview() || current_user_can( 'edit_posts' ) ) {
		return;
	}
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	if ( isset( $_GET['wc-api'] ) || isset( $_GET['wc-ajax'] ) || isset( $_GET['rest_route'] ) ) {
		return;
	}
	$uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '/';
	if ( preg_match( '#^/(wp-json|wc-api|wp-login\.php|wp-admin|wp-content|xmlrpc\.php)#', $uri ) ) {
		return;
	}
	wp_redirect( $front . $uri, 302 ); // phpcs:ignore WordPress.Security.SafeRedirect.wp_redirect_wp_redirect
	exit;
}

function madar_reset_message( $message, $key, $user_login, $user_data ) {
	$lang  = isset( $GLOBALS['madar_reset_lang'] ) ? (string) $GLOBALS['madar_reset_lang'] : 'eg';
	$front = madar_frontend_url( madar_locale_prefix( $lang ) . 'my-account/reset-password/' );
	if ( ! $front ) {
		return $message;
	}
	$url = add_query_arg(
		array(
			'key'   => $key,
			'login' => rawurlencode( $user_login ),
		),
		$front
	);
	return "طلب إعادة تعيين كلمة المرور لحساب: {$user_login}\r\nSomeone requested a password reset for: {$user_login}\r\n\r\n"
		. "لو مش إنت، تجاهل الرسالة دي. / If this was not you, ignore this email.\r\n\r\n{$url}\r\n";
}

function madar_order_received_url( $url, $order ) {
	if ( ! $order instanceof WC_Order || ! madar_frontend_base() ) {
		return $url;
	}
	return add_query_arg(
		array(
			'order' => $order->get_id(),
			'key'   => $order->get_order_key(),
		),
		madar_frontend_url( madar_locale_prefix( (string) $order->get_meta( '_madar_lang' ) ) . 'checkout/order-received/' )
	);
}

function madar_store_order_lang( $order, $request ) {
	$lang = $request instanceof WP_REST_Request ? (string) $request->get_header( 'x_madar_lang' ) : '';
	if ( $order instanceof WC_Order && $lang ) {
		$order->update_meta_data( '_madar_lang', madar_lang( $lang ) );
	}
}
