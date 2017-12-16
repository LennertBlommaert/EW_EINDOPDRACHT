import Cloud from '../classes/Cloud';
import Tree from '../classes/Tree';
import Rock from '../classes/Rock';
import Mushroom from '../classes/Mushroom';
import Evergreen from '../classes/Evergreen';
import Flower from '../classes/Flower';
import Colors from '../objects/Colors';
import Particles from '../classes/Particles';
import Constants from '../objects/Constants';

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

    this.trees = [];
    this.clouds = [];
    this.rocks = [];
    this.mushrooms = [];
    this.evergreens = [];
    this.flowers = [];

    window.setInterval(this.shrinkChildren, Constants.SCENE_SHRINK_CHILDREN_INTERVAL);

  }

  addLights = () => {
    this.hemisphereLight = new THREE.HemisphereLight(this.skyColor, this.groundColor);
    this.shadowLight = this.createShadowLight();
    this.add(this.hemisphereLight);
    this.add(this.shadowLight);
  }

  createShadowLight = () => {
    const shadowLight = new THREE.DirectionalLight(Colors.sun, Constants.SCENE_SHADOWLIGHT_INTENSITY);
    // const shadowLight = new THREE.SpotLight(0xffffff, .9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;

    // Define visible area of projected shadowLight
    shadowLight.shadow.camera.left = - 400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = - 400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    return shadowLight;
  }

  moveShadowLight = () => {}

  addTerrain = () => {
    const terrain = THREE.Terrain({
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

    terrain.name = `Terrain`;

    // NO EFFECT
    terrain.children[0].receiveShadow = true;
    terrain.children[0].castShadow = true;
    terrain.receiveShadow = true;
    terrain.castShadow = true;

    // NO EFFECT
    // terrain.geometry.computeFaceNormals();
    // terrain.geometry.computeVertexNormals();

    this.add(terrain);
  }

  manipulateWorldOnNote = (note = 0, positionVector = new THREE.Vector3(0, 0, 0)) => {

    if (note === 0) {
      return this.raiseTerrain(Constants.SCENE_TERRIAN_DIMENSION / 4, 5);
    }

    this.createObjectOnNote(note, positionVector);
  };

  createObjectOnNote = (note = 0, positionVector = new THREE.Vector3(0, 0, 0)) => {
    // W/Z on keyboard
    console.log(note);

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

  addParticles = () => {
    this.particles = new Particles();
    this.add(this.particles.particleSystem);
  };

  createCloud = positionVector => {
    const deadCloud = this.clouds.find(cloud => cloud.mesh.visible === false);
    if (deadCloud) {
      //NOTE: Should be worldElement.animateGrowth();
      //But resusing same (unlooped) actions is very bugy
      //Look back into another timeScale
      //currently overwriting al actions
      return deadCloud.setupAnimations();
    }

    const newCloud = new Cloud(this.loadedData.cloudData[0], this.loadedData.cloudData[1], positionVector);
    this.clouds.push(newCloud);

    this.add(newCloud.mesh);

    return newCloud;
  };

  createRock = positionVector => {
    const deadRock = this.rocks.find(rock => rock.mesh.visible === false);
    if (deadRock) {
      //NOTE: Should be worldElement.animateGrowth();
      //But resusing same (unlooped) actions is very bugy
      //Look back into another timeScale
      //currently overwriting al actions
      return deadRock.setupAnimations();
    }

    const newRock = new Rock(this.loadedData.rockData[0], this.loadedData.rockData[1], positionVector);
    this.rocks.push(newRock);

    this.add(newRock.mesh);

    return newRock;
  };

  createMushroom = positionVector => {
    const deadMushroom = this.mushrooms.find(mushroom => mushroom.mesh.visible === false);
    if (deadMushroom) {
      //NOTE: Should be worldElement.animateGrowth();
      //But resusing same (unlooped) actions is very bugy
      //Look back into another timeScale
      //currently overwriting al actions
      return deadMushroom.setupAnimations();
    }

    const newMushroom = new Mushroom(this.loadedData.mushroomData[0], this.loadedData.mushroomData[1], positionVector);
    this.mushrooms.push(newMushroom);

    this.add(newMushroom.mesh);

    return newMushroom;
  };

  createTree = positionVector => {

    const deadTree = this.trees.find(tree => tree.mesh.visible === false);
    if (deadTree) {
      //NOTE: Should be worldElement.animateGrowth();
      //But resusing same (unlooped) actions is very bugy
      //Look back into another timeScale
      //currently overwriting al actions
      return deadTree.setupAnimations();
    }

    const newTree = new Tree(this.loadedData.treeData[0], this.loadedData.treeData[1], positionVector);
    this.trees.push(newTree);

    this.add(newTree.mesh);

    return newTree;
  }

  createEvergreen = positionVector => {

    const deadEvergreen = this.evergreens.find(evergreen => evergreen.mesh.visible === false);
    if (deadEvergreen) {
      //NOTE: Should be worldElement.animateGrowth();
      //But resusing same (unlooped) actions is very bugy
      //Look back into another timeScale
      //currently overwriting al actions
      return deadEvergreen .setupAnimations();
    }

    const newEvergreen = new Evergreen(this.loadedData.evergreenData[0], this.loadedData.evergreenData[1], positionVector);
    this.evergreens.push(newEvergreen);

    this.add(newEvergreen.mesh);

    return newEvergreen;
  }

  createFlower = positionVector => {

    const deadFlower = this.flowers.find(flower => flower.mesh.visible === false);
    if (deadFlower) {
      //NOTE: Should be worldElement.animateGrowth();
      //But resusing same (unlooped) actions is very bugy
      //Look back into another timeScale
      //currently overwriting al actions
      return deadFlower .setupAnimations();
    }

    const newFlower = new Flower(this.loadedData.flowerData[0], this.loadedData.flowerData[1], positionVector);
    this.flowers.push(newFlower);

    this.add(newFlower.mesh);

    return newFlower;
  }

  raiseTerrain = (distanceFromCamera = 0, increasement = 10) => {

    //WHEN USING THREE.Terrain
    const terrainGeom = this.getObjectByName(`Terrain`).children[0].geometry;

    terrainGeom.vertices.forEach(v => {
      if (v.x > distanceFromCamera || v.x < - distanceFromCamera) {
        v.z += increasement - Math.random() * (increasement * 4 / 5) + (Math.abs(v.x) - distanceFromCamera) / 50;
      }


      if (v.y > distanceFromCamera || v.y < - distanceFromCamera) {
        v.z += increasement - Math.random() * (increasement * 4 / 5)  + (Math.abs(v.y) - distanceFromCamera) / 50;
      }

      // if (v.x > distanceFromCamera) {
      //   v.z += increasement - Math.random() * (increasement * 4 / 5) + (v.x - distanceFromCamera) / 20;
      // }
    });

    terrainGeom.verticesNeedUpdate = true;

    terrainGeom.computeFaceNormals();
    terrainGeom.computeVertexNormals();
  }

  lowerTerrain = (distanceFromCamera = 0, lowerSubstraction = 0.4) => {
    //WHEN USING THREE.Terrain
    const terrainGeom = this.getObjectByName(`Terrain`).children[0].geometry;

    //const terrainGeom = this.getObjectByName(`Terrain`).geometry;

    terrainGeom.vertices.forEach(v => {
      // if (v.z >= 0 && (v.x > distanceFromCamera || v.x < - distanceFromCamera || v.y > distanceFromCamera || v.y < - distanceFromCamera)) {
      //   v.z -= lowerSubstraction;
      // }

      if (v.z >= 0 && (v.x > distanceFromCamera || v.x < - distanceFromCamera)) {
        // v.z -= (lowerSubstraction + (Math.abs(v.x) - distanceFromCamera) / 200);
        v.z -= lowerSubstraction;
      }

      if (v.z >= 0 && (v.y > distanceFromCamera || v.y < - distanceFromCamera)) {
        // v.z -= (lowerSubstraction + (Math.abs(v.y) - distanceFromCamera) / 200);
        v.z -= lowerSubstraction;
      }

      // if (v.z >= 0 && v.x > distanceFromCamera) {
      //   v.z -= (lowerSubstraction + (v.x - distanceFromCamera) / 10);
      // }
    });

    terrainGeom.verticesNeedUpdate = true;

    terrainGeom.computeFaceNormals();
    terrainGeom.computeVertexNormals();
  }

  updateAnimationMixerWorldElements = () => {
    const deltaSeconds = this.clock.getDelta();

    this.trees.forEach(tree => {
      tree.updateAnimationMixer(deltaSeconds);
    });
    this.clouds.forEach(cloud => cloud.updateAnimationMixer(deltaSeconds));
    this.rocks.forEach(rock => rock.updateAnimationMixer(deltaSeconds));
    this.mushrooms.forEach(mushroom => mushroom.updateAnimationMixer(deltaSeconds));
    this.evergreens.forEach(evergreen => evergreen.updateAnimationMixer(deltaSeconds));
    this.flowers.forEach(flower => flower.updateAnimationMixer(deltaSeconds));
  }

  emptyScene = () => {

    while (this.children.length > 0) {
      this.removeChild(this.children[0]);
    }

    this.addLights();
    this.addTerrain();
  }

  shrinkChildren = () => {

    // "POOLING" possibility?
    const livingTree = this.trees.find(tree => tree.mesh.visible === true);
    if (livingTree) livingTree.animateShrink();

    const livingCloud = this.clouds.find(cloud => cloud.mesh.visible === true);
    if (livingCloud) livingCloud.animateShrink();

    const livingMushroom = this.mushrooms.find(mushroom => mushroom.mesh.visible === true);
    if (livingMushroom) livingMushroom.animateShrink();

    const livingRock = this.rocks.find(rock => rock.mesh.visible === true);
    if (livingRock) livingRock.animateShrink();

    const livingEvergreen = this.evergreens.find(evergreen => evergreen.mesh.visible === true);
    if (livingEvergreen) livingEvergreen.animateShrink();

    const livingFlower = this.flowers.find(flower => flower.mesh.visible === true);
    if (livingFlower) livingFlower.animateShrink();

  }

  removeChild = child => {
    child.children.forEach(block => {
      block.material.dispose();
      block.geometry.dispose();
    });
    this.remove(child);
  }

  inflateLastChild = (scaleIncreasement = 1) => {
    //work with pushed notes.length
    const lastChild = this.children[this.children.length - 1];

    if (lastChild.type !== `Mesh`) return;

    lastChild.scale.x += scaleIncreasement;
    lastChild.scale.y += scaleIncreasement;
    lastChild.scale.z += scaleIncreasement;
  }

  inflateLastChildren = (numberToInflate, scaleIncreasement = 2) => {
    const lastChilds = this.children.slice(this.children.length - numberToInflate);

    lastChilds.forEach(child => {
      if (child.type !== `Mesh`) return;

      if (child.scale.x <= 200) {
        child.scale.x += scaleIncreasement - (child.scale.x / 100);
        child.scale.y += scaleIncreasement - (child.scale.x / 100);
        child.scale.z += scaleIncreasement - (child.scale.x / 100);
      }
    });
  }
}
