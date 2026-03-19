<?php
/**
 * Fallback template. WordPress lo usa cuando no existe front-page.php o page.php.
 * En producción esta página nunca debería cargarse si el sitio está configurado correctamente.
 */
get_header(); ?>

<main id="main" role="main" style="padding-top:72px;">
  <div class="container section">
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
      <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
        <h1 class="section-title"><?php the_title(); ?></h1>
        <div style="margin-top:1.5rem;"><?php the_content(); ?></div>
      </article>
    <?php endwhile; else : ?>
      <p><?php esc_html_e( 'No se encontró contenido.', 'mycrof' ); ?></p>
    <?php endif; ?>
  </div>
</main>

<?php get_footer();
