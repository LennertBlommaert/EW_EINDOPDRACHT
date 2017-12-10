// import Colors from '../objects/Colors';
import WorldElement from './WorldElement';

class Tree extends WorldElement {

  constructor(geom, mats, positionVector) {
  // constructor(geom, position = {x: 0, y: 0, z: 0}) {

    // const mats = [
    //   new THREE.MeshPhongMaterial({color: Colors.treeTrunk, flatShading: THREE.FlatShading, morphTargets: true}),
    //   new THREE.MeshPhongMaterial({color: Colors.treeCrown, flatShading: THREE.FlatShading, morphTargets: true})
    // ];

    super({geom, mats, positionVector});

    this.mesh.name = `Tree`;
    this.mesh.rotation.y = Math.random() * Math.PI * 2;

    this.wiggleAddition = 0.0025;

    //this.wiggle();
  }

  wiggle() {

    // this.mesh.rotation.x += this.wiggleAddition;
    //
    // if (this.mesh.rotation.x > Math.PI / 12 || this.mesh.rotation.x < - Math.PI / 12) this.wiggleAddition = - this.wiggleAddition;

    if (this.mesh.visible) {
      window.requestAnimationFrame(() => this.wiggle());
    }
  }
}

export default Tree;
