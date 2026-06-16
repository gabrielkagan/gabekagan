/* ============================================
   Gabe Kagan — Site Interactions
   Vanilla JS, zero dependencies
   ============================================ */

(function () {
  'use strict';

  // --- Navbar scroll effect ---
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile nav toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Scroll reveal (Intersection Observer) ---
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Smooth scroll for anchor links (fallback for older browsers) ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Copyright year ---
  const yearEl = document.querySelector('.current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Hero typewriter (the live prompt line) ---
  const typed = document.getElementById('hero-typed');
  if (typed) {
    const phrases = [
      './ship-it',
      'sudo make-it-rain',
      "echo \"let's build something\"",
      'open --to work'
    ];
    if (reduceMotion) {
      typed.textContent = phrases[0];
    } else {
      let p = 0, i = 0, deleting = false;
      const tick = function () {
        const word = phrases[p];
        typed.textContent = deleting ? word.slice(0, i--) : word.slice(0, i++);
        let delay = deleting ? 45 : 90;
        if (!deleting && i > word.length) {
          deleting = true;
          delay = 1600; // hold the finished line
        } else if (deleting && i < 0) {
          deleting = false;
          i = 0;
          p = (p + 1) % phrases.length;
          delay = 400;
        }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 700);
    }
  }

  // --- Keyboard easter eggs ---
  const termBody = document.getElementById('hero-terminal-body');
  const activeLine = termBody ? termBody.querySelector('.term-line:last-of-type') : null;

  const COMMANDS = {
    help: 'commands: sudo · hire · coffee · whoami · clear  (konami works too ↑↑↓↓←→←→ba)',
    sudo: 'permission denied. nice try though 😏',
    hire: 'excellent instinct. → scroll to ./work-with-me, or just email me@gabekagan.io',
    coffee: '☕ brewing… fun fact: this entire site is coffee-powered.',
    whoami: 'you: a person with great taste. me: still Gabe.',
    ls: 'kalshi-bot/  visionclaw/  personal-kb/  vitals/  local-llm-stack/'
  };

  function printEgg(cmd, out) {
    if (!termBody || !activeLine) return;
    const line = document.createElement('p');
    line.className = 'term-egg';
    line.innerHTML = '<span class="term-prompt">gabe@kagan:~$</span> ' +
      cmd.replace(/[<&]/g, function (c) { return c === '<' ? '&lt;' : '&amp;'; });
    const resp = document.createElement('p');
    resp.className = 'term-egg-out';
    resp.textContent = out;
    termBody.insertBefore(line, activeLine);
    termBody.insertBefore(resp, activeLine);
    activeLine.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }

  function clearEggs() {
    if (!termBody) return;
    termBody.querySelectorAll('.term-egg, .term-egg-out').forEach(function (n) { n.remove(); });
  }

  let buffer = '';
  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kIndex = 0;

  document.addEventListener('keydown', function (e) {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    // Konami → toggle CRT boost
    if (e.key === konami[kIndex] || e.key === konami[kIndex].toLowerCase()) {
      kIndex++;
      if (kIndex === konami.length) {
        document.body.classList.toggle('crt-boost');
        printEgg('konami', document.body.classList.contains('crt-boost') ? 'CRT overdrive: ON 📺' : 'CRT overdrive: off');
        kIndex = 0;
      }
    } else {
      kIndex = 0;
    }

    if (e.key && e.key.length === 1 && /[a-z]/i.test(e.key)) {
      buffer = (buffer + e.key.toLowerCase()).slice(-12);
      Object.keys(COMMANDS).forEach(function (cmd) {
        if (buffer.endsWith(cmd)) {
          buffer = '';
          if (cmd === 'clear') { clearEggs(); return; }
          printEgg(cmd, COMMANDS[cmd]);
        }
      });
      if (buffer.endsWith('clear')) { buffer = ''; clearEggs(); }
    }
  });
})();
