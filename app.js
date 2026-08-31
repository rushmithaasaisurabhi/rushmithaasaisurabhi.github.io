/* ─────────────────────────────────────────────────────────
   Seemantham Invitation — App Script
   • Smooth scroll between sections
   • Intersection Observer fade-in animations
   • Flowers & leaves falling animation
───────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Letter reveal for invitation text ── */
  function initLetterAnimations() {
    var targets = document.querySelectorAll('.letter-animate');
    if (!targets.length) return;

    targets.forEach(function (target) {
      var source = target.getAttribute('data-animate-text') || target.textContent || '';
      var lines = source.split('|');
      var label = lines.join(' ');
      var fragment = document.createDocumentFragment();
      var letterIndex = 0;
      var section = target.closest ? target.closest('.section') : null;
      var sectionTargets = section ? section.querySelectorAll('.letter-animate') : targets;
      var textOrder = Array.prototype.indexOf.call(sectionTargets, target);

      target.setAttribute('aria-label', label);
      target.style.setProperty('--text-order', Math.max(textOrder, 0));
      target.textContent = '';

      lines.forEach(function (line, lineIndex) {
        var lineWrap = document.createElement('span');
        lineWrap.className = 'letter-line';

        Array.prototype.forEach.call(line, function (char) {
          var span = document.createElement('span');
          span.className = char === ' ' ? 'letter letter-space' : 'letter';
          span.setAttribute('aria-hidden', 'true');
          span.style.setProperty('--letter-index', letterIndex);
          span.innerHTML = char === ' ' ? '&nbsp;' : char;
          letterIndex += 1;
          lineWrap.appendChild(span);
        });

        fragment.appendChild(lineWrap);

        if (lineIndex < lines.length - 1) {
          fragment.appendChild(document.createElement('br'));
          letterIndex += 4;
        }
      });

      target.appendChild(fragment);
      target.classList.add('is-letterized');
    });

    function revealSection(section) {
      section.classList.add('letters-visible');
    }

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.section').forEach(revealSection);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealSection(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.34 }
    );

    document.querySelectorAll('.section').forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ── Intersection Observer for fade-up elements ── */
  function initFadeObserver() {
    var els = document.querySelectorAll('.hero-card');
    els.forEach(function (el) {
      el.classList.add('fade-up');
    });

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ── Staggered animation delays for details card rows ── */
  function initStaggerDelays() {
    var rows = document.querySelectorAll('.detail-row');
    rows.forEach(function (row, i) {
      row.style.transitionDelay = (i * 0.12) + 's';
    });
    var divs = document.querySelectorAll('.gold-divider');
    divs.forEach(function (d, i) {
      d.style.transitionDelay = (i * 0.08) + 's';
    });
  }

  /* ── Flowers & Leaves Falling Animation ── */
  function initPetals() {
    var container = document.getElementById('petals-container');
    if (!container) return;

    var types = [
      { cls: 'rose',     w: 14, h: 12 },
      { cls: 'rose',     w: 18, h: 15 },
      { cls: 'marigold', w: 13, h: 11 },
      { cls: 'marigold', w: 16, h: 14 },
      { cls: 'jasmine',  w: 8,  h: 8  },
      { cls: 'jasmine',  w: 10, h: 10 },
      { cls: 'leaf',     w: 18, h: 24 },
      { cls: 'leaf',     w: 14, h: 20 }
    ];

    var totalPetals = 36;

    for (var i = 0; i < totalPetals; i++) {
      (function (idx) {
        var type = types[idx % types.length];
        var petal = document.createElement('div');
        petal.className = 'petal ' + type.cls;
        petal.style.width  = type.w + 'px';
        petal.style.height = type.h + 'px';

        var delay    = (Math.random() * 18).toFixed(2);
        var duration = (7 + Math.random() * 10).toFixed(2);
        var leftPct  = (Math.random() * 100).toFixed(2);
        var rotateOffset = Math.floor(Math.random() * 60) - 30;

        petal.style.left              = leftPct + '%';
        petal.style.animationDuration = duration + 's';
        petal.style.animationDelay    = delay + 's';
        /* Use a CSS custom property so keyframes can incorporate the tilt offset */
        petal.style.setProperty('--rotate-offset', rotateOffset + 'deg');

        container.appendChild(petal);
      })(i);
    }
  }

  /* ── Tap-to-play background music with a gentle synthesized fallback ── */
  function initMusicToggle() {
    var button = document.querySelector('.music-toggle');
    var audio = document.getElementById('ceremony-music');
    if (!button) return;

    var audioContext = null;
    var synthTimer = null;
    var synthPlaying = false;
    var usingSynth = false;
    var notes = [261.63, 329.63, 392.00, 493.88, 392.00, 329.63];
    var noteIndex = 0;

    function setPlaying(isPlaying) {
      button.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
      button.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
      var text = button.querySelector('.music-toggle-text');
      if (text) text.textContent = isPlaying ? 'Pause' : 'Music';
    }

    function playTone() {
      if (!audioContext) return;

      var now = audioContext.currentTime;
      var gain = audioContext.createGain();
      var main = audioContext.createOscillator();
      var shimmer = audioContext.createOscillator();
      var frequency = notes[noteIndex % notes.length];
      noteIndex += 1;

      main.type = 'sine';
      shimmer.type = 'triangle';
      main.frequency.setValueAtTime(frequency, now);
      shimmer.frequency.setValueAtTime(frequency * 2, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.045, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      main.connect(gain);
      shimmer.connect(gain);
      gain.connect(audioContext.destination);

      main.start(now);
      shimmer.start(now);
      main.stop(now + 2.45);
      shimmer.stop(now + 2.45);
    }

    function startSynth() {
      var Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return false;

      if (!audioContext) audioContext = new Context();
      if (audioContext.state === 'suspended') audioContext.resume();

      usingSynth = true;
      synthPlaying = true;
      playTone();
      synthTimer = window.setInterval(playTone, 1750);
      setPlaying(true);
      return true;
    }

    function stopSynth() {
      synthPlaying = false;
      if (synthTimer) {
        window.clearInterval(synthTimer);
        synthTimer = null;
      }
      setPlaying(false);
    }

    function playAudioOrFallback() {
      if (!audio) {
        startSynth();
        return;
      }

      audio.volume = 0.45;
      audio.play().then(function () {
        usingSynth = false;
        setPlaying(true);
      }).catch(function () {
        startSynth();
      });
    }

    button.addEventListener('click', function () {
      if (usingSynth && synthPlaying) {
        stopSynth();
        return;
      }

      if (audio && !audio.paused) {
        audio.pause();
        setPlaying(false);
        return;
      }

      playAudioOrFallback();
    });

    if (audio) {
      audio.addEventListener('pause', function () {
        if (!usingSynth) setPlaying(false);
      });
      audio.addEventListener('ended', function () {
        if (!usingSynth) setPlaying(false);
      });
    }
  }

  /* ── Up / down section navigation ── */
  function initSectionNavigation() {
    var sections = Array.prototype.slice.call(document.querySelectorAll('.section'));
    var prevButton = document.querySelector('[data-section-nav="prev"]');
    var nextButton = document.querySelector('[data-section-nav="next"]');
    if (!sections.length || !prevButton || !nextButton) return;

    function getCurrentSectionIndex() {
      var viewportMiddle = window.scrollY + (window.innerHeight / 2);
      var closestIndex = 0;
      var closestDistance = Infinity;

      sections.forEach(function (section, index) {
        var sectionMiddle = section.offsetTop + (section.offsetHeight / 2);
        var distance = Math.abs(viewportMiddle - sectionMiddle);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    }

    function updateButtons() {
      var currentIndex = getCurrentSectionIndex();
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === sections.length - 1;
    }

    function goToSection(direction) {
      var currentIndex = getCurrentSectionIndex();
      var nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
      sections[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    prevButton.addEventListener('click', function () { goToSection(-1); });
    nextButton.addEventListener('click', function () { goToSection(1); });
    window.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    initLetterAnimations();
    initFadeObserver();
    initStaggerDelays();
    initPetals();
    initMusicToggle();
    initSectionNavigation();
  });

})();
