// DOM declarations
const welcomeScreen = document.querySelector("#welcome");
const questionScreen = document.querySelector("#question");
const finishScreen = document.querySelector("#finish");
const scoresScreen = document.querySelector("#scores");
const startButton = document.querySelector("#start-button");
const initialsForm = document.querySelector("#finish form");
const initialsInput = document.querySelector("#finish input");
const scoreButton = document.querySelector("#nav-scores");

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
}

let tally = {
    correct: 0,
    incorrect: 0,
    timeLeftCount: 0,
}

const init = () => {
    welcomeScreen.classList.remove("hide");
    scoreButton.classList.remove("hide");
    scoresScreen.classList.add("hide");
}

const startGame = () => {
    welcomeScreen.classList.add("hide");
    scoreButton.classList.add("hide");
    questionScreen.classList.remove("hide");
    const heading = document.querySelector("#question h2");
    const questionP = document.querySelector("#question p");
    const answers = document.querySelectorAll("#question li");
    const correct = document.querySelector("#question #correct");

    correct.innerHTML = "";

    // Record scores for each round
    let correctCount = 0;
    let incorrectCount = 0;

    const answerText = [];
    while (answerText.length < answers.length) {
        answerText.push(document.createElement("span"));
    }

    // Question countdown section
    let timeLeft = 60;

    document.querySelector("#question #timer").innerText = `Timer: ${timeLeft}`;

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
    }

    const timerFunction = () => {
        document.querySelector("#question #timer").innerText = `Timer: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            questionScreen.classList.add("hide");
            document.querySelector("#times-up").classList.remove("hide");
            answers.forEach(answer => {
                answer.removeEventListener("click", questionChecker);
            })
            let timeLeft2 = 3;
            const timesUpTimer = setInterval(function () {
                if (timeLeft2 === 0) {
                    clearInterval(timesUpTimer);
                    document.querySelector("#times-up").classList.add("hide");
                    // Stores finish time in global tally object
                    tally.timeLeftCount = timeLeft;
                    showFinishScreen();
                    const AnswerTextSpan = document.querySelectorAll("#question li span");
                    AnswerTextSpan.forEach(span => {
                        span.remove();
                    })
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

    const questionChecker = event => {

    if (
        (event.target.dataset.correct === "true") ||
        (event.target.parentElement.dataset.correct === "true")
    ) {
        correctCount++;
        correct.innerHTML = "<em>Correct!</em>";
    } else {
        if (timeLeft >= 5) {
            timeLeft -= 5;
        } else {
            timeLeft = 0;
        }
            
        incorrectCount++;
        correct.innerHTML = "<strong>WRONG</strong>";
    }

        answerText.textContent = "";

        // Confirms next question exists before proceeding to populate
        
        questionCounter++;
        if (questionLibrary[`question${questionCounter}`]) {
            questionServer(`question${questionCounter}`);
            console.log(questionCounter);

            console.log(questionLibrary[`question${questionCounter}`]);
        // Once all questions have been answered
        } else {
            // Prevents questionTimer from continuing to run in background
            clearInterval(questionTimer);
            answerText.textContent = "";
            // Stores finish time in global tally object
            tally.timeLeftCount = timeLeft;
            tally.correct = correctCount;
            tally.incorrect = incorrectCount;
            showFinishScreen();
            const AnswerTextSpan = document.querySelectorAll("#question li span");
            AnswerTextSpan.forEach(span => {
                span.remove();
            })
            questionCounter = 1;
            answers.forEach(answer => {
                answer.removeEventListener("click", questionChecker);
            })
        }
    };

    answers.forEach(answer => {
        answer.addEventListener("click", questionChecker);
    })
}

let finalScoresArray = [];

const showFinishScreen = () => {
    questionScreen.classList.add("hide");
    finishScreen.classList.remove("hide");
    const finalScore = document.querySelector("#finish ul");

    /* Clears any existing score so new score isn't appended onto existing list items */
    finalScore.innerHTML = "";

    let tallyArray = [];

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

    const initialsSubmission = event => {
        event.preventDefault();

        console.log(tally);
        // Adds initials property to tally object
        tally.initials = initialsInput.value;

        tallyArray = [tally.initials, tally.timeLeftCount, tally.correct];
        finalScoresArray.push(tallyArray);

        localStorage.setItem("scores", JSON.stringify(finalScoresArray));
        showScores();
        initialsForm.removeEventListener("submit", initialsSubmission);
    }

    initialsForm.addEventListener("submit", initialsSubmission);
}

const showScores = () => {
    questionScreen.classList.add("hide");
    finishScreen.classList.add("hide");
    welcomeScreen.classList.add("hide");
    scoresScreen.classList.remove("hide");
    scoreButton.classList.add("hide");
    
    const scoreList = document.querySelector("#scores ul");
    const scores = JSON.parse(localStorage.getItem("scores"));

    const playAgain = document.querySelector("#play-again");

    playAgain.addEventListener("click", init);

    // Checks if there are scores to display in LocalStorage() -- otherwise filler text is shown
    if (scores) { 
        const scoreListItems = [];

        /* Clears any existing scores so list items aren't appended onto existing list items */
        scoreList.innerHTML = "";

        // Creates as many list items as there are score entries
        for (let i = 0; i < scores.length; i++) {
            scoreListItems.push(document.createElement("li"));
        }

        console.log(scores);

        for (let i = 0; i < scoreListItems.length; i++) {
            scoreListItems[i].textContent = `${scores[i][0]}: ${scores[i][1]} seconds | ${scores[i][2]} correct`;
            scoreList.appendChild(scoreListItems[i]);
        }

        console.log(scoreListItems);

        const clearScores = document.querySelector("#clear-scores");

        clearScores.addEventListener("click", () => {
            localStorage.clear();
            scoreListItems.forEach(listItem => {
                listItem.remove();
            })
            scoreList.innerHTML = "<p>Cleared!</p>";
            // Empties array so scores aren't saved when localStorage is cleared
            finalScoresArray = [];
        })
    } else {
        scoreList.innerHTML = "<p>Awaiting new scores!</p>"
    }
    
}

// Start button event listener to trigger sequence
startButton.addEventListener("click", startGame);

scoreButton.addEventListener("click", showScores);

// Runs on load time and also called on Play Again button
init();