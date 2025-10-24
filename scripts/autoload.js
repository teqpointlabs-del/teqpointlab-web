(function(){
  const sentinel = document.getElementById('loadNextSentinel');
  const container = document.getElementById('secondScreenContainer');
  if(!sentinel || !container) return;
  let loaded = false;

  function buildContactScreen(){
    const wrapper = document.createElement('section');
    wrapper.className = 'contact-screen';
    wrapper.id = 'contactSection';
    wrapper.setAttribute('aria-label','Contact section');

    wrapper.innerHTML = `
      <div class="contact-grid">
        <div class="contact-image-col">
          <figure class="contact-illustration">
            <img src="assets/images/TPLMOCKNTRAIN.jpg" alt="Get in touch" />
          </figure>
        </div>
        <div class="contact-form-col">
          <h2 class="contact-title">Contact Us</h2>
          <p class="contact-subtitle">Fill the form & our team will reach out shortly.</p>
          <form id="contactForm" novalidate>
            <div class="field-group"><label for="name">Name<span aria-hidden="true">*</span></label><input id="name" name="name" type="text" autocomplete="name" required /><p class="field-error" data-error-for="name"></p></div>
            <div class="field-group"><label for="email">Email<span aria-hidden="true">*</span></label><input id="email" name="email" type="email" autocomplete="email" required /><p class="field-error" data-error-for="email"></p></div>
            <div class="field-group"><label for="mobile">Mobile<span aria-hidden="true">*</span></label><input id="mobile" name="mobile" type="tel" inputmode="tel" autocomplete="tel" required /><p class="field-error" data-error-for="mobile"></p></div>
            <div class="field-group"><label for="subject">Subject</label><input id="subject" name="subject" type="text" /></div>
            <div class="field-group"><label for="message">Message</label><textarea id="message" name="message" rows="4"></textarea></div>
            <div class="field-group file-group"><label for="attachment">Attachment</label><input id="attachment" name="attachment" type="file" /></div>
            <div class="actions"><button type="submit" class="btn primary">Send</button><button type="reset" class="btn">Reset</button></div>
            <div class="form-status" aria-live="polite" id="formStatus"></div>
          </form>
        </div>
      </div>
      <section class="branches" aria-label="Branch locations">
       <!-- <h3 class="section-heading">Our Branches</h3>
        <ul class="branch-list">
          <li><strong>New York</strong><span>USA</span></li>
          <li><strong>London</strong><span>UK</span></li>
          <li><strong>Berlin</strong><span>Germany</span></li>
          <li><strong>Sydney</strong><span>Australia</span></li>
          <li><strong>Tokyo</strong><span>Japan</span></li>
          <li><strong>Bangalore</strong><span>India</span></li>
        </ul> -->
        <figure class="branches-visual"><img src="assets/images/BRACHESTPL.jpg" alt="Global branches visual" /></figure>
      </section>
      <section class="social-links" aria-label="Social media">
        <h3 class="section-heading">Connect With Us</h3>
        <ul class="social-list">
          <li><a href="#" aria-label="Twitter" class="social-btn twitter">${socialIcon('M')}</a></li>
          <li><a href="#" aria-label="LinkedIn" class="social-btn linkedin">${socialIcon('in')}</a></li>
          <li><a href="#" aria-label="Facebook" class="social-btn facebook">${socialIcon('f')}</a></li>
          <li><a href="#" aria-label="Instagram" class="social-btn instagram">${socialIcon('●')}</a></li>
        </ul>
      </section>`;

    container.appendChild(wrapper);
    container.hidden = false;
    container.setAttribute('data-loaded','true');
    const title = wrapper.querySelector('.contact-title');
    title.tabIndex = -1; title.focus({ preventScroll:true });
  }

  function socialIcon(txt){
    return `<span class="icon">${txt}</span>`;
  }

  function loadSecond(){
    if(loaded) return; loaded = true; buildContactScreen(); }

  // Expose a safe loader for programmatic invocation (Contact nav click)
  window.ensureContactLoaded = function(){
    if(!loaded) { loadSecond(); }
    return container.querySelector('.contact-screen');
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ loadSecond(); observer.disconnect(); } });
  }, { rootMargin: '200px 0px 0px 0px', threshold: 0 });

  observer.observe(sentinel);

  // Basic form validation hookup deferred until contact.js (optional enhancement)
})();
