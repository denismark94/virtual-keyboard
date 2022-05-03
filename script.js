import values from './assets/i18n.js'

document.body.addEventListener('keydown', activate)
document.body.addEventListener('keyup', deactivate)




function activate(event) {
    event.preventDefault();
    let code = event.code
    console.log(code)
    let btn = document.getElementById(code)
    btn.classList.add('active')
    print(code)
}

function deactivate(event) {
    let code = event.code
    let btn = document.getElementById(code)
    btn.classList.remove('active')
}

let container = document.createElement('div')
container.classList.add('container')
document.body.appendChild(container)

let textArea = document.createElement('textarea')
textArea.rows = 10;
textArea.autofocus = true;
container.appendChild(textArea)
let keyboard = document.createElement('div')
keyboard.classList.add('keyboard')
container.appendChild(keyboard)
let button;

let layout = [
    ['Backquote','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal','Backspace'],
    ['Tab','KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight','Backslash','Delete'],
    ['CapsLock','KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','Enter'],
    ['ShiftLeft','IntlBackslash','KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Period','Comma','Slash','ArrowUp','ShiftRight'],
    ['ControlLeft','MetaLeft','AltLeft','Space','AltRight','ControlRight','ArrowLeft','ArrowDown','ArrowRight']
]

let functional = ['Backspace','Tab','CapsLock', 'Enter','ShiftLeft','Ctrl','Win','Alt']

for (let i = 0; i < layout.length; i++) {
    let row = document.createElement('div');
    row.classList.add('row')
    for (let j = 0; j < layout[i].length;j++) {
        button = document.createElement('button')
        if (layout[i][j].includes('Arrow')) {
            button.classList.add('arrow', layout[i][j].replace('Arrow','').toLowerCase())
        } else
            button.textContent = values[layout[i][j]];
        button.id = layout[i][j];
        if (functional.includes(layout[i][j]))
            button.classList.add('functional')

        row.appendChild(button)
    }
    keyboard.appendChild(row)
}


document.querySelectorAll('button').forEach((btn)=>{
    btn.addEventListener('mousedown',(event)=>press(event));
    btn.addEventListener('mouseup',(event)=>event.target.classList.remove('active'));
})

function press(event) {
    event.target.classList.add('active')
    console.log(event.target.id)
    print(event.target.id)
}

function print(code) {
    let splitter = textArea.selectionStart;
    let value = textArea.value
    switch(code) {
        case 'Backspace':
            textArea.value = value.substring(0,splitter - 1);
            break;
        case 'Tab':
            textArea.value = value.substring(0, splitter) + '\t' + value.substring(splitter, value.length);
            textArea.selectionStart = splitter + 1;
            textArea.selectionEnd = splitter + 1;
            break;
        case 'Space':
            textArea.value = value.substring(0, splitter) + ' ' + value.substring(splitter, value.length);
            textArea.selectionStart = splitter + 1;
            textArea.selectionEnd = splitter + 1;
            break;
        case 'ArrowLeft':
            textArea.selectionStart = (splitter>0)?splitter - 1:splitter;
            textArea.selectionEnd = (splitter>0)?splitter - 1:splitter;
            break;
        case 'ArrowRight':
            textArea.selectionStart = (splitter<textArea.value.length)?(splitter + 1):splitter;
            textArea.selectionEnd = (splitter<textArea.value.length)?(splitter + 1):splitter;
            break;
        case 'Enter':
            textArea.value = value.substring(0, splitter) + '\n' + value.substring(splitter, value.length);
            textArea.selectionStart = splitter + 1;
            textArea.selectionEnd = splitter + 1;
            break; 
        default:
            textArea.value = value.substring(0, splitter) + values[code] + value.substring(splitter, value.length);
            textArea.selectionStart = splitter + 1;
            textArea.selectionEnd = splitter + 1;            
    }
}
