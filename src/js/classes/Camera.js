export default class Camera extends THREE.PerspectiveCamera {
  constructor({aspectRatio = 1, fieldOfView = 60, near = 1, far = 1000, x = 0, y = 60, z = 0}) {
    super(fieldOfView, aspectRatio, near, far);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }

  //NOT IN USE
  rotate(angle = 0.005) {
    this.rotation.y -= angle;
    //console.log(angle);
  }
}
