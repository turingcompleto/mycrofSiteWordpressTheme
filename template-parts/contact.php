<section class="section section-contact" id="contacto" data-sec-num="04">
  <div class="container">

    <div class="contact-grid">

      <div class="contact-info" data-reveal="left">
        <p class="section-label"><?php esc_html_e( 'Hablemos', 'mycrof' ); ?></p>
        <h2><?php esc_html_e( 'Comencemos a construir tu equipo del futuro.', 'mycrof' ); ?></h2>
        <p><?php esc_html_e( 'Cuéntanos qué necesitas. En menos de 24 horas un experto en talento IT se pondrá en contacto contigo.', 'mycrof' ); ?></p>

        <div class="contact-detail">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <span>contact@mycrof.mx</span>
        </div>

        <div class="contact-detail">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <a href="tel:+525551595864" style="color:inherit;text-decoration:none;">+52 55 5159 5864</a>
        </div>

        <div class="contact-detail">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
          </svg>
          <span>mycrof.mx</span>
        </div>
      </div>

      <div class="contact-form-wrap" data-reveal="right">

        <?php if ( isset( $_GET['sent'] ) && '1' === $_GET['sent'] ) : ?>
          <div class="form-success" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <?php esc_html_e( 'Mensaje enviado. ¡Te contactaremos en menos de 24 horas!', 'mycrof' ); ?>
          </div>
        <?php endif; ?>

        <form method="post" action="<?php echo esc_url( home_url( '/#contacto' ) ); ?>" novalidate>
          <?php wp_nonce_field( 'mycrof_contact', 'mycrof_contact_nonce' ); ?>

          <div class="form-row">
            <div class="form-group">
              <label for="contact_name"><?php esc_html_e( 'Nombre', 'mycrof' ); ?></label>
              <input type="text" id="contact_name" name="contact_name" placeholder="<?php esc_attr_e( 'Tu nombre', 'mycrof' ); ?>" required>
            </div>
            <div class="form-group">
              <label for="contact_email"><?php esc_html_e( 'Email', 'mycrof' ); ?></label>
              <input type="email" id="contact_email" name="contact_email" placeholder="<?php esc_attr_e( 'tu@empresa.com', 'mycrof' ); ?>" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="contact_phone"><?php esc_html_e( 'Teléfono', 'mycrof' ); ?></label>
              <input type="tel" id="contact_phone" name="contact_phone" placeholder="<?php esc_attr_e( 'Opcional', 'mycrof' ); ?>">
            </div>
            <div class="form-group">
              <label for="contact_type"><?php esc_html_e( 'Soy...', 'mycrof' ); ?></label>
              <div class="form-select-wrap">
                <select id="contact_type" name="contact_type">
                  <option value=""><?php esc_html_e( 'Selecciona una opción', 'mycrof' ); ?></option>
                  <option value="empresa"><?php esc_html_e( 'Una empresa buscando talento', 'mycrof' ); ?></option>
                  <option value="talento"><?php esc_html_e( 'Un profesional IT', 'mycrof' ); ?></option>
                  <option value="otro"><?php esc_html_e( 'Otro', 'mycrof' ); ?></option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="contact_message"><?php esc_html_e( 'Mensaje', 'mycrof' ); ?></label>
            <textarea id="contact_message" name="contact_message" placeholder="<?php esc_attr_e( 'Cuéntanos qué necesitas...', 'mycrof' ); ?>" required></textarea>
          </div>

          <button type="submit" class="btn btn-primary form-submit">
            <?php esc_html_e( 'Enviar Mensaje', 'mycrof' ); ?>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>

        </form>
      </div>

    </div>
  </div>
</section>
