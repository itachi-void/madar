<?php
/**
 * Plugin Name:       Madar Headless
 * Description:       Headless WooCommerce API for the Madar storefront: catalog, looks, materials, customer accounts, wardrobe, back-in-stock alerts and concierge questions.
 * Version:           1.1.0
 * Requires at least: 6.4
 * Requires PHP:      8.0
 * Requires Plugins:  woocommerce
 * Author:            Madar
 * License:           GPL-2.0-or-later
 * Text Domain:       madar-headless
 */

defined( 'ABSPATH' ) || exit;

define( 'MADAR_HEADLESS_VERSION', '1.1.0' );
define( 'MADAR_HEADLESS_DIR', plugin_dir_path( __FILE__ ) );

require_once MADAR_HEADLESS_DIR . 'includes/helpers.php';
require_once MADAR_HEADLESS_DIR . 'includes/post-types.php';
require_once MADAR_HEADLESS_DIR . 'includes/catalog.php';
require_once MADAR_HEADLESS_DIR . 'includes/account.php';
require_once MADAR_HEADLESS_DIR . 'includes/forms.php';
require_once MADAR_HEADLESS_DIR . 'includes/cors.php';
require_once MADAR_HEADLESS_DIR . 'includes/headless.php';
require_once MADAR_HEADLESS_DIR . 'includes/admin.php';

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	require_once MADAR_HEADLESS_DIR . 'includes/cli.php';
}

register_activation_hook( __FILE__, 'madar_activate' );

function madar_activate() {
	madar_register_post_types();
	foreach ( madar_default_options() as $name => $value ) {
		add_option( $name, $value );
	}
	flush_rewrite_rules();
}

add_action( 'plugins_loaded', 'madar_boot', 20 );

function madar_boot() {
	if ( ! class_exists( 'WooCommerce' ) ) {
		add_action(
			'admin_notices',
			static function () {
				echo '<div class="notice notice-error"><p>Madar Headless requires WooCommerce to be installed and active.</p></div>';
			}
		);
		return;
	}
	add_action( 'init', 'madar_register_post_types' );
	// A new plugin version may change the API payload: drop cached responses once.
	if ( get_option( 'madar_plugin_version' ) !== MADAR_HEADLESS_VERSION ) {
		update_option( 'madar_plugin_version', MADAR_HEADLESS_VERSION, false );
		madar_bump_cache();
	}
	add_action( 'after_setup_theme', 'madar_ensure_thumbnails', 99 );
	add_action( 'rest_api_init', 'madar_register_catalog_routes' );
	add_action( 'rest_api_init', 'madar_register_account_routes' );
	add_action( 'rest_api_init', 'madar_register_form_routes' );
	madar_boot_auth();
	madar_boot_cors();
	madar_boot_headless();
	madar_boot_cache();
	madar_boot_stock_alerts();
	if ( is_admin() ) {
		madar_boot_admin();
	}
}
