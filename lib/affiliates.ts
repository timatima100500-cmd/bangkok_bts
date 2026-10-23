export const AFFILIATE_ID_PENDING = "AFFILIATE_ID_PENDING";

export const affiliates = {
  klook: { id: AFFILIATE_ID_PENDING },
  "12go": { id: AFFILIATE_ID_PENDING },
  airalo: { id: AFFILIATE_ID_PENDING },
  agoda: { id: AFFILIATE_ID_PENDING },
  travelpayouts: { id: AFFILIATE_ID_PENDING },
} as const;

export type AffiliatePartner = keyof typeof affiliates;

export function affiliateHref(partner: AffiliatePartner, href: string): string {
  const url = new URL(href);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error(`Invalid affiliate URL: ${href}`);
  if (affiliates[partner].id === AFFILIATE_ID_PENDING) return href;
  // TODO(verify): implement each partner's approved tracking format after IDs arrive.
  return href;
}
