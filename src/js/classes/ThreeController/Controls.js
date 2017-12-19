import Constants from '../../objects/Constants';

export default class Controls extends THREE.OrbitControls {
  constructor({
    camera = {},
    domElementClassName = `.world`,
    autoRotateSpeed = Constants.BPM / 40,
    maxPolarAngle = Constants.CONTROLS_MAX_POLAR_ANGLE,
    maxDistance = Constants.CONTROLS_MAX_DISTANCE,
    minDistance = Constants.CONTROLS_MIN_DISTANCE,
  }) {
    super(camera, document.querySelector(domElementClassName));

    this.autoRotate = true;
    this.autoRotateSpeed = autoRotateSpeed;

    this.enableDamping = true;

    this.maxPolarAngle = maxPolarAngle;

    this.maxDistance = maxDistance;

    this.minDistance = minDistance;

    this.enablePan = minDistance;

  }

  toggleAutorotate = () => {
    this.autoRotate = !this.autoRotate;
  }

  setAutorationSpeed = speed => this.autoRotateSpeed = speed;
}
