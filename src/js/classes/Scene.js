import Cloud from '../classes/Cloud';
import Tree from '../classes/Tree';
import Rock from '../classes/Rock';
import Mushroom from '../classes/Mushroom';
import Colors from '../objects/Colors';
import Particles from '../classes/Particles';

//import Constants from '../objects/Constants';

export default class Scene extends THREE.Scene {

  constructor({skyColor = Colors.sky, groundColor = Colors.grass, fogNear = 300, fogFar = 950, loadedData = []}) {
    super();
    this.loadedData = loadedData;
    this.groundColor = groundColor;
    this.skyColor = skyColor;
    this.fog = new THREE.Fog(this.skyColor, fogNear, fogFar);
    this.addLights();
    this.addTerrain();
    this.addParticles();
    this.background = new THREE.Color(this.skyColor);

    this.trees = [];
    this.clouds = [];
    this.rocks = [];
    this.mushrooms = [];

    window.setInterval(this.shrinkChildren, 1500);

  }

  addLights = () => {
    this.hemisphereLight = new THREE.HemisphereLight(this.skyColor, this.groundColor);
    this.shadowLight = this.createShadowLight();
    this.add(this.hemisphereLight);
    this.add(this.shadowLight);
  }

  createShadowLight = () => {
    const shadowLight = new THREE.DirectionalLight(Colors.sun, .9);
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
    const xS = 63, yS = 63;
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
      xSegments: xS,
      xSize: 2200,
      ySegments: yS,
      ySize: 2200,
    });

    // const geometry = new THREE.PlaneGeometry(1024, 1024, 63, 63);
    // const material = new THREE.MeshBasicMaterial({color: 0x0B6623, side: THREE.DoubleSide, flatShading: true});
    // const terrain = new THREE.Mesh(geometry, material);
    // terrain.rotation.x = - Math.PI / 2;


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
  /*
  this.mesh.position.z = getRandomArbitrary(- 500, 500);
  this.mesh.position.x = getRandomArbitrary(- 500, 500);
  this.mesh.position.y = getRandomArbitrary(- 10, - 5);
  */
  manipulateWorldOnNote = (note = 0, positionVector = new THREE.Vector3(0, 0, 0)) => {

    // A/Q key on keyboard
    //console.log(this.getObjectByName(`Terrain`));
    if (note === 0) {
      return this.raiseTerrain(500, 5);
    }

    this.createObjectOnNote(note, positionVector);
  };

  createObjectOnNote = (note = 0, positionVector = new THREE.Vector3(0, 0, 0)) => {
    // W/Z on keyboard

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
  }

  addParticles = () => {
    this.particles = new Particles();
    this.add(this.particles.particleSystem);
  };

  createCloud = positionVector => {
    const deadCloud = this.clouds.find(cloud => cloud.scaleFactor === 1);
    if (deadCloud) return deadCloud.animateGrowth();

    const newCloud = new Cloud(this.loadedData.cloudData[0], this.loadedData.cloudData[1], positionVector);
    this.clouds.push(newCloud);

    this.add(newCloud.mesh);

    return newCloud;
  };

  createRock = positionVector => {
    const deadRock = this.rocks.find(rock => rock.scaleFactor === 1);
    if (deadRock) return deadRock.animateGrowth();

    const newRock = new Rock(this.loadedData.rockData[0], this.loadedData.rockData[1], positionVector);
    this.rocks.push(newRock);

    this.add(newRock.mesh);

    return newRock;
  };

  createMushroom = positionVector => {
    const deadMushroom = this.mushrooms.find(mushroom => mushroom.scaleFactor === 1);
    if (deadMushroom) return deadMushroom.animateGrowth();

    const newMushroom = new Mushroom(this.loadedData.mushroomData[0], this.loadedData.mushroomData[1], positionVector);
    this.mushrooms.push(newMushroom);

    this.add(newMushroom.mesh);

    return newMushroom;
  };

  createTree = positionVector => {
    const deadTree = this.trees.find(tree => tree.scaleFactor === 1);
    if (deadTree) return deadTree.animateGrowth();

    const newTree = new Tree(this.loadedData.treeData[0], this.loadedData.treeData[1], positionVector);
    this.trees.push(newTree);

    this.add(newTree.mesh);

    return newTree;
  }

  raiseTerrain = (distanceFromCamera = 0, increasement = 10) => {

    //WHEN USING THREE.Terrain
    const terrainGeom = this.getObjectByName(`Terrain`).children[0].geometry;

    //const terrainGeom = this.getObjectByName(`Terrain`).geometry;

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

  emptyScene = () => {

    while (this.children.length > 0) {
      this.children[0].children.forEach(c => {
        c.material.dispose();
        c.geometry.dispose();
      });

      this.remove(this.children[0]);
    }

    this.addLights();
    this.addTerrain();

  }

  brighten = () => {
    console.info(`BRIGHTEN THE WORLD UP`);
  }

  darken = () => {
    console.info(`DARKEN THE WORLD DOWN`);
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

    // const tree = this.getObjectByName(`Tree`);
    // if (tree) this.tree.removeChild(tree);

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

  //   this.children.forEach(child => {
  //     console.info(child.name, child.type);
  //     if (child.name !== `Terrain` || child.type !== `DirectionalLight` || child.type !== `HemisphereLight`) {
  //       child.children.forEach(c => {
  //         c.material.dispose();
  //         c.geometry.dispose();
  //       });
  //
  //       this.remove(child);
  //     }
  //   });
}
