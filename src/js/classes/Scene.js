import Cloud from '../classes/Cloud';
import Airplane from '../classes/Airplane';

import Constants from '../objects/Constants';

import getRandomArbitrary from '../lib/getRandomArbitrary';


export default class Scene extends THREE.Scene {

  constructor({fogColor = 0xf7d9aa, fogNear = 100, fogFar = 950}) {
    super();
    this.fog = new THREE.Fog(fogColor, fogNear, fogFar);
    this.addLights();
    this.addTerrain();
  }

  addLights = () => {
    const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    const shadowLight = new THREE.DirectionalLight(0xffffff, .9);

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

    this.add(hemisphereLight);
    this.add(shadowLight);
  }

  addTerrain = () => {
    const xS = 63, yS = 63;
    const terrain = THREE.Terrain({
      name: `Terrain`,
      easing: THREE.Terrain.Linear,
      frequency: 2.5,
      heightmap: THREE.Terrain.DiamondSquare,
      material: new THREE.MeshBasicMaterial({color: 0x0B6623}),
      maxHeight: 50,
      minHeight: - 50,
      steps: 1,
      useBufferGeometry: false,
      xSegments: xS,
      xSize: 1024,
      ySegments: yS,
      ySize: 1024,
    });


    terrain.name = `Terrain`;

    terrain.receiveShadow = true;

    this.add(terrain);
  }

  createObjectOnNote = (note = 0) => {

    if (note > 60) {
      this.createPlane();
    }

    // A key on keyboard

    //console.log(this.getObjectByName(`Terrain`));
    if (note === 60) {
      const terrainGeom = this.getObjectByName(`Terrain`).children[0].geometry;

      terrainGeom.vertices.forEach(v => {
        v.z += 1;
      });

      console.log(terrainGeom.vertices[0]);

      terrainGeom.verticesNeedUpdate = true;
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

    airplane.mesh.position.y = getRandomArbitrary(0, Constants.HEIGHT / 2);
    airplane.mesh.position.x = getRandomArbitrary(0, Constants.WIDTH / 2) - Constants.WIDTH / 4;

    this.add(airplane.mesh);

  }

}
