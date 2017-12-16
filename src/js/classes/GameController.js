export default class GameController {
  constructor(noteContainerDomElementClassName) {
    this.$noteContainer = document.querySelector(`.${noteContainerDomElementClassName}`);
    // this.notes = [
    //   `B`, `D`
    // ];


    this.notes = [
      `B`, `D`, `B`, `D`, `B`, `D`,
      `A`, `D`, `A`, `D`, `A`, `D`,
      `G`, `D`, `G`, `D`, `G`, `D`,
      `F#`, `D`, `F#`, `D`, `F#`, `D`,
    ];

    this.notes.forEach((f, i) => {
      const $li = document.createElement(`li`);
      $li.textContent = f;
      $li.dataset.index = i;
      this.$noteContainer.appendChild($li);
    });

    this.currentNoteIndex = 0;

    // this.song = [
    //   [`D4`, `8n`], [`A4`, `8n`], [`A4`, `8n`],
    //   [`E4`, `16n`], [`B4`, `8n`],
    //   [`C12`, `16n`]
    // ];
  }

  checkNotePlayed = note => {
    console.log(note);
    if (note === this.getCurrentNote()) return this.correctNotePlayed();
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

    this.$noteContainer.style.transform = `translateX(-${7.28 * this.currentNoteIndex}rem)`;
  };

  resetNoteContainersClassLists = () => Array.from(this.$noteContainer.querySelectorAll(`li`)).forEach(li => li.classList.remove(`active`));

  getCurrentNote = () => this.notes[this.currentNoteIndex];

}
