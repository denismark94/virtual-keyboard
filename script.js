import { values, functional, layout } from './assets/i18n.js'; // eslint-disable-line import/extensions

let lang = 'en';
let caps = false;
const pressed = {};
let textArea;
let keyboard;
let ind;
let buttons;

function createKeyboard() {
  const container = document.createElement('div');
  container.classList.add('container');
  document.body.appendChild(container);
  textArea = document.createElement('textarea');
  textArea.rows = 10;
  textArea.placeholder = values[lang].placeholder;
  container.appendChild(textArea);
  textArea.focus();
  keyboard = document.createElement('div');
  keyboard.classList.add('keyboard');
  container.appendChild(keyboard);
}

function createButtons() {
  let button;
  let row;
  ind = document.createElement('div');
  ind.classList.add('indicator');
  for (let i = 0; i < layout.length; i += 1) {
    row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < layout[i].length; j += 1) {
      button = document.createElement('button');
      button.id = layout[i][j];
      if (layout[i][j].includes('Arrow')) button.classList.add('arrow', layout[i][j].replace('Arrow', '').toLowerCase());
      if (functional.includes(layout[i][j])) button.classList.add('functional');
      if (layout[i][j] === 'CapsLock') button.append(ind);
      row.appendChild(button);
    }
    keyboard.appendChild(row);
  }
  buttons = document.querySelectorAll('button');
}

function setText(elem, value) {
  elem.textContent = value; // eslint-disable-line no-param-reassign
}

function changeLayout() {
  let value;
  buttons.forEach((btn) => {
    if (!functional.includes(btn.id)) {
      value = values[lang][btn.id];
      setText(btn, caps ? value.toUpperCase() : value.toLowerCase());
      if (values[`alt_${lang}`][btn.id]) {
        if (pressed.ShiftLeft || pressed.ShiftRight) {
          setText(btn, values[`alt_${lang}`][btn.id]);
        } else setText(btn, values[lang][btn.id]);
      }
    } else {
      if (!btn.id.includes('Arrow')) setText(btn, values[lang][btn.id]);
      if (btn.id === 'CapsLock') btn.appendChild(ind);
    }
  });
  if (caps) ind.classList.add('on');
  else ind.classList.remove('on');
  document.querySelector('textarea').placeholder = values[lang].placeholder;
}

function setLocalStorage() {
  localStorage.setItem('lang', lang);
  localStorage.setItem('caps', caps);
}

function getLocalStorage() {
  if (localStorage.getItem('lang')) {
    lang = localStorage.getItem('lang');
    caps = localStorage.getItem('caps') === 'true';
  }
  changeLayout();
}

function moveCursor(direction, currentIndex) {
  const rows = textArea.value.split('\n');
  let rowIndex = 0;
  let positionInRow = currentIndex;
  let result = currentIndex;
  while (positionInRow > rows[rowIndex].length) {
    positionInRow -= rows[rowIndex].length + 1;
    rowIndex += 1;
  }
  switch (direction) {
    case 'up':
      if (rowIndex > 0) {
        result -= positionInRow + 1;
        if (rows[rowIndex - 1].length > positionInRow) {
          result -= rows[rowIndex - 1].length - positionInRow;
        }
      }
      break;
    case 'down':
      if (rowIndex < rows.length - 1) {
        result += rows[rowIndex].length - positionInRow + 1;
        if (rows[rowIndex + 1].length >= positionInRow) result += positionInRow;
      }
      break;
    default:
      break;
  }
  return result;
}

function print(code) {
  let val;
  let index;
  let buffer;
  switch (code) {
    case 'Backspace':
      if (textArea.selectionStart !== textArea.selectionEnd) {
        textArea.setRangeText('', textArea.selectionStart, textArea.selectionEnd, 'start');
      } else {
        textArea.setRangeText('', Math.max(textArea.selectionStart - 1, 0), textArea.selectionEnd, 'start');
      }
      break;
    case 'Tab':
      textArea.setRangeText('\t', textArea.selectionStart, textArea.selectionEnd, 'end');
      break;
    case 'ArrowLeft':
      if (pressed.ShiftLeft || pressed.ShiftRight) {
        textArea.selectionStart -= 1;
        break;
      }
      if (textArea.selectionStart === textArea.selectionEnd) textArea.selectionStart -= 1;
      textArea.selectionEnd = textArea.selectionStart;
      break;
    case 'ArrowRight':
      if (pressed.ShiftLeft || pressed.ShiftRight) {
        textArea.selectionEnd += 1;
        break;
      }
      if (textArea.selectionStart === textArea.selectionEnd) {
        textArea.selectionStart += 1;
        textArea.selectionEnd = textArea.selectionStart;
      } else textArea.selectionStart = textArea.selectionEnd;
      break;
    case 'ArrowDown':
      index = moveCursor('down', textArea.selectionEnd);
      if (pressed.ShiftLeft || pressed.ShiftRight) {
        textArea.selectionEnd = index;
      } else {
        textArea.selectionStart = index;
        textArea.selectionEnd = textArea.selectionStart;
      }
      break;
    case 'ArrowUp':
      index = moveCursor('up', textArea.selectionStart);
      if (pressed.ShiftLeft || pressed.ShiftRight) {
        textArea.selectionStart = index;
      } else {
        textArea.selectionStart = index;
        textArea.selectionEnd = textArea.selectionStart;
      }
      break;
    case 'Enter':
      textArea.setRangeText('\n', textArea.selectionStart, textArea.selectionEnd, 'end');
      break;
    case 'CapsLock':
      caps = !caps;
      changeLayout();
      break;
    case 'AltLeft':
      if (pressed.ShiftLeft || pressed.ShiftRight) {
        lang = lang === 'en' ? 'ru' : 'en';
        changeLayout();
      }
      break;
    case 'AltRight':
      if (pressed.ShiftLeft || pressed.ShiftRight) {
        lang = lang === 'en' ? 'ru' : 'en';
        changeLayout();
      }
      break;
    case 'ControlLeft':
      if (pressed.ShiftLeft || pressed.ShiftRight) {
        lang = lang === 'en' ? 'ru' : 'en';
        changeLayout();
      }
      break;
    case 'ControlRight':
      if (pressed.ShiftLeft || pressed.ShiftRight) {
        lang = lang === 'en' ? 'ru' : 'en';
        changeLayout();
      }
      break;
    case 'ShiftLeft':
      if (pressed.AltLeft || pressed.AltRight || pressed.ControlLeft || pressed.ControlRight) {
        lang = lang === 'en' ? 'ru' : 'en';
        changeLayout();
      }
      break;
    case 'ShiftRight':
      if (pressed.AltLeft || pressed.AltRight || pressed.ControlLeft || pressed.ControlRight) {
        lang = lang === 'en' ? 'ru' : 'en';
        changeLayout();
      }
      break;
    case 'Delete':
      if (textArea.selectionStart !== textArea.selectionEnd) {
        textArea.setRangeText('', textArea.selectionStart, textArea.selectionEnd, 'end');
      } else {
        textArea.setRangeText('', textArea.selectionStart, textArea.selectionEnd + 1, 'end');
      }
      break;
    case 'MetaLeft':
      break;
    default:
      if (pressed.ControlLeft || pressed.ControlRight) {
        switch (code) {
          case 'KeyA':
            textArea.selectionStart = 0;
            textArea.selectionEnd = textArea.value.length;
            break;
          case 'KeyC':
            buffer = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
            navigator.clipboard.writeText(buffer).then();
            break;
          case 'KeyV':
            navigator.clipboard.readText().then((data) => textArea.setRangeText(data, textArea.selectionStart, textArea.selectionEnd, 'end'));
            break;
          case 'KeyX':
            buffer = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
            navigator.clipboard.writeText(buffer).then();
            textArea.setRangeText('', textArea.selectionStart, textArea.selectionEnd, 'end');
            break;
          default:
            break;
        }
        break;
      }
      if (values[`alt_${lang}`][code]) {
        val = pressed.ShiftLeft || pressed.ShiftRight ? values[`alt_${lang}`][code] : values[lang][code];
      } else val = caps ? values[lang][code].toUpperCase() : values[lang][code];
      textArea.setRangeText(val, textArea.selectionStart, textArea.selectionEnd, 'end');
      break;
  }
}

function press(event) {
  let code;
  switch (event.type) {
    case 'keydown':
      code = event.code;
      break;
    case 'mousedown':
      code = event.target.id;
      break;
    default:
      break;
  }
  if (!(code in values[lang])) return;
  event.preventDefault();
  document.getElementById(code).classList.add('active');
  pressed[code] = true;
  if (code === 'ShiftLeft' || code === 'ShiftRight') {
    caps = !caps;
    changeLayout();
  }
  print(code);
}

function release(event) {
  let code;
  switch (event.type) {
    case 'keyup':
      code = event.code;
      break;
    case 'mouseup':
      code = event.target.id;
      break;
    default:
      break;
  }
  if (!(code in values[lang])) return;
  event.preventDefault();
  document.getElementById(code).classList.remove('active');
  pressed[code] = false;
  if (code === 'ShiftLeft' || code === 'ShiftRight') {
    caps = !caps;
    changeLayout();
  }
  textArea.focus();
}

function assignListeners() {
  window.addEventListener('beforeunload', setLocalStorage);
  window.addEventListener('load', getLocalStorage);
  document.body.addEventListener('keydown', press);
  document.body.addEventListener('keyup', release);
  buttons.forEach((btn) => {
    btn.addEventListener('mousedown', press);
    btn.addEventListener('mouseup', release);
  });
}

createKeyboard();
createButtons();
assignListeners();
