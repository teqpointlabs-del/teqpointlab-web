(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(()=>{
    const container = document.getElementById('secondScreenContainer');
    const observer = new MutationObserver(()=>{
      if(container?.querySelector('#contactForm')){
        attach(); observer.disconnect();
      }
    });
    observer.observe(container, { childList:true, subtree:true });
  });

  function attach(){
    const form = document.getElementById('contactForm');
    if(!form) return;
    const statusEl = document.getElementById('formStatus');
    const submitBtn = form.querySelector('button[type="submit"]');

    // --- EmailJS CONFIG PLACEHOLDERS ---
    // Replace the below 3 constants with your actual EmailJS dashboard values.
    // DO NOT commit real keys to public repos.
  const EMAILJS_SERVICE_ID = 'service_oxr5onf';
  const EMAILJS_TEMPLATE_ID = 'template_7a7cclk';
  const EMAILJS_PUBLIC_KEY = 'hTPJvC3bbpdPs6ByN';

    // Track one-time init
    let emailjsReady = false;

    function loadEmailJSSDK(){
      return new Promise((resolve, reject) => {
        if(window.emailjs){ return resolve(window.emailjs); }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.async = true;
        script.onload = () => window.emailjs ? resolve(window.emailjs) : reject(new Error('EmailJS not available after load'));
        script.onerror = () => reject(new Error('Failed to load EmailJS SDK'));
        document.head.appendChild(script);
      });
    }

    async function ensureEmailJSInit(){
      if(emailjsReady) return;
      const sdk = await loadEmailJSSDK();
      if(!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY.startsWith('YOUR_')){
        throw new Error('EmailJS public key not configured');
      }
      sdk.init({ publicKey: EMAILJS_PUBLIC_KEY });
      emailjsReady = true;
    }

    function disableForm(disabled){
      if(submitBtn){ submitBtn.disabled = disabled; submitBtn.setAttribute('aria-disabled', String(disabled)); }
      if(disabled){ form.classList.add('is-submitting'); } else { form.classList.remove('is-submitting'); }
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors();
      const data = new FormData(form);
      const name = data.get('name').trim();
      const email = data.get('email').trim();
  const mobile = data.get('mobile') ? data.get('mobile').trim() : '';
  let valid = true;

      if(!name){ setError('name','Name is required'); valid = false; }
  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setError('email','Valid email required'); valid = false; }
  if(!mobile){ setError('mobile','Mobile is required'); valid = false; }
  else if(!/^\+?[0-9()\-\s]{7,20}$/.test(mobile)){ setError('mobile','Enter valid phone number'); valid = false; }

      if(!valid){ statusEl.textContent = 'Please correct highlighted fields.'; return; }

      // Guard missing config
      if(EMAILJS_SERVICE_ID.startsWith('YOUR_') || EMAILJS_TEMPLATE_ID.startsWith('YOUR_')){
        statusEl.textContent = 'Email service not configured. Please set EmailJS IDs.';
        return;
      }

      statusEl.textContent = 'Sending...';
      disableForm(true);

      // Build template params (capitalized keys as required by your EmailJS template)
      const templateParams = {
        Name: name,
        Email: email,
        Mobile: mobile,
        Subject: (data.get('subject') || '').toString().trim(),
        Message: (data.get('message') || '').toString().trim()
      };

      ensureEmailJSInit()
        .then(()=> window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams))
        .then(()=> {
          statusEl.textContent = 'Message sent successfully! Thank you.';
          form.reset();
        })
        .catch(err => {
          console.error('EmailJS error', err);
          statusEl.textContent = 'Failed to send message. Please try again later.';
        })
        .finally(()=> disableForm(false));
    });

    function setError(fieldId, msg){
      const err = document.querySelector(`[data-error-for="${fieldId}"]`);
      if(err){ err.textContent = msg; }
      const input = document.getElementById(fieldId);
      if(input){ input.setAttribute('aria-invalid','true'); }
    }
    function clearErrors(){
      form.querySelectorAll('[aria-invalid="true"]').forEach(el=> el.removeAttribute('aria-invalid'));
      form.querySelectorAll('.field-error').forEach(e=> e.textContent='');
      statusEl.textContent='';
    }
  }
})();