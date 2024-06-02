import type { Caido } from "@caido/sdk-frontend";
import { getCaidoAPI, setCaidoAPI } from "./caidoapi";
import { initWebSocket } from "./websocket";
import { setEvenBetterAPI } from "./evenbetterapi";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";
import { getData } from "./storage";

export const init = (caido: Caido) => {
  setCaidoAPI(caido);

  const evenBetterAPI = new EvenBetterAPI(caido, {
    manifestID: "livecaidoreload-plugin",
    name: "LiveCaidoReload",
  });
  setEvenBetterAPI(evenBetterAPI);

  initWebSocket();

  getData();

  evenBetterAPI.eventManager.on("onCaidoLoad", () => {
    setTimeout(() => {
      const previousPath = localStorage.getItem("previousPath");
      if (!previousPath) return;

      localStorage.removeItem("previousPath");
      getCaidoAPI().navigation.goTo(previousPath);
    }, 25);
  });
};
