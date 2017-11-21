const createScene = () => {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

  return scene;
};

export default createScene;
