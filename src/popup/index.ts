// Get reference to UI elements
const pauseBtn = document.getElementById("pauseBtn") as HTMLButtonElement;
const statusEl = document.getElementById("status") as HTMLDivElement;

// Initialize popup when opened
async function init() {
  try {
    console.log("initiating...");
    if (!chrome?.storage?.local) {
      throw new Error("Chrome storage API not available");
    }
    const { paused = false } = await chrome.storage.local.get("paused");
    updateUI(paused);
  } catch (error) {
    console.error("Failed to initialize popup:", error);
    updateUI(false); // Default to not paused
  }
}

// Update button label + status text
function updateUI(paused: boolean) {
  if (!pauseBtn || !statusEl) return;
  pauseBtn.textContent = paused ? "Resume capture" : "Pause capture";
  statusEl.textContent = paused ? "Capture is paused" : "Capture is running";
}

// Toggle paused state
pauseBtn?.addEventListener("click", async () => {
  try {
    if (!chrome?.storage?.local) {
      throw new Error("Chrome storage API not available");
    }
    console.log("pause button is clicked");
    const { paused = false } = await chrome.storage.local.get("paused");
    const next = !paused;
    await chrome.storage.local.set({ paused: next });
    updateUI(next);
  } catch (error) {
    console.error("Failed to toggle paused state:", error);
  }
});

// Kick off init
init();
