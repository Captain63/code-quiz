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
    },
    question3: {
        text: `What is the difference between triple equals (===) and double equals (==) in JavaScript?`,
        answers: {
            answer1: {
                text: `Double equals sets a variable equal to a value, triple equals compares values/variables`,
                correct: false
            },
            answer2: {
                text: `Double equals compares value and type, triple equals only compares value`,
                correct: false
            },
            answer3: {
                text: `There is no difference`,
                correct: false
            },
            answer4: {
                text: `Triple equals compares value and type, double equals only compares value (correct)`,
                correct: true
            }
        }
    },
    question4: {
        text: `What is a major advantage of using back ticks (\`\`) for enclosing strings?`,
        answers: {
            answer1: {
                text: `They look cool`,
                correct: false
            },
            answer2: {
                text: `They are better for performance`,
                correct: false
            },
            answer3: {
                text: `You don't need to escape most special characters`,
                correct: true
            },
            answer4: {
                text: `There is no advantage`,
                correct: false
            }
        }
    },
    question5: {
        text: `When passing an object or array into local storage, what method must be used?`,
        answers: {
            answer1: {
                text: `JSON.parse()`,
                correct: false
            },
            answer2: {
                text: `.toString()`,
                correct: false
            },
            answer3: {
                text: `JSON.stringify()`,
                correct: true
            },
            answer4: {
                text: `.join()`,
                correct: false
            }
        }
    }
    // Add other questions once confirmed this method will work
}

const tally = {
    correct: 0,
    incorrect: 0,
    timeLeft: 0
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
    const correct = document.querySelector("#question #correct");

    // Reset scores for each quiz round
    tally.correct = 0;
    tally.incorrect = 0;

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

    // Question countdown section
    let timeLeft = 60;

    const timerFunction = () => {
        document.querySelector("#question #timer").innerText = `Timer: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            questionScreen.classList.toggle("hide");
            document.querySelector("#times-up").classList.toggle("hide");
            let timeLeft2 = 3;
            const timesUpTimer = setInterval(function () {
                if (timeLeft2 === 0) {
                    clearInterval(timesUpTimer);
                    document.querySelector("#times-up").classList.toggle("hide");
                    // Stores finish time in global tally object
                    tally.timeLeft = timeLeft;
                    showFinishScreen();
                }
                timeLeft2--;
            }, 1000);
            // Prevents decrementer from running again (resulting in -1 final time) if timer hits 0
            return;
        }
        timeLeft--;
        // Sets 1 second interval
    }

    const questionTimer = setInterval(timerFunction, 1000);

    // Initializes first question before event listeners take over
    questionServer("question1");

    answers.forEach(answer => {
        answer.addEventListener("click", function(event) {

            if (answer.dataset.correct === "true") {
                tally.correct++;
                correct.innerHTML = "<em>Correct!</em>";
            } else {
                if (timeLeft >= 5) {
                    timeLeft -= 5;
                } else {
                    timeLeft = 0;
                }
                
                tally.incorrect++;
                correct.innerHTML = "<strong>WRONG</strong>";
            }

            answerText.textContent = "";

            // Confirms next question exists before proceeding to populate
            if (questionLibrary[`question${questionCounter}`]) {
                questionServer(`question${questionCounter}`);

            // Once all questions have been answered
            } else {
                // Prevents questionTimer from continuing to run in background
                clearInterval(questionTimer);
                // Stores finish time in global tally object
                tally.timeLeft = timeLeft;
                showFinishScreen();
            }
        });
    })
}

const showFinishScreen = () => {
    questionScreen.classList.add("hide");
    finishScreen.classList.toggle("hide");
    console.log(tally.correct);
    console.log(tally.incorrect);
    console.log(tally.timeLeft);

    // showScores();
}

const showScores = () => {
    
}

// Start button event listener to trigger sequence
startButton.addEventListener("click", startGame);

// Runs on load time and also called on Restart button
init();