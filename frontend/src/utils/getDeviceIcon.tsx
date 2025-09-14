import { Laptop, Monitor, Smartphone } from "lucide-react";

export function getDeviceIcon(device: string) {
  if (
    device.toLowerCase().includes("mobile") ||
    device.toLowerCase().includes("iphone") ||
    device.toLowerCase().includes("pixel")
  ) {
    return <Smartphone className="h-5 w-5 text-muted-foreground" />;
  }
  if (
    device.toLowerCase().includes("macbook") ||
    device.toLowerCase().includes("laptop")
  ) {
    return <Laptop className="h-5 w-5 text-muted-foreground" />;
  }
  return <Monitor className="h-5 w-5 text-muted-foreground" />;
}
