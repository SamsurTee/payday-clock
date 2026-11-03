'use strict';
const { app, BrowserWindow, Menu, session } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { isAppURL } = require('./navigation.cjs');
const pagePath = path.join(__dirname, '..', 'index.html');
const pageURL = pathToFileURL(pagePath).href;
let mainWindow;

app.setName('薪动');
// Keep one stable settings directory across application versions and architectures.
app.setPath('userData', path.join(app.getPath('appData'), 'PaydayClock'));
const ownsLock = app.requestSingleInstanceLock();
if (!ownsLock) app.quit();
else {
  app.on('second-instance', () => {
    if (!mainWindow || mainWindow.isDestroyed()) createWindow();
    else { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.show(); mainWindow.focus(); }
  });
  app.whenReady().then(() => {
    session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    session.defaultSession.setPermissionCheckHandler(() => false);
    // The application is entirely offline: permit only its own local resources.
    session.defaultSession.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*'] }, (_details, callback) => callback({ cancel: true }));
    installMenu();
    createWindow();
    app.on('activate', () => {
      if (!mainWindow || mainWindow.isDestroyed()) createWindow();
      else mainWindow.show();
    });
  });
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
}

function secureWindow(win) {
  win.webContents.on('will-navigate', (event, url) => { if (!isAppURL(url, pageURL)) event.preventDefault(); });
  win.webContents.on('will-attach-webview', event => event.preventDefault());
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!isAppURL(url, pageURL) || new URL(url).searchParams.get('view') !== 'mini') return { action: 'deny' };
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        width: 450, height: 770, minWidth: 380, minHeight: 540,
        title: '薪动 · 专注小窗', alwaysOnTop: true, autoHideMenuBar: true,
        backgroundColor: '#f5f6f0', icon: path.join(__dirname, '..', 'build', 'icon.png'),
        webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true }
      }
    };
  });
  win.webContents.on('did-create-window', child => secureWindow(child));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1160, height: 870, minWidth: 390, minHeight: 600, show: false,
    title: '薪动', backgroundColor: '#f5f6f0', autoHideMenuBar: true,
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true }
  });
  secureWindow(mainWindow);
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.loadFile(pagePath);
}

function installMenu() {
  const menu = [];
  if (process.platform === 'darwin') menu.push({ label: '薪动', submenu: [{ role: 'about', label: '关于薪动' }, { type: 'separator' }, { role: 'hide', label: '隐藏薪动' }, { role: 'hideOthers', label: '隐藏其他' }, { role: 'unhide', label: '显示全部' }, { type: 'separator' }, { role: 'quit', label: '退出薪动' }] });
  menu.push({ label: '编辑', submenu: [{ role: 'undo', label: '撤销' }, { role: 'redo', label: '重做' }, { type: 'separator' }, { role: 'cut', label: '剪切' }, { role: 'copy', label: '复制' }, { role: 'paste', label: '粘贴' }, { role: 'selectAll', label: '全选' }] });
  menu.push({ label: '显示', submenu: [{ role: 'resetZoom', label: '实际大小' }, { role: 'zoomIn', label: '放大' }, { role: 'zoomOut', label: '缩小' }, { type: 'separator' }, { label: '切换窗口置顶', accelerator: 'CmdOrCtrl+Shift+T', click: () => { const win = BrowserWindow.getFocusedWindow(); if (win) win.setAlwaysOnTop(!win.isAlwaysOnTop()); } }, { role: 'togglefullscreen', label: '切换全屏' }] });
  menu.push({ label: '窗口', submenu: [{ role: 'minimize', label: '最小化' }, { role: 'close', label: '关闭窗口' }, ...(process.platform === 'darwin' ? [] : [{ role: 'quit', label: '退出' }])] });
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
  app.setAboutPanelOptions({ applicationName: '薪动 · Payday Clock', applicationVersion: app.getVersion(), copyright: 'Copyright © 2026 SamsurTee · MIT License', website: 'https://github.com/SamsurTee/payday-clock' });
}
