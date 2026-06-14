// Strapi v5 : réponses au format "plat" (plus de `data` / `attributes`).
// Les relations et médias sont directement l'objet (ou null), avec un
// `documentId`. Cf migration v4 → v5 (2026-06-13).
export type TEvent = {
    id: number;
    documentId: string;
    startAt: string;
    endAt: string;
    titlePrefix: string;
    titleSuffix: string;
    banner?: { url: string } | null;
    eventType?: {
        defaultBanner?: { url: string } | null;
        defaultTitlePrefix: string;
        defaultTitleSuffix: string;
    } | null;
}
