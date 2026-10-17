import type { ComponentType } from "react";
import HarveyBody from "./harvey";
import BragBody from "./brag";
import GeoSeoBody from "./geo-seo-claude";

/** Long-form body for each marketplace slug in ../marketplaceData.ts. */
export const BODIES: Record<string, ComponentType> = {
  "harvey-ai-sales-agent": HarveyBody,
  "brag-launch-video-skill": BragBody,
  "geo-seo-claude": GeoSeoBody,
};
