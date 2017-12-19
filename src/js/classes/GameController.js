export default class GameController {
  constructor(noteContainerDomElementClassName) {
    this.$notesListContainer = document.querySelector(`.${noteContainerDomElementClassName}`);
    this.$notesList = this.$notesListContainer.querySelector(`ul`);
    this.$congratulations = this.$notesListContainer.querySelector(`.congratulations`);

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
      {tone: `C`}, {tone: `E`}, {tone: `C`}, {tone: `E`}, {tone: `C`}, {tone: `E`}
    ];
    //
    // this.notes = [
    //   {tone: `C`}, {tone: `E`}, {tone: `G`}, {tone: `B`},
    //   {tone: `C`}, {tone: `B`}, {tone: `G`}, {tone: `E`},
    //   {tone: `C`}, {tone: `E`}, {tone: `G`}, {tone: `B`},
    //   {tone: `C`}, {tone: `B`}, {tone: `G`}, {tone: `E`},
    // ];

    // this.currentNoteOpacity = 0;
    // this.currentNoteScale = 1;

    this.notes.forEach((n, i) => {
      n.domElement = document.createElement(`li`);
      n.domElement.textContent = n.tone;
      n.domElement.dataset.index = i;
      this.$notesList.appendChild(n.domElement);
    });

    this.currentNoteIndex = 0;
  }

  checkNotePlayed = note => {
    if (note === this.getCurrentNote().tone) return this.correctNotePlayed();
    this.wrongNotePlayed();
  }

  showChallengeMessage() {
    this.$notesListContainer.classList.remove(`game-inactive`);
    this.removeChallengeTimer = window.setTimeout(() => this.$notesListContainer.classList.add(`game-inactive`), 5000);
    this.$notesListContainer.onclick = () => {
      window.clearTimeout(this.removeChallengeTimer);
      this.start();
    };
  }

  start = () => {
    this.currentNoteIndex = 0;
    this.$notesListContainer.classList.remove(`game-over`);
    this.$notesListContainer.classList.remove(`game-inactive`);
    this.$notesListContainer.classList.add(`game-started`);
    this.displayCurrentNote();
    this.startTime = Date.now();
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
    this.endTime = Date.now();
    console.log(this.beginTime);
    this.$congratulations.textContent = `Wow! in ${Math.floor(this.endTime - this.startTime) / 1000}s`;
    this.$notesListContainer.classList.add(`game-over`);
    this.$notesListContainer.classList.remove(`game-started`);
    window.setTimeout(() => {
      this.$notesListContainer.classList.remove(`game-over`);
      this.$notesListContainer.classList.add(`game-inactive`);
    }, 2000);
  }

  displayCurrentNote = () => {

    const $previousNote = this.$notesList.querySelector(`li[data-index='${this.currentNoteIndex - 1}']`);
    if ($previousNote) $previousNote.classList.remove(`active`);

    const $currentNote = this.$notesList.querySelector(`li[data-index='${this.currentNoteIndex}']`);
    if ($currentNote) $currentNote.classList.add(`active`);

    this.$notesList.style.transform = `translateX(-${8 * this.currentNoteIndex + 2}rem)`;
  };

  // updateCurrentNote = () => {
  //   console.log(this.currentNoteScale);
  //   this.currentNoteOpacity += 0.1;
  //   this.currentNoteScale += 0.001;
  //   this.getCurrentNote().domElement.style.opacity = this.currentNoteOpacity;
  //   this.getCurrentNote().domElement.style.transform = `scale(${this.currentNoteScale})`;
  // }

  resetNoteContainersClassLists = () => Array.from(this.$notesList.querySelectorAll(`li`)).forEach(li => li.classList.remove(`active`));

  getCurrentNote = () => this.notes[this.currentNoteIndex];

}
