(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const welcome = $('#welcome');
  const music = $('#background-music');
  const musicButton = $('#music-toggle');
  const musicLabel = $('#music-label');
  const lightbox = $('#lightbox');
  const flowers = $('#flower-dialog');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activePhoto = 0;
  let giftOpened = false;
  let returnFocus = null;
  let petalTimer;

  const photos = [
    ['assets/photo-01.jpg', '01 / Một chút rạng rỡ', 'Em cười rạng rỡ giữa những ánh đèn'],
    ['assets/photo-02.jpg', '02 / Một chút cuốn hút', 'Em trong chiếc váy trắng'],
    ['assets/photo-03.jpg', '03 / Một chút dịu dàng', 'Ảnh em chụp trước gương'],
    ['assets/photo-04.jpg', '04 / Một chút bình yên', 'Em trong không gian quán cà phê ấm áp'],
    ['assets/photo-05.jpg', '05 / Và thật nhiều đáng yêu', 'Em cười và giơ tay hình chữ V']
  ];

  function reflectMusic() {
    const playing = !music.paused;
    musicButton.classList.toggle('playing', playing);
    musicButton.setAttribute('aria-pressed', String(playing));
    musicButton.setAttribute('aria-label', playing ? 'Tắt nhạc piano' : 'Bật nhạc piano');
    musicLabel.textContent = playing ? 'Chút nhạc cho em' : 'Bật chút nhạc';
  }

  function startMusic() {
    music.volume = 0.38;
    // Called directly from a user gesture, including on iOS.
    const playback = music.play();
    if (playback) playback.catch(() => {
      reflectMusic();
      musicLabel.textContent = 'Chạm để thử lại';
    });
  }

  function lockPage() {
    document.body.classList.toggle('dialog-open', Boolean(document.querySelector('dialog[open]')));
  }

  function revealPage() {
    if (!('IntersectionObserver' in window) || reducedMotion) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    document.body.classList.add('motion-ready');
  }

  function openGift(withMusic) {
    if (giftOpened) return;
    giftOpened = true;
    if (withMusic) startMusic();
    const dismiss = () => {
      welcome.close();
      lockPage();
      revealPage();
      // A programmatic focus target keeps keyboard navigation on the actual page.
      const title = $('#hero-title');
      title.tabIndex = -1;
      title.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    if (reducedMotion) dismiss();
    else {
      welcome.classList.add('leaving');
      welcome.addEventListener('animationend', dismiss, { once: true });
      // Fallback if animation events are disabled by the browser or an extension.
      window.setTimeout(() => { if (welcome.open) dismiss(); }, 850);
    }
  }

  function showPhoto(index) {
    activePhoto = (index + photos.length) % photos.length;
    const [source, caption, alt] = photos[activePhoto];
    $('#lightbox-image').src = source;
    $('#lightbox-image').alt = alt;
    $('#lightbox-caption').textContent = caption;
  }

  function showDialog(dialog, trigger) {
    returnFocus = trigger;
    dialog.showModal();
    lockPage();
  }

  function scatterPetals() {
    if (reducedMotion) return;
    const layer = $('#petal-layer');
    window.clearTimeout(petalTimer);
    layer.replaceChildren();
    const palette = ['#d994a5', '#edbec8', '#bd7187', '#f0d0bb', '#e6a6b0'];
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 42; i += 1) {
      const petal = document.createElement('i');
      petal.className = 'petal';
      const properties = {
        '--left': `${Math.random() * 100}%`,
        '--size': `${7 + Math.random() * 9}px`,
        '--duration': `${4 + Math.random() * 3}s`,
        '--delay': `${Math.random() * 1.4}s`,
        '--drift': `${Math.random() * 200 - 100}px`,
        '--spin': `${Math.random() * 720 - 360}deg`,
        '--color': palette[i % palette.length]
      };
      Object.entries(properties).forEach(([name, value]) => petal.style.setProperty(name, value));
      fragment.append(petal);
    }
    layer.append(fragment);
    petalTimer = window.setTimeout(() => layer.replaceChildren(), 9000);
  }

  $('#open-gift').addEventListener('click', () => openGift(true));
  $('#open-quiet').addEventListener('click', () => openGift(false));
  welcome.addEventListener('cancel', (event) => { event.preventDefault(); openGift(false); });
  musicButton.addEventListener('click', () => music.paused ? startMusic() : music.pause());
  music.addEventListener('play', reflectMusic);
  music.addEventListener('pause', reflectMusic);
  music.addEventListener('error', () => {
    musicLabel.textContent = 'Nhạc chưa tải được';
    musicButton.setAttribute('aria-pressed', 'false');
    musicButton.classList.remove('playing');
  });
  document.querySelectorAll('[data-photo]').forEach((button) => {
    button.addEventListener('click', () => {
      showPhoto(Number(button.dataset.photo));
      showDialog(lightbox, button);
    });
  });
  $('#previous-photo').addEventListener('click', () => showPhoto(activePhoto - 1));
  $('#next-photo').addEventListener('click', () => showPhoto(activePhoto + 1));
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(activePhoto + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  $('#receive-flowers').addEventListener('click', (event) => {
    showDialog(flowers, event.currentTarget);
    scatterPetals();
  });
  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => document.getElementById(button.dataset.close).close());
  });
  [lightbox, flowers].forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom || dialog === lightbox) dialog.close();
    });
    dialog.addEventListener('close', () => {
      lockPage();
      if (returnFocus) returnFocus.focus({ preventScroll: true });
      if (dialog === flowers) {
        window.clearTimeout(petalTimer);
        $('#petal-layer').replaceChildren();
      }
    });
  });
  // Back/forward cache keeps the current music preference and scroll position.
  window.addEventListener('pagehide', () => music.pause());
  welcome.showModal();
  lockPage();
})();
