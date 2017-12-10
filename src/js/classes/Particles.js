import Colors from '../objects/Colors';

class Particles {

  constructor() {

    this.particleGeometry = new THREE.Geometry();
    this.particleMaterial = new THREE.PointsMaterial({color: Colors.white, size: 1.5});
    // this.particleSystem = new THREE.GPUParticleSystem({maxParticles: 250000});
    // this.options = {
    //   position: new THREE.Vector3(),
    //   positionRandomness: .3,
    //   velocity: new THREE.Vector3(),
    //   velocityRandomness: .5,
    //   color: 0xaa88ff,
    //   colorRandomness: .2,
    //   turbulence: .5,
    //   lifetime: 2,
    //   size: 5,
    //   sizeRandomness: 1
    // };
    // this.spawnerOptions = {
    //   spawnRate: 15000,
    //   horizontalSpeed: 1.5,
    //   verticalSpeed: 1.33,
    //   timeScale: 1
    // };
    for (let i = 0;i < 500;i ++) {

      const particle = new THREE.Vector3();
      particle.x =  THREE.Math.randFloatSpread(1500);
      particle.y =  THREE.Math.randFloatSpread(1500);
      particle.z =  THREE.Math.randFloatSpread(1500);

      this.particleGeometry.vertices.push(particle);

    }

    this.particleSystem = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.particleSystem.position.y = 10;
    this.particleSystem.position.x = 0;
    this.particleSystem.position.z = 0;
    this.particleSystem.rotation.x = Math.random() * 6;
    this.particleSystem.rotation.y = Math.random() * 6;
    this.particleSystem.rotation.z = Math.random() * 6;

  }

  move () {
    //onsole.log(this.particleGeometry.vertices);
    //console.log(Math.random() * 2 - 1);
    const vectorX = Math.random() * 2 - 1;
    const vectorY = Math.random() * 2 - 1;
    const vectorZ = Math.random() * 2 - 1;


    this.particleGeometry.vertices.forEach(particle => {
      particle.add(new THREE.Vector3(
        vectorX,
        vectorY,
        vectorZ
      ));
    });
    this.clock = new THREE.Clock();
    this.delta = this.clock.getDelta();
    this.particleSystem.rotation.y += this.delta;
    this.particleGeometry.verticesNeedUpdate = true;

    // this.tick = 0;
    // this.delta = this.clock.getDelta() * this.spawnerOptions.timeScale;
    // this.tick += this.delta;
    // if (this.tick < 0) this.tick = 0;
    // if (this.delta > 0) {
    //   this.options.position.x = Math.sin(this.tick * this.spawnerOptions.horizontalSpeed) * 20;
    //   this.options.position.y = Math.sin(this.tick * this.spawnerOptions.verticalSpeed) * 10;
    //   this.options.position.z = Math.sin(this.tick * this.spawnerOptions.horizontalSpeed + this.spawnerOptions.verticalSpeed) * 5;
    //   for (let x = 0;x < this.spawnerOptions.spawnRate * this.delta;x ++) {
		// 			// Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
		// 			// their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
    //     this.particleSystem.spawnParticle(this.options);
    //   }
    // }
    // this.particleSystem.update(this.tick);

    window.requestAnimationFrame(() => this.move());

  }

}

export default Particles;
