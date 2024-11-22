document.addEventListener("DOMContentLoaded", () => {
    // extract page elements
    const elements = {
        screens: {
            start: document.getElementById("screen-start"),
            mode: document.getElementById("screen-mode"),
            animals: document.getElementById("screen-animal"),
            question: document.getElementById("screen-question"),
            guess: document.getElementById("screen-guess"),
            result: document.getElementById("screen-result"),
        },
        buttons: {
            start: document.getElementById("button-start"),
            guess: document.getElementById("button-guess"),
            guesser: document.getElementById("button-guesser"),
            continue: document.getElementById("button-continue"),
            yes: document.getElementById("button-yes"),
            no: document.getElementById("button-no"),
            correct: document.getElementById("button-correct"),
            incorrect: document.getElementById("button-incorrect"),
            replay: document.getElementById("button-replay"),
        },
        messages: {
            animal: document.getElementById("message-animal"),
            question: document.getElementById("message-question"),
            guess: document.getElementById("message-guess"),
            result: document.getElementById("message-result"),
        },
        images: {
            guess: document.getElementById("image-guess"),
            result: document.getElementById("image-result"),
        }
    };

    // questions decision tree
    const questions = [
        { yes: 1, no: 2, text: "does it have legs?", path: null },              // 00
        { yes: 6, no: 8, text: "is it a mammal?", path: null },                 // 01
        { yes: 3, no: 4, text: "does it fly?", path: null },                    // 02
        { yes: 5, no: 7, text: "is it an insect?", path: null },                // 03
        { yes: 9, no: 10, text: "does it swim?", path: null },                  // 04
        { yes: null, no: null, text: "Butterfly", path: "butterfly-7x5.jpg" },  // 05
        { yes: null, no: null, text: "Chimpanzee", path: "chimpanzee-7x5.jpg" },// 06
        { yes: null, no: null, text: "Eagle", path: "eagle-7x5.jpg" },          // 07
        { yes: null, no: null, text: "Frog", path: "frog-7x5.jpg" },            // 08
        { yes: null, no: null, text: "Salmon", path: "salmon-7x5.jpg" },        // 09
        { yes: null, no: null, text: "Snake", path: "snake-7x5.jpg" },          // 10
    ];
    let currentQuestion = 0;
    let isGuess = true;
    let isGuessCorrect = true;

    // Utility functions
    const switchScreen = (hide, show) => {
        hide.classList.add("hidden");
        show.classList.remove("hidden");
    };

    const updateMessage = (element, text) => {
        elements.messages[element].textContent = text;
    };

    const updateImage = (image, path, isRedScale = false) => {
        const imageElement = elements.images[image];

        if (imageElement) {
            imageElement.src = `./assets/images/${path}`;
            imageElement.style.filter = isRedScale
                ? "grayscale(100%) sepia(100%) saturate(500%) hue-rotate(-50deg)"
                : "none";
        } else {
            console.error(`Element with id "${image}" not found.`);
        }
    };

    const sendData = () => {
        fetch('http://127.0.0.1:5000/guess-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                animal: questions[currentQuestion].text,
                isGuess: isGuess, 
                isGuesser: isGuessCorrect,
            }),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error))
    };

    // Handle answers (Yes/No) in the decision tree
    const handleAnswer = (answer) => {
        currentQuestion = questions[currentQuestion][answer];
        updateMessage("question", questions[currentQuestion].text);

        if (questions[currentQuestion].yes === questions[currentQuestion].no) {
            updateMessage("guess", `is it a ${questions[currentQuestion].text}?`);
            updateImage("guess", questions[currentQuestion].path);
            switchScreen(elements.screens.question, elements.screens.guess);
        }
    };

    elements.buttons.yes.addEventListener("click", () => handleAnswer("yes"));
    elements.buttons.no.addEventListener("click", () => handleAnswer("no"));

    elements.buttons.correct.addEventListener("click", () => {
        switchScreen(elements.screens.guess, elements.screens.result);

        updateMessage("result", `it's a ${questions[currentQuestion].text}!`);
        updateImage("result", questions[currentQuestion].path, false);
    });

    elements.buttons.incorrect.addEventListener("click", () => {
        isGuessCorrect = false;
        switchScreen(elements.screens.guess, elements.screens.result);

        updateMessage("result", `it's not a ${questions[currentQuestion].text}?`);
        updateImage("result", questions[currentQuestion].path, true);
    });

    // Event listeners
    const buttonActions = {
        start: () => {
            switchScreen(elements.screens.start, elements.screens.mode);
        },
        guess: () => {
            updateMessage("animal", "animals you can guess");
            switchScreen(elements.screens.mode, elements.screens.animals);
        },
        guesser: () => {
            isGuess = false;

            updateMessage("animal", "animal I can guess");
            switchScreen(elements.screens.mode, elements.screens.animals);
        },
        continue: () => {
            currentQuestion = 0;
            updateMessage("question", questions[currentQuestion].text);
            switchScreen(elements.screens.animals, elements.screens.question);
        },
        replay: () => {
            switchScreen(elements.screens.result, elements.screens.start)
            sendData()
        },
    };

    Object.entries(buttonActions).forEach(([buttonName, action]) => {
        elements.buttons[buttonName].addEventListener("click", action);
    });
});
