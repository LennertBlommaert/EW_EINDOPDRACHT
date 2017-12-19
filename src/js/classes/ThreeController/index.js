import Scene from './Scene/';
import Renderer from './Renderer';
import Camera from './Camera';
import Controls from './Controls';
import EventEmitter2 from 'eventemitter2';
import Constants from '../../objects/Constants';

/*
  A class containing al the THREE logic
*/

export default class ThreeController extends EventEmitter2 {
  constructor(loadedData = {}) {
    super({});
    this.loadedData = loadedData;

    this.scene = new Scene({loadedData: this.loadedData});
    this.renderer = new Renderer({});
    this.camera = new Camera({});
    this.controls = new Controls({camera: this.camera});

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.scene.add(this.camera);

    this.linkGUIControls();
  }

  updateMouse(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  darken() {
    this.camera.pointLight.intensity -= Constants.CAMERA_POINTLIGHT_INTENSITY_CHANGE;
  }

  brighten() {
    this.camera.pointLight.intensity += Constants.CAMERA_POINTLIGHT_INTENSITY_CHANGE;
  }


  checkIntersections = () => {

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const objectsToCheckIntersection = this.scene.children.filter(c => {
      return c.name !== `Terrain` && c.type !== `Points`;
    });

    this.intersects = this.raycaster.intersectObjects(objectsToCheckIntersection);

    console.log(this.intersects.length);

    if (this.intersects.length > 0) {
      const firstIntersectionObjectName = this.intersects[0].object.name;
      this.emit(`threeControllerOnIntersection`, firstIntersectionObjectName);
    }
  }

  linkGUIControls = () => {
    this.$resetButton = document.querySelector(`.reset-button`);
    this.$resetButton.addEventListener(`click`, () => this.scene.emptyScene());

    this.$autoRotateButton = document.querySelector(`.auto-rotation-button`);
    this.$autoRotateButton.addEventListener(`click`, () => {
      this.$autoRotateButton.classList.toggle(`btn-toggle`);
      this.controls.toggleAutorotate();
    });
  }

}
