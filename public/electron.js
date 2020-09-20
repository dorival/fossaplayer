const {
  BrowserWindow,
  Menu,
	app,
  shell,
  ipcMain,
} = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const { PublicClientApplication } = require('msal-electron-poc');
const fetch = require('electron-fetch').default;


let mainWindow;

let accessToken;
let msalApp;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: '#F7F7F7',
    minWidth: 880,
    show: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      preload: __dirname + '/preload.js',
    },
    height: 860,
    width: 1280,
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = require('electron-devtools-installer');

    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => {
        console.log(`Added Extension: ${name}`);
      })
      .catch((err) => {
        console.log('An error occurred: ', err);
      });

    installExtension(REDUX_DEVTOOLS)
      .then((name) => {
        console.log(`Added Extension: ${name}`);
      })
      .catch((err) => {
        console.log('An error occurred: ', err);
      });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    ipcMain.on('open-external-window', (event, arg) => {
      shell.openExternal(arg);
    });
  });
};

const generateMenu = () => {
  const template = [
    {
      label: 'File',
      submenu: [{ role: 'about' }, { role: 'quit' }],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
    {
      role: 'help',
      submenu: [
        {
          click() {
            require('electron').shell.openExternal(
              'https://getstream.io/winds'
            );
          },
          label: 'Learn More',
        },
        {
          click() {
            require('electron').shell.openExternal(
              'https://github.com/GetStream/Winds/issues'
            );
          },
          label: 'File Issue on GitHub',
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

app.on('ready', () => {
  createWindow();
	generateMenu();

	configureAuthentication();
	listenForAcquireToken();
	listenForUserInfo();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('load-page', (event, arg) => {
  mainWindow.loadURL(arg);
});

// --------------- //

function configureAuthentication() {
  msalApp = new PublicClientApplication({
    clientId: 'MY_API_KEY_HERE',
  });
}

// Sets a listener for the AcquireToken event that when triggered
// performs the authorization code grant flow
function listenForAcquireToken() {
  ipcMain.on('AcquireToken', () => {
    getAccessToken();
  });
}

async function getAccessToken() {
  const tokenRequest = {
    scopes: ['user.read', 'files.read'],
  };

  try {
		accessToken = await msalApp.acquireToken(tokenRequest);
		console.log('Got Token', accessToken);
		mainWindow.webContents.send('IsAuthenticated', true);
  } catch (error) {
		mainWindow.webContents.send('IsAuthenticated', false);
    console.error(error);
  }
}

function listenForUserInfo() {
	ipcMain.on('AcquireUserInfo', () => {
		if (accessToken) {
			showUserInfo();
		} else {
			mainWindow.webContents.send('UserInfo', { username: 'Not Authenticated' });
		}
	});
}

function showUserInfo() {
	fetch('https://graph.microsoft.com/v1.0/me', {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	})
	.then((response) => {
		if (response && response.ok === true) {
			response
				.json()
				.then(body => {
					const userInfo = {
						username: `${body.displayName} (${body.userPrincipalName})`
					}
					mainWindow.webContents.send('UserInfo', userInfo);
				})
		} else {
			mainWindow.webContents.send('UserInfo', {
				username: 'Not Authenticated'
			});
		}
		
	})
	.catch((error) => {
		mainWindow.webContents.send('UserInfo',  { username: error.description });
	});
	
}