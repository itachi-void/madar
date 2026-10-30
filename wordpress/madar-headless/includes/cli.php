<?php
defined( 'ABSPATH' ) || exit;

/**
 * Madar storefront data commands.
 */
class Madar_CLI {

	private $dry = false;
	private $force = false;
	private $publish = false;
	private $report = array();

	private function note( $item, $action, $detail = '' ) {
		$this->report[] = array(
			'item'   => $item,
			'action' => $this->dry && ! in_array( $action, array( 'missing', 'skip', 'link' ), true ) ? 'would ' . $action : $action,
			'detail' => $detail,
		);
	}

	private function load( $assoc ) {
		$file = $assoc['file'] ?? MADAR_HEADLESS_DIR . 'data/seed.json';
		if ( ! is_readable( $file ) ) {
			WP_CLI::error( "Seed file not found: {$file}" );
		}
		$data = json_decode( (string) file_get_contents( $file ), true );
		if ( ! is_array( $data ) || empty( $data['products'] ) ) {
			WP_CLI::error( 'Seed file is not valid Madar seed JSON.' );
		}
		return $data;
	}

	private function finish() {
		if ( $this->report ) {
			WP_CLI\Utils\format_items( 'table', $this->report, array( 'item', 'action', 'detail' ) );
		}
		if ( ! $this->dry ) {
			madar_bump_cache();
		}
	}

	/** Sets a meta value only when empty, unless --force is used. */
	private function soft_meta( $post_id, $key, $value ) {
		$current = get_post_meta( $post_id, $key, true );
		if ( ! $this->force && ! empty( $current ) && 'no' !== $current ) {
			return false;
		}
		if ( ! $this->dry ) {
			update_post_meta( $post_id, $key, $value );
		}
		return true;
	}

	private function merge_i18n( $post_id, $incoming ) {
		$current = get_post_meta( $post_id, '_madar_i18n', true );
		$current = is_array( $current ) ? $current : array();
		$changed = 0;
		foreach ( (array) $incoming as $lang => $fields ) {
			if ( ! in_array( $lang, MADAR_TRANSLATED_LOCALES, true ) || ! is_array( $fields ) ) {
				continue;
			}
			foreach ( $fields as $field => $value ) {
				if ( '' === (string) $value || ( ! $this->force && ! empty( $current[ $lang ][ $field ] ) ) ) {
					continue;
				}
				$current[ $lang ][ $field ] = in_array( $field, array( 'description', 'short_description', 'story' ), true ) ? wp_kses_post( $value ) : sanitize_textarea_field( $value );
				++$changed;
			}
		}
		if ( $changed && ! $this->dry ) {
			update_post_meta( $post_id, '_madar_i18n', $current );
		}
		return $changed;
	}

	private function category_id( $slug, $name ) {
		$term = get_term_by( 'slug', $slug, 'product_cat' );
		if ( $term ) {
			return (int) $term->term_id;
		}
		$this->note( "category {$slug}", 'create', $name );
		if ( $this->dry ) {
			return 0;
		}
		$created = wp_insert_term( $name, 'product_cat', array( 'slug' => $slug ) );
		return is_wp_error( $created ) ? 0 : (int) $created['term_id'];
	}

	private function create_product( $spec, $categories ) {
		if ( $this->dry ) {
			return 0;
		}
		$styling = ! empty( $spec['styling_only'] );
		$product = new WC_Product_Variable();
		$product->set_name( $spec['name'] );
		$product->set_sku( $spec['sku'] );
		if ( ! empty( $spec['slug'] ) ) {
			$product->set_slug( $spec['slug'] );
		}
		$product->set_status( $styling || $this->publish ? 'publish' : 'draft' );
		$product->set_catalog_visibility( $styling ? 'hidden' : 'visible' );
		$product->set_menu_order( (int) ( $spec['order'] ?? 0 ) );
		$product->set_description( wp_kses_post( (string) ( $spec['description'] ?? '' ) ) );
		$product->set_category_ids( array_filter( $categories ) );
		$rows = array();
		foreach ( (array) ( $spec['variations'] ?? array() ) as $row ) {
			if ( is_array( $row ) && isset( $row['size'] ) ) {
				$rows[] = $row;
			}
		}
		if ( ! $rows ) {
			foreach ( (array) $spec['sizes'] as $size ) {
				$rows[] = array(
					'size'     => $size,
					'price'    => $spec['price'] ?? '',
					'in_stock' => true,
				);
			}
		}
		$attribute = new WC_Product_Attribute();
		$attribute->set_name( $spec['size_attribute'] ?? 'المقاس' );
		$attribute->set_options( array_values( array_unique( array_map( 'strval', wp_list_pluck( $rows, 'size' ) ) ) ) );
		$attribute->set_visible( true );
		$attribute->set_variation( true );
		$product->set_attributes( array( $attribute ) );
		$product_id = $product->save();
		$key        = sanitize_title( $attribute->get_name() );
		foreach ( $rows as $index => $row ) {
			$variation = new WC_Product_Variation();
			$variation->set_parent_id( $product_id );
			$variation->set_attributes( array( $key => (string) $row['size'] ) );
			$variation->set_regular_price( (string) ( $row['price'] ?? '' ) );
			if ( isset( $row['sale_price'] ) && '' !== (string) $row['sale_price'] ) {
				$variation->set_sale_price( (string) $row['sale_price'] );
			}
			$variation->set_manage_stock( false );
			$variation->set_stock_status( empty( $row['in_stock'] ) ? 'outofstock' : 'instock' );
			$variation->set_menu_order( $index );
			$variation->save();
		}
		WC_Product_Variable::sync( $product_id );
		return $product_id;
	}

	private function upsert_post( $type, $spec ) {
		$existing = get_posts(
			array(
				'post_type'   => $type,
				'name'        => $spec['slug'],
				'post_status' => 'any',
				'numberposts' => 1,
				'fields'      => 'ids',
			)
		);
		if ( $existing ) {
			return (int) $existing[0];
		}
		$this->note( "{$type} {$spec['slug']}", 'create', $spec['title'] );
		if ( $this->dry ) {
			return 0;
		}
		return (int) wp_insert_post(
			array(
				'post_type'    => $type,
				'post_status'  => 'publish',
				'post_name'    => $spec['slug'],
				'post_title'   => $spec['title'],
				'post_excerpt' => (string) ( $spec['excerpt'] ?? '' ),
				'post_content' => (string) ( $spec['story'] ?? '' ),
				'menu_order'   => (int) ( $spec['order'] ?? 0 ),
			)
		);
	}

	private function ids_for( $keys, $map ) {
		$ids = array();
		foreach ( (array) $keys as $key ) {
			if ( ! empty( $map[ $key ] ) ) {
				$ids[] = (int) $map[ $key ];
			}
		}
		return $ids;
	}

	/**
	 * Links the Madar storefront data to existing WooCommerce products, and creates missing pieces.
	 *
	 * Existing products are matched by SKU. Their names, prices, stock and variations are never changed.
	 * Madar fields (translations, pairings, hotspots, audience) are only filled when empty unless --force.
	 * Missing sale products are created as drafts (or published with --publish-new) with their sizes, prices,
	 * per-size stock status and description from the seed. Styling-only pieces are created hidden and not for sale.
	 *
	 * ## OPTIONS
	 *
	 * [--file=<path>]
	 * : Seed JSON. Defaults to the bundled data/seed.json.
	 *
	 * [--dry-run]
	 * : Show what would change without writing.
	 *
	 * [--force]
	 * : Overwrite Madar fields that already have values.
	 *
	 * [--publish-new]
	 * : Publish sale products that the seed creates (for a new, empty store).
	 */
	public function seed( $args, $assoc ) {
		$this->dry     = isset( $assoc['dry-run'] );
		$this->force   = isset( $assoc['force'] );
		$this->publish = isset( $assoc['publish-new'] );
		$data          = $this->load( $assoc );

		if ( ! empty( $data['size_charts'] ) ) {
			$this->note( 'size charts', 'save', 'men + kids' );
			if ( ! $this->dry ) {
				update_option( 'madar_size_charts', $data['size_charts'], false );
			}
		}
		$cats = array();
		foreach ( (array) ( $data['categories'] ?? array() ) as $category ) {
			$cats[ $category['slug'] ] = $this->category_id( $category['slug'], $category['name'] );
		}

		$map = array();
		foreach ( $data['products'] as $spec ) {
			$id = wc_get_product_id_by_sku( $spec['sku'] );
			if ( $id ) {
				$this->note( $spec['key'], 'link', "#{$id} by SKU {$spec['sku']}" );
			} elseif ( ! empty( $spec['create_if_missing'] ) ) {
				$id = $this->create_product( $spec, $this->ids_for( $spec['categories'] ?? array(), $cats ) );
				if ( ! empty( $spec['styling_only'] ) ) {
					$detail = 'styling piece, hidden, not for sale';
				} elseif ( $this->publish ) {
					$detail = 'published — sizes, prices and stock copied from the reference store; review before launch';
				} else {
					$detail = 'DRAFT — review price, sizes and stock before publishing';
				}
				$this->note( $spec['key'], 'create', $detail );
			} else {
				$this->note( $spec['key'], 'missing', "SKU {$spec['sku']} not found; skipped" );
				continue;
			}
			$map[ $spec['key'] ] = $id;
		}

		$materials = array();
		foreach ( (array) ( $data['materials'] ?? array() ) as $spec ) {
			$id = $this->upsert_post( 'madar_material', $spec );
			if ( ! $id ) {
				continue;
			}
			$materials[ $spec['key'] ] = $id;
			$this->soft_meta( $id, '_madar_products', $this->ids_for( $spec['products'] ?? array(), $map ) );
			$this->soft_meta( $id, '_madar_composition_verified', 'no' );
			$this->merge_i18n( $id, $spec['i18n'] ?? array() );
		}

		foreach ( $data['products'] as $spec ) {
			$id = $map[ $spec['key'] ] ?? 0;
			if ( ! $id ) {
				continue;
			}
			$changed = array();
			if ( $this->soft_meta( $id, '_madar_audience', $spec['audience'] ?? '' ) ) {
				$changed[] = 'audience';
			}
			if ( $this->soft_meta( $id, '_madar_size_chart', $spec['size_chart'] ?? '' ) ) {
				$changed[] = 'size chart';
			}
			if ( $this->soft_meta( $id, '_madar_styling_only', ! empty( $spec['styling_only'] ) ? 'yes' : 'no' ) ) {
				$changed[] = 'styling flag';
			}
			if ( $this->soft_meta( $id, '_madar_pairs', $this->ids_for( $spec['pairs'] ?? array(), $map ) ) ) {
				$changed[] = 'pairs';
			}
			if ( $this->soft_meta( $id, '_madar_materials', $this->ids_for( $spec['materials'] ?? array(), $materials ) ) ) {
				$changed[] = 'materials';
			}
			if ( ! empty( $spec['hotspots'] ) && $this->soft_meta( $id, '_madar_hotspots', madar_sanitize_hotspots( $spec['hotspots'] ) ) ) {
				$changed[] = 'hotspots';
			}
			$i18n = $this->merge_i18n( $id, $spec['i18n'] ?? array() );
			if ( $i18n ) {
				$changed[] = "{$i18n} translations";
			}
			$this->note( $spec['key'], 'update', $changed ? implode( ', ', $changed ) : 'nothing to change' );
		}

		foreach ( (array) ( $data['looks'] ?? array() ) as $spec ) {
			$id = $this->upsert_post( 'madar_look', $spec );
			if ( ! $id ) {
				continue;
			}
			$this->soft_meta( $id, '_madar_products', $this->ids_for( $spec['products'], $map ) );
			foreach ( array( 'audience', 'occasion', 'palette' ) as $field ) {
				$this->soft_meta( $id, '_madar_' . $field, $spec[ $field ] );
			}
			$this->merge_i18n( $id, $spec['i18n'] ?? array() );
			$this->note( "look {$spec['slug']}", 'update', count( $spec['products'] ) . ' pieces' );
		}
		$this->finish();
		WP_CLI::success( $this->dry ? 'Dry run complete. Nothing was written.' : 'Seed complete.' );
	}

	/**
	 * Moves the WordPress demo products to draft. Nothing is deleted.
	 *
	 * ## OPTIONS
	 *
	 * [--file=<path>]
	 * : Seed JSON with demo_skus.
	 *
	 * [--dry-run]
	 * : Show what would change without writing.
	 *
	 * @subcommand hide-demo
	 */
	public function hide_demo( $args, $assoc ) {
		$this->dry = isset( $assoc['dry-run'] );
		$data      = $this->load( $assoc );
		foreach ( (array) ( $data['demo_skus'] ?? array() ) as $sku ) {
			$id = wc_get_product_id_by_sku( $sku );
			if ( ! $id ) {
				$this->note( $sku, 'skip', 'not found' );
				continue;
			}
			$product = wc_get_product( $id );
			if ( 'draft' === $product->get_status() ) {
				$this->note( $sku, 'skip', "#{$id} already draft" );
				continue;
			}
			$this->note( $sku, 'draft', "#{$id} {$product->get_name()}" );
			if ( ! $this->dry ) {
				$product->set_status( 'draft' );
				$product->save();
			}
		}
		$this->finish();
		WP_CLI::success( 'Demo products handled.' );
	}

	private function attach( $path, $parent_id, $alt, $concept ) {
		$hash  = md5_file( $path );
		$found = get_posts(
			array(
				'post_type'   => 'attachment',
				'post_status' => 'inherit',
				'numberposts' => 1,
				'fields'      => 'ids',
				'meta_key'    => '_madar_source_hash', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value'  => $hash, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
			)
		);
		if ( $found ) {
			return (int) $found[0];
		}
		if ( $this->dry ) {
			return -1;
		}
		$upload = wp_upload_bits( basename( $path ), null, (string) file_get_contents( $path ) );
		if ( ! empty( $upload['error'] ) ) {
			WP_CLI::warning( basename( $path ) . ': ' . $upload['error'] );
			return 0;
		}
		$type = wp_check_filetype( $upload['file'] );
		$id   = wp_insert_attachment(
			array(
				'post_mime_type' => $type['type'],
				'post_title'     => pathinfo( $path, PATHINFO_FILENAME ),
				'post_status'    => 'inherit',
			),
			$upload['file'],
			$parent_id
		);
		wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $upload['file'] ) );
		update_post_meta( $id, '_wp_attachment_image_alt', sanitize_text_field( $alt ) );
		update_post_meta( $id, '_madar_source_hash', $hash );
		if ( $concept ) {
			update_post_meta( $id, '_madar_concept', 1 );
		}
		return (int) $id;
	}

	/**
	 * Imports the generated images from the image brief "outputs" folder.
	 *
	 * Product images become role images and the WooCommerce gallery. Existing images are kept as extra gallery items.
	 * Running it again does not duplicate files. Missing files are reported and skipped.
	 *
	 * ## OPTIONS
	 *
	 * --dir=<path>
	 * : The "outputs" folder that contains products/, lookbook/ and materials/.
	 *
	 * [--file=<path>]
	 * : Seed JSON. Defaults to the bundled data/seed.json.
	 *
	 * [--real-photos]
	 * : The files are real photographs, not generated concepts.
	 *
	 * [--dry-run]
	 * : Show what would change without writing.
	 *
	 * @subcommand import-images
	 */
	public function import_images( $args, $assoc ) {
		require_once ABSPATH . 'wp-admin/includes/image.php';
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		$this->dry = isset( $assoc['dry-run'] );
		$concept   = ! isset( $assoc['real-photos'] );
		$dir       = untrailingslashit( (string) $assoc['dir'] );
		if ( ! is_dir( $dir ) ) {
			WP_CLI::error( "Folder not found: {$dir}" );
		}
		$data = $this->load( $assoc );

		foreach ( $data['products'] as $spec ) {
			$id = wc_get_product_id_by_sku( $spec['sku'] );
			if ( ! $id ) {
				$this->note( $spec['key'], 'skip', 'product not found; run seed first' );
				continue;
			}
			$product = wc_get_product( $id );
			$roles   = array();
			foreach ( $spec['images'] as $role => $file ) {
				$path = "{$dir}/products/{$spec['key']}/{$file}";
				if ( ! is_readable( $path ) ) {
					$this->note( $spec['key'], 'missing', $file );
					continue;
				}
				$attachment = $this->attach( $path, $id, $product->get_name(), $concept );
				if ( $attachment ) {
					$roles[ $role ] = $attachment;
				}
			}
			if ( ! $roles ) {
				continue;
			}
			$this->note( $spec['key'], 'images', implode( ', ', array_keys( $roles ) ) );
			if ( $this->dry ) {
				continue;
			}
			$stored = $product->get_meta( '_madar_images' );
			$roles  = $roles + ( is_array( $stored ) ? $stored : array() );
			$product->update_meta_data( '_madar_images', $roles );
			$main = $roles['on_model'] ?? ( $roles['front'] ?? 0 );
			$old  = array_filter( array_merge( array( $product->get_image_id() ), $product->get_gallery_image_ids() ) );
			if ( $main ) {
				$product->set_image_id( $main );
			}
			$gallery = array_values( array_unique( array_diff( array_merge( array_values( $roles ), $old ), array( $main ) ) ) );
			$product->set_gallery_image_ids( $gallery );
			$product->save();
		}

		foreach ( array(
			'madar_look'     => array( $data['looks'] ?? array(), 'lookbook' ),
			'madar_material' => array( $data['materials'] ?? array(), 'materials' ),
		) as $type => $group ) {
			foreach ( $group[0] as $spec ) {
				$post = get_posts(
					array(
						'post_type'   => $type,
						'name'        => $spec['slug'],
						'post_status' => 'any',
						'numberposts' => 1,
						'fields'      => 'ids',
					)
				);
				if ( ! $post ) {
					$this->note( $spec['slug'], 'skip', 'run seed first' );
					continue;
				}
				foreach ( array(
					'image'        => '_thumbnail_id',
					'detail_image' => '_madar_detail_image',
				) as $field => $meta_key ) {
					if ( empty( $spec[ $field ] ) ) {
						continue;
					}
					$path = "{$dir}/{$group[1]}/{$spec[ $field ]}";
					if ( ! is_readable( $path ) ) {
						$this->note( $spec['slug'], 'missing', $spec[ $field ] );
						continue;
					}
					$attachment = $this->attach( $path, (int) $post[0], $spec['title'], $concept );
					$this->note( $spec['slug'], 'image', $spec[ $field ] );
					if ( $attachment > 0 ) {
						update_post_meta( (int) $post[0], $meta_key, $attachment );
					}
				}
			}
		}
		$this->finish();
		WP_CLI::success( $this->dry ? 'Dry run complete. Nothing was written.' : 'Images imported.' );
	}

	/**
	 * Prints the environment and Madar data status as a table.
	 */
	public function status() {
		global $wp_version;
		$gateways = array();
		foreach ( WC()->payment_gateways()->payment_gateways() as $gateway ) {
			if ( 'yes' === $gateway->enabled ) {
				$gateways[] = $gateway->id;
			}
		}
		$linked = wc_get_products(
			array(
				'limit'      => -1,
				'return'     => 'ids',
				'status'     => array( 'publish', 'draft', 'private' ),
				'meta_key'   => '_madar_audience', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_compare' => 'EXISTS',
			)
		);
		$rows   = array(
			array( 'check' => 'PHP', 'value' => PHP_VERSION ),
			array( 'check' => 'WordPress', 'value' => $wp_version ),
			array( 'check' => 'WooCommerce', 'value' => WC()->version ),
			array( 'check' => 'Madar Headless', 'value' => MADAR_HEADLESS_VERSION ),
			array( 'check' => 'Permalinks', 'value' => get_option( 'permalink_structure' ) ? get_option( 'permalink_structure' ) : 'PLAIN — must be changed' ),
			array( 'check' => 'REST base', 'value' => rest_url( 'madar/v1/' ) ),
			array( 'check' => 'Currency', 'value' => get_woocommerce_currency() ),
			array( 'check' => 'Published products', 'value' => count( wc_get_products( array( 'limit' => -1, 'return' => 'ids', 'status' => 'publish' ) ) ) ),
			array( 'check' => 'Products linked to Madar', 'value' => count( $linked ) ),
			array( 'check' => 'Looks', 'value' => (int) wp_count_posts( 'madar_look' )->publish ),
			array( 'check' => 'Materials', 'value' => (int) wp_count_posts( 'madar_material' )->publish ),
			array( 'check' => 'Payment methods enabled', 'value' => $gateways ? implode( ', ', $gateways ) : 'none' ),
			array( 'check' => 'Shipping zones', 'value' => count( WC_Shipping_Zones::get_zones() ) ),
			array( 'check' => 'Storefront URL', 'value' => madar_frontend_base() ? madar_frontend_base() : '(empty)' ),
			array( 'check' => 'Allowed origins', 'value' => implode( ' ', madar_allowed_origins() ) ),
			array( 'check' => 'Redirect WordPress pages', 'value' => get_option( 'madar_headless_redirect', 'no' ) ),
		);
		WP_CLI\Utils\format_items( 'table', $rows, array( 'check', 'value' ) );
	}

	/**
	 * Clears the Madar API cache.
	 *
	 * @subcommand flush-cache
	 */
	public function flush_cache() {
		madar_bump_cache();
		WP_CLI::success( 'Madar cache cleared.' );
	}

	/**
	 * Applies the Madar basics to a new WooCommerce store and prints before → after for every option.
	 *
	 * Sets: site title, Cairo timezone, Egypt store location, EGP and its number format, skips the
	 * WooCommerce setup wizard, and enables cash on delivery for testing. Changes nothing else.
	 *
	 * ## OPTIONS
	 *
	 * [--dry-run]
	 * : Show what would change without writing.
	 *
	 * @subcommand setup-store
	 */
	public function setup_store( $args, $assoc ) {
		$this->dry = isset( $assoc['dry-run'] );
		$show      = static function ( $value ) {
			if ( is_array( $value ) ) {
				return wp_json_encode( $value, JSON_UNESCAPED_UNICODE );
			}
			return false === $value || '' === $value ? '(empty)' : (string) $value;
		};
		$cod       = get_option( 'woocommerce_cod_settings', array() );
		$cod       = is_array( $cod ) ? $cod : array();
		$options   = array(
			'blogname'                       => 'مدار',
			'timezone_string'                => 'Africa/Cairo',
			'woocommerce_default_country'    => 'EG:EGC',
			'woocommerce_currency'           => 'EGP',
			'woocommerce_currency_pos'       => 'right_space',
			'woocommerce_price_thousand_sep' => ',',
			'woocommerce_price_decimal_sep'  => '.',
			'woocommerce_price_num_decimals' => '2',
			'woocommerce_onboarding_profile' => array( 'skipped' => true ),
			'woocommerce_task_list_hidden'   => 'yes',
			'woocommerce_cod_settings'       => array_merge(
				$cod,
				array(
					'enabled'     => 'yes',
					'title'       => 'الدفع عند الاستلام',
					'description' => 'ادفع نقدًا عند استلام طلبك.',
				)
			),
		);
		foreach ( $options as $name => $value ) {
			$before = get_option( $name );
			if ( $before === $value ) {
				$this->note( $name, 'skip', 'already ' . $show( $value ) );
				continue;
			}
			$this->note( $name, 'set', $show( $before ) . ' → ' . $show( $value ) );
			if ( ! $this->dry ) {
				update_option( $name, $value );
			}
		}
		$this->finish();
		WP_CLI::success( $this->dry ? 'Dry run complete. Nothing was written.' : 'Store basics applied. Cash on delivery is enabled for testing only.' );
	}

	private function rest( $method, $route, $params = array() ) {
		$request = new WP_REST_Request( $method, $route );
		foreach ( $params as $key => $value ) {
			$request->set_param( $key, $value );
		}
		$response = rest_do_request( $request );
		return array( $response->get_status(), $response->get_data() );
	}

	/**
	 * Checks the installation end to end and prints PASS / FAIL / WARN for each check.
	 *
	 * Creates one temporary customer and deletes it at the end. Creates no orders.
	 *
	 * ## OPTIONS
	 *
	 * [--file=<path>]
	 * : Seed JSON. Defaults to the bundled data/seed.json.
	 */
	public function selftest( $args, $assoc ) {
		$data = $this->load( $assoc );
		$rows = array();
		$add  = static function ( $check, $ok, $detail = '', $level = 'FAIL' ) use ( &$rows ) {
			$rows[] = array(
				'check'  => $check,
				'result' => $ok ? 'PASS' : $level,
				'detail' => $detail,
			);
		};
		madar_bump_cache();
		$add( 'PHP 8.0+', version_compare( PHP_VERSION, '8.0', '>=' ), PHP_VERSION );
		$add( 'WooCommerce 8.0+', version_compare( WC()->version, '8.0', '>=' ), WC()->version );
		$add( 'Pretty permalinks', (bool) get_option( 'permalink_structure' ), (string) get_option( 'permalink_structure' ) );

		list( $status, $settings ) = $this->rest( 'GET', '/madar/v1/settings' );
		$add( 'Settings endpoint', 200 === $status && ! empty( $settings['currency'] ), 200 === $status ? 'currency ' . $settings['currency'] : "HTTP {$status}" );

		list( $status, $products ) = $this->rest( 'GET', '/madar/v1/products', array( 'lang' => 'en' ) );
		$skus = 200 === $status ? wp_list_pluck( $products, 'sku' ) : array();
		$missing = array();
		$no_en   = array();
		foreach ( $data['products'] as $spec ) {
			if ( ! in_array( $spec['sku'], $skus, true ) ) {
				$missing[] = $spec['sku'];
				continue;
			}
			foreach ( $products as $item ) {
				if ( $item['sku'] === $spec['sku'] && ( '' === $item['name'] || $item['name'] === $spec['name'] ) ) {
					$no_en[] = $spec['sku'];
				}
			}
		}
		$add( 'Storefront products', 200 === $status && ! $missing, count( $skus ) . ' returned' . ( $missing ? '; missing ' . implode( ', ', $missing ) : '' ) );
		$add( 'English product names', ! $no_en, $no_en ? 'untranslated: ' . implode( ', ', $no_en ) : 'all translated' );
		$demo = array_intersect( (array) ( $data['demo_skus'] ?? array() ), $skus );
		$add( 'Demo products hidden', ! $demo, $demo ? 'still visible: ' . implode( ', ', $demo ) : 'none visible' );
		$pairs = 0;
		foreach ( $products as $item ) {
			$pairs += $item['madar']['pairs'] ? 1 : 0;
		}
		$add( 'Orbit pairings', $pairs >= count( $data['products'] ), "{$pairs} products have pairings" );
		$with_images = 0;
		foreach ( $products as $item ) {
			$with_images += $item['images'] ? 1 : 0;
		}
		$add( 'Product images', $with_images === count( $products ), "{$with_images} of " . count( $products ) . ' have images (import after the images are ready)', 'WARN' );

		list( $status, $looks ) = $this->rest( 'GET', '/madar/v1/looks' );
		$add( 'Looks', 200 === $status && count( $looks ) >= count( $data['looks'] ), ( 200 === $status ? count( $looks ) : 0 ) . ' looks' );
		list( $status, $materials ) = $this->rest( 'GET', '/madar/v1/materials' );
		$add( 'Materials', 200 === $status && count( $materials ) >= count( $data['materials'] ), ( 200 === $status ? count( $materials ) : 0 ) . ' materials' );

		$routes = rest_get_server()->get_routes();
		$need   = array( '/madar/v1/auth/login', '/madar/v1/me/wardrobe', '/madar/v1/stock-alerts', '/madar/v1/concierge', '/wc/store/v1/cart', '/wc/store/v1/checkout' );
		$absent = array_diff( $need, array_keys( $routes ) );
		$add( 'API routes', ! $absent, $absent ? 'missing ' . implode( ', ', $absent ) : count( $need ) . ' routes registered' );

		$email = 'madar-selftest-' . wp_generate_password( 6, false, false ) . '@example.com';
		add_filter( 'woocommerce_email_enabled_customer_new_account', '__return_false' );
		list( $status, $account ) = $this->rest(
			'POST',
			'/madar/v1/auth/register',
			array(
				'email'    => $email,
				'password' => wp_generate_password( 16, false, false ),
			)
		);
		$user_id = 201 === $status ? (int) $account['user']['id'] : 0;
		$add( 'Customer registration', (bool) $user_id, 201 === $status ? "temporary user #{$user_id}" : "HTTP {$status}" );
		if ( $user_id ) {
			list( $uid, $secret )      = explode( '.', $account['token'], 2 );
			$_SERVER['HTTP_X_MADAR_TOKEN'] = $account['token'];
			$_SERVER['REQUEST_URI']        = '/' . rest_get_url_prefix() . '/madar/v1/me';
			$resolved                      = madar_determine_current_user( 0 );
			$add( 'Sign-in token', $resolved === $user_id, $resolved === $user_id ? 'token resolves to the customer' : 'token rejected' );
			wp_set_current_user( $user_id );
			$this->rest(
				'PUT',
				'/madar/v1/me/wardrobe',
				array( 'items' => array( array( 'product_id' => (int) ( $products[0]['id'] ?? 0 ) ) ) )
			);
			list( $status, $wardrobe ) = $this->rest( 'GET', '/madar/v1/me/wardrobe' );
			$add( 'Wardrobe save', 200 === $status && 1 === count( $wardrobe['items'] ?? array() ), 200 === $status ? count( $wardrobe['items'] ?? array() ) . ' item saved' : "HTTP {$status}" );
			madar_revoke_token( (int) $uid, $secret );
			$add( 'Token revoked', ! madar_verify_token( (int) $uid, $secret ) );
			unset( $_SERVER['HTTP_X_MADAR_TOKEN'] );
			wp_set_current_user( 0 );
			require_once ABSPATH . 'wp-admin/includes/user.php';
			$add( 'Temporary user deleted', wp_delete_user( $user_id ) );
		}

		$origins = madar_allowed_origins();
		$add( 'Allowed storefront origins', (bool) $origins, implode( ' ', $origins ) );
		$loopback = wp_remote_get(
			rest_url( 'madar/v1/settings' ),
			array(
				'timeout'   => 15,
				'sslverify' => false,
			)
		);
		$code     = is_wp_error( $loopback ) ? $loopback->get_error_message() : wp_remote_retrieve_response_code( $loopback );
		$add( 'HTTP request to the REST API', 200 === $code, 'GET ' . rest_url( 'madar/v1/settings' ) . " → {$code}", 'WARN' );

		$gateways = array();
		foreach ( WC()->payment_gateways()->payment_gateways() as $gateway ) {
			if ( 'yes' === $gateway->enabled ) {
				$gateways[] = $gateway->id;
			}
		}
		$add( 'Payment methods', (bool) $gateways, $gateways ? implode( ', ', $gateways ) : 'none enabled — owner decision pending', 'WARN' );
		$add( 'Shipping zones', (bool) WC_Shipping_Zones::get_zones(), count( WC_Shipping_Zones::get_zones() ) . ' zones — owner decision pending', 'WARN' );
		madar_bump_cache();

		WP_CLI\Utils\format_items( 'table', $rows, array( 'check', 'result', 'detail' ) );
		$failed = count( wp_list_filter( $rows, array( 'result' => 'FAIL' ) ) );
		if ( $failed ) {
			WP_CLI::error( "{$failed} check(s) failed." );
		}
		WP_CLI::success( 'All required checks passed.' );
	}
}

WP_CLI::add_command( 'madar', 'Madar_CLI' );
