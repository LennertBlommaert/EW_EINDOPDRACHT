import Cloud from '../classes/Cloud';
import Airplane from '../classes/Airplane';

import Constants from '../objects/Constants';

import getRandomArbitrary from '../lib/getRandomArbitrary';


export default class Scene extends THREE.Scene {

  constructor({fogColor = 0xffffff, fogNear = 300, fogFar = 950}) {
    super();
    this.fog = new THREE.Fog(fogColor, fogNear, fogFar);
    this.addLights();
    this.addTerrain();
  }

  addLights = () => {
    this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    this.shadowLight = this.createShadowLight();

    this.add(this.hemisphereLight);
    this.add(this.shadowLight);
  }

  createShadowLight = () => {
    const shadowLight = new THREE.DirectionalLight(0xffffff, .9);
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

  moveShadowLight = () => {
  }

  addTerrain = () => {
    const xS = 63, yS = 63;
    const terrain = THREE.Terrain({
      name: `Terrain`,
      easing: THREE.Terrain.Linear,
      frequency: 2.5,
      heightmap: THREE.Terrain.DiamondSquare,
      material: new THREE.MeshBasicMaterial({color: 0x0B6623, flatShading: true}),
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

    console.log(terrain);

    // NO EFFECT
    terrain.children[0].receiveShadow = true;
    terrain.children[0].castShadow = true;
    terrain.receiveShadow = true;
    terrain.castShadow = true;

    // NO EFFECT
    // terrain.geometry.computeFaceNormals();
    // terrain.geometry.computeVertexNormals();

    this.add(terrain);

    console.log(this.getObjectByName(`Terrain`));
  }

  createObjectOnNote = (note = 0) => {

    if (note > 60) {
      this.createPlane();
    }

    // A key on keyboard

    //console.log(this.getObjectByName(`Terrain`));
    if (note === 60) {
      this.updateTerrain();
    }

    if (note < 60) {
      this.createCloud();
    }

    //console.log(this.getObjectByName(`Terrain`).minHeight);
  };


  createCloud = () => {
    const cloud = new Cloud();

    cloud.mesh.position.y = getRandomArbitrary(0, Constants.HEIGHT / 2);
    cloud.mesh.position.x = getRandomArbitrary(0, Constants.WIDTH / 2) - Constants.WIDTH / 2;

    cloud.mesh.position.z = - 400 - Math.random() * 400;

    const s = 1 + Math.random() * 2;
    cloud.mesh.scale.set(s, s, s);

    this.add(cloud.mesh);
  };



  createPlane = () => {
    const airplane = new Airplane();

    airplane.mesh.scale.set(.25, .25, .25);

    airplane.mesh.position.y = getRandomArbitrary(0, 50);
    airplane.mesh.position.z = getRandomArbitrary(0, 50);
    airplane.mesh.position.x = getRandomArbitrary(0, Constants.WIDTH / 2) - Constants.WIDTH / 4;

    this.add(airplane.mesh);

  }

  updateTerrain = (distanceFromCamera = 500) => {

    //WHEN USING THREE.Terrain
    const terrainGeom = this.getObjectByName(`Terrain`).children[0].geometry;

    //const terrainGeom = this.getObjectByName(`Terrain`).geometry;

    terrainGeom.vertices.forEach(v => {
      if (v.x > distanceFromCamera || v.x < - distanceFromCamera || v.y > distanceFromCamera || v.y < - distanceFromCamera) {
        v.z += 5 - Math.random() * 4;
      }
    });

    terrainGeom.verticesNeedUpdate = true;

    // Could be fix for shadow problem => no effect
    terrainGeom.computeFaceNormals();
    terrainGeom.computeVertexNormals();
  }

  lowerTerrain = (distanceFromCamera = 500) => {
    //WHEN USING THREE.Terrain
    const terrainGeom = this.getObjectByName(`Terrain`).children[0].geometry;

    //const terrainGeom = this.getObjectByName(`Terrain`).geometry;

    terrainGeom.vertices.forEach(v => {
      if (v.z >= 0 && (v.x > distanceFromCamera || v.x < - distanceFromCamera || v.y > distanceFromCamera || v.y < - distanceFromCamera)) {
        v.z -= 0.1;
      }
    });

    terrainGeom.verticesNeedUpdate = true;

    // Could be fix for shadow problem => no effect
    terrainGeom.computeFaceNormals();
    terrainGeom.computeVertexNormals();
  }

}
