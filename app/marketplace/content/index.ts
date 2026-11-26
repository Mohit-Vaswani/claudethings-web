import type { ComponentType } from "react";
import HarveyBody from "./harvey";
import BragBody from "./brag";
import GeoSeoBody from "./geo-seo-claude";
import HypitBody from "./hypit";
import ReaBody from "./rea";
import ApiAnythingBody from "./api-anything";
import HallmarkBody from "./hallmark";
import AnatomyBody from "./anatomy";
import EccBody from "./ecc";
import ImpeccableBody from "./impeccable";
import PonytailBody from "./ponytail";
import MattPocockSkillsBody from "./matt-pocock-skills";
import CloudflareSecurityAuditBody from "./cloudflare-security-audit";

/** Long-form body for each marketplace slug in ../marketplaceData.ts. */
export const BODIES: Record<string, ComponentType> = {
  "harvey-ai-sales-agent": HarveyBody,
  "brag-launch-video-skill": BragBody,
  "geo-seo-claude": GeoSeoBody,
  "hypit-ai-video-cloning": HypitBody,
  "rea-reverse-engineering-mcp": ReaBody,
  "api-anything-website-to-api": ApiAnythingBody,
  "hallmark-anti-ai-slop-design-skill": HallmarkBody,
  "anatomy-isometric-illustration-skill": AnatomyBody,
  "ecc-claude-code-agent-harness": EccBody,
  "impeccable-design-skill": ImpeccableBody,
  "ponytail-lazy-senior-dev-skill": PonytailBody,
  "matt-pocock-skills": MattPocockSkillsBody,
  "cloudflare-security-audit-skill": CloudflareSecurityAuditBody,
};
