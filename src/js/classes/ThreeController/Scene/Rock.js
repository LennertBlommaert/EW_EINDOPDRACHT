import WorldElement from './WorldElement';
class Rock extends WorldElement {

  constructor(geom, mats, positionVector) {

    super({geom, mats, positionVector});
    this.mesh.name = `Rock`;
    this.mesh.rotation.y = Math.random() * Math.PI * 2;
  }

}

export default Rock;
