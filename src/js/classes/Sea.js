import Colors from '../objects/Colors';

class Sea {

  constructor() {
    const geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));


    geom.mergeVertices();

    const l = geom.vertices.length;

    this.waves = [];

    for (let i = 0;i < l;i ++) {
      const v = geom.vertices[i];
      this.waves.push({
        y: v.y,
        x: v.x,
        z: v.z,
        ang: Math.random() * Math.PI * 2,
        amp: 5 + Math.random() * 15,
        speed: .016 + Math.random() * .036
      });
    }

    const mat = new THREE.MeshPhongMaterial({
      color: Colors.blue,
      transparent: true,
      opacity: .6,
      flatShading: true
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
  }

  moveWaves(factor = .1) {
    const verts = this.mesh.geometry.vertices;
    const l = verts.length;

    for (let i = 0;i < l;i ++) {
      const v = verts[i];

      const vprops = this.waves[i];

      v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp * factor;
      v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp * factor;

      vprops.ang += vprops.speed;

      this.mesh.geometry.verticesNeedUpdate = true;
      this.mesh.rotation.z += .0000005;
    }
  }

}

export default Sea;
