export default class WorldElement {
  constructor({geom, mats, positionVector}) {
    this.scaleFactor = 100;
    this.scaleFactorIncreasement = 1;
    this.positionVector = positionVector;
    console.log(positionVector);

    this.geom = geom;
    this.mats = mats;

    for (let i = 0;i < mats.length;i ++) {
      mats[i].morphTargets = true;
      mats[i].flatShading = THREE.FlatShading;
    }

    this.positionVector = positionVector;

    this._constructMesh();
    this.toggleMeshVisibility();

    this._setupAnimations();

    this.animateGrowth();

    this.wiggleAddition = 0.0025;
  }

  _constructMesh = () => {
    this.mesh = new THREE.Mesh(this.geom, this.mats);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.position.set(this.positionVector.x, this.positionVector.y, this.positionVector.z);
    console.log(this.mesh);
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
    //this.growthAction.repetitions = 0;
    //NOTE: Dirty fix with LoopPingPong, trying to pause the ping ponged animation at the right time
    this.growthAction.setLoop(THREE.LoopOnce);
    this.growthAction.clampWhenFinished = true;

    // this.clip = this.mesh.geometry.animations[0];
    // this.clip = THREE.AnimationClip.createFromMorphTargetSequence(this.geom.morphTargets, 30);
    // this.mixer.clipAction(this.clip).setDuratation(5).play();
  }

  toggleMeshVisibility = () => this.mesh.visible = !this.mesh.visible;

  animateGrowth = () => {
    // NOTE: adaption of best fix, causes element to snap away
    //this.growthAction.reset();

    this.growthAction.play();
    //this.growthAction.timeScale = 1;

    window.requestAnimationFrame(() => this.updateAnimationMixer());

    // this.scaleFactor += this.scaleFactorIncreasement;
    // this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
    //
    // if (this.scaleFactor < 100) {
    //   window.requestAnimationFrame(this.animateGrowth);
    // }
  }
  animateShrink = () => {

    // NOTE:
    //Is normally best fix, does only work while animation action is running
    //this.growthAction.play(); does not start animation action, because it only loops once
    //and has already reached its final state
    //this.growthAction.play();
    //this.growthAction.timeScale = - 1;

    // NOTE: adaption of best fix, causes element to snap away
    // this.growthAction.paused = false;
    // this.growthAction.play();
    // this.growthAction.timeScale = - 1;

    //NOTE: FOR DIRTY FIX WITH LoopPingPong
    //this.growthAction.paused = false;

    window.requestAnimationFrame(() => this.updateAnimationMixer());

      // this.scaleFactor -= this.scaleFactorIncreasement;
      // this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
      // if (this.scaleFactor > 1) {
      //   window.requestAnimationFrame(this.animateShrink);
      // } else {
      //   this.toggleMeshVisibility();
      // }
  }

  updateAnimationMixer = () => {
    this.mixer.update(this.clock.getDelta());

    if (this.growthAction.isRunning()) {

      //NOTE: FOR DIRTY FIX WITH LoopPingPong
      // if (parseFloat(this.growthAction.time).toFixed(1) === parseFloat(this.growthAction._clip.duration).toFixed(1) || parseFloat(this.growthAction.time).toFixed(1) === 0.1) {
      //   console.log(parseFloat(this.growthAction.time).toFixed(1));
      //   this.growthAction.paused = true;
      // }

      window.requestAnimationFrame(() => this.updateAnimationMixer());
    }

    if (!this.mesh.visible) this.toggleMeshVisibility();
  }

  wiggle() {

    this.mesh.rotation.x += this.wiggleAddition;

    if (this.mesh.rotation.x > Math.PI / 12 || this.mesh.rotation.x < - Math.PI / 12) this.wiggleAddition = - this.wiggleAddition;
  }

}
