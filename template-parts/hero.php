<section class="hero" id="inicio" aria-label="<?php esc_attr_e( 'Hero', 'mycrof' ); ?>">

  <canvas id="hero-canvas" aria-hidden="true"></canvas>
  <div class="hero-grid" aria-hidden="true"></div>
  <div class="hero-vignette" aria-hidden="true"></div>

  <div class="container">
    <div class="hero-content">

      <div class="hero-label">
        <span class="hero-label-dot" aria-hidden="true"></span>
        <?php esc_html_e( 'Tech Talent Partner', 'mycrof' ); ?>
      </div>

      <h1 class="hero-title">
        <span class="hero-title-clip"><span class="hero-title-line"><?php esc_html_e( 'Conectando el', 'mycrof' ); ?></span></span>
        <span class="hero-title-clip"><span class="hero-title-line"><span class="gradient-text"><?php esc_html_e( 'Mejor Talento IT', 'mycrof' ); ?></span></span></span>
        <span class="hero-title-clip"><span class="hero-title-line"><?php esc_html_e( 'con el Futuro.', 'mycrof' ); ?></span></span>
      </h1>

      <p class="hero-typewriter" aria-live="polite">
        <span id="typewriter-text"></span><span class="cursor" aria-hidden="true"></span>
      </p>

      <div class="hero-ctas">
        <a href="#contacto" class="btn btn-primary hero-cta-1">
          <?php esc_html_e( 'Contratar Talento', 'mycrof' ); ?>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a href="#talento" class="btn btn-outline hero-cta-2">
          <?php esc_html_e( 'Soy Talento', 'mycrof' ); ?>
        </a>
      </div>

    </div>
  </div>

  <div class="hero-scroll" aria-hidden="true">
    <span><?php esc_html_e( 'Scroll', 'mycrof' ); ?></span>
    <div class="hero-scroll-arrow"></div>
  </div>

</section>
