/*

  NOTE: NOT USED

*/

//import ShortcutVisualisation from './ShortcutVisualisation';

export default class Mouse {
  constructor() {
    window.addEventListener(`mousemove`, e => this.handleMouseMove(e));
    this.pos = {};
    this.shiftPos = {};
    this.ctrlPos = {};
    this.altPose = {};
    //this.shortcutVisualisation = new ShortcutVisualisation();
  }

  handleMouseMove = e => {
    const {x = e.clientX, y = e.clientY, shiftKey, ctrlKey, altKey, metaKey} = e;

    if (shiftKey) return this.handleMouseMoveWithShiftKey(x, y);
    if (ctrlKey) return this.handleMouseMoveWithControlKey(x, y);
    if (altKey) return this.handleMouseMoveWithAltKey(x, y);
    if (metaKey) return this.handleMouseMoveWithMetaKey(x, y);
  };

  handleMouseMoveWithShiftKey = (x, y) => {
    this.shiftPos.x = x;
    this.shiftPos.y = y;
  };
  handleMouseMoveWithControlKey = (x, y) => {
    this.ctrlPos.x = x;
    this.ctrlPos.y = y;
  }
  handleMouseMoveWithAltKey = (x, y) => {
    this.altPos.x = x;
    this.altPos.y = y;
  }
  handleMouseMoveWithMetaKey = (x, y) => {
    this.metaPos.x = x;
    this.metaPos.y = y;
  }
}
