import { app, BrowserWindow, ipcMain, shell } from 'electron';
import os from 'node:os';
import path from 'node:path';
import { calculateExpression, parseCommand } from '../src/shared/commands';

const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: '#070b14',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    title: 'NexusVoice',
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    void win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    void win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

function validWebUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

ipcMain.handle('open-url', async (_event, input: unknown) => {
  if (typeof input !== 'string' || !validWebUrl(input)) {
    return { ok: false, message: 'Chỉ cho phép URL HTTP/HTTPS hợp lệ.' };
  }
  await shell.openExternal(input);
  return { ok: true, message: 'Đã mở liên kết.' };
});

ipcMain.handle('system-info', () => ({
  platform: process.platform,
  release: os.release(),
  arch: process.arch,
  hostname: os.hostname(),
  memory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB`,
}));

ipcMain.handle('run-command', async (_event, text: unknown) => {
  if (typeof text !== 'string' || text.length > 300) {
    return { ok: false, message: 'Lệnh không hợp lệ.' };
  }
  const command = parseCommand(text);
  if (command.kind === 'open-url') {
    await shell.openExternal(command.url);
    return { ok: true, message: `Đã mở ${command.label}.` };
  }
  if (command.kind === 'calculate') {
    try {
      const result = calculateExpression(command.expression);
      return { ok: true, message: `Kết quả là ${result}.`, data: result };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : 'Không thể tính.' };
    }
  }
  if (command.kind === 'system-info') {
    return { ok: true, message: 'Đây là thông tin hệ thống.', data: {
      platform: process.platform,
      release: os.release(),
      arch: process.arch,
      hostname: os.hostname(),
    } };
  }
  return { ok: false, message: 'Mình chưa hiểu lệnh đó. Hãy thử “mở YouTube”, “tính 12 * 4” hoặc “thông tin hệ thống”.' };
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
