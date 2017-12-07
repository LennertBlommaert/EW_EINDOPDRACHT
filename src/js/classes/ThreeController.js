import Scene from './Scene';
import Renderer from './Renderer';
import Camera from './Camera';
import Controls from './Controls';

export default class ThreeController {
  constructor(loadedData = {}) {
    this.loadedData = loadedData;

    this.scene = new Scene({loadedData: this.loadedData});
    this.renderer = new Renderer({});
    this.camera = new Camera({});
    this.controls = new Controls({camera: this.camera});

    console.log(`SCENE:`, this.scene);

    this.linkGUIControls();

    // does not work - PROBLEM w/ Camera + orbitcontrols
    //this.camera.rotation.x = 0;
    //this.camera.updateProjectionMatrix;
    //this.controls.update();
  }


  linkGUIControls = () => {
    this.$resetButton = document.querySelector(`.reset-button`);
    this.$resetButton.addEventListener(`click`, this.scene.emptyScene);

    this.$autoRotateButton = document.querySelector(`.auto-rotation-button`);
    console.log(this.$autoRotateButton);
    this.$autoRotateButton.addEventListener(`click`, this.controls.toggleAutorotate);

    this.$autRotateSpeedRange = document.querySelector(`#auto-rotation-speed`);
    this.$autRotateSpeedRange.addEventListener(`input`, ({currentTarget}) => this.controls.setAutorationSpeed(parseFloat(currentTarget.value, 10)));
  }

}
