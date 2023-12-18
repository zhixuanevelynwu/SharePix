/** Creates the canvas object and handles user interaction */
/** Load in assets */
function preload() {
  // cursorArrow = loadImage("/static/images/pixel-cursor.png");
}

/** Sets up the canvas */
function setup() {
  // Initialize currentState in localStorage
  setCurrentState(STATE_PAINT);
  setCurrentColor(currentColor);

  // Create canvas and draw it for the first time
  let c = createCanvas(600, 600);
  c.id("my-canvas");

  canvas = new Canvas();
  canvas.drawSelf();

  // Restore saved canvas (if any)
  restoreCurrentCanvas();

  // Push the current canvas to the buffer
  storeCurrentProcess();
}

/** Updates the canvas */
function draw() {
  // Draw canvas
  canvas.drawSelf();

  // Set cursor to a cross to indicate we are drawing
  cursor(CROSS);

  // Detect state change
  if (currentState != getCurrentState) {
    currentState = getCurrentState();
    handleStateChange();
    frame = 0;
  }
  // Detect color change
  if (currentColor != getCurrentColor()) {
    currentColor = getCurrentColor();
  }
}

// Helper functions
/** Handles current state */
function handleStateChange() {
  // Erase everything on canvas
  if (currentState == STATE_CLEAR) {
    canvas.clear();
    storeCurrentProcess();
    // Return state to orginal state
    restoreState();
  }

  // Fill an enclosed area on canvas
  else if (currentState == STATE_FILL) {
    if (mouseIsPressed && inCanvas(mouseX, mouseY)) {
      // Before fill, push the current canvas to the buffer
      storeCurrentProcess();
      canvas.fill();
      // After fill, push the current canvas to the buffer
      storeCurrentProcess();
    }
  }

  // Hide grids
  else if (currentState == STATE_HIDE) {
    showGrids = !showGrids;
    restoreState();
  }

  // Next
  else if (currentState == STATE_NEXT) {
    goToNextStep();
    restoreState();
  }

  // Prev
  else if (currentState == STATE_LAST) {
    restoreLastStep();
    restoreState();
  }

  // Export images
  else if (currentState == STATE_EXPORT) {
    savePNG();
    restoreState();
  }

  // Publish artwork
  else if (currentState == STATE_PUBLISH) {
    publish();
    canvas.clear();
    restoreState();
  }

  // Color picker
  else if (currentState == STATE_COLOR) {
    // Draw cursor of selected color
    let selectedColor = rgbaToHex(get(mouseX, mouseY));
    push();
    noCursor();
    fill(selectedColor);
    stroke(0, 0, 0);
    strokeWeight(1);
    rectMode(CENTER);
    rect(mouseX, mouseY, 25, 25);
    pop();
    // Change selected color
    if (mouseIsPressed && inCanvas(mouseX, mouseY)) {
      setCurrentColor(selectedColor);
      console.log(getCurrentColor());
      restoreState();
    }
  }
}

/** Given x, y coordinates check if a point lies in the canvas */
function inCanvas(x, y) {
  return x > 0 && x < width && y > 0 && y < height;
}

/** Called whenever the mouse is down */
function mousePressed() {
  if (currentState == STATE_PAINT || currentState == STATE_ERASE) {
    toggleDraw = true;
    // Push the current canvas to the buffer
    storeCurrentProcess();
  }
}

/** Called whenever the mouse is released */
function mouseReleased() {
  if (currentState == STATE_PAINT || currentState == STATE_ERASE) {
    toggleDraw = false;
    // Push the current canvas to the buffer
    storeCurrentProcess();
  }
}

/** Called whenever a key is pressed */
function keyPressed() {
  console.log(key);
}

/** Downloads your art */
function savePNG() {
  save("pixel-art.png");
}

/** Convert RGB to hex */
function rgbaToHex(rgba) {
  let r = hex(rgba[0]).substring(6, 8);
  let g = hex(rgba[1]).substring(6, 8);
  let b = hex(rgba[2]).substring(6, 8);
  let a = hex(rgba[3]).substring(6, 8);
  // console.log(r, g, b, a);
  return "#" + r + g + b + a;
}

/** Push the current canvs to the buffer */
function storeCurrentProcess() {
  let currentProcess = canvas.matrix();
  if (!equal(currentProcess, buffer[buffer.length - 1])) {
    while (buffer.length >= maxBufferSize) {
      buffer.splice(0, 1);
    }
    // Push the current canvas to the buffer
    append(buffer, currentProcess);
    console.log(buffer);

    // Update currentBufferIndex
    currentBufferIndex = buffer.length - 1;

    // Save changes to local storage
    saveCurrentCanvas();
  }
}

/** Go to the next step (if any) */
function goToNextStep() {
  console.log(currentBufferIndex);
  if (currentBufferIndex + 1 < buffer.length) {
    currentBufferIndex++;
    let nextStep = buffer[currentBufferIndex];
    canvas.restore(nextStep);
  }
}

/** Goes back to the last step (if any) */
function restoreLastStep() {
  console.log(currentBufferIndex);
  if (currentBufferIndex - 1 >= 0) {
    currentBufferIndex--;
    let lastStep = buffer[currentBufferIndex];
    canvas.restore(lastStep);
  }
}

/** Store the current canvas locally */
function saveCurrentCanvas() {
  window.localStorage.setItem("currentCanvas", canvas.matrix());
}

/** Get local canvas */
function getCurrentCanvas() {
  return window.localStorage.getItem("currentCanvas");
}

/** Restore local canvas */
function restoreCurrentCanvas() {
  let savedCanvas = getCurrentCanvas();
  if (savedCanvas) {
    let currentCanvas = savedCanvas.split(",");
    if (currentCanvas) {
      let matrix = [];
      for (let i = 0; i < canvas.row; i++) {
        matrix[i] = [];
        for (let j = 0; j < canvas.col; j++) {
          append(matrix[i], currentCanvas[i * canvas.col + j]);
        }
      }
      canvas.restore(matrix);
    }
  }
}

/** Checks if 2 matrices equal to each other */
function equal(m0, m1) {
  if (m0 && m1) {
    for (let i = 0; i < m0.length; i++) {
      for (let j = 0; j < m0.length; j++) {
        if (m0[i][j] != m1[i][j]) return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
