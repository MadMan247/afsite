const triviaQuestion = document.getElementById('trivia-question');
const answersForm = document.getElementById('answers-form');
const answersDiv = document.getElementById('answers');
const elaboration = document.getElementById('elaboration');
const newQuestionButton = document.getElementById('new-question-btn');

let currentQuestion;
let trivia;
let mixedAnswers;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Here in lies the newest of the implementations of this trivia game.

function displayNewTrivia() {
    currentQuestion = trivia[Math.floor(Math.random() * trivia.length)];

    mixedAnswers = [currentQuestion.answers[0], currentQuestion.answers[1], currentQuestion.answers[2], currentQuestion.answers[3]];
    shuffleArray(mixedAnswers);

    triviaQuestion.textContent = currentQuestion.question;
    answersDiv.innerHTML = '';
    elaboration.textContent = '';
    mixedAnswers.forEach((answer, index) => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="radio" name="answer" value="${index}">
            ${answer}
            </input>
        `;
        answersDiv.appendChild(label);
    });

    hideNewQuestionButton();
    hideElaboration();
}

function checkAnswer(e) {
    e.preventDefault();
    const selectedAnswer = document.querySelector(`input[name='answer']:checked`);

    console.log("Let's look at that answer boy, you selected: ", mixedAnswers[parseInt(selectedAnswer.value)]);


    if (mixedAnswers[parseInt(selectedAnswer.value)] === currentQuestion.answers[3]) {
        elaboration.innerHTML =
            `
            <h4>~Correct~</h4>
            <p>${currentQuestion.correctResponse}</p>
            `
        elaboration.textContent = `~Correct~ ${currentQuestion.correctResponse}`;
    } else {
        elaboration.textContent = `~Incorrect~ ${currentQuestion.incorrectResponse}`
    }
    displayElaboration();
    displayNewQuestionButton();
}

function displayNewQuestionButton() {
    newQuestionButton.style.opacity = '1';
    newQuestionButton.style.pointerEvents = 'auto';
}

function hideNewQuestionButton() {
    newQuestionButton.style.opacity = '0';
    newQuestionButton.style.pointerEvents = 'none';
}

function displayElaboration() {
    elaboration.style.opacity  = '1';
}

function hideElaboration() {
    elaboration.style.opacity ='0';
}

async function triviaJson() {
    hideElaboration();
    hideNewQuestionButton();

    trivia = await fetch("./trivia/trivia.json")
        .then((response) => {return response.json()})
        .catch(err => console.error(err));

    displayNewTrivia();

    answersForm.addEventListener('submit', checkAnswer);
    newQuestionButton.addEventListener('click', () => displayNewTrivia());

}


// displayTrivia(); // Display the first trivia question immediately

triviaJson();

