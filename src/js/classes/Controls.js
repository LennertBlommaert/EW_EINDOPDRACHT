export default class Controls extends THREE.OrbitControls {
  constructor({camera = {}, domElementClassName = `.world`}) {
    super(camera, document.querySelector(domElementClassName));

    //this.autoRotate = true;
    this.autoRotateSpeed = 10;

    this.keys = {
      LEFT: 37, //left arrow
      UP: 38, // up arrow
      RIGHT: 39, // right arrow
      BOTTOM: 40 // down arrow
    };
  }

  toggleAutorotate = () => {
    this.autoRotate = !this.autoRotate;
  }

  setAutorationSpeed = speed => {
    console.log(speed);
    this.autoRotateSpeed = speed;
  };
}
