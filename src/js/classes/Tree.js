import getRandomArbitrary from '../lib/getRandomArbitrary';

class Tree {

  constructor(geom, mat) {

    console.info(geom, mat);

    this.loader = new THREE.JSONLoader();
    this.scaleFactor = 1;
    this.scaleFactorIncreasement = 1;

    geom.computeBoundingBox();

    geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, geom.boundingBox.min.y, 0));

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.mesh.position.z = getRandomArbitrary(0, 500);
    this.mesh.position.x = getRandomArbitrary(0, 500);
    this.mesh.position.y = getRandomArbitrary(- 5, 0);


    this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);

    window.requestAnimationFrame(this.animateGrowth);
  }

  animateGrowth = () => {
    this.scaleFactor += this.scaleFactorIncreasement;
    this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);

    if (this.scaleFactor < 100) {
      window.requestAnimationFrame(this.animateGrowth);
    }
  }
}

export default Tree;
