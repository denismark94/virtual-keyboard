import values from "./assets/i18n.js";


let lang = "en";
let caps = false;
let pressed = {};


function setLocalStorage() {
  localStorage.setItem("lang", lang);
}

function getLocalStorage() {
  if (localStorage.getItem("lang")) {
    lang = localStorage.getItem("lang")
  }
  changeLayout();
}

window.addEventListener('beforeunload', setLocalStorage)
window.addEventListener('load', getLocalStorage)



document.body.addEventListener("keydown", press);
document.body.addEventListener("keyup", release);


function press(event) {
  let code;
  switch (event.type) {
    case "keydown":
      code = event.code;
      if (code in values[lang]) {
        event.preventDefault();
      }
      break;
    case "mousedown":
      code = event.target.id;
      break;
  }
  let btn = document.getElementById(code);
  btn.classList.add("active");
  pressed[code] = true;
  if (code === "ShiftLeft" || code === "ShiftRight") {
    caps = !caps;
    changeLayout();
  }
  print(code);
}

function release(event) {
  let code;
  switch (event.type) {
    case "keyup":
      code = event.code;
      break;
    case "mouseup":
      code = event.target.id;
      break;
  }
  let btn = document.getElementById(code);
  btn.classList.remove("active");
  pressed[code] = false;
  if (code === "ShiftLeft" || code === "ShiftRight") {
    caps = !caps;
    changeLayout();
  }
  textArea.focus();
}

let container = document.createElement("div");
container.classList.add("container");
document.body.appendChild(container);

let textArea = document.createElement("textarea");
textArea.rows = 10;
textArea.placeholder = values[lang]["placeholder"];

container.appendChild(textArea);
textArea.focus();

let keyboard = document.createElement("div");
keyboard.classList.add("keyboard");
container.appendChild(keyboard);
let button;

let layout = [
  [
    "Backquote",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "Digit0",
    "Minus",
    "Equal",
    "Backspace",
  ],
  [
    "Tab",
    "KeyQ",
    "KeyW",
    "KeyE",
    "KeyR",
    "KeyT",
    "KeyY",
    "KeyU",
    "KeyI",
    "KeyO",
    "KeyP",
    "BracketLeft",
    "BracketRight",
    "Backslash",
    "Delete",
  ],
  [
    "CapsLock",
    "KeyA",
    "KeyS",
    "KeyD",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyJ",
    "KeyK",
    "KeyL",
    "Semicolon",
    "Quote",
    "Enter",
  ],
  [
    "ShiftLeft",
    "IntlBackslash",
    "KeyZ",
    "KeyX",
    "KeyC",
    "KeyV",
    "KeyB",
    "KeyN",
    "KeyM",
    "Period",
    "Comma",
    "Slash",
    "ArrowUp",
    "ShiftRight",
  ],
  [
    "ControlLeft",
    "MetaLeft",
    "AltLeft",
    "Space",
    "AltRight",
    "ControlRight",
    "ArrowLeft",
    "ArrowDown",
    "ArrowRight",
  ],
];

let functional = [
  "Backspace",
  "Tab",
  "CapsLock",
  "Delete",
  "Enter",
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "MetaLeft",
  "AltLeft",
  "AltRight",
  "ArrowLeft",
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
];

function createButtons() {
  let ind = document.createElement("div");
  ind.classList.add("indicator");
  for (let i = 0; i < layout.length; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < layout[i].length; j++) {
      button = document.createElement("button");
      button.id = layout[i][j];
      if (layout[i][j].includes("Arrow"))
        button.classList.add(
          "arrow",
          layout[i][j].replace("Arrow", "").toLowerCase()
        );
      if (functional.includes(layout[i][j])) button.classList.add("functional");
      if (layout[i][j] === "CapsLock") {
        button.append(ind);
      }
      row.appendChild(button);
    }
    keyboard.appendChild(row);
  }
}

createButtons();

let buttons = document.querySelectorAll("button");
buttons.forEach((btn) => {
  btn.addEventListener("mousedown", press);
  btn.addEventListener("mouseup", release);
});

// changeLayout();

function print(code) {
  let rows, index, count;
  switch (code) {
    case "Backspace":
      if (textArea.selectionStart != textArea.selectionEnd) {
        textArea.setRangeText(
          "",
          textArea.selectionStart,
          textArea.selectionEnd,
          "start"
        );
      } else {
        textArea.setRangeText(
          "",
          Math.max(textArea.selectionStart - 1, 0),
          textArea.selectionEnd,
          "start"
        );
      }
      break;
    case "Tab":
      textArea.setRangeText(
        "\t",
        textArea.selectionStart,
        textArea.selectionEnd,
        "end"
      );
      break;
    case "ArrowLeft":
      if (pressed["ShiftLeft"] || pressed["ShiftRight"]) {
        textArea.selectionStart -= 1;
        break;
      }
      if (textArea.selectionStart === textArea.selectionEnd)
        textArea.selectionStart -= 1;
      textArea.selectionEnd = textArea.selectionStart;
      break;
    case "ArrowRight":
      if (pressed["ShiftLeft"] || pressed["ShiftRight"]) {
        textArea.selectionEnd += 1;
        break;
      }
      if (textArea.selectionStart === textArea.selectionEnd) {
        textArea.selectionStart += 1;
        textArea.selectionEnd = textArea.selectionStart;
      } else textArea.selectionStart = textArea.selectionEnd;
      break;
    case "ArrowDown":
      rows = textArea.value.split("\n");
      count = textArea.selectionEnd;
      index = textArea.selectionEnd;
      for (let i = 0; i < rows.length - 1; i++) {
        if (count < rows[i].length + 1) {
          index += Math.min(
            rows[i].length + 1,
            rows[i].length - count + rows[i + 1].length + 1
          );
          break;
        } else {
          count -= rows[i].length + 1;
        }
      }
      if (pressed["ShiftLeft"] || pressed["ShiftRight"]) {
        textArea.selectionEnd = index;
      } else {
        textArea.selectionStart = index;
        textArea.selectionEnd = textArea.selectionStart;
      }
      break;
    case "ArrowUp":
      rows = textArea.value.split("\n");
      count = textArea.selectionStart;
      index = textArea.selectionStart;
      for (let i = 0; i < rows.length; i++) {
        if (count < rows[i].length + 1) {
          if (i > 0) {
            index -=
              rows[i - 1].length < count ? count + 1 : rows[i].length + 1;
          }
          break;
        } else {
          count -= rows[i].length + 1;
        }
      }
      if (pressed["ShiftLeft"] || pressed["ShiftRight"]) {
        textArea.selectionStart = index;
      } else {
        textArea.selectionStart = index;
        textArea.selectionEnd = textArea.selectionStart;
      }
      break;
    case "Enter":
      textArea.setRangeText(
        "\n",
        textArea.selectionStart,
        textArea.selectionEnd,
        "end"
      );
      break;
    case "CapsLock":
      caps = !caps;
      changeLayout();
      break;
    case "AltLeft":
      if (pressed["ShiftLeft"] || pressed["ShiftRight"]) {
        lang = lang === "en" ? "ru" : "en";
        changeLayout();
      }
      break;
    case "AltRight":
      if (pressed["ShiftLeft"] || pressed["ShiftRight"]) {
        lang = lang === "en" ? "ru" : "en";
        changeLayout();
      }
      break;
    case "ControlLeft":
      if (pressed["ShiftLeft"] || pressed["ShiftRight"]) {
        lang = lang === "en" ? "ru" : "en";
        changeLayout();
      }
      break;
    case "ControlRight":
      if (pressed["ShiftLeft"] || pressed["ShiftRight"]) {
        lang = lang === "en" ? "ru" : "en";
        changeLayout();
      }
      break;
    case "ShiftLeft":
      if (
        pressed["AltLeft"] ||
        pressed["AltRight"] ||
        pressed["ControlLeft"] ||
        pressed["ControlRight"]
      ) {
        lang = lang === "en" ? "ru" : "en";
        changeLayout();
      }
      break;
    case "ShiftRight":
      if (
        pressed["AltLeft"] ||
        pressed["AltRight"] ||
        pressed["ControlLeft"] ||
        pressed["ControlRight"]
      ) {
        lang = lang === "en" ? "ru" : "en";
        changeLayout();
      }
      break;
    case "Delete":
      if (textArea.selectionStart != textArea.selectionEnd) {
        textArea.setRangeText(
          "",
          textArea.selectionStart,
          textArea.selectionEnd,
          "end"
        );
      } else {
        textArea.setRangeText(
          "",
          textArea.selectionStart,
          textArea.selectionEnd + 1,
          "end"
        );
      }
      break;
    case "MetaLeft":
      break;
    default:
      if (pressed["ControlLeft"] || pressed["ControlRight"]) {
        switch (code) {
          case "KeyA":
            textArea.selectionStart = 0;
            textArea.selectionEnd = textArea.value.length;
            break;
          case "KeyC":
            navigator.clipboard
              .writeText(
                textArea.value.substring(
                  textArea.selectionStart,
                  textArea.selectionEnd
                )
              )
              .then();
            break;
          case "KeyV":
            navigator.clipboard
              .readText()
              .then((data) =>
                textArea.setRangeText(
                  data,
                  textArea.selectionStart,
                  textArea.selectionEnd,
                  "end"
                )
              );
            break;
          case "KeyX":
            navigator.clipboard.writeText(
              textArea.value.substring(
                textArea.selectionStart,
                textArea.selectionEnd
              )
            );
            textArea.setRangeText(
              "",
              textArea.selectionStart,
              textArea.selectionEnd,
              "end"
            );
            break;
        }
        break;
      }
      let val;
      if (values[`alt_${lang}`][code])
        val =
          pressed["ShiftLeft"] || pressed["ShiftRight"]
            ? values[`alt_${lang}`][code]
            : values[lang][code];
      else val = caps ? values[lang][code].toUpperCase() : values[lang][code];
      textArea.setRangeText(
        val,
        textArea.selectionStart,
        textArea.selectionEnd,
        "end"
      );
      break;
  }
}

function changeLayout() {
  let ind = document.querySelector(".indicator");
  buttons.forEach((btn) => {
    if (!functional.includes(btn.id)) {
      btn.textContent = caps? values[lang][btn.id].toUpperCase(): values[lang][btn.id].toLowerCase();
      if (values[`alt_${lang}`][btn.id])
        if (pressed["ShiftLeft"] || pressed["ShiftRight"])
          btn.textContent = values[`alt_${lang}`][btn.id];
        else btn.textContent = values[lang][btn.id];
    } else {
      if (!btn.id.includes("Arrow")) btn.textContent = values[lang][btn.id];
      if (btn.id === "CapsLock") btn.appendChild(ind);
    }
  });
  if (caps) ind.classList.add("on");
  else ind.classList.remove("on");

  document.querySelector("textarea").placeholder = values[lang]["placeholder"];
}
