// DOM declarations
const welcomeScreen = document.querySelector("#welcome");
const questionScreen = document.querySelector("#question");
const finishScreen = document.querySelector("#finish");
const scoresScreen = document.querySelector("#scores");
const startButton = document.querySelector("#start-button");

// Question library for serving questions and evaluating user responses
const questionLibrary = {
    question1: {
        text: `Describe the relationship between Java and JavaScript.`,
        answers: {
            answer1: {
                text: `Java is the desktop-based version of JavaScript`,
                correct: false
            },
            answer2: {
                text: `They are not related`,
                correct: true
            },
            answer3: {
                text: `JavaScript was derived from Java`,
                correct: false
            },
            answer4: {
                text: `They were developed by the same team`,
                correct: false
            }
        }
    },
    question2: {
        text: `What symbol do you use to declare an array in JavaScript?`,
        answers: {
            answer1: {
                text: `Square brackets: []`,
                correct: true
            },
            answer2: {
                text: `Parentheses: ()`,
                correct: false
            },
            answer3: {
                text: `Curly brackets: {}`,
                correct: false
            },
            answer4: {
                text: `Back ticks: \`\``,
                correct: false
            }
        }
    }
    // Add other questions once confirmed this method will work
}

const init = () => {
    welcomeScreen.classList.remove("hide");
    scoresScreen.classList.add("hide");
}

const startGame = () => {
    welcomeScreen.classList.toggle("hide");
    questionScreen.classList.toggle("hide");
    const heading = document.querySelector("#question h2");
    const questionP = document.querySelector("#question p");
    const answers = document.querySelectorAll("#question li");
    const correct = document.querySelector("#question h3");
    let answerText = [];
    while (answerText.length < answers.length) {
        answerText.push(document.createElement("span"));
    }

    let questionCounter = 1;
    const questionServer = (question) => {        
        heading.textContent = `Question ${questionCounter}`;
        questionP.textContent = questionLibrary[question].text;
        let answerCounter = 1;
        answers.forEach (answer => {
            let answerSelector = "answer" + answerCounter.toString();
            answerText[answerCounter - 1].textContent = questionLibrary[question].answers[answerSelector].text;
            answer.appendChild(answerText[answerCounter - 1]);
            answer.setAttribute("data-correct", `${questionLibrary[question].answers[answerSelector].correct}`);
            answerCounter++;
        })
        questionCounter++;
    }

    // Initializes first question before event listeners take over
    questionServer("question1");

    answers.forEach(answer => {
        answer.addEventListener("click", function(event) {
            if (answer.dataset.correct === "true") {
                correct.innerHTML = "<em>Correct!</em>";
            } else {
                correct.innerHTML = "<strong>WRONG</strong>";
            }

            answerText.textContent = "";

            // Confirms next question exists before proceeding to populate
            if (questionLibrary[`question${questionCounter}`]) {
                questionServer(`question${questionCounter}`);

            // Once all questions have been answered
            } else {
                showFinishScreen();
            }
        });
    })
}

const showFinishScreen = () => {
    questionScreen.classList.toggle("hide");
    finishScreen.classList.toggle("hide");


    // showScores();
}

const showScores = () => {
    
}

// Start button event listener to trigger sequence
startButton.addEventListener("click", startGame);

// Runs on load time and also called on Restart button
init();