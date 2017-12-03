import getRandomArbitrary from '../lib/getRandomArbitrary';

class Tree {

  constructor(geom, mat) {

    this.scaleFactor = 1;
    this.scaleFactorIncreasement = 1;

    //THESE LINES CAUSE TREES TO SPAWN HIGHER AND HIGHER EACH TIME A NEW TREE IS ADDED TO THE Scene
    // WHY???
    //LINES ARE USED TO PU TREE'S SCALEPOINT TO ITS ROOTS
    //geom.computeBoundingBox();
    //geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, geom.boundingBox.min.y, 0));

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.mesh.name = `Tree`;

    this.mesh.position.z = getRandomArbitrary(- 500, 500);
    this.mesh.position.x = getRandomArbitrary(- 500, 500);
    this.mesh.position.y = getRandomArbitrary(- 10, - 5);

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

  animateShrink = () => {
    this.scaleFactor -= this.scaleFactorIncreasement;
    this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
    if (this.scaleFactor > 1) {
      window.requestAnimationFrame(this.animateShrink);
    }
  }
}

export default Tree;
