import getRandomArbitrary from '../lib/getRandomArbitrary';
import Colors from '../objects/Colors';

class Tree {

  constructor(geom) {

    this.scaleFactor = 1;
    this.scaleFactorIncreasement = 1;

    //THESE LINES CAUSE TREES TO SPAWN HIGHER AND HIGHER EACH TIME A NEW TREE IS ADDED TO THE Scene
    // WHY???
    //LINES ARE USED TO PUT TREE'S SCALEPOINT TO ITS ROOTS
    //geom.computeBoundingBox();
    //geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, geom.boundingBox.min.y, 0));
    const mats = [
      new THREE.MeshPhongMaterial({color: Colors.brownDark, flatShading: THREE.FlatShading}),
      new THREE.MeshPhongMaterial({color: Colors.crownGreen, flatShading: THREE.FlatShading})
    ];
    this.mesh = new THREE.Mesh(geom, mats);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.mesh.name = `Tree`;

    this.mesh.position.z = getRandomArbitrary(- 500, 500);
    this.mesh.position.x = getRandomArbitrary(- 500, 500);
    this.mesh.position.y = getRandomArbitrary(- 10, - 5);
    this.mesh.rotation.y = Math.random() * Math.PI * 2;

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
