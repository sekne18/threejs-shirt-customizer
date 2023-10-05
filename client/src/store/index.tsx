import { proxy } from "valtio";

const state = proxy({
  intro: true,
  color: "#EFBD48",
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: "./logo_black.webp",
  fullDecal: "./logo_black.webp",
});

export default state;
