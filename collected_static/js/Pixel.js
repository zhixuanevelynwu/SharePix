/** Defines the Pixel object */
// Represents each pixel inside the canvas
class Pixel {
  constructor(color, w, h, x, y) {
    this.color = color;
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
  }

  /** Draws the current pixel */
  drawSelf() {
    push();
    if (showGrids) stroke(255);
    else stroke(color(this.color));

    if (this.mouseInGrid() && inCanvas(mouseX, mouseY)) {
      // Update color state here
      if (toggleDraw) {
        if (currentState == STATE_PAINT) this.color = currentColor;
        else if (currentState == STATE_ERASE) this.color = blankColor;
      }
    }
    fill(color(this.color));

    rect(this.x, this.y, this.w, this.h);
    pop();
  }

  /** Checks if mouse is inside a grid */
  mouseInGrid() {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    );
  }
}
