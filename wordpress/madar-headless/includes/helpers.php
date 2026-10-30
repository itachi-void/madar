<?php
defined( 'ABSPATH' ) || exit;

const MADAR_LOCALES            = array( 'eg', 'sa', 'en', 'fr', 'es' );
const MADAR_TRANSLATED_LOCALES = array( 'sa', 'en', 'fr', 'es' );

function madar_default_options() {
	return array(
		'madar_frontend_url'      => '',
		'madar_allowed_origins'   => "http://localhost:5173\nhttp://localhost:4173",
		'madar_headless_redirect' => 'no',
		'madar_token_days'        => 30,
		'madar_concierge_email'   => '',
		'madar_size_charts'       => array(),
	);
}

/** Locale code from a request or a string; Egyptian Arabic is the default. */
function madar_lang( $request ) {
	$lang = $request instanceof WP_REST_Request ? (string) $request->get_param( 'lang' ) : (string) $request;
	return in_array( $lang, MADAR_LOCALES, true ) ? $lang : 'eg';
}

/** URL prefix used by the storefront for a locale ("" for Egyptian Arabic). */
function madar_locale_prefix( $lang ) {
	$lang = madar_lang( (string) $lang );
	return 'eg' === $lang ? '' : $lang . '/';
}

/** Translated post field, falling back to the base (Egyptian Arabic) value. */
function madar_i18n( $post_id, $field, $lang, $fallback = '' ) {
	if ( 'eg' !== $lang ) {
		$all = get_post_meta( $post_id, '_madar_i18n', true );
		if ( is_array( $all ) && ! empty( $all[ $lang ][ $field ] ) ) {
			return (string) $all[ $lang ][ $field ];
		}
	}
	return (string) $fallback;
}

/** Picks a locale from a {eg, sa, en, fr, es} map, or returns a plain string. */
function madar_pick( $value, $lang ) {
	if ( is_array( $value ) ) {
		if ( ! empty( $value[ $lang ] ) ) {
			return (string) $value[ $lang ];
		}
		return isset( $value['eg'] ) ? (string) $value['eg'] : '';
	}
	return (string) $value;
}

function madar_int_list( $value ) {
	if ( is_string( $value ) ) {
		$value = preg_split( '/[\s,]+/', $value, -1, PREG_SPLIT_NO_EMPTY );
	}
	if ( ! is_array( $value ) ) {
		return array();
	}
	return array_values( array_unique( array_filter( array_map( 'absint', $value ) ) ) );
}

function madar_frontend_base() {
	return untrailingslashit( (string) get_option( 'madar_frontend_url', '' ) );
}

function madar_frontend_url( $path = '' ) {
	$base = madar_frontend_base();
	return $base ? $base . '/' . ltrim( $path, '/' ) : '';
}

function madar_allowed_origins() {
	$list  = preg_split( '/[\s,]+/', (string) get_option( 'madar_allowed_origins', '' ), -1, PREG_SPLIT_NO_EMPTY );
	$front = wp_parse_url( madar_frontend_base() );
	if ( ! empty( $front['scheme'] ) && ! empty( $front['host'] ) ) {
		$list[] = $front['scheme'] . '://' . $front['host'] . ( isset( $front['port'] ) ? ':' . $front['port'] : '' );
	}
	return array_values( array_unique( array_map( 'untrailingslashit', $list ) ) );
}

function madar_cache_version() {
	return (int) get_option( 'madar_cache_version', 1 );
}

function madar_bump_cache() {
	update_option( 'madar_cache_version', madar_cache_version() + 1, false );
}

function madar_cached( $key, $callback, $ttl = 600 ) {
	$full = 'madar_' . madar_cache_version() . '_' . md5( $key );
	$hit  = get_transient( $full );
	if ( false !== $hit ) {
		return $hit;
	}
	$value = $callback();
	set_transient( $full, $value, $ttl );
	return $value;
}

function madar_image( $attachment_id, $role = '' ) {
	$attachment_id = absint( $attachment_id );
	if ( ! $attachment_id || 'attachment' !== get_post_type( $attachment_id ) ) {
		return null;
	}
	$full = wp_get_attachment_image_src( $attachment_id, 'full' );
	if ( ! $full ) {
		return null;
	}
	return array(
		'id'      => $attachment_id,
		'role'    => $role,
		'src'     => $full[0],
		'width'   => (int) $full[1],
		'height'  => (int) $full[2],
		'srcset'  => (string) wp_get_attachment_image_srcset( $attachment_id, 'full' ),
		'alt'     => (string) get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ),
		'concept' => (bool) get_post_meta( $attachment_id, '_madar_concept', true ),
	);
}

function madar_client_ip() {
	return isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '0.0.0.0';
}

/** Counts an attempt and reports whether the bucket is over its limit. */
function madar_rate_limited( $bucket, $max, $window ) {
	$key   = 'madar_rl_' . md5( $bucket . '|' . madar_client_ip() );
	$count = (int) get_transient( $key );
	if ( $count >= $max ) {
		return true;
	}
	set_transient( $key, $count + 1, $window );
	return false;
}

function madar_error( $code, $message, $status ) {
	return new WP_Error( $code, $message, array( 'status' => $status ) );
}

function madar_money( $amount ) {
	if ( '' === $amount || null === $amount ) {
		return null;
	}
	return wc_format_decimal( $amount, wc_get_price_decimals() );
}

function madar_iso_date( $value ) {
	$time = is_string( $value ) && '' !== $value ? strtotime( $value ) : false;
	return gmdate( 'c', $time ? $time : time() );
}

function madar_ensure_thumbnails() {
	$types   = array( 'product', 'madar_look', 'madar_material' );
	$support = get_theme_support( 'post-thumbnails' );
	if ( true === $support ) {
		return;
	}
	if ( is_array( $support ) && isset( $support[0] ) && is_array( $support[0] ) ) {
		$types = array_values( array_unique( array_merge( $support[0], $types ) ) );
	}
	add_theme_support( 'post-thumbnails', $types );
}

function madar_boot_cache() {
	foreach ( array( 'save_post_product', 'save_post_product_variation', 'save_post_madar_look', 'save_post_madar_material', 'woocommerce_update_product', 'woocommerce_update_product_variation', 'woocommerce_product_set_stock_status', 'woocommerce_variation_set_stock_status', 'deleted_post', 'trashed_post', 'untrashed_post' ) as $hook ) {
		add_action( $hook, 'madar_bump_cache' );
	}
}
