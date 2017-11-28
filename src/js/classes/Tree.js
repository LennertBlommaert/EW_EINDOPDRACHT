class Tree {

  constructor(scene) {
    // const loader = new THREE.JSONLoader();
    this.loader = new THREE.JSONLoader();
    this.mesh = {};

    this.loader.load(
      `assets/data/tree.json`,
      (geom, mat) => this.handleLoad(geom, mat, scene)
    );
  }

  handleLoad = (geom, mat, scene) => {
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.scale.set(100, 100, 100);
    scene.add(this.mesh);
  };
}

export default Tree;
