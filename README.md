# Пиксель Инсайд

Экспертный подкаст о том, как устроено digital-агентство изнутри, на примере
«Пиксель Плюс». Гости выпусков — сотрудники компании. Сайт сделан на чистом
HTML/CSS/JS: без CMS, без сборщиков, без базы данных.

## Структура

```
index.html                     — главная (анонс, «что такое», сетка выпусков, стать гостем)
episodes/                      — детальные страницы выпусков
  _template.html               — шаблон для нового выпуска
  <slug>.html                  — страница конкретного выпуска
assets/
  css/style.css                — все стили («эфир», тёмный минимализм)
  js/data.js                   — ЕДИНЫЙ источник данных: сайт + массив выпусков
  js/main.js                   — рендер сетки, счётчика, страницы выпуска, меню
  img/logo-inside.svg          — логотип «Пиксель Инсайд»
  img/episodes/<slug>.jpg      — обложки выпусков
favicon.svg
```

## Как запустить

Ничего собирать не нужно. Просто открой `index.html` в браузере (работает с
диска) либо выложи папку на любой статический хостинг (nginx, GitHub Pages,
Netlify, Vercel, хостинг «Пиксель Плюс» и т.п.).

## Как добавить выпуск

1. В [`assets/js/data.js`](assets/js/data.js) добавь объект в массив `episodes`:

```js
{
  slug: "novyj-vypusk",          // латиница, дефисы; имя файла episodes/novyj-vypusk.html
  num: 11,
  title: "Название выпуска",
  guest: "Имя Фамилия",
  role: "должность в «Пиксель Плюс»",
  date: "10 октября 2026",
  duration: "31:05",
  youtube: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  vk: "https://vkvideo.ru/playlist/-28867919_51581450",   // или ссылка на конкретный ролик
  poster: "assets/img/episodes/novyj-vypusk.jpg",
  description: "Абзац один.\n\nАбзац два.",
  inside: ["пункт 1", "пункт 2"],
  forWhom: "Кому будет полезен выпуск."
}
```

2. Скопируй [`episodes/_template.html`](episodes/_template.html) в
   `episodes/novyj-vypusk.html` и поменяй в нём строку
   `window.EPISODE_SLUG = "primer-vypuska";` на свой slug.

3. При необходимости положи обложку в `assets/img/episodes/`.

Главная, счётчик выпусков и навигация «предыдущий/следующий» обновятся сами.

## Плейлисты

- YouTube: https://www.youtube.com/playlist?list=PLYbpMI2RbIFT_Ypv_3CT2xZS9EOxIs6-5
- VK Видео: https://vkvideo.ru/playlist/-28867919_51581450

## Что поправить перед публикацией

- Домен в JSON-LD (`index.html`) сейчас указан как `https://pixelinside.ru/` —
  поменяй, если итоговый домен другой.
- Ссылки на конкретные ролики во VK уже прописаны в `assets/js/data.js`
  (поле `vk` у каждого выпуска).
