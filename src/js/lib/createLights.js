// const createLights = scene => {
//
//   const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
//
//   const shadowLight = new THREE.DirectionalLight(0xffffff, .9);
//
//   shadowLight.position.set(150, 350, 350);
//
//   shadowLight.castShadow = true;
//
//   // Define visible area of projected shadowLight
//   shadowLight.shadow.camera.left = - 400;
//   shadowLight.shadow.camera.right = 400;
//   shadowLight.shadow.camera.top = 400;
//   shadowLight.shadow.camera.bottom = - 400;
//   shadowLight.shadow.camera.near = 1;
//   shadowLight.shadow.camera.far = 1000;
//
//   shadowLight.shadow.mapSize.width = 2048;
//   shadowLight.shadow.mapSize.height = 2048;
//
//   scene.add(hemisphereLight);
//   scene.add(shadowLight);
//
// };
//
// export default createLights;
