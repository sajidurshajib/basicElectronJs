const electron = require('electron')
const {ipcRenderer} = electron
const ul = document.querySelector('ul')

//add
ipcRenderer.on('item:add',(e,item)=>{
    const li = document.createElement('li')
    const itemText = document.createTextNode(item)
    li.appendChild(itemText)
    ul.appendChild(li)
})

//clear
ipcRenderer.on('item:clear',()=>{
    ul.innerHTML = ''
})

//remove
ul.addEventListener('dblclick',removeItem)

function removeItem(e){
    e.target.remove()
}