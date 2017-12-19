import Constants from '../../objects/Constants';

export default class Camera extends THREE.PerspectiveCamera {
  constructor({aspectRatio = Constants.CAMERA_ASPECTRATIO, fieldOfView = Constants.CAMERA_FIELD_OF_VIEW, near = Constants.CAMERA_NEAR, far = Constants.CAMERA_FAR, x = Constants.CAMERA_POSITION.x, y = Constants.CAMERA_POSITION.y, z = Constants.CAMERA_POSITION.z}) {
    super(fieldOfView, aspectRatio, near, far);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.rotation.x = 1;
    this.rotation.y = - 1;
    this.castShadow = true;

    this.pointLight = new THREE.PointLight(0xffffff);
    this.pointLight.position.set(1, 1, 2);
    this.add(this.pointLight);

    //this.moveYAddition = 0.15;
    this.moveYTarget = 70;
    this.moveYEasing = 0.001;
  }

  moveY() {
    const dy = this.moveYTarget - this.position.y;
    this.position.y += dy * this.moveYEasing;
  }

  toggleMoveYDirection() {
    if (this.moveYTarget === 70) return this.moveYTarget = 1;
    this.moveYTarget = 70;
  }

  bounce() {
    if (this.position.y < 5) return;
    this.position.y -= 4;
    window.requestAnimationFrame(() => this.moveUp());
  }

  //NOT IN USE
  rotate(angle = 0.005) {
    this.rotation.y -= angle;
  }
}
