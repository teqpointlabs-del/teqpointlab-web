(function(){
  const views = Array.from(document.querySelectorAll('.app-view'));
  const navLinks = Array.from(document.querySelectorAll('[data-view-link]'));
  const contactNav = document.getElementById('contactNavLink');
  const secondScreenContainer = document.getElementById('secondScreenContainer');
  const hero = document.querySelector('.hero[data-view="home"]');

  function showView(target){
    const targetId = `view-${target}`;
    views.forEach(v => {
      const isTarget = v.id === targetId;
      v.hidden = !isTarget;
    });
    if(hero){ hero.hidden = target !== 'home'; }
    navLinks.forEach(a => {
      const isActive = a.getAttribute('data-view-link') === target;
      if(isActive) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    // If leaving home, remove contact highlighting state
    if(target !== 'home' && contactNav){
      contactNav.classList.remove('is-active');
      contactNav.removeAttribute('aria-current');
    }
    if(location.hash !== `#${target}`) history.replaceState({view:target},'', `#${target}`);
    focusPrimaryHeading(targetId);
    ensureSlidersInitialized();
  }

  function focusPrimaryHeading(viewId){
    const container = document.getElementById(viewId);
    if(!container) return;
    const h = container.querySelector('h1,h2');
    if(h){ h.tabIndex = -1; h.focus({ preventScroll:false }); }
  }

  function ensureSlidersInitialized(){
    // slider.js initializes automatically on DOMContentLoaded; for hidden => shown we can retrigger if needed
    // If future dynamic content added, we can re-run initAll via dispatch
    // For now, nothing required since sliders exist in DOM at load.
  }

  function initialView(){
    const hash = location.hash.replace('#','').trim();
    if(['home','gallery'].includes(hash)) return hash; return 'home';
  }

  function handleNav(e){
    const link = e.currentTarget;
    const view = link.getAttribute('data-view-link');
    if(!view) return;
    e.preventDefault();
    showView(view);
    window.scrollTo({ top:0, behavior:'smooth' });
  }

  function scrollToContact(){
    if(secondScreenContainer && secondScreenContainer.hasAttribute('hidden')){
      secondScreenContainer.removeAttribute('hidden');
    }
    // Ensure content exists (via autoload helper) then perform custom offset scroll
    const target = (window.ensureContactLoaded && window.ensureContactLoaded()) || secondScreenContainer;
    if(!target) return;
    // Use manual scroll to account for fixed header height
    const header = document.querySelector('.site-header');
    const headerH = header ? header.offsetHeight : 0;
    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset + rect.top - (headerH + 16); // 16px breathing room
    window.scrollTo({ top: scrollTop < 0 ? 0 : scrollTop, behavior: 'smooth' });
    setTimeout(()=>{
      const title = target.querySelector('.contact-title');
      if(title){ title.tabIndex = -1; title.focus({ preventScroll:true }); }
    }, 400);
  }

  navLinks.forEach(l => l.addEventListener('click', handleNav));
  if(contactNav){
    contactNav.addEventListener('click', e => {
      e.preventDefault();
      // Always remain on home (if currently gallery switch back first)
      showView('home');
      // Defer scroll so layout stable
      setTimeout(scrollToContact, 50);
    });
  }

  // Intersection observer to highlight Contact link when contact section visible
  function initContactObserver(){
    if(!contactNav) return;
    const check = ()=> document.getElementById('contactSection');
    let target = check();
    if(!target){
      // Poll until loaded (autoload may inject later)
      const poll = setInterval(()=>{
        target = check();
        if(target){ clearInterval(poll); setupObserver(target); }
      },150);
    } else {
      setupObserver(target);
    }
  }

  function setupObserver(el){
    const header = document.querySelector('.site-header');
    const headerH = header ? header.offsetHeight : 0;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting && location.hash.replace('#','') !== 'gallery'){
          // Ensure we're conceptually on home
            contactNav.classList.add('is-active');
            contactNav.setAttribute('aria-current','page');
            navLinks.forEach(a=> a.removeAttribute('aria-current'));
        } else if(!entry.isIntersecting) {
          contactNav.classList.remove('is-active');
          contactNav.removeAttribute('aria-current');
          // restore active state for actual view hash
          const current = initialView();
          navLinks.forEach(a=>{
            const isActive = a.getAttribute('data-view-link') === current;
            if(isActive) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
          });
        }
      });
    }, { root:null, threshold: 0.35, rootMargin: `-${headerH + 10}px 0px 0px 0px` });
    observer.observe(el);
  }

  initContactObserver();

  window.addEventListener('load', ()=> {
    showView(initialView());
    initContactObserver();
  });

  window.addEventListener('hashchange', ()=> {
    const v = initialView();
    showView(v);
  });
})();