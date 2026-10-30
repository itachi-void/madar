<?php
defined( 'ABSPATH' ) || exit;

const MADAR_LANG_LABELS = array(
	'sa' => 'العربية (السعودية)',
	'en' => 'English',
	'fr' => 'Français',
	'es' => 'Español',
);

function madar_boot_admin() {
	add_action( 'admin_menu', 'madar_admin_menu' );
	add_action( 'admin_init', 'madar_register_settings' );
	add_action( 'add_meta_boxes', 'madar_add_meta_boxes' );
	add_action( 'save_post_product', 'madar_save_product_meta', 20, 2 );
	add_action( 'save_post_madar_look', 'madar_save_look_meta', 20, 2 );
	add_action( 'save_post_madar_material', 'madar_save_material_meta', 20, 2 );
	add_action( 'admin_notices', 'madar_admin_notice' );
	foreach ( array( 'madar_stock_alert', 'madar_question' ) as $type ) {
		add_filter( "manage_{$type}_posts_columns", 'madar_inbox_columns' );
		add_action( "manage_{$type}_posts_custom_column", 'madar_inbox_column', 10, 2 );
	}
}

function madar_admin_menu() {
	add_menu_page( 'Madar', 'Madar', 'manage_woocommerce', 'madar', 'madar_render_settings', 'dashicons-store', 56 );
	add_submenu_page( 'madar', 'Madar settings', 'Settings', 'manage_woocommerce', 'madar', 'madar_render_settings' );
}

function madar_register_settings() {
	register_setting( 'madar_settings', 'madar_frontend_url', array( 'sanitize_callback' => 'esc_url_raw' ) );
	register_setting(
		'madar_settings',
		'madar_allowed_origins',
		array(
			'sanitize_callback' => static function ( $value ) {
				$lines = preg_split( '/[\s,]+/', (string) $value, -1, PREG_SPLIT_NO_EMPTY );
				$clean = array();
				foreach ( $lines as $line ) {
					$parts = wp_parse_url( $line );
					if ( ! empty( $parts['scheme'] ) && ! empty( $parts['host'] ) && in_array( $parts['scheme'], array( 'http', 'https' ), true ) ) {
						$clean[] = $parts['scheme'] . '://' . $parts['host'] . ( isset( $parts['port'] ) ? ':' . $parts['port'] : '' );
					}
				}
				return implode( "\n", array_unique( $clean ) );
			},
		)
	);
	register_setting(
		'madar_settings',
		'madar_headless_redirect',
		array(
			'sanitize_callback' => static function ( $value ) {
				return 'yes' === $value ? 'yes' : 'no';
			},
		)
	);
	register_setting( 'madar_settings', 'madar_concierge_email', array( 'sanitize_callback' => 'sanitize_email' ) );
	register_setting(
		'madar_settings',
		'madar_token_days',
		array(
			'sanitize_callback' => static function ( $value ) {
				return max( 1, min( 365, absint( $value ) ) );
			},
		)
	);
}

function madar_render_settings() {
	if ( ! current_user_can( 'manage_woocommerce' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1>Madar Headless</h1>
		<p>REST base: <code><?php echo esc_html( rest_url( 'madar/v1/' ) ); ?></code> · Store API: <code><?php echo esc_html( rest_url( 'wc/store/v1/' ) ); ?></code></p>
		<form method="post" action="options.php">
			<?php settings_fields( 'madar_settings' ); ?>
			<table class="form-table" role="presentation">
				<tr><th><label for="madar_frontend_url">Storefront URL</label></th>
					<td><input class="regular-text" type="url" id="madar_frontend_url" name="madar_frontend_url" value="<?php echo esc_attr( get_option( 'madar_frontend_url', '' ) ); ?>">
					<p class="description">Used for password-reset, order-confirmation and stock-alert links.</p></td></tr>
				<tr><th><label for="madar_allowed_origins">Allowed storefront origins</label></th>
					<td><textarea class="large-text code" rows="4" id="madar_allowed_origins" name="madar_allowed_origins"><?php echo esc_textarea( get_option( 'madar_allowed_origins', '' ) ); ?></textarea>
					<p class="description">One origin per line, for example <code>https://shop.example.com</code>. The storefront URL is always allowed.</p></td></tr>
				<tr><th>Redirect WordPress pages</th>
					<td><label><input type="checkbox" name="madar_headless_redirect" value="yes" <?php checked( 'yes', get_option( 'madar_headless_redirect', 'no' ) ); ?>> Send visitors from WordPress front-end pages to the storefront (admin, REST, login and payment callbacks are never redirected).</label></td></tr>
				<tr><th><label for="madar_concierge_email">Concierge inbox</label></th>
					<td><input class="regular-text" type="email" id="madar_concierge_email" name="madar_concierge_email" value="<?php echo esc_attr( get_option( 'madar_concierge_email', '' ) ); ?>">
					<p class="description">Empty uses the site admin email.</p></td></tr>
				<tr><th><label for="madar_token_days">Sign-in length (days)</label></th>
					<td><input type="number" min="1" max="365" id="madar_token_days" name="madar_token_days" value="<?php echo esc_attr( (string) get_option( 'madar_token_days', 30 ) ); ?>"></td></tr>
			</table>
			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}

function madar_add_meta_boxes() {
	add_meta_box( 'madar_product', 'Madar storefront', 'madar_product_box', 'product', 'normal', 'default' );
	add_meta_box( 'madar_look', 'Look details', 'madar_look_box', 'madar_look', 'normal', 'high' );
	add_meta_box( 'madar_material', 'Material details', 'madar_material_box', 'madar_material', 'normal', 'high' );
}

function madar_field( $label, $name, $value, $type = 'text', $help = '' ) {
	echo '<p><label><strong>' . esc_html( $label ) . '</strong><br>';
	if ( 'textarea' === $type ) {
		echo '<textarea class="large-text" rows="3" name="' . esc_attr( $name ) . '">' . esc_textarea( (string) $value ) . '</textarea>';
	} elseif ( 'checkbox' === $type ) {
		echo '<input type="checkbox" name="' . esc_attr( $name ) . '" value="yes" ' . checked( 'yes', $value, false ) . '>';
	} else {
		echo '<input class="large-text" type="' . esc_attr( $type ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( (string) $value ) . '">';
	}
	echo '</label>' . ( $help ? '<br><span class="description">' . esc_html( $help ) . '</span>' : '' ) . '</p>';
}

function madar_select( $label, $name, $value, $options ) {
	echo '<p><label><strong>' . esc_html( $label ) . '</strong><br><select name="' . esc_attr( $name ) . '">';
	foreach ( $options as $key => $text ) {
		echo '<option value="' . esc_attr( $key ) . '" ' . selected( $value, $key, false ) . '>' . esc_html( $text ) . '</option>';
	}
	echo '</select></label></p>';
}

function madar_translation_fields( $post_id, $fields ) {
	$all = get_post_meta( $post_id, '_madar_i18n', true );
	$all = is_array( $all ) ? $all : array();
	echo '<hr><h3>Translations</h3><p class="description">The main WordPress fields are Egyptian Arabic. Leave a translation empty to fall back to it.</p>';
	foreach ( MADAR_LANG_LABELS as $lang => $label ) {
		echo '<details><summary><strong>' . esc_html( $label ) . '</strong></summary>';
		foreach ( $fields as $field => $type ) {
			madar_field( $field, "madar_i18n[{$lang}][{$field}]", $all[ $lang ][ $field ] ?? '', $type );
		}
		echo '</details>';
	}
}

function madar_product_box( $post ) {
	wp_nonce_field( 'madar_save_product', 'madar_product_nonce' );
	$meta   = static function ( $key ) use ( $post ) {
		return get_post_meta( $post->ID, $key, true );
	};
	$images = $meta( '_madar_images' );
	$images = is_array( $images ) ? $images : array();
	madar_select( 'Audience', 'madar_audience', $meta( '_madar_audience' ), array( '' => 'From category', 'men' => 'Men', 'kids' => 'Kids' ) );
	madar_select( 'Size chart', 'madar_size_chart', $meta( '_madar_size_chart' ), array( '' => 'None', 'men' => 'Men', 'kids' => 'Kids' ) );
	madar_field( 'Orbit pairings (product IDs, in order)', 'madar_pairs', implode( ', ', madar_int_list( $meta( '_madar_pairs' ) ) ), 'text', 'Pieces that orbit this product and appear in “Complete the look”.' );
	madar_field( 'Materials (material IDs)', 'madar_materials', implode( ', ', madar_int_list( $meta( '_madar_materials' ) ) ) );
	madar_field( 'Styling piece only (not for sale)', 'madar_styling_only', $meta( '_madar_styling_only' ), 'checkbox' );
	echo '<h3>Image roles (attachment IDs)</h3>';
	foreach ( MADAR_IMAGE_ROLES as $role ) {
		madar_field( $role, "madar_images[{$role}]", $images[ $role ] ?? '', 'number' );
	}
	madar_field( 'Hotspots (JSON)', 'madar_hotspots', $meta( '_madar_hotspots' ) ? wp_json_encode( $meta( '_madar_hotspots' ), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT ) : '', 'textarea', 'List of {id, x, y, view, image_role, label:{eg,sa,en,fr,es}}. x and y are percentages of the front image.' );
	madar_field( 'Fit (verified only)', 'madar_fit', $meta( '_madar_fit' ) );
	madar_field( 'Care (verified only)', 'madar_care', $meta( '_madar_care' ), 'textarea' );
	echo '<h3>Model information</h3>';
	madar_field( 'Model height (cm)', 'madar_model_height', $meta( '_madar_model_height' ), 'number' );
	madar_field( 'Size worn', 'madar_model_size', $meta( '_madar_model_size' ) );
	madar_field( 'Verified from a real shoot (shown only when ticked)', 'madar_model_verified', $meta( '_madar_model_verified' ), 'checkbox' );
	madar_translation_fields(
		$post->ID,
		array(
			'name'              => 'text',
			'short_description' => 'textarea',
			'description'       => 'textarea',
			'fit'               => 'text',
			'care'              => 'textarea',
		)
	);
}

function madar_look_box( $post ) {
	wp_nonce_field( 'madar_save_look', 'madar_look_nonce' );
	madar_field( 'Products (IDs, in order)', 'madar_products', implode( ', ', madar_int_list( get_post_meta( $post->ID, '_madar_products', true ) ) ) );
	madar_select( 'Audience', 'madar_audience', get_post_meta( $post->ID, '_madar_audience', true ), array( 'men' => 'Men', 'kids' => 'Kids', 'family' => 'Family' ) );
	madar_select( 'Occasion', 'madar_occasion', get_post_meta( $post->ID, '_madar_occasion', true ), array( 'everyday' => 'Everyday', 'smart' => 'Smart', 'layers' => 'Layers', 'evening' => 'Evening' ) );
	madar_select( 'Palette', 'madar_palette', get_post_meta( $post->ID, '_madar_palette', true ), array( 'earth' => 'Earth', 'mono' => 'Mono', 'light' => 'Light' ) );
	madar_field( 'Detail image (attachment ID)', 'madar_detail_image', get_post_meta( $post->ID, '_madar_detail_image', true ), 'number', 'The featured image is the main look image.' );
	madar_translation_fields(
		$post->ID,
		array(
			'title'   => 'text',
			'excerpt' => 'textarea',
		)
	);
}

function madar_material_box( $post ) {
	wp_nonce_field( 'madar_save_material', 'madar_material_nonce' );
	madar_field( 'Products (IDs)', 'madar_products', implode( ', ', madar_int_list( get_post_meta( $post->ID, '_madar_products', true ) ) ) );
	madar_field( 'Care (verified only)', 'madar_care', get_post_meta( $post->ID, '_madar_care', true ), 'textarea' );
	madar_field( 'Composition', 'madar_composition', get_post_meta( $post->ID, '_madar_composition', true ) );
	madar_field( 'Composition verified from a supplier label (shown only when ticked)', 'madar_composition_verified', get_post_meta( $post->ID, '_madar_composition_verified', true ), 'checkbox' );
	madar_translation_fields(
		$post->ID,
		array(
			'title'       => 'text',
			'story'       => 'textarea',
			'care'        => 'textarea',
			'composition' => 'text',
		)
	);
}

function madar_can_save( $post_id, $nonce_name, $action ) {
	if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || wp_is_post_revision( $post_id ) ) {
		return false;
	}
	$nonce = isset( $_POST[ $nonce_name ] ) ? sanitize_text_field( wp_unslash( $_POST[ $nonce_name ] ) ) : '';
	return $nonce && wp_verify_nonce( $nonce, $action ) && current_user_can( 'edit_post', $post_id );
}

function madar_posted( $key ) {
	// phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified in madar_can_save().
	return isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : null;
}

function madar_save_translations( $post_id, $fields ) {
	$posted = madar_posted( 'madar_i18n' );
	$clean  = array();
	foreach ( MADAR_TRANSLATED_LOCALES as $lang ) {
		foreach ( $fields as $field => $type ) {
			$value = is_array( $posted ) && isset( $posted[ $lang ][ $field ] ) ? (string) $posted[ $lang ][ $field ] : '';
			$value = 'html' === $type ? wp_kses_post( $value ) : ( 'textarea' === $type ? sanitize_textarea_field( $value ) : sanitize_text_field( $value ) );
			if ( '' !== $value ) {
				$clean[ $lang ][ $field ] = $value;
			}
		}
	}
	update_post_meta( $post_id, '_madar_i18n', $clean );
}

function madar_sanitize_hotspots( $value ) {
	$list = is_string( $value ) ? json_decode( $value, true ) : $value;
	if ( ! is_array( $list ) ) {
		return null;
	}
	$clean = array();
	foreach ( $list as $item ) {
		if ( ! is_array( $item ) || empty( $item['id'] ) ) {
			continue;
		}
		$labels = array();
		foreach ( MADAR_LOCALES as $lang ) {
			$label = is_array( $item['label'] ?? null ) ? ( $item['label'][ $lang ] ?? '' ) : ( 'eg' === $lang ? ( $item['label'] ?? '' ) : '' );
			if ( '' !== (string) $label ) {
				$labels[ $lang ] = sanitize_text_field( (string) $label );
			}
		}
		$clean[] = array(
			'id'         => sanitize_key( $item['id'] ),
			'x'          => max( 0, min( 100, (float) ( $item['x'] ?? 0 ) ) ),
			'y'          => max( 0, min( 100, (float) ( $item['y'] ?? 0 ) ) ),
			'view'       => in_array( $item['view'] ?? 'front', array( 'front', 'back', 'on_model' ), true ) ? $item['view'] : 'front',
			'image_role' => in_array( $item['image_role'] ?? '', MADAR_IMAGE_ROLES, true ) ? $item['image_role'] : '',
			'label'      => $labels,
		);
	}
	return $clean;
}

function madar_save_product_meta( $post_id ) {
	if ( ! madar_can_save( $post_id, 'madar_product_nonce', 'madar_save_product' ) ) {
		return;
	}
	$audience = (string) madar_posted( 'madar_audience' );
	update_post_meta( $post_id, '_madar_audience', in_array( $audience, array( 'men', 'kids' ), true ) ? $audience : '' );
	$chart = (string) madar_posted( 'madar_size_chart' );
	update_post_meta( $post_id, '_madar_size_chart', in_array( $chart, array( 'men', 'kids' ), true ) ? $chart : '' );
	update_post_meta( $post_id, '_madar_pairs', array_values( array_diff( madar_int_list( (string) madar_posted( 'madar_pairs' ) ), array( $post_id ) ) ) );
	update_post_meta( $post_id, '_madar_materials', madar_int_list( (string) madar_posted( 'madar_materials' ) ) );
	foreach ( array( 'madar_styling_only', 'madar_model_verified' ) as $flag ) {
		update_post_meta( $post_id, '_' . $flag, 'yes' === madar_posted( $flag ) ? 'yes' : 'no' );
	}
	$images = madar_posted( 'madar_images' );
	$roles  = array();
	foreach ( MADAR_IMAGE_ROLES as $role ) {
		$id = is_array( $images ) ? absint( $images[ $role ] ?? 0 ) : 0;
		if ( $id ) {
			$roles[ $role ] = $id;
		}
	}
	update_post_meta( $post_id, '_madar_images', $roles );
	$raw = trim( (string) madar_posted( 'madar_hotspots' ) );
	if ( '' === $raw ) {
		update_post_meta( $post_id, '_madar_hotspots', array() );
	} else {
		$hotspots = madar_sanitize_hotspots( $raw );
		if ( null === $hotspots ) {
			set_transient( 'madar_notice_' . get_current_user_id(), 'Hotspots were not saved: the JSON is invalid.', 60 );
		} else {
			update_post_meta( $post_id, '_madar_hotspots', $hotspots );
		}
	}
	update_post_meta( $post_id, '_madar_fit', sanitize_text_field( (string) madar_posted( 'madar_fit' ) ) );
	update_post_meta( $post_id, '_madar_care', sanitize_textarea_field( (string) madar_posted( 'madar_care' ) ) );
	update_post_meta( $post_id, '_madar_model_height', absint( madar_posted( 'madar_model_height' ) ) );
	update_post_meta( $post_id, '_madar_model_size', sanitize_text_field( (string) madar_posted( 'madar_model_size' ) ) );
	madar_save_translations(
		$post_id,
		array(
			'name'              => 'text',
			'short_description' => 'html',
			'description'       => 'html',
			'fit'               => 'text',
			'care'              => 'textarea',
		)
	);
	madar_bump_cache();
}

function madar_save_look_meta( $post_id ) {
	if ( ! madar_can_save( $post_id, 'madar_look_nonce', 'madar_save_look' ) ) {
		return;
	}
	update_post_meta( $post_id, '_madar_products', madar_int_list( (string) madar_posted( 'madar_products' ) ) );
	foreach ( array(
		'audience' => array( 'men', 'kids', 'family' ),
		'occasion' => array( 'everyday', 'smart', 'layers', 'evening' ),
		'palette'  => array( 'earth', 'mono', 'light' ),
	) as $field => $allowed ) {
		$value = (string) madar_posted( 'madar_' . $field );
		update_post_meta( $post_id, '_madar_' . $field, in_array( $value, $allowed, true ) ? $value : $allowed[0] );
	}
	update_post_meta( $post_id, '_madar_detail_image', absint( madar_posted( 'madar_detail_image' ) ) );
	madar_save_translations(
		$post_id,
		array(
			'title'   => 'text',
			'excerpt' => 'textarea',
		)
	);
	madar_bump_cache();
}

function madar_save_material_meta( $post_id ) {
	if ( ! madar_can_save( $post_id, 'madar_material_nonce', 'madar_save_material' ) ) {
		return;
	}
	update_post_meta( $post_id, '_madar_products', madar_int_list( (string) madar_posted( 'madar_products' ) ) );
	update_post_meta( $post_id, '_madar_care', sanitize_textarea_field( (string) madar_posted( 'madar_care' ) ) );
	update_post_meta( $post_id, '_madar_composition', sanitize_text_field( (string) madar_posted( 'madar_composition' ) ) );
	update_post_meta( $post_id, '_madar_composition_verified', 'yes' === madar_posted( 'madar_composition_verified' ) ? 'yes' : 'no' );
	madar_save_translations(
		$post_id,
		array(
			'title'       => 'text',
			'story'       => 'html',
			'care'        => 'textarea',
			'composition' => 'text',
		)
	);
	madar_bump_cache();
}

function madar_admin_notice() {
	$key     = 'madar_notice_' . get_current_user_id();
	$message = get_transient( $key );
	if ( $message ) {
		delete_transient( $key );
		echo '<div class="notice notice-error"><p>' . esc_html( $message ) . '</p></div>';
	}
}

function madar_inbox_columns( $columns ) {
	return array(
		'cb'           => $columns['cb'] ?? '',
		'title'        => 'Request',
		'madar_email'  => 'Email',
		'madar_status' => 'Status',
		'madar_lang'   => 'Language',
		'date'         => 'Date',
	);
}

function madar_inbox_column( $column, $post_id ) {
	$map = array(
		'madar_email'  => '_madar_email',
		'madar_status' => '_madar_status',
		'madar_lang'   => '_madar_lang',
	);
	if ( isset( $map[ $column ] ) ) {
		echo esc_html( (string) get_post_meta( $post_id, $map[ $column ], true ) );
	}
}
