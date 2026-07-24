// Strapi v5 : réponses au format "plat" (plus de `data` / `attributes`).
// Les relations et médias sont directement l'objet (ou null), avec un
// `documentId`. Cf migration v4 → v5 (2026-06-13).
export type TEvent = {
    id: number;
    banner?: { url: string; } | null;
    documentId: string;
    endAt: string;
    eventType?: {
        defaultBanner?: { url: string; } | null;
        defaultTitlePrefix: string;
        defaultTitleSuffix: string;
    } | null;
    startAt: string;
    titlePrefix: string;
    titleSuffix: string;
};
