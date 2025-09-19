import { UAParser } from "ua-parser-js";
import { format } from "date-fns";
import { logger } from "@/config/logger";

interface SessionWithUserAgent {
  current?: boolean;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
  expiresAt: Date;
}

export interface IpInfo {
  ip: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country_code: string;
  country_code_iso3: string;
  country_name: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
  hostname: string;
}

interface TransformedSession {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  status: "expired" | "active";
  current?: boolean;
}

export const transformSessions = async (sessions: SessionWithUserAgent[]) => {
  const transformed: TransformedSession[] = [];

  for (const session of sessions) {
    const parser = UAParser(session.userAgent!);
    const browser = parser.browser.name || "Unknown";
    const deviceType = parser.device.type || "Desktop";
    const device = `${deviceType} - ${browser}`;
    const location = await getLocationFromIP(session.ipAddress!);
    const lastActive = format(
      new Date(session.updatedAt),
      "d/M/yyyy, h:mm:ss a"
    );
    const status = getSessionStatus(session.expiresAt);

    transformed.push({
      id: session.id,
      current: session.current,
      device,
      ip: session.ipAddress,
      lastActive,
      location,
      status,
    });
  }

  return transformed;
};

async function getLocationFromIP(ip: string): Promise<string> {
  if (ip === "::1" || ip === "127.0.0.1") return "Localhost";

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = (await res.json()) as IpInfo;

    const location =
      data.city && data.country_name
        ? `${data.city}, ${data.country_name}`
        : data.country_name || "Unknown Location";

    return location;
  } catch (error: any) {
    logger.error("Error fetching IP info", { error: error.message || "" });
    return "Unknown Location";
  }
}

function getSessionStatus(expiresAt: Date) {
  return new Date() < new Date(expiresAt) ? "active" : "expired";
}
