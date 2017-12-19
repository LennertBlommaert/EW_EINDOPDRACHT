const loadJSONFiles = () => {

  const JSONLoader = new THREE.JSONLoader();
  const textureLoader = new THREE.TextureLoader();

  const loadedData = {};

  return new Promise(resolve => {

    JSONLoader.load(
      `assets/data/tree.json`,
      (geom, mat) => {
        loadedData.treeData = [geom, mat];
        resolve(loadedData);
      }
    );

  })
  .then(

    JSONLoader.load(
      `assets/data/cloud.json`,
      (geom, mat) => {
        loadedData.cloudData = [geom, mat];
        return;
      }
    )

  )
  .then(

    JSONLoader.load(
      `assets/data/rock.json`,
      (geom, mat) => {
        loadedData.rockData = [geom, mat];
        return;
      }
    )

  )
  .then(

    JSONLoader.load(
      `assets/data/mushroom.json`,
      (geom, mat) => {
        loadedData.mushroomData = [geom, mat];
        return;
      }
    )

  )
  .then(

    JSONLoader.load(
      `assets/data/evergreen.json`,
      (geom, mat) => {
        loadedData.evergreenData = [geom, mat];
        return;
      }
    )

  )
  .then(

    JSONLoader.load(
      `assets/data/flower.json`,
      (geom, mat) => {
        loadedData.flowerData = [geom, mat];
        return;
      }
    )
  )
  .then(

    textureLoader.load(
      `assets/img/particle.png`,
      texture => {
        loadedData.texture = texture;
        return;
      }
    )

  );
};

export default loadJSONFiles;
