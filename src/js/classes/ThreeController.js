import Scene from './Scene';
import Renderer from './Renderer';
import Camera from './Camera';
import Controls from './Controls';

export default class ThreeController {
  constructor() {
    this.loadedData = {};

    this.loadJSONFiles()
      .then(this.init())
      .catch(reason => console.error(`Loading JSON files vor three objects failed: ${reason}`));

    // does not work - PROBLEM w/ Camera + orbitcontrols
    //this.camera.rotation.x = 0;
    //this.camera.updateProjectionMatrix;
    //this.controls.update();
  }

  init = () => {
    this.scene = new Scene({loadedData: this.loadedData});
    this.renderer = new Renderer({});
    this.camera = new Camera({});
    this.controls = new Controls({camera: this.camera});

    this.linkGUIControls();
  }

  linkGUIControls = () => {
    this.$resetButton = document.querySelector(`.reset-button`);
    this.$resetButton.addEventListener(`click`, this.scene.emptyScene);

    this.$autoRotateButton = document.querySelector(`.auto-rotation-button`);
    console.log(this.$autoRotateButton);
    this.$autoRotateButton.addEventListener(`click`, this.controls.toggleAutorotate);

    this.$autRotateSpeedRange = document.querySelector(`#auto-rotation-speed`);
    this.$autRotateSpeedRange.addEventListener(`input`, ({currentTarget}) => this.controls.setAutorationSpeed(parseInt(currentTarget.value, 10)));
  }

  loadJSONFiles = () => {

    this.loader = new THREE.JSONLoader();

    return new Promise(resolve => {

      this.loader.load(
        `assets/data/tree.json`,
        (geom, mat) => {
          this.loadedData.treeData = [geom, mat];
          resolve();
        }
      );

    })
    .then(

      this.loader.load(
        `assets/data/cloud.json`,
        (geom, mat) => {
          this.loadedData.cloudData = [geom, mat];
          return;
        }
      )

    );

  }
}
