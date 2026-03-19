<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="<?php bloginfo( 'description' ); ?>">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" id="site-header">
  <div class="container">
    <nav class="nav-inner" role="navigation" aria-label="<?php esc_attr_e( 'Menú principal', 'mycrof' ); ?>">

      <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="nav-logo" aria-label="<?php bloginfo( 'name' ); ?>">
        <?php if ( has_custom_logo() ) :
          the_custom_logo();
        else : ?>
          <span class="nav-logo-text">MYCROF<span class="nav-logo-dot"></span></span>
        <?php endif; ?>
      </a>

      <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="<?php esc_attr_e( 'Abrir menú', 'mycrof' ); ?>">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul class="nav-menu" id="nav-menu" role="list">
        <li><a class="nav-link" href="#servicios"><?php esc_html_e( 'Servicios', 'mycrof' ); ?></a></li>
        <li><a class="nav-link" href="#proceso"><?php esc_html_e( 'Proceso', 'mycrof' ); ?></a></li>
        <li><a class="nav-link" href="#talento"><?php esc_html_e( 'Talento', 'mycrof' ); ?></a></li>
        <li><a class="nav-link" href="#contacto"><?php esc_html_e( 'Contacto', 'mycrof' ); ?></a></li>
        <li><a class="btn btn-primary nav-cta" href="#contacto"><?php esc_html_e( 'Contáctanos', 'mycrof' ); ?></a></li>
      </ul>

    </nav>
  </div>
</header>
