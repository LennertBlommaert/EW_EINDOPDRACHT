export default class WorldElement {
  constructor({geom, mats, position}) {
    this.scaleFactor = 100;
    this.scaleFactorIncreasement = 1;

    this.geom = geom;
    this.mats = mats;
    this.position = position;

    this._constructMesh();
    this.toggleMeshVisibility();

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
    console.log(`SETUP ANIMATIONS`);
    this.mixer = new THREE.AnimationMixer(this.mesh);
    //this.clips = this.mesh.geometry.animations;
    this.clock = new THREE.Clock();

    //this.clips = THREE.AnimationClip.CreateClipsFromMorphTargetSequences(`animation_`, this.mesh.geometry.morphTargets, 24, true);

    //this.growthClip = THREE.AnimationClip.findByName(this.clips, `animation_`);
    this.growthClip = THREE.AnimationClip.CreateFromMorphTargetSequence(`animation_`, this.mesh.geometry.morphTargets, 60, true);

    this.growthAction = this.mixer.clipAction(this.growthClip);
    this.growthAction.setLoop(THREE.LoopOnce);
    this.growthAction.clampWhenFinished = true;

    // this.clip = this.mesh.geometry.animations[0];
    // this.clip = THREE.AnimationClip.createFromMorphTargetSequence(this.geom.morphTargets, 30);
    // this.mixer.clipAction(this.clip).setDuratation(5).play();
  }

  toggleMeshVisibility = () => this.mesh.visible = !this.mesh.visible;

  animateGrowth = () => {
    this.growthAction.play();
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

    if (this.growthAction.isRunning()) {
      window.requestAnimationFrame(() => this.updateAnimationMixer());
    }

    if (!this.mesh.visible) this.toggleMeshVisibility();
  }

  animateShrink = () => {

    console.log(`WorldElement.js - Animate shrink`);

    // this.scaleFactor -= this.scaleFactorIncreasement;
    // this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
    // if (this.scaleFactor > 1) {
    //   window.requestAnimationFrame(this.animateShrink);
    // } else {
    //   this.toggleMeshVisibility();
    // }
  }
}
