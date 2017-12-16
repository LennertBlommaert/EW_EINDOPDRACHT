import WorldElement from './WorldElement';

class Evergreen extends WorldElement {

  constructor(geom, mats, positionVector) {
    super({geom, mats, positionVector});

    this.mesh.name = `Evergreen`;
    this.mesh.rotation.y = Math.random() * Math.PI * 2;
  }
}

export default Evergreen;
