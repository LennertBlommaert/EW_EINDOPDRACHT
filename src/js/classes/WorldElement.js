export default class WorldElement {
  constructor({geom, mats, position}) {
    this.scaleFactor = 100;
    this.scaleFactorIncreasement = 1;

    this.geom = geom;
    this.mats = mats;
    this.position = position;


    this._constructMesh();
    this._getAnimations();

    this.animateGrowth();
  }

  _constructMesh = () => {
    this.mesh = new THREE.Mesh(this.geom, this.mats);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
  }

  _getAnimations = () => {
    this.mixer = new THREE.AnimationMixer(this.mesh);
    this.clip = this.mesh.geometry.animations[0];
    // this.clip = THREE.AnimationClip.createFromMorphTargetSequence(this.geom.morphTargets, 30);
    // this.mixer.clipAction(this.clip).setDuratation(5).play();
    console.log(this.clip);

  }

  toggleMeshVisibility = () => this.mesh.visible = !this.mesh.visible;

  animateGrowth = () => {
    if (!this.mesh.visible) this.toggleMeshVisibility;
    this.mixer.clipAction(this.clip).play();
    window.requestAnimationFrame(this.animateGrowth);




    // this.scaleFactor += this.scaleFactorIncreasement;
    // this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
    //
    // if (this.scaleFactor < 100) {
    //   window.requestAnimationFrame(this.animateGrowth);
    // }
  }

  animateShrink = () => {
    // this.scaleFactor -= this.scaleFactorIncreasement;
    // this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
    // if (this.scaleFactor > 1) {
    //   window.requestAnimationFrame(this.animateShrink);
    // } else {
    //   this.toggleMeshVisibility();
    // }
  }
}
