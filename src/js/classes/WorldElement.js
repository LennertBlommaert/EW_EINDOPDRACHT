export default class WorldElement {
  constructor({geom, mats, position}) {
    this.scaleFactor = 1;
    this.scaleFactorIncreasement = 1;

    this.geom = geom;
    this.mats = mats;
    this.position = position;


    this._constructMesh();

    this.animateGrowth();
  }

  _constructMesh = () => {
    this.mesh = new THREE.Mesh(this.geom, this.mats);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
  }

  toggleMeshVisibility = () => this.mesh.visible = !this.mesh.visible;

  animateGrowth = () => {
    if (!this.mesh.visible) this.toggleMeshVisibility;

    this.scaleFactor += this.scaleFactorIncreasement;
    this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);

    if (this.scaleFactor < 100) {
      window.requestAnimationFrame(this.animateGrowth);
    }
  }

  animateShrink = () => {
    this.scaleFactor -= this.scaleFactorIncreasement;
    this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
    if (this.scaleFactor > 1) {
      window.requestAnimationFrame(this.animateShrink);
    } else {
      this.toggleMeshVisibility();
    }
  }
}
