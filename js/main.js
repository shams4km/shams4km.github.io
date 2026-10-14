/* =========================================================
   НАСТРОЙКИ — всё, что нужно поменять, находится здесь
   ========================================================= */
const CONFIG = {
  telegram: 'user_shams',                                // ник в Telegram без @
  profi: 'https://profi.ru/profile/ShamsutdinovKM2/',    // профиль на Профи.ру
};

// Отзывы для бегущей ленты. tag — плашка с результатом (необязательно)
const REVIEWS = [
  {
    name: 'Джамиля', role: 'родитель ученика', source: 'Профи.ру', date: '29 июня 2026', tag: 'ЕГЭ · 90',
    text: 'Спасибо большое Камилю! Сын написал ЕГЭ по информатике на 90 баллов.',
  },
  {
    name: 'Женя', role: 'ученик', source: 'Профи.ру', date: '17 октября 2025', tag: 'пробники ↑',
    text: 'Очень нравиться формат занятий, Камиль меня не грузит, помогает и на занятиях весело, при этом баллы пробников сильно выросли. Советую его как репетитора.',
  },
  {
    name: 'Екатерина', role: 'родитель ученика', source: 'Профи.ру', date: '8 марта 2026', tag: 'группа',
    text: 'Занимаемся онлайн в группе — ребенку очень нравится. В компании веселее, появляется мотивация, и стеснение отвечать пропадает. Преподаватель умеет держать внимание даже через экран, всё организовано удобно и технически грамотно. Уже видим прогресс: ребенок стабильно решает задачи ЕГЭ и к предмету появился интерес. Однозначно рекомендую репетитора!',
  },
  {
    name: 'Мария', role: 'ученик', tag: 'ЕГЭ · 90+',
    text: 'Камиль лучший репетитор ever/ занимались больше года, все было круто, занятия проходили на одной волне, объяснения супер понятные, РЕКОМЕНДУЮ',
  },
  {
    name: 'Василиса', role: 'родитель ученицы', source: 'Профи.ру', date: '27 января 2026',
    text: 'Отличный репетитор, все доступно объясняет, умеет заинтересовать, теперь информатика — это наш любимый предмет в школе. Всем рекомендую, моя дочь в полном восторге',
  },
  {
    name: 'Герман', source: 'Профи.ру', date: '22 октября 2025',
    text: 'Классная подача материала, интересные и удобные домашки',
  },
];

/* ========================================================= */

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const animated = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduce;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- ссылки и контент ---------- */
  const tgUrl = `https://t.me/${CONFIG.telegram}`;
  $$('[data-link="tg"]').forEach((a) => (a.href = tgUrl));
  $$('[data-link="profi"]').forEach((a) => (a.href = CONFIG.profi));
  $('.js-year').textContent = new Date().getFullYear();

  const reviewCard = (r) => `
    <article class="rcard">
      <div class="rcard__top"><span class="rcard__q" aria-hidden="true">“</span>${r.tag ? `<span class="rcard__tag">${esc(r.tag)}</span>` : ''}</div>
      <p>${esc(r.text)}</p>
      <div class="rcard__who">
        <div class="rcard__ava" aria-hidden="true">${esc(r.name.trim()[0] || '★')}</div>
        <div><b>${esc(r.name)}</b><small>${esc([r.role, r.source, r.date].filter(Boolean).join(' · '))}</small></div>
      </div>
    </article>`;
  let reviewSet = [...REVIEWS];
  while (reviewSet.length && reviewSet.length < 6) reviewSet = reviewSet.concat(REVIEWS);
  $('.js-reviews').innerHTML = reviewSet.map(reviewCard).join('');

  /* ---------- мобильное меню ---------- */
  $('.nav__burger').addEventListener('click', () => document.body.classList.toggle('menu-open'));

  /* ---------- текст-утилиты ---------- */
  function splitChars(el) {
    const label = el.textContent.replace(/\s+/g, ' ').trim();
    const lines = el.innerHTML.split(/<br\s*\/?>/i).map((chunk) => {
      const tmp = document.createElement('div');
      tmp.innerHTML = chunk;
      return tmp.textContent.trim();
    });
    el.innerHTML = lines.map((line) =>
      `<span class="split-line">${line.split(' ').map((w) =>
        `<span class="split-word">${[...w].map((c) => `<span class="split-char">${c}</span>`).join('')}</span>`
      ).join(' ')}</span>`
    ).join('');
    el.setAttribute('aria-label', label);
    $$('.split-line', el).forEach((l) => l.setAttribute('aria-hidden', 'true'));
    return $$('.split-char', el);
  }

  function splitWords(el, accentWords = []) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => {
      const clean = w.replace(/[.,:—«»]/g, '').toLowerCase();
      return `<span class="w${accentWords.includes(clean) ? ' is-accent' : ''}">${w}</span>`;
    }).join(' ');
    return $$('.w', el);
  }

  const SCRAMBLE = '!<>-_\\/[]{}—=+*^?#01';
  function scramble(el) {
    const orig = el.dataset.text || (el.dataset.text = el.textContent);
    let frame = 0;
    const total = orig.length * 2 + 6;
    cancelAnimationFrame(el._raf);
    const tick = () => {
      el.textContent = [...orig].map((ch, i) => {
        if (ch === ' ') return ' ';
        return i * 2 < frame - 4 ? ch : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
      }).join('');
      if (frame++ < total) el._raf = requestAnimationFrame(tick);
      else el.textContent = orig;
    };
    tick();
  }
  if (fine) $$('[data-scramble]').forEach((el) => el.addEventListener('mouseenter', () => scramble(el)));

  /* ---------- печать в hero-терминале ---------- */
  const HERO_LINES = [
    [['>>> ', 'c-com'], ['from ', 'c-key'], ['kamil '], ['import ', 'c-key'], ['ege']],
    [['>>> ', 'c-com'], ['ege.'], ['prepare', 'c-fn'], ['(student='], ['"ты"', 'c-str'], [')']],
    [['загружаю знания ', 'c-com'], ['██████████ ', 'c-num'], ['100%', 'c-num']],
    [['>>> ', 'c-com'], ['ege.'], ['result', 'c-fn']],
    [["'сдал уверенно ✓'", 'c-str']],
  ];
  async function typeHero(instant = false) {
    const box = $('.js-hero-term');
    box.innerHTML = '';
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    for (const line of HERO_LINES) {
      for (const [text, cls] of line) {
        const span = document.createElement('span');
        if (cls) span.className = cls;
        box.appendChild(span);
        if (instant) { span.textContent = text; continue; }
        for (const ch of text) {
          span.textContent += ch;
          await wait(ch === '█' ? 70 : 28 + Math.random() * 40);
        }
      }
      box.appendChild(document.createTextNode('\n'));
      if (!instant) await wait(260);
    }
    const cur = document.createElement('span');
    cur.className = 't-cursor';
    box.appendChild(cur);
  }

  /* ---------- интерактивный терминал ---------- */
  const term = (() => {
    const out = $('.js-term-out');
    const input = $('.js-term-input');
    const history = [];
    let hIndex = 0;

    const line = (html, cls = 'out') => {
      const div = document.createElement('div');
      div.className = cls;
      div.innerHTML = html;
      out.appendChild(div);
      out.scrollTop = out.scrollHeight;
    };
    const textLine = (text, cls = 'out') => line(esc(text), cls);

    const TIPS = [
      '№2 — таблицы истинности: перебирай все наборы через itertools.product([0, 1], repeat=4)',
      '№8 — комбинаторика: itertools.product и permutations переберут слова за тебя',
      '№14 — системы счисления: int("1011", 2) переводит в десятичную, а обратно — через % и //',
      '№16 — рекурсия: добавь sys.setrecursionlimit и @lru_cache, и всё полетит',
      '№25 — делители: перебирай до корня из числа, а не до самого числа',
    ];
    let tipIndex = 0;

    const commands = {
      help: () => line(
        'Команды:\n' +
        '  <span class="c-fn">about</span>   — кто я такой\n' +
        '  <span class="c-fn">price</span>   — сколько стоит\n' +
        '  <span class="c-fn">trial</span>   — записаться на бесплатный урок\n' +
        '  <span class="c-fn">ege</span>     — лайфхак к ЕГЭ\n' +
        '  <span class="c-fn">ls</span>      — что в репозитории\n' +
        '  <span class="c-fn">tg</span>      — открыть Telegram\n' +
        '  <span class="c-fn">clear</span>   — очистить экран\n' +
        'А ещё можно print("...") и считать: 2**10'),
      about: () => line(
        '<span class="c-str">Камиль Шамсутдинов</span>\n' +
        '├─ ИТИС КФУ, fullstack- и iOS-разработчик\n├─ ЕГЭ по информатике — 93 балла\n├─ преподаю 4 года, 100+ учеников\n└─ рейтинг 5,0 на Профи.ру'),
      price: () => line(
        'индивидуально  <span class="c-num">2 500 ₽</span> / 90 мин\n' +
        'в группе       <span class="c-num">1 500 ₽</span> / 90 мин\n' +
        'пробный урок   <span class="ok">0 ₽</span>  ← начни с него'),
      trial: () => {
        line('Отличный выбор! Открываю запись…', 'ok');
        setTimeout(() => scrollToEl($('#trial')), 500);
      },
      ege: () => { textLine(TIPS[tipIndex % TIPS.length]); tipIndex++; },
      ls: () => line('<span class="c-fn">task_02_logic/</span>  <span class="c-fn">task_08_combinatorics/</span>  <span class="c-fn">task_14_numbers/</span>\n<span class="c-fn">task_16_recursion/</span>  <span class="c-fn">task_25_divisors/</span>  task_27_solution.py'),
      tg: () => { line('Открываю Telegram…', 'ok'); window.open(tgUrl, '_blank', 'noopener'); },
      telegram: () => commands.tg(),
      clear: () => { out.innerHTML = ''; },
      exit: () => line('Не уходи 🥲 Первый урок бесплатный — набери <span class="c-fn">trial</span>'),
      'import this': () => textLine('Beautiful is better than ugly.\nSimple is better than complex.\nReadability counts.'),
    };

    function run(raw) {
      const cmd = raw.trim();
      if (!cmd) return;
      textLine(cmd, 'cmd');
      history.push(cmd);
      hIndex = history.length;

      const key = cmd.toLowerCase();
      if (commands[key]) return commands[key]();

      const printMatch = cmd.match(/^print\(\s*(["'])(.*)\1\s*\)$/);
      if (printMatch) return textLine(printMatch[2]);

      if (/^[\d\s+\-*/%().]+$/.test(cmd) && /\d/.test(cmd)) {
        try {
          const result = Function(`"use strict"; return (${cmd});`)();
          if (Number.isFinite(result)) return line(`<span class="c-num">${esc(result)}</span>`);
        } catch (e) { /* ниже покажем SyntaxError */ }
        return textLine('SyntaxError: invalid syntax', 'err');
      }

      if (key.startsWith('sudo')) return textLine('Хорошая попытка 😄 Права root выдаются после пробного урока', 'err');

      textLine(`NameError: name '${cmd.split(/[\s(]/)[0]}' is not defined`, 'err');
      line('Подсказка: введи <span class="c-fn">help</span>');
    }

    $('.js-term-form').addEventListener('submit', (e) => {
      e.preventDefault();
      run(input.value);
      input.value = '';
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' && hIndex > 0) { input.value = history[--hIndex]; e.preventDefault(); }
      if (e.key === 'ArrowDown') { hIndex = Math.min(history.length, hIndex + 1); input.value = history[hIndex] || ''; e.preventDefault(); }
    });
    $$('.terminal__hints button').forEach((b) => b.addEventListener('click', () => { run(b.dataset.cmd); input.focus({ preventScroll: true }); }));
    $('.terminal--big').addEventListener('click', (e) => { if (!e.target.closest('button, a')) input.focus({ preventScroll: true }); });

    let greeted = false;
    return {
      greet() {
        if (greeted) return;
        greeted = true;
        line('<span class="c-com">Python 3.12 · kamil-ege-shell</span>');
        line('Привет! Введи <span class="c-fn">help</span>, чтобы увидеть команды 👇');
      },
    };
  })();

  /* ---------- флип-карточки на тач-устройствах ---------- */
  $$('.flip').forEach((f) => f.addEventListener('click', () => { if (!fine) f.classList.toggle('is-flipped'); }));

  /* ---------- запись: заявка → Telegram ---------- */
  const toastEl = $('.toast');
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove('is-on'), 4200);
  };
  $('.js-booking').addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const comment = (d.get('comment') || '').trim();
    const text = [
      'Привет! Хочу записаться на бесплатный пробный урок 🙌',
      `Имя: ${d.get('name').trim()}`,
      `Пишет: ${d.get('who')}`,
      `Класс: ${d.get('grade')}`,
      `Формат: ${d.get('format')}`,
      comment && `Комментарий: ${comment}`,
    ].filter(Boolean).join('\n');

    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    window.open(`${tgUrl}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    toast('Заявка скопирована. Если чат пустой — просто вставь её 👌');
  });

  /* ---------- плавный скролл к якорям ---------- */
  let lenis = null;
  function scrollToEl(el) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.6 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#' || a.dataset.link) return;
    e.preventDefault();
    document.body.classList.remove('menu-open');
    scrollToEl(id === '#top' ? document.body : $(id));
  }));

  /* ---------- скрины отзывов: просмотр крупно ---------- */
  const lightbox = $('.lightbox');
  const lbImg = $('.lightbox__img');
  function openLightbox(img) {
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
  }
  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
  }
  lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  const proofs = $$('.proof');
  proofs.forEach((card) => card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox($('img', card)); }
  }));
  const useDrag = animated && fine && typeof Draggable !== 'undefined';
  if (!useDrag) proofs.forEach((card) => card.addEventListener('click', () => openLightbox($('img', card))));

  /* ---------- галерея: подпись всегда в видимой части фото ---------- */
  function placeCaptions(figs = $$('.gallery figure')) {
    const vw = innerWidth;
    figs.forEach((fig) => {
      const r = fig.getBoundingClientRect();
      const cutL = Math.max(0, -r.left);
      const cutR = Math.max(0, r.right - vw);
      const cap = $('figcaption', fig);
      cap.style.setProperty('--cl', `${14 + cutL}px`);
      cap.style.setProperty('--cr', `${14 + cutR}px`);
      cap.classList.toggle('is-tiny', r.width - cutL - cutR < 160);
    });
  }

  /* ---------- счётчики ---------- */
  const fmt = (v, dec) => v.toLocaleString('ru-RU', { minimumFractionDigits: dec, maximumFractionDigits: dec });

  /* ---------- без анимаций (reduced motion или CDN не загрузился) ---------- */
  if (!animated) {
    $('.preloader').remove();
    document.body.classList.remove('is-loading');
    $$('.js-counter').forEach((c) => (c.textContent = fmt(Number(c.dataset.to), Number(c.dataset.dec || 0))));
    proofs.forEach((c) => (c.style.transform = `rotate(${c.dataset.rot || 0}deg)`));
    typeHero(true);
    term.greet();
    // без анимаций ленты не едут сами — их просто листают как обычный горизонтальный скролл
    document.documentElement.classList.add('is-static');
    placeCaptions();
    addEventListener('resize', () => placeCaptions());
    $('.gallery').addEventListener('scroll', () => placeCaptions(), { passive: true });
    return;
  }

  /* ---------- бесконечная лента: едет сама, но её можно тащить, свайпать и листать тачпадом ---------- */
  function makeLoop(track, { speed = 40, dir = -1, area = track, onFrame } = {}) {
    const originals = [...track.children];
    originals.forEach((el) => {
      const copy = el.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    });
    let width = 0;
    const measure = () => { width = track.children[originals.length].offsetLeft - track.children[0].offsetLeft; };
    measure();
    addEventListener('resize', measure);

    let x = 0, inertia = 0, auto = 1, hovered = false, dragging = false, press = null, lastX = 0, lastT = 0, vel = 0;
    if (fine) { // на тачскринах «наведение» залипает после тапа, поэтому только для мыши
      area.addEventListener('mouseenter', () => { hovered = true; });
      area.addEventListener('mouseleave', () => { hovered = false; });
    }

    track.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      press = { x: e.clientX, y: e.clientY, id: e.pointerId };
      lastX = e.clientX; lastT = performance.now(); vel = 0; inertia = 0;
    });
    track.addEventListener('pointermove', (e) => {
      if (!press || e.pointerId !== press.id) return;
      const dx = e.clientX - press.x;
      const dy = e.clientY - press.y;
      if (!dragging) {
        if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { press = null; return; } // это вертикальный скролл страницы
        if (Math.abs(dx) < 6) return;
        dragging = true;
        try { track.setPointerCapture(e.pointerId); } catch (err) { /* указатель уже отпущен — тащим без захвата */ }
      }
      const now = performance.now();
      const step = e.clientX - lastX;
      x += step;
      vel = vel * 0.6 + (step / Math.max(1, now - lastT)) * 1000 * 0.4;
      lastX = e.clientX; lastT = now;
    });
    const release = () => {
      if (dragging) inertia = Math.max(-3000, Math.min(3000, vel));
      dragging = false; press = null;
    };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => track.addEventListener(t, release));
    area.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // вертикальное колесо — скролл страницы
      e.preventDefault();
      x -= e.deltaX;
    }, { passive: false });

    return (dt) => {
      const box = area.getBoundingClientRect();
      if (!width || box.bottom < -100 || box.top > innerHeight + 100) return; // за экраном — не тратим кадры
      const pause = hovered || dragging || press;
      auto += ((pause ? 0 : 1) - auto) * Math.min(1, dt * 4);
      if (!dragging) {
        x += (dir * speed * auto + inertia) * dt;
        inertia *= Math.pow(0.03, dt);
      }
      x %= width;
      if (x > 0) x -= width;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      if (onFrame) onFrame();
    };
  }

  /* =========================================================
     АНИМАЦИИ
     ========================================================= */
  gsap.registerPlugin(ScrollTrigger);

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  /* ---------- курсор ---------- */
  if (fine) {
    document.body.classList.add('has-cursor');
    const cursor = $('.cursor');
    const label = $('.cursor__label');
    const dotX = gsap.quickTo('.cursor__dot', 'x', { duration: 0.1 });
    const dotY = gsap.quickTo('.cursor__dot', 'y', { duration: 0.1 });
    const ringX = gsap.quickTo('.cursor__ring', 'x', { duration: 0.45, ease: 'power3' });
    const ringY = gsap.quickTo('.cursor__ring', 'y', { duration: 0.45, ease: 'power3' });
    gsap.set('.cursor__dot, .cursor__ring', { x: -100, y: -100 });
    window.addEventListener('mousemove', (e) => { dotX(e.clientX); dotY(e.clientY); ringX(e.clientX); ringY(e.clientY); });
    document.addEventListener('mouseover', (e) => {
      const labeled = e.target.closest('[data-cursor]');
      const hover = e.target.closest('a, button, summary, label');
      if (labeled && (!hover || hover === labeled || hover.contains(labeled))) {
        label.textContent = labeled.dataset.cursor;
        cursor.classList.add('is-label');
        cursor.classList.remove('is-hover');
      } else {
        cursor.classList.toggle('is-hover', !!hover);
        cursor.classList.remove('is-label');
      }
    });
    document.addEventListener('mouseleave', () => gsap.to('.cursor', { opacity: 0, duration: 0.3 }));
    document.addEventListener('mouseenter', () => gsap.to('.cursor', { opacity: 1, duration: 0.3 }));

    /* магнитные кнопки */
    $$('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.35);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)', overwrite: true });
      });
    });
  }

  /* ---------- шапка прячется при скролле вниз ---------- */
  const nav = $('.nav');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => nav.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 300 && !document.body.classList.contains('menu-open')),
  });

  /* ---------- HERO ---------- */
  gsap.set('.hero__title .line__in', { yPercent: 115 });
  gsap.set('.hero__eyebrow, .hero__lead, .hero__cta', { y: 30, opacity: 0 });
  gsap.set('.hero__photo', { clipPath: 'inset(100% 0% 0% 0%)' });
  gsap.set('.hero__photo img', { scale: 1.4 });
  gsap.set('.chip', { scale: 0, opacity: 0 });
  gsap.set('.terminal--hero', { y: 50, opacity: 0 });
  gsap.set('.hero__name-in', { yPercent: 100, opacity: 0 });

  function heroIntro() {
    const tl = gsap.timeline();
    tl.to('.hero__title .line__in', { yPercent: 0, duration: 1.3, stagger: 0.1, ease: 'expo.out' })
      .to('.hero__eyebrow, .hero__lead, .hero__cta', { y: 0, opacity: 1, stagger: 0.1, duration: 1.1, ease: 'expo.out' }, 0.2)
      .to('.hero__photo', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 0)
      .to('.hero__photo img', { scale: 1, duration: 2, ease: 'expo.out' }, 0.3)
      .to('.hero__name-in', { yPercent: 0, opacity: 1, duration: 1.6, ease: 'expo.out' }, 0.4)
      .to('.chip', { scale: 1, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'back.out(2.2)' }, 0.9)
      .to('.terminal--hero', { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', onComplete: () => typeHero() }, 1)
      .add(startParallax);
  }

  function startParallax() {
    if (!fine) return;
    const items = $$('.hero [data-depth]').map((el) => ({
      d: parseFloat(el.dataset.depth),
      x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }),
    }));
    $('.hero').addEventListener('mousemove', (e) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      items.forEach((it) => { it.x(nx * it.d * 70); it.y(ny * it.d * 70); });
    });
  }

  gsap.to('.hero__name-in', { xPercent: -28, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__photo img', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__grid', { yPercent: 12, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* ---------- бегущие строки (ускоряются от скролла) ---------- */
  const marqueeTweens = $$('.marquee__row').map((row, i) => {
    const track = $('.marquee__track', row);
    row.appendChild(track.cloneNode(true));
    const tracks = $$('.marquee__track', row);
    const tween = i === 0
      ? gsap.to(tracks, { xPercent: -100, repeat: -1, duration: 28, ease: 'none' })
      : gsap.fromTo(tracks, { xPercent: -100 }, { xPercent: 0, repeat: -1, duration: 40, ease: 'none' });
    tween.totalTime(tween.duration() * 100);
    return tween;
  });
  ScrollTrigger.create({
    onUpdate(self) {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6);
      marqueeTweens.forEach((t) => {
        gsap.timeline({ overwrite: true })
          .to(t, { timeScale: self.direction * boost, duration: 0.2 })
          .to(t, { timeScale: self.direction, duration: 1.2, ease: 'power2.out' });
      });
    },
  });
  gsap.from('.marquee__row--a', { rotate: -8, scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.marquee__row--b', { rotate: 7, scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---------- манифест: слова проявляются ---------- */
  const words = splitWords($('.js-words'), ['аналогии', 'живой', 'код', 'решать']);
  gsap.set(words, { opacity: 0.14 });
  gsap.to(words, {
    opacity: 1, stagger: 0.1, ease: 'none',
    scrollTrigger: { trigger: '.manifesto', start: 'top 70%', end: 'bottom 55%', scrub: true },
  });

  /* ---------- заголовки по буквам ---------- */
  $$('.js-split').forEach((el) => {
    const chars = splitChars(el);
    gsap.from(chars, {
      yPercent: 115, rotate: 6, duration: 1.1, stagger: 0.022, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  /* ---------- обо мне ---------- */
  gsap.fromTo('.about__photo-in', { clipPath: 'inset(100% 0% 0% 0%)' }, {
    clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut',
    scrollTrigger: { trigger: '.about', start: 'top 75%' },
  });
  gsap.fromTo('.about__photo-in img', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.about__badge', { scale: 0, rotate: -180, duration: 1.4, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.about', start: 'top 55%' } });

  /* ---------- счётчики ---------- */
  $$('.js-counter').forEach((el) => {
    const to = Number(el.dataset.to);
    const dec = Number(el.dataset.dec || 0);
    const obj = { v: 0 };
    el.textContent = fmt(0, dec);
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(obj, { v: to, duration: to > 100 ? 1.6 : 2, ease: 'power3.out', onUpdate: () => (el.textContent = fmt(dec ? obj.v : Math.round(obj.v), dec)) }),
    });
  });

  /* ---------- методика: горизонтальный скролл ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const track = $('.features__track');
    const dist = () => track.scrollWidth - innerWidth;
    const hTween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.features', pin: true, start: 'top top', end: () => '+=' + dist(), scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
    });
    $$('.fcard:not(.fcard--intro)', track).forEach((card) => {
      gsap.from(card, {
        rotate: 6, y: 80, scale: 0.9, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: hTween, start: 'left 100%', end: 'left 55%', scrub: true },
      });
    });
    gsap.from('.bars i', {
      scaleY: 0, stagger: 0.08, duration: 0.8, ease: 'back.out(2)',
      scrollTrigger: { trigger: '.art-bot', containerAnimation: hTween, start: 'left 80%' },
    });
  });
  mm.add('(max-width: 900px)', () => {
    $$('.fcard').forEach((card) => gsap.from(card, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 88%' } }));
    gsap.from('.bars i', { scaleY: 0, stagger: 0.08, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: '.art-bot', start: 'top 85%' } });
  });

  /* ---------- терминал: приветствие при появлении ---------- */
  ScrollTrigger.create({ trigger: '.terminal--big', start: 'top 80%', once: true, onEnter: () => term.greet() });

  /* ---------- галерея и отзывы: бесконечные ленты, которые можно листать руками ---------- */
  const loops = $$('.gallery__row').map((row, i) => {
    const tick = makeLoop(row, { speed: 32, dir: i ? 1 : -1, onFrame: () => placeCaptions(figs) });
    const figs = $$('figure', row);
    return tick;
  });
  loops.push(makeLoop($('.js-reviews'), { speed: 38, area: $('.reviews__marquee') }));
  gsap.ticker.add((time, deltaMs) => {
    const dt = Math.min(deltaMs, 100) / 1000;
    loops.forEach((tick) => tick(dt));
  });

  /* ---------- 3D-наклон карточек цен ---------- */
  if (fine) {
    $$('[data-tilt]').forEach((card) => {
      const glare = $('.pcard__glare', card);
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        gsap.to(card, { rotateY: (px - 0.5) * 14, rotateX: (0.5 - py) * 14, duration: 0.5, ease: 'power3' });
        glare.style.setProperty('--gx', `${px * 100}%`);
        glare.style.setProperty('--gy', `${py * 100}%`);
      });
      card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1, 0.4)' }));
    });
  }

  /* ---------- скрины отзывов: разбросаны, можно таскать ---------- */
  proofs.forEach((card) => gsap.set(card, { rotation: Number(card.dataset.rot || 0) }));
  gsap.set(proofs, { y: 90, opacity: 0 });
  ScrollTrigger.batch(proofs, {
    start: 'top 92%', once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1.2, stagger: 0.12, ease: 'expo.out' }),
  });
  if (useDrag) {
    gsap.registerPlugin(Draggable);
    proofs.forEach((card) => {
      const rot = Number(card.dataset.rot || 0);
      const [drag] = Draggable.create(card, {
        type: 'x,y', bounds: '.reviews', zIndexBoost: true, cursor: 'none', activeCursor: 'none',
        onPress() { gsap.to(card, { scale: 1.04, rotation: 0, duration: 0.3, ease: 'power3.out' }); },
        onRelease() { gsap.to(card, { scale: 1, rotation: rot / 2, duration: 0.7, ease: 'back.out(2)' }); },
        onClick() { openLightbox($('img', card)); },
      });
      card.addEventListener('mouseenter', () => { if (!drag.isPressed) gsap.to(card, { rotation: 0, scale: 1.02, duration: 0.5, ease: 'power3.out' }); });
      card.addEventListener('mouseleave', () => { if (!drag.isPressed) gsap.to(card, { rotation: rot, scale: 1, duration: 0.7, ease: 'power3.out' }); });
    });
  }

  /* ---------- бронирование: фото ---------- */
  gsap.from('.booking__photo', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.booking', start: 'top 75%' } });

  /* ---------- FAQ: плавное раскрытие ---------- */
  $$('.faq details').forEach((d) => {
    d.addEventListener('toggle', () => {
      if (d.open) gsap.from($('div', d), { height: 0, opacity: 0, duration: 0.6, ease: 'expo.out' });
    });
  });

  /* ---------- футер: прожектор за курсором ---------- */
  const big = $('.footer__big');
  big.addEventListener('mousemove', (e) => {
    const r = big.getBoundingClientRect();
    big.style.setProperty('--mx', `${e.clientX - r.left}px`);
    big.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
  big.addEventListener('mouseleave', () => big.style.setProperty('--mx', '-50%'));
  gsap.from('.footer__big', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 85%' } });

  /* ---------- общие появления ---------- */
  gsap.set('[data-reveal]', { y: 50, opacity: 0 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%', once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, stagger: 0.09, ease: 'expo.out', overwrite: true }),
  });

  /* ---------- прелоадер ---------- */
  const countEl = $('.js-count');
  const counter = { v: 0 };
  gsap.timeline()
    .to('.preloader__code p', { opacity: 1, y: 0, stagger: 0.28, duration: 0.5, ease: 'power2.out' })
    .to(counter, { v: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => (countEl.textContent = Math.round(counter.v)) }, 0)
    .to('.preloader__bar i', { scaleX: 1, duration: 1.8, ease: 'power2.inOut' }, 0)
    .to('.preloader', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=0.15')
    .add(() => {
      document.body.classList.remove('is-loading');
      if (lenis) lenis.start();
      heroIntro();
    }, '-=0.65')
    .add(() => $('.preloader').remove());

  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
