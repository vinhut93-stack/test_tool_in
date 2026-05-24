export function loadQuestion(state) {

    const lesson =
        state.filteredLessons[
        state.currentIndex
        ];

    if (!lesson) return;

    document
        .getElementById(
            "lesson-image"
        )
        .src =
        lesson.img;

    document
        .getElementById(
            "lesson-image"
        )
        .onerror =
        function () {
            this.src =
                "https://img.icons8.com/fluency/240/image.png";
        };

    document
        .getElementById(
            "meaning"
        )
        .innerText =
        lesson.meaning;

    document
        .getElementById(
            "feedback-msg"
        )
        .innerHTML = "";

    document
        .getElementById(
            "selected-answer"
        )
        .innerHTML = "";

    document
        .getElementById(
            "answer-input"
        )
        .value = "";

    renderQuestion(
        lesson,
        state.difficulty
    );

    updateProgress(
        state
    );

    speak(
        lesson.word
    );
}

function renderQuestion(
    lesson,
    difficulty
) {

    const mode =
        document
            .getElementById(
                "mode-pill"
            );

    if (
        difficulty === "hard"
    ) {

        mode.innerText =
            "🔴 Hard";

        renderTyping(
            lesson
        );

        return;
    }

    if (
        difficulty === "easy"
    ) {

        mode.innerText =
            "🟢 Easy";

        renderChoose(
            lesson,
            1,
            4
        );

        return;
    }

    mode.innerText =
        "🟡 Normal";

    renderChoose(
        lesson,
        2,
        8
    );
}

function renderChoose(
    lesson,
    missingCount,
    optionCount
) {

    document
        .getElementById(
            "typing-area"
        )
        .style.display =
        "none";

    document
        .getElementById(
            "letters-grid"
        )
        .style.display =
        "grid";

    const word =
        lesson.word
            .toUpperCase();

    const hidden =
        [];

    while (
        hidden.length
        <
        missingCount
    ) {

        const i =
            Math.floor(
                Math.random()
                *
                word.length
            );

        if (
            !hidden.includes(i)
        ) {

            hidden.push(i);
        }
    }

    let displayWord = "";
    const correct = [];

    word
        .split("")
        .forEach(
            (
                char,
                index
            ) => {

                if (
                    hidden.includes(
                        index
                    )
                ) {

                    displayWord +=
                        "_ ";

                    correct.push(
                        char
                    );

                } else {

                    displayWord +=
                        char + " ";
                }
            });

    document
        .getElementById(
            "word-display"
        )
        .innerText =
        displayWord;

    const options =
        [...correct];

    const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    while (
        options.length
        <
        optionCount
    ) {

        options.push(

            alphabet[
            Math.floor(
                Math.random()
                *
                alphabet.length
            )
            ]
        );
    }

    shuffle(
        options
    );

    window.selectedLetters =
        [];

    window.correctLetters =
        correct;

    const grid =
        document
            .getElementById(
                "letters-grid"
            );

    grid.innerHTML = "";

    options.forEach(
        letter => {

            const btn =
                document
                    .createElement(
                        "button"
                    );

            btn.className =
                "letter-btn";

            btn.innerText =
                letter;

            btn.onclick =
                () => {

                    if (
                        window
                            .selectedLetters
                            .length
                        >=
                        correct.length
                    ) {
                        return;
                    }

                    btn.classList
                        .add(
                            "selected"
                        );

                    window
                        .selectedLetters
                        .push(letter);

                    renderSelected();

                    fadeButtons();
                };

            grid.appendChild(
                btn
            );
        });
}

function fadeButtons() {

    const buttons =
        document
            .querySelectorAll(
                ".letter-btn"
            );

    buttons.forEach(
        btn => {

            if (
                !btn.classList
                    .contains(
                        "selected"
                    )
            ) {

                btn.classList
                    .add("fade");
            }
        });
}

function renderTyping() {

    document
        .getElementById(
            "typing-area"
        )
        .style.display =
        "block";

    document
        .getElementById(
            "letters-grid"
        )
        .style.display =
        "none";

    document
        .getElementById(
            "word-display"
        )
        .innerText =
        "⌨️ Type The Word";
}

function renderSelected() {

    const box =
        document
            .getElementById(
                "selected-answer"
            );

    box.innerHTML = "";

    window
        .selectedLetters
        .forEach(
            letter => {

                const pill =
                    document
                        .createElement(
                            "div"
                        );

                pill.className =
                    "answer-pill";

                pill.innerText =
                    letter;

                box.appendChild(
                    pill
                );
            });
}

export function checkAnswer(
    lesson,
    difficulty
) {

    if (
        difficulty === "hard"
    ) {

        const value =
            document
                .getElementById(
                    "answer-input"
                )
                .value
                .trim()
                .toLowerCase();

        return (
            value ===
            lesson.word
                .toLowerCase()
        );
    }

    return (
        JSON.stringify(
            window
                .selectedLetters
        )
        ===
        JSON.stringify(
            window
                .correctLetters
        )
    );
}

function speak(text) {

    const utter =
        new SpeechSynthesisUtterance(
            text
        );

    utter.lang =
        "en-US";

    utter.rate =
        .9;

    speechSynthesis
        .cancel();

    speechSynthesis
        .speak(
            utter
        );
}

function shuffle(arr) {

    for (
        let i =
            arr.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random()
                * (i + 1)
            );

        [
            arr[i],
            arr[j]
        ] =
            [
                arr[j],
                arr[i]
            ];
    }
}

function updateProgress(
    state
) {

    const total =
        state.filteredLessons
            .length;

    const current =
        state.currentIndex + 1;

    document
        .getElementById(
            "lesson-count"
        )
        .innerText =
        `${current}/${total}`;

    document
        .getElementById(
            "progress-bar"
        )
        .style.width =
        `${(current / total) * 100}%`;
}