import Colors from '../objects/Colors';
import WorldElement from './WorldElement';

class Tree extends WorldElement {

  constructor(geom, position = {x: 0, y: 0, z: 0}) {

    const mats = [
      new THREE.MeshPhongMaterial({color: Colors.brownDark, flatShading: THREE.FlatShading}),
      new THREE.MeshPhongMaterial({color: Colors.crownGreen, flatShading: THREE.FlatShading})
    ];

    super({geom, mats, position});

    this.mesh.name = `Tree`;
    this.mesh.rotation.y = Math.random() * Math.PI * 2;
  }
}

export default Tree;
