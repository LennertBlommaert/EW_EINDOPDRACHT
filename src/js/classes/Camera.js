export default class Camera extends THREE.PerspectiveCamera {
  constructor({aspectRatio = 1, fieldOfView = 60, near = 1, far = 1000}) {
    super(fieldOfView, aspectRatio, near, far);
    this.position.x = 0;
    this.position.y = 100;
    this.position.z = 200;
  }
}
