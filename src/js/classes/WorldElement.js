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
    this.clock = new THREE.Clock();

    this.growMorphTargs = this.mesh.geometry.morphTargets.filter(morphTarget => morphTarget.name.startsWith(`grow_`));
    this.growthClip = THREE.AnimationClip.CreateFromMorphTargetSequence(`grow_`, this.growMorphTargs, 60, true);
    this.growthAction = this.mixer.clipAction(this.growthClip);
    console.log(this.growMorphTargs);
    this.growthAction.setLoop(THREE.LoopOnce);
    this.growthAction.clampWhenFinished = true;

    this.wiggleMorphTargs = this.mesh.geometry.morphTargets.filter(morphTarget => morphTarget.name.startsWith(`wiggle_`));
    this.wiggleClip = THREE.AnimationClip.CreateFromMorphTargetSequence(`wiggle_`, this.wiggleMorphTargs, 60, false);
    this.wiggleAction = this.mixer.clipAction(this.wiggleClip);
    this.wiggleAction.setLoop(THREE.LoopRepeat);
    this.wiggleAction.clampWhenFinished = false;
    // this.wiggleAction.timeScale = .1;
    //
    // this.shrinkMorphTargs = this.mesh.geometry.morphTargets.filter(morphTarget => morphTarget.name.startsWith(`shrink_`));
    // this.shrinkClip = THREE.AnimationClip.CreateFromMorphTargetSequence(`shrink_`, this.shrinkMorphTargs, 60, false);
    // this.shrinkAction = this.mixer.clipAction(this.shrinkClip);
    // this.shrinkAction.setLoop(THREE.LoopOnce);
    // this.shrinkAction.clampWhenFinished = true;
  }

  toggleMeshVisibility = () => this.mesh.visible = !this.mesh.visible;

  animateGrowth = () => {

    this.growthAction.play();
    if (this.wiggleClip) {
      this.growthAction.crossFadeTo(this.wiggleAction, 5, true);
    }


    window.requestAnimationFrame(() => this.updateAnimationMixer());
  }

  animateWiggle = () => {
    this.wiggleAction.play();
    window.requestAnimationFrame(() => this.updateAnimationMixer());
  }

  animateShrink = () => {

    // this.shrinkAction.play();
    // if (this.wiggleClip) {
    //   this.shrinkAction.crossFadeFrom(this.wiggleAction, 5, true);
    // }

    window.requestAnimationFrame(() => this.updateAnimationMixer());

  }

  updateAnimationMixer = () => {
    this.mixer.update(this.clock.getDelta());

    if (this.growthAction.isRunning()) {

      window.requestAnimationFrame(() => this.updateAnimationMixer());

    } else {
      if (this.wiggleClip) {
        this.animateWiggle();
      }
    }

    if (!this.mesh.visible) this.toggleMeshVisibility();
  }

}
