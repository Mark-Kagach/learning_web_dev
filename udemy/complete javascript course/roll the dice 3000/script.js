'use strict';

const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const diceEl = document.querySelector('.dice');

score0El.textContent = 0;
score1El.textContent = 0;
//diceEl.classList.add('hidden');

//get their total scores as a number const
const totalScoreP1 = Number(document.querySelector('#score--0').textContent);
const totalScoreP2 = Number(document.querySelector('#score--1').textContent);

//diceroller function FIXME maybe implemented wnong cause sometimes get crazy rolls.
function rollDice() {
  return Math.trunc(Math.random() * 6) + 1;
}

//checking which player is active function
let active;
let passive;
function whosActive() {
  if (
    document.querySelectorAll('.player')[0].classList.contains('player--active')
  ) {
    active = 0;
    passive = 1;
  } else {
    active = 1;
    passive = 0;
  }
}

let currentScore;
let currentEl;
function wheresCurrent(active) {
  //Select currentscore of the active player.
  currentEl = document.querySelector(`#current--${active}`);
  currentScore = Number(currentEl.textContent);
}

let totalScore;
let totalEl;
function wheresTotal(active) {
  totalEl = document.querySelector(`#score--${active}`);
  totalScore = Number(totalEl.textContent);
}

//listen for the click
document.querySelector('.btn--roll').addEventListener('click', function () {
  //0. check whos active so you know whos DOM to manipulate
  whosActive();
  wheresCurrent(active);

  //1. generate random btw 1/6
  let i = rollDice();

  //2. display the roll
  diceEl.src = `dice-${i}.png`;

  //3. check whether 1 and have to switch orr add to current score
  if (i === 1) {
    //null the players current score
    currentEl.textContent = 0;
    currentScore = 0;

    //switch player--active classes
    document
      .querySelectorAll('.player')
      [active].classList.remove('player--active');
    document
      .querySelectorAll('.player')
      [passive].classList.add('player--active');
  } else {
    //add i to the current score
    //then display it
    currentScore = currentScore + i;
    currentEl.textContent = currentScore;
  }
});

//listen for the hold button
document.querySelector('.btn--hold').addEventListener('click', function () {
  whosActive();
  wheresTotal(active);
  wheresCurrent(active);

  totalScore += currentScore;
  totalEl.textContent = totalScore;

  if (totalScore >= 100) {
    //make persons bg green specifically create a won class, so you can easily add/remove it
    document.querySelectorAll('.player')[active].classList.add('won');
    // say player x Won 🎉
    document.querySelectorAll('.name')[active].textContent = 'You Won 🎉';
    // block any button but new-game
    document.querySelector('.btn--hold').disabled = true;
    document.querySelector('.btn--roll').disabled = true;
  } else {
    //change the players
    document
      .querySelectorAll('.player')
      [active].classList.remove('player--active');
    document
      .querySelectorAll('.player')
      [passive].classList.add('player--active');

    //null the current score
    currentEl.textContent = 0;
    currentScore = 0;
  }
  //add current to the total, then display it.
});

console.log(1 % 10);
//listen for the new game button
document.querySelector('.btn--new').addEventListener('click', function () {
  //remove the won class
  document.querySelectorAll('.player')[active].classList.remove('won');
  //change the name to normal
  document.querySelectorAll('.name')[active].textContent = `Player ${
    active + 1
  }`;
  //unblock the buttons
  // block any button but new-game
  document.querySelector('.btn--hold').disabled = false;
  document.querySelector('.btn--roll').disabled = false;

  //annulate the score for active
  totalScore = 0;
  currentScore = 0;
  totalEl.textContent = 0;
  currentEl.textContent = 0;

  //annulate score for passive
  document.querySelector(`#score--${passive}`).textContent = 0;
});
