/** Defines the Canvas object */
// A canvas object holds 32X32 grids
class Canvas {
  constructor(col = 32, row = 32) {
    this.col = col;
    this.row = row;
    this.gridW = width / col;
    this.gridH = height / row;

    // Initialize the canvas with a 2D array of blank grids
    this.grids = [];
    this.initializeCanvas();
  }

  /** Recursively expands until encoutering an enclosed area */
  fillNeighbors(row, col, origColor) {
    // Base case 0: Not in grid, return.
    if (this.outGrid(row, col)) {
      return;
    } else {
      let root = this.grids[row][col];

      // Base case 1: encountered another color. Stop expanding
      if (root.color != origColor) {
        return;
      }

      // Expand
      root.color = currentColor;
      this.fillNeighbors(row - 1, col, origColor);
      this.fillNeighbors(row, col - 1, origColor);
      this.fillNeighbors(row, col + 1, origColor);
      this.fillNeighbors(row + 1, col, origColor);
    }
  }

  /** Fills in an enclosed area */
  fill() {
    // Get root pixel information
    let row = min(max(0, Math.floor(mouseY / this.gridH)), this.row - 1);
    let col = min(max(0, Math.floor(mouseX / this.gridW)), this.col - 1);
    let root = this.grids[row][col];
    let origColor = root.color;

    // If the colors are the same there's no need to fill
    if (origColor == currentColor) return;
    else this.fillNeighbors(row, col, origColor);
  }

  /** Return a matrix representaion of the canvas */
  matrix() {
    let matrix = [];
    for (let i = 0; i < this.row; i++) {
      matrix[i] = [];
      for (let j = 0; j < this.col; j++) {
        append(matrix[i], this.grids[i][j].color);
      }
    }

    // console.log(JSON.stringify(matrix).length);
    return matrix;
  }

  /** Given an x,y index pair checks if it is out of bound */
  outGrid(row, col) {
    return row < 0 || row >= this.row || col < 0 || col >= this.col;
  }

  /** Draws the current canvas */
  drawSelf() {
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        this.grids[i][j].drawSelf();
      }
    }
  }

  /** Clears everything on canvas */
  clear() {
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        this.grids[i][j].color = blankColor;
      }
    }
  }

  /** Initializes the canvas */
  initializeCanvas() {
    for (let i = 0; i < this.row; i++) {
      this.grids[i] = [];
      for (let j = 0; j < this.col; j++) {
        append(
          this.grids[i],
          new Pixel(
            blankColor,
            this.gridW,
            this.gridH,
            this.gridW * j,
            this.gridH * i
          )
        );
      }
    }
  }

  restore(matrix) {
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        this.grids[i][j].color = matrix[i][j];
      }
    }
  }
}
