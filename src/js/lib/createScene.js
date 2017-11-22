const createScene = (fogColor = 0xf7d9aa, fogNear = 100, fogFar = 950) => {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);

  return scene;
};

export default createScene;
