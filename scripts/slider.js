(function(){
  const SLIDE_DURATION = 300;
  const INTERVAL_MS = 3000;

  function initSlider(root){
    const slidesContainer = root.querySelector('.slides');
    const slides = Array.from(root.querySelectorAll('.slide'));
    const prevBtn = root.querySelector('.prev');
    const nextBtn = root.querySelector('.next');
    const dotsContainer = root.querySelector('.dots');
    let index = 0;
    let isAnimating = false;
    let touchStartX = 0;
    let touchDeltaX = 0;
    let autoTimer = null;

    function update(){
      slidesContainer.style.transform = `translateX(-${index * 100}%)`;
      Array.from(dotsContainer.children).forEach((dot,i)=>{
        dot.setAttribute('aria-selected', i===index ? 'true':'false');
        dot.tabIndex = i===index ? 0 : -1;
      });
    }
    function setIndex(newIndex, userInitiated=false){
      if(isAnimating) return;
      if(newIndex < 0) newIndex = slides.length - 1;
      if(newIndex >= slides.length) newIndex = 0;
      if(newIndex === index) return;
      index = newIndex;
      isAnimating = true;
      update();
      resetAutoplay(userInitiated);
      setTimeout(()=> isAnimating = false, SLIDE_DURATION + 30);
    }
    function resetAutoplay(){
      if(autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(()=> setIndex(index + 1), INTERVAL_MS);
    }

    // Build dots
    dotsContainer.innerHTML = '';
    slides.forEach((_,i)=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dot';
      b.setAttribute('role','tab');
      b.setAttribute('aria-label',`Go to slide ${i+1}`);
      b.addEventListener('click', ()=> setIndex(i, true));
      dotsContainer.appendChild(b);
    });

    prevBtn?.addEventListener('click',()=> setIndex(index - 1, true));
    nextBtn?.addEventListener('click',()=> setIndex(index + 1, true));

    root.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowLeft'){ e.preventDefault(); setIndex(index - 1, true); }
      if(e.key === 'ArrowRight'){ e.preventDefault(); setIndex(index + 1, true); }
    });

    slidesContainer.addEventListener('touchstart', (e)=>{
      if(e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX; touchDeltaX = 0; slidesContainer.style.transition='none'; if(autoTimer) clearInterval(autoTimer);
    }, {passive:true});
    slidesContainer.addEventListener('touchmove', (e)=>{
      if(e.touches.length !== 1) return; touchDeltaX = e.touches[0].clientX - touchStartX; slidesContainer.style.transform = `translateX(calc(-${index*100}% + ${touchDeltaX}px))`; }, {passive:true});
    slidesContainer.addEventListener('touchend', ()=>{
      slidesContainer.style.transition='';
      const threshold = window.innerWidth * 0.15;
      if(Math.abs(touchDeltaX) > threshold){ setIndex(index + (touchDeltaX < 0 ? 1 : -1), true); }
      else { update(); resetAutoplay(); }
    });

    update();
    resetAutoplay();
  }

  function initAll(){
    document.querySelectorAll('[data-slider]').forEach(slider => initSlider(slider));
  }

  if(document.readyState !== 'loading') initAll();
  else document.addEventListener('DOMContentLoaded', initAll);
})();