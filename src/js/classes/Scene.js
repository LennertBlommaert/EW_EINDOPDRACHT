
export default class Scene extends THREE.Scene {

  constructor({fogColor = 0xf7d9aa, fogNear = 100, fogFar = 950}) {
    super();
    this.fog = new THREE.Fog(fogColor, fogNear, fogFar);
    this.addLights = this.addLights();

    // Generate a terrain
    const xS = 63, yS = 63;
    console.log(THREE.Terrain);
    const terrainScene = THREE.Terrain({
      easing: THREE.Terrain.Linear,
      frequency: 2.5,
      heightmap: THREE.Terrain.DiamondSquare,
      material: new THREE.MeshBasicMaterial({color: 0x5566aa}),
      maxHeight: 100,
      minHeight: - 100,
      steps: 1,
      useBufferGeometry: false,
      xSegments: xS,
      xSize: 1024,
      ySegments: yS,
      ySize: 1024,
    });
// Assuming you already have your global scene, add the terrain to it
    this.add(terrainScene);
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

}
