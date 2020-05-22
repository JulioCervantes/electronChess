const { app, BrowserWindow, Menu, dialog } = require('electron');
const { loadPgnFromFile } = require('./pgn_reader');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 2480, height: 1240})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })


    //Menu
const isMac = process.platform === 'darwin';

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      { label:'Open pgn file...', role: 'open',click: 
          async () =>{
            dialog.showOpenDialog(mainWindow,{
              properties: ['openFile']
            }).then(result => {
              console.log(result.canceled)
              console.log(result.filePaths)
              console.log(result);
              if(result){
                loadPgnFromFile(result.filePaths[0]).then(result=>{
                  mainWindow.webContents.executeJavaScript(`loadPgnFromWindow(${JSON.stringify(result)})`);
                })
              }
            }).catch(err => {
              console.log(err)
            })
          }
      },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);




}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
