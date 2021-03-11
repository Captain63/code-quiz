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

let tally = {
    correct: 0,
    incorrect: 0,
    timeLeftCount: 0,
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
    tally.timeLeftCount = 0;

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
                    tally.timeLeftCount = timeLeft;
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
                console.log(questionCounter);

            // Once all questions have been answered
            } else {
                // Prevents questionTimer from continuing to run in background
                clearInterval(questionTimer);
                // Stores finish time in global tally object
                tally.timeLeftCount = timeLeft;
                showFinishScreen();
            }
        });
    })
}

const finalScores = [];

const showFinishScreen = () => {
    questionScreen.classList.add("hide");
    finishScreen.classList.toggle("hide");
    const finalScore = document.querySelector("#finish ul");

    /* Clears any existing score so new score isn't appended onto existing list items */
    finalScore.innerHTML = "";

    localStorage.clear();

    const listItems = [];

    // Creates an array of 3 list items
    for (let i = 0; i < 3; i++) {
        listItems.push(document.createElement("li"));
    }

    // Assigns score values to list items
    listItems[0].textContent = `Time Remaining: ${tally.timeLeftCount}`;
    listItems[1].textContent = `# Right: ${tally.correct}`;
    listItems[2].textContent = `# Wrong: ${tally.incorrect}`;

    // Appends each list item to ul
    listItems.forEach(listItem => {
        finalScore.appendChild(listItem);
    })

    const initialsForm = document.querySelector("#finish form");
    const initialsInput = document.querySelector("#finish input");

    initialsForm.addEventListener("submit", event => {
        event.preventDefault();

        // Adds initials property to tally object
        tally.initials = initialsInput.value;

        const tallyArray = [tally.initials, tally.timeLeftCount, tally.correct];
        finalScores.push(tallyArray);

        localStorage.setItem("scores", JSON.stringify(finalScores));
        showScores();
    })

}

const showScores = () => {
    questionScreen.classList.add("hide");
    finishScreen.classList.add("hide");
    scoresScreen.classList.remove("hide");

    const scores = JSON.parse(localStorage.getItem("scores"));
    const scoreList = document.querySelector("#scores ul");
    const scoreListItems = [];

    /* Clears any existing scores of list items aren't appended onto existing list items */
    scoreList.innerHTML = "";

    // Creates as many list items as there are score entries
    for (let i = 0; i < scores.length; i++) {
        scoreListItems.push(document.createElement("li"));
    }

    for (let i = 0; i < scoreListItems.length; i++) {
        scoreListItems[i].textContent = `${scores[i][0]}: ${scores[i][1]} seconds | ${scores[i][2]} correct`;
        scoreList.appendChild(scoreListItems[i]);
    }

    const playAgain = document.querySelector("#play-again");

    playAgain.addEventListener("click", init);

    const clearScores = document.querySelector("#clear-scores");

    clearScores.addEventListener("click", () => {
        localStorage.clear();
        // showScores();
    })
}

// Start button event listener to trigger sequence
startButton.addEventListener("click", startGame);

// Runs on load time and also called on Play Again button
init();