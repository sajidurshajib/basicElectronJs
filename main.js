const electron = require('electron')
const url = require('url')
const path = require('path')
const { Menu } = require('electron')

const {app, BrowserWindow, ipcMain} = electron

//Set environment 
process.env.NODE_ENV = 'production'

let mainWindow
let addWindow

//Listen for the app to be ready 
app.on('ready',()=>{
    //create new window
    mainWindow = new BrowserWindow({
        width:800,
        height:600,
        webPreferences: {
            nodeIntegration:true
        }
    })
    
    //Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:'file:',
        slashes:true
    }))
    //Quite app when close all
    mainWindow.on('closed',()=>{
        app.quit()
    })

    //Build menu from template 
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    //insert the menu
    Menu.setApplicationMenu(mainMenu)
})


//Handle create add window
function createAddWindow(){
    //create new window
    addWindow = new BrowserWindow({
        width:200,
        height:300,
        title:'Add shopping list item',
        webPreferences: {
            nodeIntegration:true
        }
    })
    //Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol:'file:',
        slashes:true
    }))
    //Garbage collection
    addWindow.on('closed',()=>{
        addWindow=null
    })
}



//catch item:add
ipcMain.on('item:add',function(e,item){
    //console.log(item)
    mainWindow.webContents.send('item:add',item)
    addWindow.close()
})




//create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label:'Add item',
                click(){
                    createAddWindow()
                }
            },
            {
                label:'Clear Item',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label:'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit()
                }
            }
        ]
    }
]


//Add developer tools item if not production
if(process.env.NODE_ENV != 'production'){
    mainMenuTemplate.push({
        label:'DevTools',
        submenu:[
            {
                label: 'Toggle devTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focuseWindow){
                    focuseWindow.toggleDevTools()
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}

