(function () {
  "use strict";
  const P = window.PIXEL || {};
  const site = P.site || {};
  const eps = Array.isArray(P.episodes) ? P.episodes : [];
  const ppEps = Array.isArray(P.podcastEpisodes) ? P.podcastEpisodes : [];

  const $ = (s, root) => (root || document).querySelector(s);
  const $$ = (s, root) => Array.from((root || document).querySelectorAll(s));

  const esc = (v) =>
    String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const pad = (n) => String(n == null ? "" : n).padStart(2, "0");

  const IS_EPISODE = !!window.EPISODE_SLUG;
  const assetPath = (p) =>
    IS_EPISODE && p && !/^(https?:|\/|\.\.\/)/.test(p) ? "../" + p : p;
  const vkId = (url) => {
    const m = String(url || "").match(/video-?\d+_(\d+)/);
    return m ? m[1] : "";
  };

  /* Год в подвале */
  $$("[data-year]").forEach((n) => (n.textContent = new Date().getFullYear()));

  /* Счётчик выпусков */
  const statEp = $("[data-stat='episodes']");
  if (statEp) statEp.textContent = eps.length ? String(eps.length) : "0";

  /* Бургер-меню */
  const burger = $("[data-burger]");
  const nav = $("[data-nav]");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const linkBtn = (href, label) =>
    href
      ? `<a class="btn btn--ghost" href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`
      : "";

  /* Карточка выпуска */
  function card(ep) {
    const poster = ep.poster
      ? `<img class="card__poster-img" src="${esc(ep.poster)}" alt="" loading="lazy">`
      : `<div class="card__poster card__poster--fallback" aria-hidden="true">` +
          `<span class="card__num">${pad(ep.num)}</span>` +
          `<span class="card__signal">СИГНАЛ</span>` +
        `</div>`;
    const meta = [ep.date, ep.duration].filter(Boolean).join(" · ");
    return (
      `<a class="card" href="episodes/${esc(ep.slug)}.html">` +
        `<div class="card__media">${poster}` +
          `<span class="card__badge">ВЫП. ${pad(ep.num)}</span>` +
        `</div>` +
        `<div class="card__body">` +
          (meta ? `<div class="card__meta mono">${esc(meta)}</div>` : "") +
          `<h3 class="card__title">${esc(ep.title)}</h3>` +
          (ep.guest
            ? `<div class="card__guest">${esc(ep.guest)}${ep.role ? " — " + esc(ep.role) : ""}</div>`
            : "") +
        `</div>` +
      `</a>`
    );
  }

  /* Свежий выпуск в hero + бегущая строка */
  function renderHeroEpisode(ep) {
    const poster = ep.poster
      ? `<img class="hero-latest__img" src="${esc(ep.poster)}" alt="">`
      : `<div class="hero-latest__img hero-latest__img--fallback" aria-hidden="true">${pad(ep.num)}</div>`;
    return (
      `<a class="hero-latest__card" href="episodes/${esc(ep.slug)}.html">` +
        `<div class="hero-latest__media">${poster}<span class="hero-latest__badge">Свежий выпуск</span></div>` +
        `<div class="hero-latest__body">` +
          `<div class="hero-latest__meta mono">ВЫП. ${pad(ep.num)} · ${esc(ep.duration)}</div>` +
          `<h3 class="hero-latest__title">${esc(ep.title)}</h3>` +
          (ep.guest ? `<div class="hero-latest__guest">${esc(ep.guest)}${ep.role ? " — " + esc(ep.role) : ""}</div>` : "") +
          `<span class="hero-latest__cta">Смотреть выпуск →</span>` +
        `</div>` +
      `</a>`
    );
  }

  function renderTickerItem(ep) {
    const thumb = ep.poster
      ? `<img class="ticker__img" src="${esc(ep.poster)}" alt="" loading="lazy">`
      : `<span class="ticker__img ticker__img--fallback">${pad(ep.num)}</span>`;
    return (
      `<a class="ticker__item" href="episodes/${esc(ep.slug)}.html">` +
        `<span class="ticker__thumb">${thumb}</span>` +
        `<span class="ticker__num">ВЫП. ${pad(ep.num)}</span>` +
        `<span class="ticker__title">${esc(ep.title)}</span>` +
        (ep.guest ? `<span class="ticker__guest">— ${esc(ep.guest)}</span>` : "") +
      `</a>`
    );
  }

  function renderPodcastCard(ep) {
    return (
      `<a class="podcast-card" href="${esc(ep.watchUrl)}" target="_blank" rel="noopener">` +
        `<span class="podcast-card__media">` +
          `<img src="${esc(ep.thumb)}" alt="" loading="lazy">` +
          (ep.duration ? `<span class="podcast-card__dur">${esc(ep.duration)}</span>` : "") +
        `</span>` +
        `<h3 class="podcast-card__title">${esc(ep.title)}</h3>` +
      `</a>`
    );
  }

  /* Сетка на главной */
  const grid = $("[data-episodes]");
  if (grid) {
    if (!eps.length) {
      grid.innerHTML =
        `<div class="episodes-empty">` +
          `<p class="episodes-empty__title">Выпуски уже в эфире — список появится здесь</p>` +
          `<p class="episodes-empty__hint">А пока весь плейлист доступен на YouTube и во VK Видео.</p>` +
          `<div class="episodes-empty__actions">` +
            linkBtn(site.youtubePlaylist, "Смотреть на YouTube") +
            linkBtn(site.vkPlaylist, "Смотреть во VK Видео") +
          `</div>` +
        `</div>`;
    } else {
      grid.innerHTML = eps.slice().reverse().map(card).join("");
    }
  }

  const heroEp = $("[data-hero-episode]");
  if (heroEp && eps.length) {
    heroEp.innerHTML = renderHeroEpisode(eps[eps.length - 1]);
  }

  const heroTicker = $("[data-hero-ticker]");
  if (heroTicker && eps.length) {
    const items = eps.slice().reverse().map(renderTickerItem).join("");
    heroTicker.innerHTML = `<div class="hero-ticker__track">${items}${items}</div>`;
  }

  const podcastGrid = $("[data-podcast-episodes]");
  if (podcastGrid && ppEps.length) {
    podcastGrid.innerHTML = ppEps.map(renderPodcastCard).join("");
  }

  /* Страница выпуска */
  const SLUG = window.EPISODE_SLUG;
  if (SLUG) {
    const ep = eps.find((e) => e.slug === SLUG);
    if (ep) renderEpisode(ep);
  }

  function renderEpisode(ep) {
    const setText = (sel, v) => {
      const n = $(sel);
      if (n) n.textContent = v == null ? "" : v;
    };
    const setHref = (sel, v) => {
      const n = $(sel);
      if (n) {
        if (v) { n.href = v; n.style.display = ""; }
        else { n.style.display = "none"; }
      }
    };

    document.title = (ep.title || "Выпуск") + " — " + site.name;

    setText("[data-ep-num]", "Выпуск " + pad(ep.num));
    setText("[data-ep-title]", ep.title);
    setText("[data-ep-guest]", ep.guest);
    setText("[data-ep-role]", ep.role);
    setText("[data-ep-date]", ep.date);
    setText("[data-ep-duration]", ep.duration);
    setText("[data-ep-forwhom]", ep.forWhom);

    const desc = $("[data-ep-desc]");
    if (desc) {
      const paras = String(ep.description || "").split(/\n+/).filter(Boolean);
      desc.innerHTML = paras.length
        ? paras.map((p) => `<p>${esc(p)}</p>`).join("")
        : "<p>Описание этого выпуска появится здесь.</p>";
    }

    const inside = $("[data-ep-inside]");
    const insideBlock = inside ? inside.closest(".episode__block") : null;
    if (inside && Array.isArray(ep.inside) && ep.inside.length) {
      inside.innerHTML = ep.inside.map((it) => `<li>${esc(it)}</li>`).join("");
      if (insideBlock) insideBlock.style.display = "";
    } else if (insideBlock) {
      insideBlock.style.display = "none";
    }

    const media = $("[data-ep-poster]");
    if (media) {
      let src = "";
      if (ep.vkEmbed) {
        src = /^https?:/i.test(ep.vkEmbed)
          ? ep.vkEmbed
          : `https://vkvideo.ru/video_ext.php?oid=-28867919&id=${vkId(ep.vk)}&hash=${ep.vkEmbed}&hd=2`;
      } else if (ep.youtube) {
        const ytId = (ep.youtube || "").split("v=")[1];
        if (ytId) src = `https://www.youtube.com/embed/${ytId}`;
      }
      if (src) {
        media.classList.add("episode__media--player");
        media.innerHTML = `<iframe src="${esc(src)}" title="${esc(ep.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen loading="lazy"></iframe>`;
      } else if (ep.poster) {
        media.innerHTML = `<img src="${esc(assetPath(ep.poster))}" alt="${esc(ep.title)}">`;
      } else {
        media.classList.add("episode__media--fallback");
        media.innerHTML =
          `<span class="episode__media-num">${pad(ep.num)}</span>` +
          `<span class="episode__media-signal">СИГНАЛ</span>`;
      }
    }

    setHref("[data-ep-youtube]", ep.youtube);
    setHref("[data-ep-vk]", ep.vk);

    const i = eps.indexOf(ep);
    setNav("[data-ep-prev]", eps[i - 1]);
    setNav("[data-ep-next]", eps[i + 1]);
  }

  function setNav(sel, e) {
    const n = $(sel);
    if (!n) return;
    if (e) {
      n.href = e.slug + ".html";
      const t = n.querySelector("[data-nav-title]");
      if (t) t.textContent = e.title;
      n.style.display = "";
    } else {
      n.style.display = "none";
    }
  }
})();
