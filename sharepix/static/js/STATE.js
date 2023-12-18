/** Define canvas state (the current tool the user is using) */
let STATE_PAINT = 0;
let STATE_ERASE = 1;
let STATE_FILL = 2;
let STATE_CLEAR = 3;
let STATE_LAST = 4;
let STATE_NEXT = 5;
let STATE_HIDE = 6;
let STATE_EXPORT = 7;
let STATE_PUBLISH = 8;
let STATE_COLOR = 9;

/** Sets the currentState of the toolbox */
function setCurrentState(state) {
  // set local storage information
  window.localStorage.setItem("currentState", state);
}

/** Gets the currentState of the toolbox */
function getCurrentState() {
  // get local storage information
  return window.localStorage.getItem("currentState");
}

/** Sets the original state of the toolbox */
function setOrigState() {
  // set local storage information
  window.localStorage.setItem("origState", getCurrentState());
}

/** Gets the original state of the toolbox */
function getOrigState() {
  // get local storage information
  return window.localStorage.getItem("origState");
}

/** Restore the original state of the toolbox */
function restoreState() {
  // set local storage information
  window.localStorage.setItem("currentState", getOrigState());
}

/** Sets current color */
function setCurrentColor(color) {
  window.localStorage.setItem("currentColor", color);
}

/** Gets current color */
function getCurrentColor() {
  return window.localStorage.getItem("currentColor");
}
