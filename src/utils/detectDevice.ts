import { Device } from "../types";

export function detectDevice(userAgent: string | null): Device {
  switch (true) {
    case userAgent?.includes("PlayStation 5"):
      return Device.PS5;
    case userAgent?.includes("PlayStation 4"):
      return Device.PS4;
    case userAgent?.includes("Android"):
      return Device.ANDROID;
    case userAgent?.includes("iPhone"):
      return Device.IOS;
    case userAgent?.includes("Windows"):
      return Device.WINDOWS;
    case userAgent?.includes("Macintosh"):
      return Device.MACOS;
    case userAgent?.includes("Linux"):
      return Device.LINUX;
    default:
      return Device.UNKNOWN;
  }
}
