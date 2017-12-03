export default class Controls extends THREE.OrbitControls {
  constructor({camera = {}, domElementClassName = `.world`}) {
    super(camera, document.querySelector(domElementClassName));

    this.autoRotate = true;

    this.keys = {
      LEFT: 37, //left arrow
      UP: 38, // up arrow
      RIGHT: 39, // right arrow
      BOTTOM: 40 // down arrow
    };
  }

  toggleAutorotate = () => {
    console.log(`alleez`);
    this.autoRotate = !this.autoRotate;
  }

  setAutorationSpeed = speed => {
    console.log(speed);
    this.autoRotateSpeed = speed;
  };
}
