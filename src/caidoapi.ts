import type { Caido } from "@caido/sdk-frontend";
import { getEvenBetterAPI } from "./evenbetterapi";

let CaidoAPI: Caido | null = null;

export const setCaidoAPI = (caido: Caido) => {
  CaidoAPI = caido;
};

export const getCaidoAPI = () => {
  if (!CaidoAPI) {
    throw new Error("CaidoAPI is not set yet!");
  }

  return CaidoAPI;
};


export const importPlugin = async (file: File) => {
  return getCaidoAPI().graphql.installPluginPackage({
    input: {
      source: {
        file: file,
      },
    },
  })
};

export const uninstallPlugin = async (pluginID: string) => {
  return getCaidoAPI().graphql.uninstallPluginPackage({
    id: pluginID,
  }).catch((err) => {
    getEvenBetterAPI().toast.showToast({
      message: "Failed to uninstall plugin",
      type: "error",
    });

    console.error(err);
  });
};
