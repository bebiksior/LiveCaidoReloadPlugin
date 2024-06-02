import { importPlugin, uninstallPlugin } from "./caidoapi";
import { getEvenBetterAPI } from "./evenbetterapi";
import { getData, updateData } from "./storage";

const WEBSOCKET_URL = "ws://localhost:8081";

export const initWebSocket = () => {
  let ws = new WebSocket(WEBSOCKET_URL);

  ws.addEventListener("open", () => {
    getEvenBetterAPI().toast.showToast({
      message: "Connected with LiveCaidoReload server",
      duration: 1500,
      position: "top",
    });
  });

  let bufferArray: Array<Blob | ArrayBuffer> = [];
  ws.addEventListener("message", async (event) => {
    if (typeof event.data === "string") {
      const message = JSON.parse(event.data);
      if (message.end) {
        console.log("File transfer completed");

        const data = getData();

        if (data && data.tempPluginID) await uninstallPlugin(data.tempPluginID);

        await new Promise((resolve) => setTimeout(resolve, 20));
        
        const blob = new Blob(bufferArray, { type: "application/zip" });

        const reader = new FileReader();
        reader.onload = async () => {
          const buffer = reader.result as ArrayBuffer;
          const file = new File([buffer], "plugin.zip", {
            type: "application/zip",
          });

          const data = await importPlugin(file);
          const tempPluginID = data.installPluginPackage.package?.id;
          updateData({ tempPluginID }).then(() => {
            localStorage.setItem("previousPath", location.hash.slice(1));
            setTimeout(() => location.reload(), 100);
          });
        };
        reader.readAsArrayBuffer(blob);
      }
    } else {
      bufferArray.push(event.data);
      console.log("Received data chunk");
    }
  });

  ws.addEventListener("close", () => {
    getEvenBetterAPI().toast.showToast({
      message:
        "Disconnected from LiveCaidoReload. Reconnecting in 3 seconds...",
      type: "error",
      position: "top",
    });

    setTimeout(() => {
      ws.close();
      initWebSocket();
    }, 3000);
  });
};
