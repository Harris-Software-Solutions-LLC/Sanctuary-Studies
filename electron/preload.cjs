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
    getTimelineContent: () => ipcRenderer.invoke('content:timeline'),
    attachTimeline: (input) => ipcRenderer.invoke('content:attach-timeline', input),
    createStudy: (input) => ipcRenderer.invoke('study:create', input),
    updateStudy: (input) => ipcRenderer.invoke('study:update', input),
    deleteStudy: (input) => ipcRenderer.invoke('study:delete', input),
    addStudyRecord: (input) => ipcRenderer.invoke('study:add-record', input),
    exportBundle: () => ipcRenderer.invoke('data:export-bundle'),
    exportFile: () => ipcRenderer.invoke('data:export-file'),
    importFile: () => ipcRenderer.invoke('data:import-file')
  })
}));
