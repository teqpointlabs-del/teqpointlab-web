(function(){
  const toggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('sideDrawer');
  const backdrop = document.getElementById('backdrop');
  if(!toggle || !drawer) return;

  function open(){
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    backdrop.hidden = false;
    toggle.setAttribute('aria-expanded','true');
  }
  function close(){
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
    backdrop.hidden = true;
    toggle.setAttribute('aria-expanded','false');
  }
  function toggleDrawer(){
    drawer.classList.contains('open') ? close() : open();
  }
  toggle.addEventListener('click', toggleDrawer);
  backdrop?.addEventListener('click', close);
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && drawer.classList.contains('open')) close();
  });
})();