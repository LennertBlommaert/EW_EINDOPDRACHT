class Particles {

  constructor() {

    const particleGeometry = new THREE.Geometry();

    for (let i = 0;i < 10000;i ++) {

      const particle = new THREE.Vector3();
      particle.x = THREE.Math.randFloatSpread(200);
      particle.y = THREE.Math.randFloatSpread(200);
      particle.z = THREE.Math.randFloatSpread(200);

      particleGeometry.vertices.push(particle);

    }

    const particleMaterial = new THREE.PointsMaterial({color: 0xffffff, size: .7});

    this.particles = new THREE.Points(particleGeometry, particleMaterial);
  }
}

export default Particles;
