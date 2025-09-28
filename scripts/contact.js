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

      // Simulate async submission
      statusEl.textContent = 'Sending...';
      setTimeout(()=>{ statusEl.textContent = 'Message sent (simulated).'; form.reset(); }, 800);
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