// ============================================================
// INTRO BOOT SEQUENCE
// ============================================================
(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader = document.getElementById('loader');
  if (!loader) return;

  if (reduceMotion){
    document.body.classList.remove('is-loading');
    loader.classList.add('is-done');
    return;
  }

  const linesEl = document.getElementById('loader-lines');
  const barEl = document.getElementById('loader-bar');
  const pctEl = document.getElementById('loader-pct');
  const bootLines = ['loading assets', 'compiling layout', 'rendering interface'];
  const minimumBootTime = 3000;
  const bootStartedAt = performance.now();
  let lineIndex = 0;
  let progress = 0;

  function typeNextLine(){
    if (lineIndex >= bootLines.length) return;
    const row = document.createElement('div');
    row.className = 'line';
    row.innerHTML = `<span class="ok">âœ“</span><span>${bootLines[lineIndex]}</span>`;
    linesEl.appendChild(row);
    lineIndex++;
    if (lineIndex < bootLines.length) setTimeout(typeNextLine, 360);
  }

  function tickProgress(){
    progress = Math.min(progress + Math.random() * 18 + 6, 100);
    barEl.style.width = progress + '%';
    pctEl.textContent = String(Math.floor(progress)).padStart(2, '0') + '%';
    if (progress < 100) {
      setTimeout(tickProgress, 140);
    } else {
      const elapsed = performance.now() - bootStartedAt;
      const remainingBuffer = Math.max(minimumBootTime - elapsed, 280);
      setTimeout(finishLoading, remainingBuffer);
    }
  }

  function finishLoading(){
    loader.classList.add('is-leaving');
    document.body.classList.remove('is-loading');
    setTimeout(() => loader.classList.add('is-done'), 750);
  }

  typeNextLine();
  tickProgress();
})();

// ============================================================
// SCROLL REVEAL â€” IntersectionObserver driven
// ============================================================
(function(){
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ============================================================
  // SMOOTH ANCHOR SCROLL (fallback for older browsers)
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // PORTRAIT IMAGE â€” graceful fallback if not replaced
  // ============================================================
  const photo = document.getElementById('profile-photo');
  if (photo){
    photo.addEventListener('error', () => {
      photo.src = 'https://placehold.co/640x780/1A1D21/6B7280?text=Add+Your+Photo';
    });
  }
})();

