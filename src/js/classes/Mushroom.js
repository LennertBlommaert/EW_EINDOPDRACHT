import WorldElement from './WorldElement';
class Mushroom extends WorldElement {

  constructor(geom, mats, positionVector) {

    super({geom, mats, positionVector});
    this.mesh.name = `Mushroom`;
    this.mesh.rotation.y = Math.random() * Math.PI * 2;
  }

}

export default Mushroom;
