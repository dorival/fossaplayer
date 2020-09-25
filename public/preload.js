const { contextBridge, ipcRenderer } = require("electron");
const { CLEARANCE_CHANNEL } = require("./core/constants");

// Read more here: https://stackoverflow.com/questions/57807459/how-to-use-preload-js-properly-in-electron

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    if (CLEARANCE_CHANNEL.test(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    if (CLEARANCE_CHANNEL.test(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
