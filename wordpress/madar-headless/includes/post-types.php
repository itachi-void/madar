<?php
defined( 'ABSPATH' ) || exit;

function madar_register_post_types() {
	$common = array(
		'public'          => false,
		'show_ui'         => true,
		'show_in_menu'    => 'madar',
		'show_in_rest'    => false,
		'capability_type' => 'post',
		'map_meta_cap'    => true,
	);
	register_post_type(
		'madar_look',
		array(
			'labels'   => array(
				'name'          => 'Looks',
				'singular_name' => 'Look',
				'add_new_item'  => 'Add look',
				'edit_item'     => 'Edit look',
			),
			'supports' => array( 'title', 'excerpt', 'thumbnail', 'page-attributes' ),
		) + $common
	);
	register_post_type(
		'madar_material',
		array(
			'labels'   => array(
				'name'          => 'Materials',
				'singular_name' => 'Material',
				'add_new_item'  => 'Add material',
				'edit_item'     => 'Edit material',
			),
			'supports' => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
		) + $common
	);
	$inbox = array(
		'supports'     => array( 'title' ),
		'capabilities' => array( 'create_posts' => 'do_not_allow' ),
	) + $common;
	register_post_type(
		'madar_stock_alert',
		array(
			'labels' => array(
				'name'          => 'Stock alerts',
				'singular_name' => 'Stock alert',
			),
		) + $inbox
	);
	register_post_type(
		'madar_question',
		array(
			'labels' => array(
				'name'          => 'Concierge questions',
				'singular_name' => 'Concierge question',
			),
		) + $inbox
	);
}
