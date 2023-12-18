/** Get useful html elements */
let palette_container = document.querySelector("#palette-container");
let saved_color_container = document.querySelector(
  "#palette-container > #saved-color-container"
);
let color_input = document.querySelector(
  "#color-input-container > #color-input"
);

function updateColor() {
  let v = color_input.value;
  setCurrentColor(v);
}
