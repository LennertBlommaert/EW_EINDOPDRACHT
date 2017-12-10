import WorldElement from './WorldElement';
class Cloud extends WorldElement {

  constructor(geom, mats, positionVector) {

    super({geom, mats, positionVector});
    this.mesh.name = `Cloud`;
    this.mesh.rotation.y = Math.random() * Math.PI * 2;
    this.mesh.receiveShadow = false;
  }

}

export default Cloud;
