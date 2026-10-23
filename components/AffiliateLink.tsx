import type { AnchorHTMLAttributes, ReactNode } from "react";
import { affiliateHref, type AffiliatePartner } from "@/lib/affiliates";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "rel" | "target"> & {
  partner: AffiliatePartner;
  href: string;
  children: ReactNode;
};

export default function AffiliateLink({ partner, href, children, ...props }: Props) {
  return <a {...props} href={affiliateHref(partner, href)} rel="sponsored nofollow noopener" target="_blank">{children}</a>;
}
