import Cloud from '../classes/Cloud';
import Tree from '../classes/Tree';
import Colors from '../objects/Colors';

import Constants from '../objects/Constants';

import getRandomArbitrary from '../lib/getRandomArbitrary';


export default class Scene extends THREE.Scene {

  constructor({skyColor = Colors.sky, groundColor = Colors.grass, fogNear = 300, fogFar = 950, loadedData = []}) {
    super();
    this.loadedData = loadedData;
    this.groundColor = groundColor;
    this.skyColor = skyColor;
    this.fog = new THREE.Fog(this.skyColor, fogNear, fogFar);
    this.addLights();
    this.addTerrain();
    this.background = new THREE.Color(this.skyColor);

    this.trees = [];

    window.setInterval(this.removeChildren, 1500);

  }

  addLights = () => {
    this.hemisphereLight = new THREE.HemisphereLight(this.skyColor, this.groundColor);

    this.shadowLight = this.createShadowLight();

    this.add(this.hemisphereLight);
    this.add(this.shadowLight);
  }

  createShadowLight = () => {
    const shadowLight = new THREE.DirectionalLight(0xffffff, .5);
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

    const shadowCameraHelper = new THREE.CameraHelper(shadowLight.shadow.camera);
    this.add(shadowCameraHelper);

    return shadowLight;
  }

  moveShadowLight = () => {}

  addTerrain = () => {
    const xS = 63, yS = 63;
    const terrain = THREE.Terrain({
      name: `Terrain`,
      easing: THREE.Terrain.Linear,
      frequency: 2.5,
      heightmap: THREE.Terrain.DiamondSquare,
      material: new THREE.MeshPhongMaterial({color: this.groundColor, flatShading: true}),
      maxHeight: 10,
      minHeight: - 10,
      steps: 1,
      useBufferGeometry: false,
      xSegments: xS,
      xSize: 1024,
      ySegments: yS,
      ySize: 1024,
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

  createObjectOnNote = (note = 0) => {

    // A/Q key on keyboard
    //console.log(this.getObjectByName(`Terrain`));
    if (note === 60) {
      this.raiseTerrain();
    }

    // W/Z on keyboard
    if (note === 62) {
      this.addTree();
    }

    if (note === 69) {
      this.addCloud();
    }

    //console.log(this.getObjectByName(`Terrain`).minHeight);
  };


  addCloud = () => {
    const cloud = new Cloud();

    cloud.mesh.position.y = getRandomArbitrary(0, Constants.HEIGHT / 2);
    cloud.mesh.position.x = getRandomArbitrary(0, Constants.WIDTH / 2) - Constants.WIDTH / 2;

    cloud.mesh.position.z = - 400 - Math.random() * 400;

    const s = 1 + Math.random() * 2;
    cloud.mesh.scale.set(s, s, s);

    this.add(cloud.mesh);
  };

  addTree = () => {

    //LOOK FOR TREES THAT ALREADY EXIST BUT WERE SHRUNK
    const deadTree = this.trees.find(tree => tree.scaleFactor === 1);

    if (deadTree) return deadTree.animateGrowth();

    //IF NO SHRUNKEN TREES WERE FOUND, CREATE A NEW TREE
    const newTree = new Tree(this.loadedData.treeData[0]);

    this.trees.push(newTree);

    // console.log(`New tree mesh position y`, newTree.mesh.position.y);
    // console.log(`New tree mesh geometry vertices[0] y`, newTree.mesh.geometry.vertices[0].y);

    this.add(newTree.mesh);
  }

  raiseTerrain = (distanceFromCamera = 400, increasement = 5) => {

    //WHEN USING THREE.Terrain
    const terrainGeom = this.getObjectByName(`Terrain`).children[0].geometry;

    //const terrainGeom = this.getObjectByName(`Terrain`).geometry;

    terrainGeom.vertices.forEach(v => {
      if (v.x > distanceFromCamera || v.x < - distanceFromCamera || v.y > distanceFromCamera || v.y < - distanceFromCamera) {
        v.z += increasement - Math.random() * (increasement * 4 / 5);
      }
    });

    terrainGeom.verticesNeedUpdate = true;

    // Could be fix for shadow problem => no effect
    terrainGeom.computeFaceNormals();
    terrainGeom.computeVertexNormals();
  }

  lowerTerrain = (distanceFromCamera = 400) => {
    //WHEN USING THREE.Terrain
    const terrainGeom = this.getObjectByName(`Terrain`).children[0].geometry;

    //const terrainGeom = this.getObjectByName(`Terrain`).geometry;

    terrainGeom.vertices.forEach(v => {
      if (v.z >= 0 && (v.x > distanceFromCamera || v.x < - distanceFromCamera || v.y > distanceFromCamera || v.y < - distanceFromCamera)) {
        v.z -= 0.25;
      }
    });

    terrainGeom.verticesNeedUpdate = true;

    // Could be fix for shadow problem => no effect
    terrainGeom.computeFaceNormals();
    terrainGeom.computeVertexNormals();
  }

  emptyScene = () => {


    // while (this.children.length > 3) {
    //
    //   if (this.children[0].name !== `Terrain` || this.children[0].type !== `DirectionalLight` || this.children[0].type !== `HemisphereLight`) {
    //
    //     if (this.children[0].length) {
    //       this.children[0].children.forEach(c => {
    //         c.material.dispose();
    //         c.geometry.dispose();
    //       });
    //
    //     }
    //
    //     this.remove(this.children[0]);
    //   }

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

  removeChildren = () => {

    const cloud = this.getObjectByName(`Cloud`);
    if (cloud) this.removeChild(cloud);

    // "POOLING" possibility?
    const livingTree = this.trees.find(tree => tree.scaleFactor >= 100);
    if (livingTree) livingTree.animateShrink();

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
