import Constants from '../objects/Constants';

export default class Renderer extends THREE.WebGLRenderer {
  constructor({alpha = true, antialias = true}) {

    super({alpha: alpha, antialias: antialias});
    this.setSize(Constants.WIDTH, Constants.HEIGHT);

    this.shadowMap.enabled = true;
    this.shadowMapDebug = true;

    const container = document.querySelector(`.world`);
    container.appendChild(this.domElement);
  }
}
