class Tree {

  constructor(scene) {
    // const loader = new THREE.JSONLoader();
    this.loader = new THREE.JSONLoader();
    this.mesh = {};
    this.scaleFactor = 1;
    this.scaleFactorIncreasement = 1;

    this.loader.load(
      `assets/data/tree.json`,
      (geom, mat) => this.handleLoad(geom, mat, scene)
    );
  }

  handleLoad = (geom, mat, scene) => {
    console.log(geom);

    geom.computeBoundingBox();

    geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, geom.boundingBox.min.y, 0));

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);

    this.mesh.position.z = 100;

    console.log(this.mesh);

    scene.add(this.mesh);
    requestAnimationFrame(this.animateGrowth);
  };

  animateGrowth = () => {
    this.scaleFactor += this.scaleFactorIncreasement;
    this.mesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);

    if (this.scaleFactor < 100) {
      requestAnimationFrame(this.animateGrowth);
    }
  }
}

export default Tree;
