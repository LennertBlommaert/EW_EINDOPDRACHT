import Scene from './Scene';
import Renderer from './Renderer';
import Camera from './Camera';
import Controls from './Controls';

export default class ThreeController {
  constructor() {
    this.scene = new Scene({});
    this.renderer = new Renderer({});
    this.camera = new Camera({});
    this.controls = new Controls({camera: this.camera});

    // this.helper = new THREE.CameraHelper(this.camera);
    // this.scene.add(this.helper);

    // does not work
    //this.camera.rotation.x = 0;
    //this.camera.updateProjectionMatrix;
    //this.controls.update();
  }
}
