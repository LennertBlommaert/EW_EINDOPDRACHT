export default class WorldElement {
  constructor({geom, mats, positionVector}) {
    this.scaleFactor = 100;
    this.scaleFactorIncreasement = 1;
    this.positionVector = positionVector;

    this.geom = geom;
    this.mats = mats;

    for (let i = 0;i < mats.length;i ++) {
      mats[i].morphTargets = true;
      mats[i].flatShading = THREE.FlatShading;
    }

    this.positionVector = positionVector;

    this._constructMesh();

    this.setupAnimations();

    this.toggleMeshVisibility();
  }

  _constructMesh = () => {
    this.mesh = new THREE.Mesh(this.geom, this.mats);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    //this.mesh.position.set(0, 0, 0);
    this.mesh.position.set(this.positionVector.x, this.positionVector.y, this.positionVector.z);
    this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
  }

  setupAnimations = () => {
    this.mixer = new THREE.AnimationMixer(this.mesh);

    this._setupGrowthAction();
    this._setupWiggleAction();
    this._setupShrinkAction();

    this.mixer.addEventListener(`finished`, e => this.onAnimationActionFinished(e));

    this.animateGrowth();
  }

  onAnimationActionFinished = e => {
    const {action} = e;

    if (action._clip.name === `grow`) this.animateWiggle();
    //WHEN WORKING WITH SET REPITIONS FOR WIGGLE
    //if (action._clip.name === `wiggle`) this.animateShrink();
    if (action._clip.name === `shrink`) this.resetAnimations();
  }

  _setupGrowthAction = () => {
    this.growMorphTargs = this.mesh.geometry.morphTargets.filter(morphTarget => morphTarget.name.startsWith(`grow_`));
    this.growthClip = THREE.AnimationClip.CreateFromMorphTargetSequence(`grow`, this.growMorphTargs, 25, true);
    this.growthAction = this.mixer.clipAction(this.growthClip);
    this.growthAction.setLoop(THREE.LoopOnce);
    this.growthAction.clampWhenFinished = true;
  }

  _setupWiggleAction = () => {
    this.wiggleMorphTargs = this.mesh.geometry.morphTargets.filter(morphTarget => morphTarget.name.startsWith(`wiggle_`));
    this.wiggleClip = THREE.AnimationClip.CreateFromMorphTargetSequence(`wiggle`, this.wiggleMorphTargs, 25, false);
    this.wiggleAction = this.mixer.clipAction(this.wiggleClip);
    this.wiggleAction.setLoop(THREE.LoopRepeat);
    //this.wiggleAction.repetitions = 12;
    this.wiggleAction.clampWhenFinished = true;
  }

  _setupShrinkAction = () => {
    this.shrinkMorphTargs = this.mesh.geometry.morphTargets.filter(morphTarget => morphTarget.name.startsWith(`shrink_`));
    this.shrinkClip = THREE.AnimationClip.CreateFromMorphTargetSequence(`shrink`, this.shrinkMorphTargs, 25, true);
    this.shrinkAction = this.mixer.clipAction(this.shrinkClip);
    this.shrinkAction.setLoop(THREE.LoopOnce);
    //this.shrinkAction.clampWhenFinished = true;
  }

  toggleMeshVisibility = () => this.mesh.visible = !this.mesh.visible;

  resetAnimations = () => {
    this.growthAction.enabled = false;
    this.wiggleAction.enabled = false;
    this.toggleMeshVisibility();
    this.shrinkAction.crossFadeTo(this.growthAction, 0, true);
    this.mixer.stopAllAction();
  }

  animateGrowth = () => {
    this.toggleMeshVisibility();
    this.growthAction.play();
  }

  animateWiggle = () => {
    this.growthAction.crossFadeTo(this.wiggleAction, .5, true);
    this.wiggleAction.play();
  }

  animateShrink = () => {
    this.wiggleAction.crossFadeTo(this.shrinkAction, .5, true);
    this.shrinkAction.play();
  }

  updateAnimationMixer = deltaSeconds => {
    if (!this.growthAction.isRunning() &&  !this.wiggleAction.isRunning() && !this.shrinkAction.isRunning()) return;
    this.mixer.update(deltaSeconds);
  }
}
