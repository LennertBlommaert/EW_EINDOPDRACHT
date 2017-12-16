export default class GameController {
  constructor(noteContainerDomElementClassName) {
    this.$noteContainer = document.querySelector(`.${noteContainerDomElementClassName}`);

    // this.notes = [
    //   `B`, `D`, `B`, `D`, `B`, `D`,
    //   `A`, `D`, `A`, `D`, `A`, `D`,
    //   `G`, `D`, `G`, `D`, `G`, `D`,
    //   `F#`, `D`, `F#`, `D`, `F#`, `D`,
    // ];

    // this.notes = [
    //   {tone: `F#`, duration: 1}, {tone: `A#`, duration: 1}, {tone: `Eb`, duration: 1}, {tone: `F#`, duration: 1},
    //   {tone: `A#`, duration: 1}, {tone: `F#`, duration: 1}, {tone: `Eb`, duration: 1}, {tone: `A#`, duration: 1},
    // ];

    this.notes = [
      {tone: `F#`}, {tone: `A#`}, {tone: `Eb`}, {tone: `F#`},
      {tone: `A#`}, {tone: `F#`}, {tone: `Eb`}, {tone: `A#`},
      {tone: `F#`}, {tone: `A#`}, {tone: `Eb`}, {tone: `F#`},
      {tone: `A#`}, {tone: `F#`}, {tone: `Eb`}, {tone: `A#`},
    ];

    // this.currentNoteOpacity = 0;
    // this.currentNoteScale = 1;

    this.notes.forEach((n, i) => {
      n.domElement = document.createElement(`li`);
      n.domElement.textContent = n.tone;
      n.domElement.dataset.index = i;
      this.$noteContainer.appendChild(n.domElement);
    });

    this.currentNoteIndex = 0;
  }

  checkNotePlayed = note => {
    console.log(note);
    if (note === this.getCurrentNote().tone) return this.correctNotePlayed();
    this.wrongNotePlayed();
  }

  start = () => {
    this.currentNoteIndex = 0;
    this.$noteContainer.parentNode.classList.remove(`game-over`);
    this.$noteContainer.parentNode.classList.toggle(`game-inactive`);
    this.displayCurrentNote();
  }

  correctNotePlayed = () => {
    if (this.currentNoteIndex >= this.notes.length - 1) this.gameWon();
    this.displayNextNote();
  }

  wrongNotePlayed = () => {
    this.currentNoteIndex = 0;
    this.resetNoteContainersClassLists();
    this.displayCurrentNote();
  }

  displayNextNote = () => {
    this.currentNoteIndex++;
    this.displayCurrentNote();
  }

  gameWon = () => {
    console.log(`YOU WON!`);
    this.$noteContainer.parentNode.classList.toggle(`game-over`);
  }

  displayCurrentNote = () => {
    const $previousNote = this.$noteContainer.querySelector(`li[data-index='${this.currentNoteIndex - 1}']`);
    if ($previousNote) $previousNote.classList.remove(`active`);

    const $currentNote = this.$noteContainer.querySelector(`li[data-index='${this.currentNoteIndex}']`);
    if ($currentNote) $currentNote.classList.add(`active`);

    this.$noteContainer.style.transform = `translateX(-${10.3 * this.currentNoteIndex}rem)`;
  };

  // updateCurrentNote = () => {
  //   console.log(this.currentNoteScale);
  //   this.currentNoteOpacity += 0.1;
  //   this.currentNoteScale += 0.001;
  //   this.getCurrentNote().domElement.style.opacity = this.currentNoteOpacity;
  //   this.getCurrentNote().domElement.style.transform = `scale(${this.currentNoteScale})`;
  // }

  resetNoteContainersClassLists = () => Array.from(this.$noteContainer.querySelectorAll(`li`)).forEach(li => li.classList.remove(`active`));

  getCurrentNote = () => this.notes[this.currentNoteIndex];

}
