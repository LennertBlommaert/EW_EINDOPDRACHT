import WorldElement from './WorldElement';
class Rock extends WorldElement {

  constructor(geom, mats, position = {x: 0, y: 0, z: 0}) {

    super({geom, mats, position});
    this.mesh.name = `Rock`;
    this.mesh.rotation.y = Math.random() * Math.PI * 2;
  }

}

export default Rock;
