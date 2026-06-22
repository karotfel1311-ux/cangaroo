import { ps4dpi } from "./ps4dpi";
import { ps4rpi } from "./ps4rpi";

export enum Instalator {
  PS4RPI = "PS4RPI",
  PS4DPI = "PS4DPI",
}

export const instalators = {
  [Instalator.PS4RPI]: ps4rpi,
  [Instalator.PS4DPI]: ps4dpi,
};
