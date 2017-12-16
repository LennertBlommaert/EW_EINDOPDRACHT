import WorldElement from './WorldElement';

class Flower extends WorldElement {

  constructor(geom, mats, positionVector) {
    super({geom, mats, positionVector});

    this.mesh.name = `Flower`;
    this.mesh.rotation.y = Math.random() * Math.PI * 2;
  }
}

export default Flower;
