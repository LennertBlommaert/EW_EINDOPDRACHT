const createKeyboardVisualisation = keys => {
  const $keysContainer = document.querySelector(`.keys-container`);

  keys.forEach(key => {
    $keysContainer.appendChild(createKey(key));
  });
};

const createKey = key => {
  const $div = document.createElement(`div`);
  $div.classList.add(`key`);
  $div.textContent = key.key;
  return $div;
};

export default createKeyboardVisualisation;
