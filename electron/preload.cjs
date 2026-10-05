const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('sanctuaryDesktop', Object.freeze({
  platform: process.platform,
  isStandalone: true
}));
