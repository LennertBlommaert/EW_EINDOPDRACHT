export default class Controls extends THREE.OrbitControls {
  constructor({camera = {}, domElementClassName = `.world`, autoRotate = true}) {
    super(camera, document.querySelector(domElementClassName));

    this.autoRotate = autoRotate;
    this.keys = {
      LEFT: 37, //left arrow
      UP: 38, // up arrow
      RIGHT: 39, // right arrow
      BOTTOM: 40 // down arrow
    };
  }
}
