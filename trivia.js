const triviaQuestion = document.getElementById('trivia-question');
const answersForm = document.getElementById('answers-form');
const answersDiv = document.getElementById('answers');
const elaboration = document.getElementById('elaboration');
const newQuestionBtn = document.createElement('button'); // Create the 'New Question' button
newQuestionBtn.textContent = 'New Question';
newQuestionBtn.style.display = 'none'; // Initially hide the button

let correctAnswer;
let randomLine;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayTrivia() {
    fetch('trivia/trivia.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            randomLine = lines[Math.floor(Math.random() * (lines.length-1))].split('!');
            const question = randomLine[0];
            const answers = randomLine.slice(1, 5);
            const elaborationCorrect = randomLine[5];
            const elaborationIncorrect = randomLine[6];

            triviaQuestion.textContent = question;

            shuffleArray(answers);
            correctAnswer = answers.indexOf(randomLine[4]);

            answersDiv.innerHTML = '';
            answers.forEach((answer, index) => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="radio" name="answer" value="${index}">
                    ${answer}
                `;
                answersDiv.appendChild(label);
            });

            newQuestionBtn.style.display = 'block'; // Show the 'New Question' button
        })
        .catch(error => console.error('Failed to load trivia: ', error));
}

answersForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');

    if (selectedAnswer) {
        const selectedValue = parseInt(selectedAnswer.value);

        if (selectedValue === correctAnswer) {
            elaboration.textContent = 'Correct! ' + randomLine[5];
        } else {
            elaboration.textContent = 'Incorrect! ' + randomLine[6];
        }

        elaboration.style.display = 'block';
        elaboration.style.opacity = 0;
        fadeIn(elaboration);
    }
});

newQuestionBtn.addEventListener('click', function() {
    elaboration.textContent = ''; // Clear the elaboration
    elaboration.style.display = 'none'; // Hide the elaboration
    displayTrivia(); // Display a new trivia question
});

function fadeIn(element) {
    let op = 0.1;  // initial opacity
    const timer = setInterval(function() {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        op += op * 0.1;
    }, 50);
}

// Append the 'New Question' button to the body
document.body.appendChild(newQuestionBtn);

// Display the first trivia question immediately
displayTrivia();
