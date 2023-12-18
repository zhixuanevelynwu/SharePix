/** Set all global variables */
/** Canvas global instance */
let c;
let canvas;

/** Current selections */
// Default to paint brush
let currentState = 0;
// Current selected color
let currentColor = "#FF8A8AFF";
// Toggle draw
let toggleDraw = false;
// Toggle display grids
let showGrids = true;

/** Define default color values */
// The "transparent color"
// Pixels are default to this color when initialized
// And set back to this color when erased
let blankColor = "#E4E4E4FF";

/** Assets */
let cursorArrow;

/** Stores the last several steps of the canvas */
let maxBufferSize = 5;
let currentBufferIndex = 0;
let buffer = [];

/** Frame count */
let frame = 0;
