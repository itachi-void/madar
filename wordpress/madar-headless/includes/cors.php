<?php
defined( 'ABSPATH' ) || exit;

const MADAR_CORS_ALLOW  = array( 'Authorization', 'Content-Type', 'X-WP-Nonce', 'X-Madar-Token', 'X-Madar-Lang', 'Cart-Token', 'Nonce', 'X-WC-Store-API-Nonce' );
const MADAR_CORS_EXPOSE = array( 'Cart-Token', 'Nonce', 'X-WC-Store-API-Nonce', 'X-WP-Total', 'X-WP-TotalPages' );

function madar_boot_cors() {
	add_filter(
		'rest_allowed_cors_headers',
		static function ( $headers ) {
			return array_values( array_unique( array_merge( (array) $headers, MADAR_CORS_ALLOW ) ) );
		}
	);
	add_filter(
		'rest_exposed_cors_headers',
		static function ( $headers ) {
			return array_values( array_unique( array_merge( (array) $headers, MADAR_CORS_EXPOSE ) ) );
		}
	);
	// The Store API answers CORS preflight itself and checks this list for normal requests.
	add_filter(
		'allowed_http_origins',
		static function ( $origins ) {
			return array_values( array_unique( array_merge( (array) $origins, madar_allowed_origins() ) ) );
		}
	);
	// Runs after WordPress core and the Store API so only listed storefront origins get CORS access.
	add_filter( 'rest_pre_serve_request', 'madar_enforce_cors', 99 );
}

function madar_enforce_cors( $served ) {
	$origin = get_http_origin();
	if ( ! $origin || headers_sent() ) {
		return $served;
	}
	if ( in_array( untrailingslashit( $origin ), madar_allowed_origins(), true ) ) {
		header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
		header( 'Access-Control-Allow-Credentials: true' );
		header( 'Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, PATCH, DELETE' );
		header( 'Access-Control-Allow-Headers: ' . implode( ', ', MADAR_CORS_ALLOW ) );
		header( 'Access-Control-Expose-Headers: ' . implode( ', ', MADAR_CORS_EXPOSE ) );
		header( 'Vary: Origin', false );
	} else {
		foreach ( array( 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Headers', 'Access-Control-Expose-Headers' ) as $name ) {
			header_remove( $name );
		}
	}
	return $served;
}
