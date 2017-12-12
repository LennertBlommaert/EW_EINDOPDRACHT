import WorldElement from './WorldElement';

class Tree extends WorldElement {

  constructor(geom, mats, positionVector) {
    super({geom, mats, positionVector});

    this.mesh.name = `Tree`;
    this.mesh.rotation.y = Math.random() * Math.PI * 2;
  }
}

export default Tree;
