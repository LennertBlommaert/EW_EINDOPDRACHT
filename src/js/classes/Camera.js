export default class Camera extends THREE.PerspectiveCamera {
  constructor({aspectRatio = 1, fieldOfView = 100, near = 1, far = 2000, x = 0, y = 100, z = 0}) {
    super(fieldOfView, aspectRatio, near, far);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    //this.rotation.x = 1;
    this.rotation.y = - 1;
    this.castShadow = true;

    this.pointLight = new THREE.PointLight(0xffffff);
    this.pointLight.position.set(1, 1, 2);
    this.add(this.pointLight);

    //this.moveYAddition = 0.15;
    this.moveYTarget = 70;
    this.easing = 0.001;

    console.log(this.position);
  }

  moveY() {
    //this.position.y += this.moveYAddition;

    const dy = this.moveYTarget - this.position.y;
    this.position.y += dy * this.easing;
  }

  toggleMoveYDirection() {
    //this.moveYAddition = - this.moveYAddition;

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
    //console.log(angle);
  }
}
