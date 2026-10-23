import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import type { MetroStation } from "@/data/transit";

export const siteCopy = {
  en: {
    title: "Bangkok Metro Guide", intro: "Stations, routes and practical travel guides in English and Russian.",
    calculator: "BTS calculator", stations: "Stations", routes: "Routes", guides: "Travel guides",
    lines: "Rail networks", scaffold: "Station and fare data in preparation", available: "BTS data available; fares are estimates",
    station: "Station", operator: "Operator / service", neighbours: "Adjacent stations", nearby: "Places to explore",
    coordinates: "Coordinates", unverifiedCoordinates: "Legacy coordinates are unverified and are not published as navigation points.",
    missingCoordinates: "Coordinates are not available yet.", route: "Route", itinerary: "Station-by-station route",
    estimated: "Estimated fare", unavailable: "Fare not available", sources: "Fare sources and dates", recorded: "Recorded",
    effective: "Effective from", verified: "Verified", unconfirmed: "Not confirmed", historical: "Historical reference",
    approximate: "Model estimate", separateTickets: "Separate tickets are added together; no shared cap is assumed.",
    fareCaution: "These are historical references and calculator estimates, not a live operator quote. Check the operator before travelling.",
    draft: "Data preview: details need editorial verification before search indexing.",
    guideDraft: "Draft guide: station association is from the imported places dataset; verify the final walking route locally.",
    home: "Home", toolScope: "The calculator currently covers BTS Sukhumvit, Silom and Gold only.",
    independent: "Independent Bangkok transport guide. No affiliate offers are active yet.",
  },
  ru: {
    title: "Метро Бангкока", intro: "Станции, маршруты и полезные советы для поездок на английском и русском.",
    calculator: "Калькулятор BTS", stations: "Станции", routes: "Маршруты", guides: "Как доехать",
    lines: "Линии и сети", scaffold: "Данные станций и тарифов готовятся", available: "Данные BTS доступны; цены приблизительные",
    station: "Станция", operator: "Оператор / сеть", neighbours: "Соседние станции", nearby: "Что посмотреть",
    coordinates: "Координаты", unverifiedCoordinates: "Старые координаты не проверены и не публикуются как точки для навигации.",
    missingCoordinates: "Координаты пока не добавлены.", route: "Маршрут", itinerary: "Маршрут по станциям",
    estimated: "Приблизительная стоимость", unavailable: "Тариф пока неизвестен", sources: "Источники и даты тарифов", recorded: "Добавлено",
    effective: "Действует с", verified: "Проверено", unconfirmed: "Не подтверждено", historical: "Архивные данные",
    approximate: "Расчётная оценка", separateTickets: "Отдельные билеты суммируются; общий лимит стоимости не предполагается.",
    fareCaution: "Здесь используются архивные данные и расчётные оценки, а не актуальная котировка оператора. Перед поездкой уточните тариф.",
    draft: "Предварительные данные: перед индексацией нужна редакционная проверка.",
    guideDraft: "Черновик: станция указана по импортированным данным. Последний участок пути уточняйте на месте.",
    home: "Главная", toolScope: "Калькулятор пока охватывает только линии BTS Сукхумвит, Силом и Gold.",
    independent: "Независимый гид по транспорту Бангкока. Партнёрские предложения пока не подключены.",
  },
} as const;

export const sitePath = (lang: Lang, path = "/") => `${lang === "ru" ? "/ru" : ""}${path === "/" && lang === "ru" ? "" : path}`;
export const stationName = (station: Pick<MetroStation, "nameEn" | "nameRu">, lang: Lang) => lang === "ru" ? station.nameRu : station.nameEn;

export function pageMetadata(lang: Lang, path: string, title: string, description: string, draft = false): Metadata {
  const origin = process.env.SITE_URL;
  return {
    title: `${title} | ${siteCopy[lang].title}`, description,
    robots: { index: !draft, follow: true },
    ...(origin ? { alternates: {
      canonical: new URL(sitePath(lang, path), origin).href,
      languages: { en: new URL(sitePath("en", path), origin).href, ru: new URL(sitePath("ru", path), origin).href },
    } } : {}),
  };
}
