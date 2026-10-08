const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sanctuaryDesktop', Object.freeze({
  platform: process.platform,
  isStandalone: true,
  data: Object.freeze({
    snapshot: () => ipcRenderer.invoke('data:snapshot'),
    createStudy: (input) => ipcRenderer.invoke('study:create', input),
    addStudyRecord: (input) => ipcRenderer.invoke('study:add-record', input),
    exportBundle: () => ipcRenderer.invoke('data:export-bundle')
  })
}));
