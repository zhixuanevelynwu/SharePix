/** Defines all toolbox functions */

/** Useful html elements */
let paint_btn = document.getElementById("paint_btn");
let erase_btn = document.getElementById("erase_btn");
let fill_btn = document.getElementById("fill_btn");
let clear_btn = document.getElementById("clear_btn");
let last_btn = document.getElementById("last_btn");
let next_btn = document.getElementById("next_btn");
let hide_btn = document.getElementById("hide_btn");
let export_btn = document.getElementById("export_btn");
let publish_btn = document.getElementById("publish_btn");
let color_btn = document.getElementById("color_btn");

let buttons = [
  paint_btn,
  erase_btn,
  fill_btn,
  clear_btn,
  last_btn,
  next_btn,
  hide_btn,
  export_btn,
  publish_btn,
  color_btn,
];

// Tool box functions
/** Activates paint brush */
function paint() {
  setCurrentState(STATE_PAINT);
  activateButton();
}

/** Activates erasor */
function erase() {
  setCurrentState(STATE_ERASE);
  activateButton();
}

/** Fills a selected enclosed area with the current color */
function fill() {
  setCurrentState(STATE_FILL);
  activateButton();
}

/** Clears the entire canvas */
function eraseAll() {
  // Store whatever state is selected before
  setOrigState();
  // Set state to clear
  setCurrentState(STATE_CLEAR);
}

/** Return canvas to the previous step */
function lastStep() {
  // Store whatever state is selected before
  setOrigState();
  // Set state to clear
  setCurrentState(STATE_LAST);
}

/** Go to the next step */
function nextStep() {
  // Store whatever state is selected before
  setOrigState();
  // Set state to clear
  setCurrentState(STATE_NEXT);
}

/** Hide grids */
let showGrids = true;
function hideGrids() {
  if (showGrids) {
    hide_btn.innerHTML = "Show grid";
    showGrids = false;
  } else {
    hide_btn.innerHTML = "Hide grid";
    showGrids = true;
  }
  setOrigState();
  setCurrentState(STATE_HIDE);
}

/** Export artwork */
function exportPNG() {
  // Store whatever state is selected before
  setOrigState();
  // Set state to export
  setCurrentState(STATE_EXPORT);
}

/** Publish work */
function publishWork() {
  // Store whatever state is selected before
  setOrigState();
  // Set state to publish
  setCurrentState(STATE_PUBLISH);
}

/** Color picker */
function colorPicker() {
  // Store whatever state is selected before
  setOrigState();
  // Set state to clear
  setCurrentState(STATE_COLOR);
}

/** Activate the current selected button */
function activateButton() {
  let state = getCurrentState();
  for (let i = 0; i < buttons.length; i++) {
    if (i == state) {
      buttons[i].classList.add("active");
    } else {
      buttons[i].classList.remove("active");
    }
  }
}

/** Ctrl S shortcut */
// https://stackoverflow.com/questions/11362106/how-do-i-capture-a-ctrl-s-without-jquery-or-any-other-library
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "s") {
    // Prevent the Save dialog to open
    e.preventDefault();
    // Place your code here
    console.log("CTRL + S");
  }
});
