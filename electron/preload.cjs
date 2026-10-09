const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sanctuaryDesktop', Object.freeze({
  platform: process.platform,
  isStandalone: true,
  openLegacyWorkspace: () => ipcRenderer.invoke('ui:open-legacy'),
  data: Object.freeze({
    snapshot: () => ipcRenderer.invoke('data:snapshot'),
    listStudies: () => ipcRenderer.invoke('data:list-studies'),
    listRecords: (input) => ipcRenderer.invoke('data:list-records', input),
    listContentItems: (input) => ipcRenderer.invoke('data:list-content-items', input),
    listStudyContent: (input) => ipcRenderer.invoke('data:list-study-content', input),
    getStorageInfo: () => ipcRenderer.invoke('data:storage-info'),
    chooseStorage: () => ipcRenderer.invoke('data:choose-storage'),
    getTimelineContent: () => ipcRenderer.invoke('content:timeline'),
    attachTimeline: (input) => ipcRenderer.invoke('content:attach-timeline', input),
    getScriptureContent: () => ipcRenderer.invoke('content:scripture'),
    attachScripture: (input) => ipcRenderer.invoke('content:attach-scripture', input),
    getLibraryContent: () => ipcRenderer.invoke('content:library'),
    attachLibrary: (input) => ipcRenderer.invoke('content:attach-library', input),
    getSymbolismContent: () => ipcRenderer.invoke('content:symbolism'),
    attachSymbolism: (input) => ipcRenderer.invoke('content:attach-symbolism', input),
    getColorsContent: () => ipcRenderer.invoke('content:colors'),
    attachColors: (input) => ipcRenderer.invoke('content:attach-colors', input),
    createStudy: (input) => ipcRenderer.invoke('study:create', input),
    updateStudy: (input) => ipcRenderer.invoke('study:update', input),
    deleteStudy: (input) => ipcRenderer.invoke('study:delete', input),
    addStudyRecord: (input) => ipcRenderer.invoke('study:add-record', input),
    exportBundle: () => ipcRenderer.invoke('data:export-bundle'),
    exportFile: () => ipcRenderer.invoke('data:export-file'),
    importFile: () => ipcRenderer.invoke('data:import-file')
  })
}));
