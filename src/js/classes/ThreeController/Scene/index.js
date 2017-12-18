import Cloud from './Cloud';
import Tree from './Tree';
import Rock from './Rock';
import Mushroom from './Mushroom';
import Evergreen from './Evergreen';
import Flower from './Flower';
import Particles from './Particles';

import Colors from '../../../objects/Colors';
import Constants from '../../../objects/Constants';

export default class Scene extends THREE.Scene {

  constructor({skyColor = Colors.sky, groundColor = Colors.grass, fogNear = Constants.SCENE_FOG_NEAR, fogFar = Constants.SCENE_FOG_FAR, loadedData = []}) {
    super();
    this.loadedData = loadedData;
    this.groundColor = groundColor;
    this.skyColor = skyColor;
    this.fog = new THREE.Fog(this.skyColor, fogNear, fogFar);
    this.addLights();
    this.addTerrain();
    this.addParticles();
    this.clock = new THREE.Clock();

    this.background = new THREE.Color(this.skyColor);

    this.worldElements = [];

    this.shadowLightAngle = 0;

    window.setInterval(() => this.shrinkChildren(), Constants.SCENE_SHRINK_CHILDREN_INTERVAL);

  }

  addLights() {
    this.hemisphereLight = new THREE.HemisphereLight(this.skyColor, this.groundColor);
    this.createShadowLight();
    this.add(this.hemisphereLight);
  }

  createShadowLight() {
    this.shadowLight = new THREE.DirectionalLight(Colors.sun, Constants.SCENE_SHADOWLIGHT_INTENSITY);
    //this.shadowLight = new THREE.SpotLight(0xffffff, .9);
    this.shadowLight.position.set(200, 800, 500);
    this.shadowLight.target.position.set(0, 0, 0);
    this.shadowLight.castShadow = true;
    this.shadowLight.shadowCameraVisible = true;

    // Define visible area of projected this.shadowLight
    this.shadowLight.shadow.camera.left = - 700;
    this.shadowLight.shadow.camera.right = 700;
    this.shadowLight.shadow.camera.top = 300;
    this.shadowLight.shadow.camera.bottom = - 700;
    this.shadowLight.shadow.camera.near = 1;
    this.shadowLight.shadow.camera.far = 2000;

    this.shadowLight.shadow.mapSize.width = 2000;
    this.shadowLight.shadow.mapSize.height = 2000;

    this.add(this.shadowLight);

    // this.helper = new THREE.CameraHelper(this.shadowLight.shadow.camera);
    // this.add(this.helper);
  }

  moveShadowLight() {
    this.shadowLightAngle += 0.01;

    this.shadowLight.position.x = 200 + 20 * Math.cos(this.shadowLightAngle);
    this.shadowLight.position.z = 500 + 20 * Math.sin(this.shadowLightAngle);
  }

  addTerrain() {
    this.terrain = THREE.Terrain({
      name: `Terrain`,
      easing: THREE.Terrain.Linear,
      frequency: 2.5,
      heightmap: THREE.Terrain.PerlinDiamond,
      material: new THREE.MeshPhongMaterial({color: this.groundColor, flatShading: true, shininess: 0}),
      maxHeight: 15,
      minHeight: - 15,
      steps: 1,
      useBufferGeometry: false,
      xSegments: Constants.SCENE_XSEGMENTS,
      xSize: Constants.SCENE_TERRIAN_DIMENSION,
      ySegments: Constants.SCENE_TERRIAN_YSEGMENTS,
      ySize: Constants.SCENE_TERRIAN_DIMENSION,
    });

    this.terrain.name = `Terrain`;

    // NO EFFECT
    this.terrain.children[0].receiveShadow = true;
    this.terrain.children[0].castShadow = true;
    this.terrain.receiveShadow = true;
    this.terrain.castShadow = true;

    // NO EFFECT
    // this.terrain.geometry.computeFaceNormals();
    // this.terrain.geometry.computeVertexNormals();

    this.add(this.terrain);
  }

  manipulateWorldOnNote(note = 0, positionVector = new THREE.Vector3(0, 0, 0)) {

    if (note === 0) {
      return this.raiseTerrain(Constants.SCENE_TERRIAN_DIMENSION / 4, 5);
    }

    this.createObjectOnNote(note, positionVector);
  }

  createObjectOnNote(note = 0, positionVector = new THREE.Vector3(0, 0, 0)) {

    if (note === 2) {
      return this.createTree(positionVector);
    }

    // E on keyboard
    if (note === 4) {
      return this.createCloud(positionVector);
    }

    // R on keyboard
    if (note === 5) {
      return this.createRock(positionVector);
    }

    // T on keyboard
    if (note === 7) {
      return this.createMushroom(positionVector);
    }

    // Y on keyboard
    if (note === 9) {
      return this.createEvergreen(positionVector);
    }

    // U on keyboard
    if (note === 11) {
      return this.createFlower(positionVector);
    }
  }

  addParticles() {
    this.particles = new Particles();
    this.add(this.particles.particleSystem);
  }

  createCloud(positionVector) {
    // NOTE: for object pooling - but animations are very buggy second run
    // const deadCloud = this.clouds.find(cloud => cloud.mesh.visible === false);
    // if (deadCloud) {
    //   //NOTE: Should be worldElement.animateGrowth();
    //   //But resusing same (unlooped) actions is very bugy
    //   //Look back into another timeScale
    //   //currently overwriting al actions
    //   return deadCloud.setupAnimations();
    // }

    const newCloud = new Cloud(this.loadedData.cloudData[0], this.loadedData.cloudData[1], positionVector);
    this.worldElements.push(newCloud);

    this.add(newCloud.mesh);

    return newCloud;
  }

  createRock(positionVector) {
    // NOTE: for object pooling - but animations are very buggy second run
    // const deadRock = this.rocks.find(rock => rock.mesh.visible === false);
    // if (deadRock) {
    //   return deadRock.setupAnimations();
    // }

    const newRock = new Rock(this.loadedData.rockData[0], this.loadedData.rockData[1], positionVector);
    this.worldElements.push(newRock);

    this.add(newRock.mesh);

    return newRock;
  }

  createMushroom(positionVector) {
    // NOTE: for object pooling - but animations are very buggy second run
    // const deadMushroom = this.mushrooms.find(mushroom => mushroom.mesh.visible === false);
    // if (deadMushroom) {
    //   return deadMushroom.setupAnimations();
    // }

    const newMushroom = new Mushroom(this.loadedData.mushroomData[0], this.loadedData.mushroomData[1], positionVector);
    this.worldElements.push(newMushroom);

    this.add(newMushroom.mesh);

    return newMushroom;
  }

  createTree(positionVector) {

    // NOTE: for object pooling - but animations are very buggy second run
    // const deadTree = this.trees.find(tree => tree.mesh.visible === false);
    // if (deadTree) {
    //   return deadTree.setupAnimations();
    // }

    const newTree = new Tree(this.loadedData.treeData[0], this.loadedData.treeData[1], positionVector);
    this.worldElements.push(newTree);

    this.add(newTree.mesh);

    return newTree;
  }

  createEvergreen(positionVector) {

    // NOTE: for object pooling - but animations are very buggy second run
    // const deadEvergreen = this.evergreens.find(evergreen => evergreen.mesh.visible === false);
    // if (deadEvergreen) {
    //   return deadEvergreen .setupAnimations();
    // }

    const newEvergreen = new Evergreen(this.loadedData.evergreenData[0], this.loadedData.evergreenData[1], positionVector);
    this.worldElements.push(newEvergreen);

    this.add(newEvergreen.mesh);

    return newEvergreen;
  }

  createFlower(positionVector) {

    // NOTE: for object pooling - but animations are very buggy second run
    // const deadFlower = this.flowers.find(flower => flower.mesh.visible === false);
    // if (deadFlower) {
    //   return deadFlower .setupAnimations();
    // }

    const newFlower = new Flower(this.loadedData.flowerData[0], this.loadedData.flowerData[1], positionVector);
    this.worldElements.push(newFlower);

    this.add(newFlower.mesh);

    return newFlower;
  }

  raiseTerrain(distanceFromCamera = 0, increasement = 10) {

    this.terrain.children[0].geometry.vertices.forEach(v => {
      if (v.x > distanceFromCamera || v.x < - distanceFromCamera) {
        v.z += increasement - Math.random() * (increasement * 4 / 5) + (Math.abs(v.x) - distanceFromCamera) / 50;
      }


      if (v.y > distanceFromCamera || v.y < - distanceFromCamera) {
        v.z += increasement - Math.random() * (increasement * 4 / 5)  + (Math.abs(v.y) - distanceFromCamera) / 50;
      }
    });

    this.terrain.children[0].geometry.verticesNeedUpdate = true;

    this.terrain.children[0].geometry.computeFaceNormals();
    this.terrain.children[0].geometry.computeVertexNormals();
  }

  lowerTerrain(distanceFromCamera = 0, lowerSubstraction = 0.4) {
    this.terrain.children[0].geometry.vertices.forEach(v => {

      if (v.z >= 0 && (v.x >= distanceFromCamera || v.x <= - distanceFromCamera)) {
        // v.z -= (lowerSubstraction + (Math.abs(v.x) + distanceFromCamera) / 200);
        v.z -= lowerSubstraction;
      }

      if (v.z >= 0 && (v.y >= distanceFromCamera || v.y <= - distanceFromCamera)) {
        v.z -= lowerSubstraction;
      }
    });

    this.terrain.children[0].geometry.verticesNeedUpdate = true;

    this.terrain.children[0].geometry.computeFaceNormals();
    this.terrain.children[0].geometry.computeVertexNormals();
  }

  updateAnimationMixerWorldElements() {
    const deltaSeconds = this.clock.getDelta();

    this.worldElements.forEach(tree => {
      tree.updateAnimationMixer(deltaSeconds);
    });
  }

  shrinkChildren() {
    if (this.worldElements.length <= 0) return;

    this.worldElements[0].animateShrink();

    window.setTimeout(() => {
      this.removeChild(this.worldElements[0].mesh);
      this.worldElements.shift();
    }, 2000);
  }

  // shrinkChildren() {
  //
  //   const livingTree = this.trees.find(tree => tree.mesh.visible === true);
  //   if (livingTree) livingTree.animateShrink();
  //
  //   const livingCloud = this.clouds.find(cloud => cloud.mesh.visible === true);
  //   if (livingCloud) livingCloud.animateShrink();
  //
  //   const livingMushroom = this.mushrooms.find(mushroom => mushroom.mesh.visible === true);
  //   if (livingMushroom) livingMushroom.animateShrink();
  //
  //   const livingRock = this.rocks.find(rock => rock.mesh.visible === true);
  //   if (livingRock) livingRock.animateShrink();
  //
  //   const livingEvergreen = this.evergreens.find(evergreen => evergreen.mesh.visible === true);
  //   if (livingEvergreen) livingEvergreen.animateShrink();
  //
  //   const livingFlower = this.flowers.find(flower => flower.mesh.visible === true);
  //   if (livingFlower) livingFlower.animateShrink();
  //
  // }

  emptyScene() {

    while (this.worldElements.length > 0) {
      this.removeChild(this.worldElements[0].mesh);
      this.worldElements.shift();
    }
  }

  removeChild(child) {

    if (child.children.length > 0) {
      child.children.forEach(block => {
        if (block.material) block.material.dispose();
        if (block.geometry) block.geometry.dispose();
      });
    }

    this.remove(child);
  }

  inflateLastChild(scaleIncreasement = 1) {
    //work with pushed notes.length
    const lastChild = this.children[this.children.length - 1];

    if (lastChild.type !== `Mesh`) return;

    lastChild.scale.x += scaleIncreasement;
    lastChild.scale.y += scaleIncreasement;
    lastChild.scale.z += scaleIncreasement;
  }

  inflateLastChildren(numberToInflate, scaleIncreasement = 2) {
    const lastChilds = this.children.slice(this.children.length - numberToInflate);

    lastChilds.forEach(child => {
      if (child.type !== `Mesh`) return;

      if (child.scale.x <= 300) {
        child.scale.x += scaleIncreasement - (child.scale.x / 100);
        child.scale.y += scaleIncreasement - (child.scale.x / 100);
        child.scale.z += scaleIncreasement - (child.scale.x / 100);
      }
    });
  }

  setLightsIntensities(x, y) {
    this.shadowLight.intensity = x;
    this.hemisphereLight.intensity = y;
  }
}
