# TASKS.md — очередь задач (ведёт супервайзер)

Статусы: `todo` · `in-progress` · `review` · `done` · `blocked`.
Агент берёт **только задачу, которую назвал супервайзер**, даже если следующая в списке свободна.
`👤` — действие Тимы (live), агент его не выполняет.

| ID | Неделя | Задача | Статус |
|---|---|---|---|
| T00 | 1 | Переписать ROADMAP.md под PLAN | done |
| T01 | 1 | Чистка кода | done |
| T02 | 1 | Статический экспорт + маршруты EN/RU + SEO-база | done |
| 👤 L1 | 1 | Домен + Cloudflare Pages | done |
| T03 | 2 | Версионирование тарифов BTS + /fares + /sources | done |
| T04 | 2 | MRT Blue, ARL, Red→DMK в данных и калькуляторе | review |
| T05 | 3 | Контент-система (markdown, verified, noindex) + партнёрские компоненты | done |
| T06 | 3 | Черновики: 2 аэропорта + /tickets-and-cards (EN) | todo |
| 👤 L1b | 3, после T06 | Email Routing hello@btsguide.com, GSC, Web Analytics, заявки в партнёрки | todo |
| 👤 L2 | 4 | Поездка №1: фото, выходы, пересадки → `notes/trip-1.md` | todo |
| T07 | 5 | Шаблон /get-to + 5 гайдов из заметок поездки | todo |
| T08 | 6 | Шаблон /stations + 15 станций | todo |
| T09 | 7 | 5 гайдов + /where-to-stay-near-bts | todo |
| T10 | 8 | RU-версии топ-8 + черновик /fares/2027-joint-fare | todo |
| 👤 L3 | 9 | Поездка №2 → `notes/trip-2.md` | todo |
| T11 | 10 | Тарифная реформа 01.01.2027: новая версия тарифа + публикация страницы | todo |
| T12 | 11 | Остальные гайды и станции, перелинковка, JSON-LD | todo |
| T13 | 12 | Отчёт по метрикам GSC (данные даёт Тима) → `docs/REVIEW-2027-01.md` | todo |
| T14 | 1 | Открыть индексацию публичных страниц, исправить тайтлы и sitemap (по прямому указанию владельца) | review |
| T15 | 1 | Подключить GA4 через @next/third-parties@15 и NEXT_PUBLIC_GA_ID в EN/RU layouts | review |
| T16 | 1 | Подключить Microsoft Clarity через NEXT_PUBLIC_CLARITY_ID в EN/RU layouts | review |

---

## T00 — ROADMAP.md
Переписать `ROADMAP.md` кратко (≤60 строк) по `docs/PLAN.md`, раздел 1 и 7: scope линий, ~70 страниц, отказ от массовых маршрутов, Cloudflare Pages, дата решения 25.01.2027 и пороги закрытия.
**Приёмка:** нет упоминаний Purple/Yellow/Pink, 300–500 маршрутов, Vercel, тайского языка; пороги закрытия совпадают с PLAN.

## T01 — Чистка кода
Удалить: `DesignToggle`, `AppearanceProvider`, `lib/sound.ts` и вызовы, класс/обёртку `phone-shell` (сделать адаптивный контейнер `max-w-3xl`). `Lang = "en" | "ru"`: тайские строки → русские (перевод черновой, пометь в отчёте). `nameZh` не выводить, из данных не удалять.
**Приёмка:** build зелёный; в `components/` и `lib/` нет `sound`, `Appearance`, `Design`; калькулятор работает как раньше (тесты те же + проходят).

## T02 — Статический экспорт и маршруты
`next.config.ts`: `output: 'export'`, `images.unoptimized`, `trailingSlash: true`. Route groups `(en)` и `(ru)` по AGENTS.md §3. Пустые страницы-заглушки: `/`, `/ru/`, `/about`, `/sources`, `/404`. `app/sitemap.ts`, `app/robots.ts` (sitemap `https://btsguide.com/sitemap.xml`), canonical, `metadataBase = https://btsguide.com`. Переключатель языка — ссылка на парную страницу, не клиентский state. Футер на всех страницах: «Unofficial guide. Not affiliated with BTSC, BEM, SRT or MRTA.» (RU: «Неофициальный гид. Не связан с BTSC, BEM, SRT и MRTA.»), без логотипов операторов.
**Приёмка:** `npm run build` создаёт `out/index.html`, `out/ru/index.html`, `out/sitemap.xml`, `out/robots.txt`; в HTML `/ru/` стоит `lang="ru"`; заглушки имеют `noindex` и отсутствуют в sitemap; `docs/DEPLOY.md` с настройками Cloudflare Pages (build command, output dir, Node version).

## T03 — Тарифы BTS с версиями
Перенести `data/fares.ts` в `data/fares/bts/2025-11-01.ts`, сделать `getFareTable("bts", date)`. Страница `/fares`: таблица ядра и расширений, пометка approximate, дата последней проверки. Страница `/sources`: все источники из всех таблиц автоматически.
**Приёмка:** тест: дата 2026-12-31 → таблица 2025-11-01; существующие тесты тарифа проходят; на `/fares` нет цифр, которых нет в данных.

## T04 — MRT Blue, ARL, Red→DMK
Станции (код, EN, RU, TH, координаты) и тарифы из официальных источников с URL и датой. `BTSLine` → `Line` с полем `operator`. Пересадки: Asok↔Sukhumvit, Sala Daeng↔Si Lom, Mo Chit↔Chatuchak Park, Phaya Thai (BTS↔ARL), Bang Wa, Bang Sue (MRT↔Red), Makkasan↔Phetchaburi. Межоператорская поездка: сумма тарифов, в UI пометка «separate tickets». Время пересадки между операторами — константа с `TODO(verify)`.
**Приёмка:** тесты: Asok→Sukhumvit: 0 stops, 1 transfer; Suvarnabhumi→Siam даёт ARL+BTS и сумму; Don Mueang→Siam находит маршрут. Каждая новая таблица имеет `sources`.

## T05 — Контент-система
Загрузчик `content/` (gray-matter + marked), правило `verified:false ⇒ noindex + не в sitemap`. Компоненты `<AffiliateLink partner key>`, `<AffiliateDisclosure>`, `<SourcesList>`, `<VerifiedBadge date>`. `lib/affiliates.ts` с ключами klook/12go/airalo/agoda/travelpayouts и `AFFILIATE_ID_PENDING`.
**Приёмка:** тест sitemap; одна тестовая страница в `content/en/pages/_example.md` (noindex); раскрытие отображается только при наличии партнёрок.

## T06 — Черновики денежных страниц (EN)
`airport/suvarnabhumi-to-city`, `airport/don-mueang-to-city`, `pages/tickets-and-cards`. Структура: короткий ответ в первых 2 строках → варианты (поезд/такси/трансфер) с ценой и временем → пошагово → FAQ (4–6 вопросов) → партнёрские блоки (трансфер, eSIM). Все неподтверждённые детали — `TODO(verify)`. `verified: false`.
**Приёмка:** у каждой цифры либо источник, либо TODO; список TODO в отчёте; объём 700–1200 слов на страницу, без воды.

## T07–T12
Супервайзер детализирует перед стартом, исходя из заметок поездок и данных GSC. Не начинать без детализации.

T11 — Проверить по официальному источнику: возврат свыше 45 бат через Paotang только для граждан Таиланда? Страница должна разделять тайцев и туристов.
