<?php
defined( 'ABSPATH' ) || exit;

/* ─── Theme Setup ─────────────────────────────────────────────────────────── */
function mycrof_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', [ 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption' ] );
	add_theme_support( 'custom-logo' );
	load_theme_textdomain( 'mycrof', get_template_directory() . '/languages' );

	register_nav_menus( [
		'primary' => __( 'Menú Principal', 'mycrof' ),
	] );
}
add_action( 'after_setup_theme', 'mycrof_setup' );

/* ─── Assets ──────────────────────────────────────────────────────────────── */
function mycrof_enqueue_assets() {
	$v = wp_get_theme()->get( 'Version' );

	// Google Fonts: Poppins + Plus Jakarta Sans
	wp_enqueue_style(
		'mycrof-fonts',
		'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Poppins:wght@400;600;700;900&display=swap',
		[],
		null
	);

	wp_enqueue_style( 'mycrof-style', get_stylesheet_uri(), [ 'mycrof-fonts' ], $v );

	wp_enqueue_script(
		'gsap',
		'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
		[],
		null,
		true
	);

	wp_enqueue_script( 'mycrof-main', get_template_directory_uri() . '/js/main.js', [ 'gsap' ], $v, true );

	// Pass contact form nonce to JS for AJAX or page feedback
	wp_localize_script( 'mycrof-main', 'MycrofData', [
		'homeUrl' => esc_url( home_url( '/' ) ),
		'sent'    => isset( $_GET['sent'] ) ? '1' : '0',
	] );
}
add_action( 'wp_enqueue_scripts', 'mycrof_enqueue_assets' );

/* ─── Contact Form Handler ────────────────────────────────────────────────── */
add_action( 'init', 'mycrof_handle_contact_form' );
function mycrof_handle_contact_form() {
	if ( 'POST' !== $_SERVER['REQUEST_METHOD'] ) return;
	if ( empty( $_POST['mycrof_contact_nonce'] ) ) return;
	if ( ! wp_verify_nonce( $_POST['mycrof_contact_nonce'], 'mycrof_contact' ) ) return;

	$name    = sanitize_text_field( $_POST['contact_name']    ?? '' );
	$email   = sanitize_email( $_POST['contact_email']        ?? '' );
	$phone   = sanitize_text_field( $_POST['contact_phone']   ?? '' );
	$type    = sanitize_text_field( $_POST['contact_type']    ?? '' );
	$message = sanitize_textarea_field( $_POST['contact_message'] ?? '' );

	$body  = "Nombre: {$name}\n";
	$body .= "Email: {$email}\n";
	$body .= "Teléfono: {$phone}\n";
	$body .= "Tipo: {$type}\n\n";
	$body .= "Mensaje:\n{$message}";

	wp_mail(
		'contact@mycrof.mx',
		"[MYCROF] Nuevo contacto de {$name}",
		$body,
		[ "Reply-To: {$name} <{$email}>" ]
	);

	wp_safe_redirect( add_query_arg( 'sent', '1', wp_get_referer() ) . '#contacto' );
	exit;
}
