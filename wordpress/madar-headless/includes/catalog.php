<?php
defined( 'ABSPATH' ) || exit;

const MADAR_IMAGE_ROLES = array( 'on_model', 'front', 'back', 'detail_1', 'detail_2' );

function madar_register_catalog_routes() {
	$lang = array(
		'lang' => array(
			'type'    => 'string',
			'enum'    => MADAR_LOCALES,
			'default' => 'eg',
		),
	);
	register_rest_route(
		'madar/v1',
		'/settings',
		array(
			'methods'             => 'GET',
			'callback'            => 'madar_rest_settings',
			'permission_callback' => '__return_true',
		)
	);
	register_rest_route(
		'madar/v1',
		'/products',
		array(
			'methods'             => 'GET',
			'callback'            => 'madar_rest_products',
			'permission_callback' => '__return_true',
			'args'                => $lang + array(
				'audience' => array(
					'type'    => 'string',
					'enum'    => array( '', 'men', 'kids' ),
					'default' => '',
				),
				'ids'      => array(
					'type'    => 'string',
					'default' => '',
				),
			),
		)
	);
	register_rest_route(
		'madar/v1',
		'/products/(?P<id>\d+)',
		array(
			'methods'             => 'GET',
			'callback'            => 'madar_rest_product',
			'permission_callback' => '__return_true',
			'args'                => $lang,
		)
	);
	register_rest_route(
		'madar/v1',
		'/product-by-slug',
		array(
			'methods'             => 'GET',
			'callback'            => 'madar_rest_product_by_slug',
			'permission_callback' => '__return_true',
			'args'                => $lang + array(
				'slug' => array(
					'type'     => 'string',
					'required' => true,
				),
			),
		)
	);
	foreach ( array( 'looks', 'materials' ) as $collection ) {
		register_rest_route(
			'madar/v1',
			'/' . $collection,
			array(
				'methods'             => 'GET',
				'callback'            => 'madar_rest_' . $collection,
				'permission_callback' => '__return_true',
				'args'                => $lang,
			)
		);
	}
	register_rest_route(
		'madar/v1',
		'/orders/confirmation',
		array(
			'methods'             => 'GET',
			'callback'            => 'madar_rest_order_confirmation',
			'permission_callback' => '__return_true',
			'args'                => array(
				'order' => array(
					'type'     => 'integer',
					'required' => true,
				),
				'key'   => array(
					'type'     => 'string',
					'required' => true,
				),
			),
		)
	);
}

function madar_rest_settings() {
	$methods = array();
	foreach ( WC()->payment_gateways()->payment_gateways() as $gateway ) {
		if ( 'yes' === $gateway->enabled ) {
			$methods[] = array(
				'id'    => $gateway->id,
				'title' => wp_strip_all_tags( $gateway->get_title() ),
			);
		}
	}
	// Countries the store sells to, with states and the address fields WooCommerce will require at checkout.
	$countries = array();
	$locales   = WC()->countries->get_country_locale();
	$default   = $locales['default'] ?? array();
	foreach ( WC()->countries->get_allowed_countries() as $code => $name ) {
		$fields   = array_replace_recursive( $default, $locales[ $code ] ?? array() );
		$required = array();
		foreach ( array( 'state', 'postcode', 'city', 'address_1' ) as $field ) {
			$hidden             = ! empty( $fields[ $field ]['hidden'] );
			$required[ $field ] = ! $hidden && ! empty( $fields[ $field ]['required'] );
		}
		$states             = WC()->countries->get_states( $code );
		$countries[ $code ] = array(
			'name'     => html_entity_decode( $name, ENT_QUOTES, 'UTF-8' ),
			'states'   => is_array( $states ) ? $states : array(),
			'required' => $required,
		);
	}
	return rest_ensure_response(
		array(
			'name'            => get_bloginfo( 'name' ),
			'currency'        => get_woocommerce_currency(),
			'currency_symbol' => html_entity_decode( get_woocommerce_currency_symbol(), ENT_QUOTES, 'UTF-8' ),
			'price_decimals'  => wc_get_price_decimals(),
			'locales'         => MADAR_LOCALES,
			'payment_methods' => $methods,
			'countries'       => $countries,
			'default_country' => WC()->countries->get_base_country(),
			'size_charts'     => get_option( 'madar_size_charts', array() ),
			'store_api'       => rest_url( 'wc/store/v1/' ),
		)
	);
}

/** Every storefront-visible product, already localized. Styling-only pieces are included. */
function madar_catalog( $lang ) {
	return madar_cached(
		'catalog_' . $lang,
		static function () use ( $lang ) {
			$products = wc_get_products(
				array(
					'status'  => 'publish',
					'limit'   => 300,
					'orderby' => 'menu_order',
					'order'   => 'ASC',
					'type'    => array( 'simple', 'variable' ),
				)
			);
			$out      = array();
			foreach ( $products as $product ) {
				$styling = 'yes' === $product->get_meta( '_madar_styling_only' );
				if ( 'hidden' === $product->get_catalog_visibility() && ! $styling ) {
					continue;
				}
				$out[] = madar_product_payload( $product, $lang );
			}
			return $out;
		}
	);
}

function madar_product_attributes( WC_Product $product ) {
	$attributes = array();
	foreach ( $product->get_attributes() as $key => $attribute ) {
		if ( ! $attribute instanceof WC_Product_Attribute ) {
			continue;
		}
		$options = array();
		if ( $attribute->is_taxonomy() ) {
			foreach ( wc_get_product_terms( $product->get_id(), $attribute->get_name(), array( 'fields' => 'all' ) ) as $term ) {
				$options[] = array(
					'value' => urldecode( $term->slug ),
					'label' => $term->name,
				);
			}
			$label = wc_attribute_label( $attribute->get_name() );
		} else {
			foreach ( $attribute->get_options() as $option ) {
				$options[] = array(
					'value' => (string) $option,
					'label' => (string) $option,
				);
			}
			$label = $attribute->get_name();
		}
		$attributes[] = array(
			'key'       => 'attribute_' . $key,
			'name'      => $attribute->get_name(),
			'label'     => $label,
			'variation' => $attribute->get_variation(),
			'options'   => $options,
		);
	}
	return $attributes;
}

function madar_product_payload( WC_Product $product, $lang ) {
	$id      = $product->get_id();
	$styling = 'yes' === $product->get_meta( '_madar_styling_only' );

	$categories = array();
	foreach ( wc_get_product_terms( $id, 'product_cat' ) as $term ) {
		$categories[] = array(
			'id'   => $term->term_id,
			'slug' => urldecode( $term->slug ),
			'name' => $term->name,
		);
	}
	$audience = (string) $product->get_meta( '_madar_audience' );
	if ( ! $audience ) {
		foreach ( $categories as $category ) {
			if ( in_array( $category['slug'], array( 'men', 'kids' ), true ) ) {
				$audience = $category['slug'];
				break;
			}
		}
	}

	$variations = array();
	if ( $product->is_type( 'variable' ) ) {
		foreach ( $product->get_children() as $child_id ) {
			$variation = wc_get_product( $child_id );
			if ( ! $variation || 'publish' !== $variation->get_status() ) {
				continue;
			}
			$attributes = array();
			foreach ( $variation->get_attributes() as $key => $value ) {
				$attributes[ 'attribute_' . $key ] = urldecode( (string) $value );
			}
			$image_id     = $variation->get_image_id();
			$variations[] = array(
				'id'             => $child_id,
				'sku'            => $variation->get_sku(),
				'attributes'     => $attributes,
				'price'          => madar_money( $variation->get_price() ),
				'regular_price'  => madar_money( $variation->get_regular_price() ),
				'sale_price'     => $variation->is_on_sale() ? madar_money( $variation->get_sale_price() ) : null,
				'in_stock'       => $variation->is_in_stock(),
				'purchasable'    => ! $styling && $variation->is_purchasable() && $variation->is_in_stock(),
				'stock_quantity' => $variation->managing_stock() ? $variation->get_stock_quantity() : null,
				'image'          => $image_id && (int) $image_id !== (int) $product->get_image_id() ? madar_image( $image_id, 'variation' ) : null,
			);
		}
		$price = array(
			'min'         => madar_money( $product->get_variation_price( 'min' ) ),
			'max'         => madar_money( $product->get_variation_price( 'max' ) ),
			'regular_min' => madar_money( $product->get_variation_regular_price( 'min' ) ),
		);
	} else {
		$price = array(
			'min'         => madar_money( $product->get_price() ),
			'max'         => madar_money( $product->get_price() ),
			'regular_min' => madar_money( $product->get_regular_price() ),
		);
	}
	$price['currency'] = get_woocommerce_currency();
	$price['on_sale']  = $product->is_on_sale();
	if ( $styling ) {
		// Styling pieces are not for sale: never show a price.
		$price = array_merge(
			$price,
			array(
				'min'         => null,
				'max'         => null,
				'regular_min' => null,
				'on_sale'     => false,
			)
		);
	}

	$roles  = $product->get_meta( '_madar_images' );
	$roles  = is_array( $roles ) ? $roles : array();
	$images = array();
	$used   = array();
	foreach ( MADAR_IMAGE_ROLES as $role ) {
		$image = empty( $roles[ $role ] ) ? null : madar_image( $roles[ $role ], $role );
		if ( $image ) {
			$images[] = $image;
			$used[]   = $image['id'];
		}
	}
	foreach ( array_merge( array( $product->get_image_id() ), $product->get_gallery_image_ids() ) as $gallery_id ) {
		$gallery_id = absint( $gallery_id );
		$image      = $gallery_id && ! in_array( $gallery_id, $used, true ) ? madar_image( $gallery_id, 'gallery' ) : null;
		if ( $image ) {
			$images[] = $image;
			$used[]   = $gallery_id;
		}
	}

	$hotspots = array();
	$stored   = $product->get_meta( '_madar_hotspots' );
	foreach ( is_array( $stored ) ? $stored : array() as $hotspot ) {
		if ( ! is_array( $hotspot ) ) {
			continue;
		}
		$hotspots[] = array(
			'id'         => (string) ( $hotspot['id'] ?? '' ),
			'x'          => (float) ( $hotspot['x'] ?? 0 ),
			'y'          => (float) ( $hotspot['y'] ?? 0 ),
			'view'       => (string) ( $hotspot['view'] ?? 'front' ),
			'image_role' => (string) ( $hotspot['image_role'] ?? '' ),
			'label'      => madar_pick( $hotspot['label'] ?? '', $lang ),
			'text'       => madar_pick( $hotspot['text'] ?? '', $lang ),
		);
	}

	$model = null;
	if ( 'yes' === $product->get_meta( '_madar_model_verified' ) ) {
		$model = array(
			'height_cm' => absint( $product->get_meta( '_madar_model_height' ) ) ?: null,
			'size'      => (string) $product->get_meta( '_madar_model_size' ),
		);
	}

	$slug = urldecode( $product->get_slug() );
	return array(
		'id'                => $id,
		'slug'              => $slug,
		'path'              => '/product/' . $slug . '/',
		'sku'               => $product->get_sku(),
		'type'              => $product->get_type(),
		'name'              => madar_i18n( $id, 'name', $lang, $product->get_name() ),
		'short_description' => wp_kses_post( madar_i18n( $id, 'short_description', $lang, $product->get_short_description() ) ),
		'description'       => wp_kses_post( madar_i18n( $id, 'description', $lang, $product->get_description() ) ),
		'categories'        => $categories,
		'audience'          => $audience,
		'price'             => $price,
		'in_stock'          => $product->is_in_stock(),
		'purchasable'       => ! $styling && $product->is_purchasable() && $product->is_in_stock(),
		'images'            => $images,
		'attributes'        => madar_product_attributes( $product ),
		'variations'        => $variations,
		'madar'             => array(
			'styling_only' => $styling,
			'pairs'        => madar_int_list( $product->get_meta( '_madar_pairs' ) ),
			'materials'    => madar_int_list( $product->get_meta( '_madar_materials' ) ),
			'hotspots'     => $hotspots,
			'fit'          => madar_i18n( $id, 'fit', $lang, (string) $product->get_meta( '_madar_fit' ) ),
			'care'         => madar_i18n( $id, 'care', $lang, (string) $product->get_meta( '_madar_care' ) ),
			'size_chart'   => (string) $product->get_meta( '_madar_size_chart' ),
			'model'        => $model,
		),
	);
}

function madar_rest_products( WP_REST_Request $request ) {
	$items    = madar_catalog( madar_lang( $request ) );
	$audience = (string) $request['audience'];
	$ids      = madar_int_list( (string) $request['ids'] );
	if ( $audience ) {
		$items = array_values(
			array_filter(
				$items,
				static function ( $item ) use ( $audience ) {
					return $item['audience'] === $audience;
				}
			)
		);
	}
	if ( $ids ) {
		$by_id = array();
		foreach ( $items as $item ) {
			$by_id[ $item['id'] ] = $item;
		}
		$items = array();
		foreach ( $ids as $id ) {
			if ( isset( $by_id[ $id ] ) ) {
				$items[] = $by_id[ $id ];
			}
		}
	}
	return rest_ensure_response( $items );
}

function madar_find_product( $lang, $callback ) {
	foreach ( madar_catalog( $lang ) as $item ) {
		if ( $callback( $item ) ) {
			return rest_ensure_response( $item );
		}
	}
	return madar_error( 'madar_product_not_found', 'Product not found.', 404 );
}

function madar_rest_product( WP_REST_Request $request ) {
	$id = absint( $request['id'] );
	return madar_find_product(
		madar_lang( $request ),
		static function ( $item ) use ( $id ) {
			return $item['id'] === $id;
		}
	);
}

function madar_rest_product_by_slug( WP_REST_Request $request ) {
	$slug = trim( urldecode( (string) $request['slug'] ), '/' );
	return madar_find_product(
		madar_lang( $request ),
		static function ( $item ) use ( $slug ) {
			return $item['slug'] === $slug;
		}
	);
}

function madar_collection_posts( $post_type ) {
	return get_posts(
		array(
			'post_type'   => $post_type,
			'post_status' => 'publish',
			'numberposts' => 100,
			'orderby'     => array(
				'menu_order' => 'ASC',
				'date'       => 'DESC',
			),
		)
	);
}

function madar_rest_looks( WP_REST_Request $request ) {
	$lang = madar_lang( $request );
	return rest_ensure_response(
		madar_cached(
			'looks_' . $lang,
			static function () use ( $lang ) {
				$out = array();
				foreach ( madar_collection_posts( 'madar_look' ) as $post ) {
					$out[] = array(
						'id'           => $post->ID,
						'slug'         => urldecode( $post->post_name ),
						'title'        => madar_i18n( $post->ID, 'title', $lang, $post->post_title ),
						'excerpt'      => madar_i18n( $post->ID, 'excerpt', $lang, $post->post_excerpt ),
						'audience'     => (string) get_post_meta( $post->ID, '_madar_audience', true ),
						'occasion'     => (string) get_post_meta( $post->ID, '_madar_occasion', true ),
						'palette'      => (string) get_post_meta( $post->ID, '_madar_palette', true ),
						'products'     => madar_int_list( get_post_meta( $post->ID, '_madar_products', true ) ),
						'image'        => madar_image( get_post_thumbnail_id( $post ), 'main' ),
						'detail_image' => madar_image( get_post_meta( $post->ID, '_madar_detail_image', true ), 'detail' ),
					);
				}
				return $out;
			}
		)
	);
}

function madar_rest_materials( WP_REST_Request $request ) {
	$lang = madar_lang( $request );
	return rest_ensure_response(
		madar_cached(
			'materials_' . $lang,
			static function () use ( $lang ) {
				$out = array();
				foreach ( madar_collection_posts( 'madar_material' ) as $post ) {
					$verified = 'yes' === get_post_meta( $post->ID, '_madar_composition_verified', true );
					$out[]    = array(
						'id'          => $post->ID,
						'slug'        => urldecode( $post->post_name ),
						'name'        => madar_i18n( $post->ID, 'title', $lang, $post->post_title ),
						'story'       => wp_kses_post( wpautop( madar_i18n( $post->ID, 'story', $lang, $post->post_content ) ) ),
						'care'        => madar_i18n( $post->ID, 'care', $lang, (string) get_post_meta( $post->ID, '_madar_care', true ) ),
						'composition' => $verified ? madar_i18n( $post->ID, 'composition', $lang, (string) get_post_meta( $post->ID, '_madar_composition', true ) ) : null,
						'products'    => madar_int_list( get_post_meta( $post->ID, '_madar_products', true ) ),
						'image'       => madar_image( get_post_thumbnail_id( $post ), 'macro' ),
					);
				}
				return $out;
			}
		)
	);
}

function madar_order_items( WC_Order $order ) {
	$items = array();
	foreach ( $order->get_items() as $item ) {
		if ( ! $item instanceof WC_Order_Item_Product ) {
			continue;
		}
		$options = array();
		foreach ( $item->get_formatted_meta_data( '' ) as $meta ) {
			$options[] = array(
				'label' => wp_strip_all_tags( $meta->display_key ),
				'value' => wp_strip_all_tags( $meta->display_value ),
			);
		}
		$items[] = array(
			'product_id'   => $item->get_product_id(),
			'variation_id' => $item->get_variation_id(),
			'name'         => $item->get_name(),
			'quantity'     => $item->get_quantity(),
			'total'        => madar_money( $item->get_total() ),
			'options'      => $options,
		);
	}
	return $items;
}

function madar_order_payload( WC_Order $order ) {
	$timeline = array();
	foreach ( array(
		'created'   => $order->get_date_created(),
		'paid'      => $order->get_date_paid(),
		'completed' => $order->get_date_completed(),
	) as $step => $date ) {
		if ( $date ) {
			$timeline[] = array(
				'step' => $step,
				'date' => $date->date( 'c' ),
			);
		}
	}
	return array(
		'id'                   => $order->get_id(),
		'number'               => $order->get_order_number(),
		'status'               => $order->get_status(),
		'status_label'         => wc_get_order_status_name( $order->get_status() ),
		'total'                => madar_money( $order->get_total() ),
		'shipping_total'       => madar_money( $order->get_shipping_total() ),
		'currency'             => $order->get_currency(),
		'payment_method_title' => $order->get_payment_method_title(),
		'needs_payment'        => $order->needs_payment(),
		'items'                => madar_order_items( $order ),
		'timeline'             => $timeline,
	);
}

function madar_rest_order_confirmation( WP_REST_Request $request ) {
	$order = wc_get_order( absint( $request['order'] ) );
	if ( ! $order instanceof WC_Order || ! hash_equals( $order->get_order_key(), (string) $request['key'] ) ) {
		return madar_error( 'madar_order_not_found', 'Order not found.', 404 );
	}
	return rest_ensure_response( madar_order_payload( $order ) );
}
