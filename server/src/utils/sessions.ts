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
  status: string; // success
  country: string; // Canada
  countryCode: string; //CA
  region: string; // QC
  regionName: string; // Quebec
  city: string; // Montreal
  zip: string; // H1K
  lat: number; // 45.6085
  lon: number; // -73.5493
  timezone: string; // America/Toronto
  isp: string; // Le Groupe Videotron Ltee
  org: string; // Videotron Ltee
  as: string; // AS5769 Videotron Ltee
  query: string; // ip address that we queried
}

interface TransformedSession {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastLogin: string;
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
    const lastLogin = format(
      new Date(session.updatedAt),
      "d/M/yyyy, h:mm:ss a"
    );
    const status = getSessionStatus(session.expiresAt);

    transformed.push({
      id: session.id,
      current: session.current,
      device,
      ip: session.ipAddress,
      lastLogin,
      location,
      status,
    });
  }

  return transformed;
};

async function getLocationFromIP(ip: string): Promise<string> {
  if (ip === "::1" || ip === "127.0.0.1") return "Localhost";

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}`);
    const data = (await res.json()) as IpInfo;

    const location =
      data.city && data.country
        ? `${data.city}, ${data.country}`
        : data.country || "Unknown Location";

    return location;
  } catch (error: any) {
    logger.error("Error fetching IP info", { error: error.message || "" });
    return "Unknown Location";
  }
}

function getSessionStatus(expiresAt: Date) {
  return new Date() < new Date(expiresAt) ? "active" : "expired";
}
