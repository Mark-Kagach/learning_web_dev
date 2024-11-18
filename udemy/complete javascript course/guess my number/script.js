'use strict';

//1. generate secret number
// function randomIntFromInterval(min, max) {
//   // min and max included
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }
// const secretN = randomIntFromInterval(1, 20);

// a better way to do it:
function generateSecretN() {
  return Math.trunc(Math.random() * 20) + 1;
}
let secretN = generateSecretN();
//Math.random produces a number btw 0 & 1; *20 we get number btw 0-20; math.trunc cuts whetever the decimal is; so 19.999 => 19. So we add +1 to get 1-20, as 20.999 would be 20;

console.log(secretN);

//Select all the elements in DOM
let score = Number(document.querySelector('.score').textContent);
let highscore = Number(document.querySelector('.highscore').textContent);

//let bg = (document.body.style.backgroundColor = '#54ab42');
//let bg = (document.body.style.backgroundColor = '##fa5252'); (if score=0 =>)

//2. listen for the check click
//3. if guess != to secret number
//4. deduct the point, update background to red
//5. check whether secret number is bigger or smaller than guess
//6. add line saying whether the guess is too low or too high
//7. if guess = secret then
//8. bg=green, also update the Qestion mark to secretN;  update the highscore if > current highscore

document.querySelector('.check').addEventListener('click', function () {
  const guess = document.querySelector('.guess').value;

  if (score > 0) {
    if (!guess) {
      document.querySelector('.message').textContent = '⛔ No number!';
    } else {
      if (guess != secretN) {
        score -= 1;
        document.querySelector('.score').textContent = score;

        if (guess > secretN) {
          document.querySelector('.message').textContent = '📈 Too High!';
        } else {
          document.querySelector('.message').textContent = '📉 Too Low!';
        }
      } else {
        document.querySelector('.message').textContent =
          '💃🎉🪩👯‍♀️ Correct Number!';
        document.body.style.backgroundColor = '#54ab42';
        document.querySelector('.number').textContent = secretN;

        if (score > highscore) {
          highscore = score;
          document.querySelector('.highscore').textContent = highscore;
        }
      }
    }
  } else {
    document.querySelector('.message').textContent = '💃🎉🪩👯‍♀️ Wrong Number!';
    document.body.style.backgroundColor = '#fa5252';
  }
});

//9. when pressed again everything resets but the highscore
document.querySelector('.again').addEventListener('click', function () {
  secretN = generateSecretN();
  score = 20;
  document.querySelector('.score').textContent = score;
  document.body.style.backgroundColor = '#222222';
  document.querySelector('.number').textContent = '?';
  document.querySelector('.message').textContent = 'Start guessing...';
});
