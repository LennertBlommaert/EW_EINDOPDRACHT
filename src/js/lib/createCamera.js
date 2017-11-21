const createCamera = (aspectRatio = 1, fieldOfView = 60, near = 1, far = 1000) => {

  const camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    near,
    far
  );

  camera.position.x = 0;
  camera.position.y = 100;
  camera.position.z = 200;

  return camera;
};

export default createCamera;
