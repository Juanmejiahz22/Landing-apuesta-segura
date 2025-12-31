/* Detect TikTok in-app browser */
(function() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isTikTok = /ByteLocale|musical_ly|TikTok/i.test(userAgent);
  
  if (isTikTok) {
    const banner = document.getElementById('tiktokBanner');
    if (banner) {
      banner.classList.remove('hidden');
      document.body.classList.add('tiktok-detected');
    }
  }
})();

/* Detect TikTok in-app browser */
(function() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isTikTok = /ByteLocale|musical_ly|TikTok/i.test(userAgent);
  
  if (isTikTok) {
    const banner = document.getElementById('tiktokBanner');
    if (banner) {
      banner.classList.remove('hidden');
      document.body.classList.add('tiktok-detected');
    }
  }
})();

const btn = document.getElementById("telegramBtn");

if (btn) {
  btn.addEventListener("click", (e) => {
    console.log("telegramBtn clicked", { tag: btn.tagName });

    if (btn.tagName && btn.tagName.toLowerCase() === "a") {
      return;
    }

    window.location.href = "https://t.me/+OCpEnkS65oZlZTcx";
  });
} else {
  console.warn("telegramBtn not found in DOM");
}

/* Simple carousel logic: auto-advance, prev/next controls, pause on hover */
(function () {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.slide'));
  if (slides.length === 0) return;

  let current = slides.findIndex(s => s.classList.contains('active'));
  if (current === -1) current = 0;

  const intervalMs = 4000;
  let timer = null;

  function show(idx) {
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    current = idx;
  }

  function next() { show((current + 1) % slides.length); }
  function prev() { show((current - 1 + slides.length) % slides.length); }

  // start autoplay
  timer = setInterval(next, intervalMs);

  // pause on hover/focus
  carousel.addEventListener('mouseover', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => { clearInterval(timer); timer = setInterval(next, intervalMs); });

  const btnPrev = carousel.querySelector('.carousel-btn.prev');
  const btnNext = carousel.querySelector('.carousel-btn.next');
  if (btnPrev) btnPrev.addEventListener('click', () => { prev(); clearInterval(timer); timer = setInterval(next, intervalMs); });
  if (btnNext) btnNext.addEventListener('click', () => { next(); clearInterval(timer); timer = setInterval(next, intervalMs); });
})();

/* Lightbox: open clicked slide in full preview */
(function () {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  if (!lightbox || !lbImg) return;

  // open when clicking the visible carousel image
  document.querySelectorAll('.carousel .slide').forEach(slide => {
    slide.addEventListener('click', (e) => {
      // use the event's currentTarget to ensure we get the element that the
      // listener was registered on (and that has pointer-events enabled)
      const el = e.currentTarget || slide;
      const src = (el && el.tagName && el.tagName.toLowerCase() === 'img') ? el.src : el.getAttribute('src');
      if (!src) return;
      lbImg.src = src;
      // set alt if present
      lbImg.alt = el.alt || 'Imagen ampliada';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  // close helpers
  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    document.body.style.overflow = '';
  };

  // close button
  const closeBtn = lightbox.querySelector('.lightbox-close');
  if (closeBtn) closeBtn.addEventListener('click', close);

  // click backdrop to close
  const backdrop = lightbox.querySelector('.lightbox-backdrop');
  if (backdrop) backdrop.addEventListener('click', close);

  // ESC to close
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && lightbox.classList.contains('open')) close();
  });
})();

/* Scroll animations: reveal elements on scroll */
(function() {
  const animatedElements = document.querySelectorAll('.scroll-animate');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
})();

/* YouTube IFrame API: golden glow on carousel when video reaches 15 seconds */
(function() {
  const carousel = document.getElementById('carousel');
  const goldenBtn1 = document.getElementById('goldenBtn1');
  
  if (!carousel) return;

  let glowApplied = false;
  let btnActivated = false;
  let glowTimeout = null;
  let player = null;
  let checkInterval = null;

  // Load YouTube IFrame API
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  // Initialize player when API is ready
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('promoVideo', {
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
  };

  function onPlayerStateChange(event) {
    // When video is playing
    if (event.data === YT.PlayerState.PLAYING) {
      // Start checking video time
      if (!checkInterval) {
        checkInterval = setInterval(checkVideoTime, 500);
      }
      
      // Reset flags if rewound
      if (player && player.getCurrentTime) {
        const currentTime = player.getCurrentTime();
        if (currentTime < 15) {
          glowApplied = false;
          if (glowTimeout) clearTimeout(glowTimeout);
        }
        if (currentTime < 60) {
          btnActivated = false;
          if (goldenBtn1) {
            goldenBtn1.classList.add('hidden');
            goldenBtn1.classList.remove('activated');
          }
        }
      }
    } else {
      // Stop checking when paused/ended
      if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
      }
    }
  }

  function checkVideoTime() {
    if (!player || !player.getCurrentTime) return;
    
    const currentTime = player.getCurrentTime();
    
    // Trigger carousel glow at 15 seconds, only once per play
    if (currentTime >= 15 && currentTime < 16 && !glowApplied) {
      glowApplied = true;
      carousel.classList.add('golden-glow');
      
      // Remove glow after 1 minute (60000 milliseconds)
      glowTimeout = setTimeout(() => {
        carousel.classList.remove('golden-glow');
      }, 60000);
    }

    // Activate golden button at 1 minute (60 seconds)
    if (currentTime >= 60 && currentTime < 61 && !btnActivated && goldenBtn1) {
      btnActivated = true;
      goldenBtn1.classList.remove('hidden');
      goldenBtn1.classList.add('activated');
    }
  }
})();
