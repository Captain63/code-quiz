// Section DOM declarations
const welcomeScreen = document.querySelector("#welcome");
const questionScreen = document.querySelector("#question");
const finishScreen = document.querySelector("#finish");
const scoresScreen = document.querySelector("#scores");
const timesUpScreen = document.querySelector("#times-up");

// Welcome screen DOM delcarations
const scoreButton = document.querySelector("#nav-scores");
const startButton = document.querySelector("#start-button");

// Questions screen DOM declarations
const heading = document.querySelector("#question h2");
const questionP = document.querySelector("#question p");
const answers = document.querySelectorAll("#question li");
const correct = document.querySelector("#question #correct");
const timerHeading = document.querySelector("#question #timer");

// Finished screen DOM declarations
const finalScore = document.querySelector("#finish ul");
const initialsForm = document.querySelector("#finish form");
const initialsInput = document.querySelector("#finish input");

// Question library for serving questions and evaluating user responses
const questionLibrary = [
    {
        text: `Describe the relationship between Java and JavaScript.`,
        answers: [
            {
                text: `Java is the desktop-based version of JavaScript`,
                correct: false
            },
            {
                text: `They are not related`,
                correct: true
            },
            {
                text: `JavaScript was derived from Java`,
                correct: false
            },
            {
                text: `They were developed by the same team`,
                correct: false
            }
        ]
    },
    {
        text: `What symbol do you use to declare an array in JavaScript?`,
        answers: [
            {
                text: `Square brackets: []`,
                correct: true
            },
            {
                text: `Parentheses: ()`,
                correct: false
            },
            {
                text: `Curly brackets: {}`,
                correct: false
            },
            {
                text: `Back ticks: \`\``,
                correct: false
            }
        ]
    },
    {
        text: `What is the difference between triple equals (===) and double equals (==) in JavaScript?`,
        answers: [
            {
                text: `Double equals sets a variable equal to a value, triple equals compares values/variables`,
                correct: false
            },
            {
                text: `Double equals compares value and type, triple equals only compares value`,
                correct: false
            },
            {
                text: `There is no difference`,
                correct: false
            },
            {
                text: `Triple equals compares value and type, double equals only compares value`,
                correct: true
            }
        ]
    },
    {
        text: `What is a major advantage of using back ticks (\`\`) for enclosing strings?`,
        answers: [
            {
                text: `They look cool`,
                correct: false
            },
            {
                text: `They are better for performance`,
                correct: false
            },
            {
                text: `You don't need to escape most special characters`,
                correct: true
            },
            {
                text: `There is no advantage`,
                correct: false
            }
        ]  
    },
    {
        text: `When passing an object or array into local storage, what method must be used?`,
        answers: [
            {
                text: `JSON.parse()`,
                correct: false
            },
            {
                text: `.toString()`,
                correct: false
            },
            {
                text: `JSON.stringify()`,
                correct: true
            },
            {
                text: `.join()`,
                correct: false
            }
        ]
    }
]

// Global tally object to record score of each round. Accessed by startGame() and showFinishScreen()
let tally = {
    correct: 0,
    incorrect: 0,
    timeLeftCount: 0
}

// Function to show Welcome Message on page load or if user chooses to play again
const init = () => {
    scoresScreen.classList.add("hide");
    welcomeScreen.classList.remove("hide");
    scoreButton.classList.remove("hide");
}

// Function to initiate game after Welcome screen */
const startGame = () => {
    welcomeScreen.classList.add("hide");
    scoreButton.classList.add("hide");
    questionScreen.classList.remove("hide");

    // Clears existing correct message if user reinitiates game after completing
    correct.innerHTML = "";

    // Record scores for each round
    let correctCount = 0;
    let incorrectCount = 0;

    // Declares empty array and then populates with four spans
    const answerText = document.querySelectorAll("#question li span");
    
    // Question countdown timer variable set
    let timeLeft = 60;
    timerHeading.textContent = `Timer: ${timeLeft}`;

    document.querySelector("#question #timer").innerText = `Timer: ${timeLeft}`;

    // "Index" value for questionServer to advance question displayed after answer is clicked
    let questionCounter = 0;

    // Question server function - accesses questionLibrary properties to populate each question
    const questionServer = (question) => {        
        heading.textContent = `Question ${question + 1}`;
        questionP.textContent = questionLibrary[question].text;
        let answerCounter = 0;
        answers.forEach (answer => {
            answerText[answerCounter].textContent = questionLibrary[question].answers[answerCounter].text;
            // answer.appendChild(answerText[answerCounter - 1]);
            answer.setAttribute("data-correct", `${questionLibrary[question].answers[answerCounter].correct}`);
            answerCounter++;
        })
    }

    // Question timer function (called by setInterval)
    const timerFunction = () => {
        timerHeading.textContent = `Timer: ${timeLeft}`;

        // Fires if timer runs out
        if (timeLeft <= 0) {
            // Prevents questionTimer from continuing to run in background
            clearInterval(questionTimer);
            questionScreen.classList.add("hide");
            timesUpScreen.classList.remove("hide");
            // Removes answer event listeners so they aren't stacked on next startGame() call
            answers.forEach(answer => {
                answer.removeEventListener("click", questionChecker);
            })
            let timeLeft2 = 2;
            // Timer for how long Times Up screen displays
            const timesUpTimer = setInterval(function () {
                if (timeLeft2 === 0) {
                    // Prevents timesUpTimer from continuing to run in background
                    clearInterval(timesUpTimer);
                    timesUpScreen.classList.add("hide");
                    // Stores finish time and scores in global tally object
                    tally.timeLeftCount = timeLeft;
                    tally.correct = correctCount;
                    tally.incorrect = incorrectCount;
                    showFinishScreen();
                }
                timeLeft2--;
            }, 1000);
            // Prevents timeLeft decrementer from running again (resulting in -1 final time) if timer hits 0
            return;
        }
        timeLeft--;
        // Sets 1 second interval
    }

    // Calls questionTimer on startGame() call
    const questionTimer = setInterval(timerFunction, 1000);

    // Initializes first question before event listeners take over
    questionServer(0);

    // Function to evaluate if questions are correct and serve next question
    const questionChecker = event => {

    if (
        // Checks list item and parent of list item (if user clicks on span)
        (event.target.dataset.correct === "true") ||
        (event.target.parentElement.dataset.correct === "true")
    ) {
        correctCount++;
        correct.innerHTML = "<em>Correct!</em>";
    } else {
        // Confirms timeLeft subtraction won't result in a negative final time
        if (timeLeft >= 5) {
            timeLeft -= 5;
        } else {
            timeLeft = 0;
        }
            
        incorrectCount++;
        correct.innerHTML = "<strong>WRONG</strong>";
    }
        
        questionCounter++;
        // Confirms next question exists based off new questionCounter value before proceeding to populate
        if (questionLibrary[questionCounter]) {
            questionServer(questionCounter);
            
        // Once all questions have been answered
        } else {
            // Prevents questionTimer from continuing to run in background
            clearInterval(questionTimer);
            // Stores finish time and scores in global tally object
            tally.timeLeftCount = timeLeft;
            tally.correct = correctCount;
            tally.incorrect = incorrectCount;
            showFinishScreen();
            
            // Resets questionCounter to 1
            questionCounter = 1;
            // Removes answer event listeners so they aren't stacked on next startGame() call
            answers.forEach(answer => {
                answer.removeEventListener("click", questionChecker);
            })
        }
    };

    // Assigns event listeners to call questionChecker function when an answer is clicked
    answers.forEach(answer => {
        answer.addEventListener("click", questionChecker);
    })
}

// Array to store final scores -- created in global scope for access by showFinishScreen() and showScores()
let finalScoresArray = [];

const showFinishScreen = () => {
    questionScreen.classList.add("hide");
    finishScreen.classList.remove("hide");

    /* Clears any existing score so new score isn't appended onto existing list items */
    finalScore.innerHTML = "";

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

        // Adds initials property to tally object
        tally.initials = initialsInput.value;

        // Creates array of tally properties to push to tallyArray
        const tallyArray = [tally.initials, tally.timeLeftCount, tally.correct];
        finalScoresArray.push(tallyArray);

        // Sends tallyArray to localStorage
        localStorage.setItem("scores", JSON.stringify(finalScoresArray));
        showScores();

        // Removes event listener so that event listeners aren't stacked on input submission
        initialsForm.removeEventListener("submit", initialsSubmission);
    }

    // Adds event listener to initials form to call initialsSubmission()
    initialsForm.addEventListener("submit", initialsSubmission);
}

const showScores = () => {
    questionScreen.classList.add("hide");
    finishScreen.classList.add("hide");
    welcomeScreen.classList.add("hide");
    scoreButton.classList.add("hide");
    scoresScreen.classList.remove("hide");
    
    const scoreList = document.querySelector("#scores ul");

    // Retrieves scores value from localStorage
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

        // Assigns scores from each round to one list item
        for (let i = 0; i < scoreListItems.length; i++) {
            scoreListItems[i].textContent = `${scores[i][0]}: ${scores[i][1]} seconds | ${scores[i][2]} correct`;
            scoreList.appendChild(scoreListItems[i]);
        }

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
        // Filler text if no scores are stored in localStorage
        scoreList.innerHTML = "<p>Awaiting new scores!</p>"
    }
}

// Start button event listener to call startGame()
startButton.addEventListener("click", startGame);

// High Scores event listener to call showScores()
scoreButton.addEventListener("click", showScores);

// Calls init() at run time
init();