export default class WorldElement {
  constructor({geom, mats, position}) {
    this.scaleFactor = 100;
    this.scaleFactorIncreasement = 1;

    this.geom = geom;
    this.mats = mats;
    this.position = position;

    this._constructMesh();
    this._setupAnimations();

    this.animateGrowth();
  }

  _constructMesh = () => {
    this.mesh = new THREE.Mesh(this.geom, this.mats);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
  }

  _setupAnimations = () => {
    this.mixer = new THREE.AnimationMixer(this.mesh);
    this.clips = this.mesh.geometry.animations;
    console.log(this.clips);
    this.clock = new THREE.Clock();

    // this.clip = this.mesh.geometry.animations[0];
    // this.clip = THREE.AnimationClip.createFromMorphTargetSequence(this.geom.morphTargets, 30);
    // this.mixer.clipAction(this.clip).setDuratation(5).play();
  }

  toggleMeshVisibility = () => this.mesh.visible = !this.mesh.visible;

  animateGrowth = () => {
    if (!this.mesh.visible) this.toggleMeshVisibility;

    this.clip = THREE.AnimationClip.findByName(this.clips, `animation_`);
    this.action = this.mixer.clipAction(this.clip);
    this.action.clampWhenFinished = true;
    this.action.play();

    window.requestAnimationFrame(() => this.updateAnimationMixer());

    // this.scaleFactor += this.scaleFactorIncreasement;
    // this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
    //
    // if (this.scaleFactor < 100) {
    //   window.requestAnimationFrame(this.animateGrowth);
    // }
  }

  updateAnimationMixer = () => {
    this.mixer.update(this.clock.getDelta());

    if (this.action.isRunning()) {
      window.requestAnimationFrame(() => this.updateAnimationMixer());
    }
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
