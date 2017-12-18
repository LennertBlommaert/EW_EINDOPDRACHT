const loadJSONFiles = () => {

  const loader = new THREE.JSONLoader();
  const loadedData = {};

  return new Promise(resolve => {

    loader.load(
      `assets/data/tree.json`,
      (geom, mat) => {
        loadedData.treeData = [geom, mat];
        resolve(loadedData);
      }
    );

  })
  .then(

    loader.load(
      `assets/data/cloud.json`,
      (geom, mat) => {
        loadedData.cloudData = [geom, mat];
        return;
      }
    )

  )
  .then(

    loader.load(
      `assets/data/rock.json`,
      (geom, mat) => {
        loadedData.rockData = [geom, mat];
        return;
      }
    )

  )
  .then(

    loader.load(
      `assets/data/mushroom.json`,
      (geom, mat) => {
        loadedData.mushroomData = [geom, mat];
        return;
      }
    )

  )
  .then(

    loader.load(
      `assets/data/evergreen.json`,
      (geom, mat) => {
        loadedData.evergreenData = [geom, mat];
        return;
      }
    )

  )
  .then(

    loader.load(
      `assets/data/flower.json`,
      (geom, mat) => {
        loadedData.flowerData = [geom, mat];
      }
    )

  );
};

export default loadJSONFiles;
