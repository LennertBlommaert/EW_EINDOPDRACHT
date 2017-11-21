import Constants from '../objects/Constants';

const createRenderer = () => {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  console.log(Constants);

  renderer.setSize(Constants.WIDTH, Constants.HEIGHT);

  renderer.shadowMap.enabled = true;

  const container = document.querySelector(`.world`);
  container.appendChild(renderer.domElement);

  return renderer;
};


export default createRenderer;
