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
  }
}
