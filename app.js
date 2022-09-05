const {app, BrowserWindow} = require('electron');
const ipc = require('electron').ipcMain;

//On initiation of app, open default window
app.on("ready", () => {
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,		
		icon: __dirname + "/app/logo.png",
		titleBarStyle: "hidden",
		webPreferences: {
			nodeIntegration: true
		}
	});
	mainWindow.setMenuBarVisibility(false);
	mainWindow.loadFile(__dirname + "/app/index.html");
	
});

//Even after closing all tabs, some OS considers the process to be still running. Hence this fix
app.on("window-all-closed", () => {
	if(process.platform !== "darwin") {
		app.quit();
	}
});

//In case the app is still running, but no instance is opened yet
app.on("activate", () => {
	if(BrowserWindow.getAllWindows().length === 0) {
		loadMainWindow();
	}
});