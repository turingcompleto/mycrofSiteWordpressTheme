<?php
/**
 * Template: Landing Page (Front Page)
 * Se carga automáticamente cuando WordPress tiene configurada una página estática de inicio.
 * Settings > Reading > "Your homepage displays" → "A static page"
 */
get_header(); ?>

<main id="main" role="main">
  <?php get_template_part( 'template-parts/hero' ); ?>
  <?php get_template_part( 'template-parts/services' ); ?>
  <?php get_template_part( 'template-parts/process' ); ?>
  <?php get_template_part( 'template-parts/talent' ); ?>
  <?php get_template_part( 'template-parts/contact' ); ?>
</main>

<?php get_footer();
