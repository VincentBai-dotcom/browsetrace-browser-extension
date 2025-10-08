import { useEffect, useState } from "react";

export default function App() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        if (!chrome?.storage?.local) {
          throw new Error("Chrome storage API not available");
        }
        const { paused = false } = await chrome.storage.local.get("paused");
        setPaused(paused);
      } catch (error) {
        console.error("Failed to initialize popup:", error);
        setPaused(false);
      }
    }
    init();
  }, []);

  const handleToggle = async () => {
    try {
      if (!chrome?.storage?.local) {
        throw new Error("Chrome storage API not available");
      }
      const next = !paused;
      await chrome.storage.local.set({ paused: next });
      setPaused(next);
    } catch (error) {
      console.error("Failed to toggle paused state:", error);
    }
  };

  return (
    <div>
      <h1>Hello Extensions</h1>
      <div id="status">
        {paused ? "Capture is paused" : "Capture is running"}
      </div>
      <button id="pauseBtn" onClick={handleToggle}>
        {paused ? "Resume capture" : "Pause capture"}
      </button>
    </div>
  );
}
