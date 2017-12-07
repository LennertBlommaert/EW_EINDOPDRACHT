class Cloud {

  constructor(position) {
    const nBlocks = 3 + Math.floor(Math.random() * 3);


    this.mesh = new THREE.Object3D();
    this.mesh.name = `cloud`;

    const geom = new THREE.BoxGeometry(20, 20, 20);

    const mat = new THREE.MeshBasicMaterial({
      color: `#ffffff`
    });

    this.nBlocks = nBlocks;

    for (let i = 0;i < nBlocks;i ++) {

      const m = new THREE.Mesh(geom, mat);

      m.position.x = i * 15;
      m.position.y = Math.random() * 10;
      m.position.z = Math.random() * 10;
      m.rotation.z = Math.random() * Math.PI * 2;
      m.rotation.y = Math.random() * Math.PI * 2;

      const s = .1 + Math.random() * .9;
      m.scale.set(s, s, s);

      m.castShadow = true;
      m.receiveShadow = true;

      this.mesh.add(m);

    }

    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;
  }
}

export default Cloud;
