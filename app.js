import { fetchLessons }
    from "./api.js";

import {
    loadQuestion,
    checkAnswer
}
    from "./game.js";

let allLessons = [];
let filteredLessons = [];

let currentIndex = 0;
let currentAgeGroup = "";
let currentDifficulty =
    "easy";

/* ---------- STORAGE ---------- */

let progress =
    JSON.parse(
        localStorage.getItem(
            "englishKidsProgress"
        )
    ) || {

        xp: 0,
        hearts: 5,
        streak: 0

    };

function saveProgress() {

    localStorage.setItem(
        "englishKidsProgress",
        JSON.stringify(
            progress
        )
    );

}

/* ---------- INIT ---------- */

init();

async function init() {

    try {

        allLessons =
            await fetchLessons();

        setupAgeGroups();

        setupDifficulty();

        updateStats();

        hideLoading();

        setupButtons();

        setupMusic();

    } catch (err) {

        console.error(err);

        alert(
            "Không tải được dữ liệu bài học"
        );

    }
}

function hideLoading() {

    document
        .getElementById(
            "loading-screen"
        )
        .style.display =
        "none";

}

/* ---------- AGE GROUP ---------- */

function setupAgeGroups() {

    const select =
        document
            .getElementById(
                "age-group-select"
            );

    const groups =
        [
            ...new Set(
                allLessons.map(
                    x => x.age_group
                )
            )
        ];

    select.innerHTML =
        "";

    groups.forEach(g => {

        const opt =
            document.createElement(
                "option"
            );

        opt.value =
            g;

        opt.innerText =
            g;

        select.appendChild(
            opt
        );

    });

    currentAgeGroup =
        groups[0];

    select.onchange =
        () => {

            currentAgeGroup =
                select.value;

            filterLessons();

        };

    filterLessons();

}

/* ---------- DIFFICULTY ---------- */

function setupDifficulty() {

    document
        .getElementById(
            "difficulty-select"
        )
        .onchange =
        e => {

            currentDifficulty =
                e.target.value;

            render();

        };

}

/* ---------- FILTER ---------- */

function filterLessons() {

    filteredLessons =
        allLessons.filter(
            x =>

                x.age_group ===
                currentAgeGroup

        );

    currentIndex = 0;

    render();

}

/* ---------- RENDER ---------- */

function render() {

    const lesson =
        filteredLessons[
        currentIndex
        ];

    if (!lesson)
        return;

    loadQuestion({

        filteredLessons,

        currentIndex,

        difficulty:
            currentDifficulty

    });

    updateStats();

}

/* ---------- STATS ---------- */

function updateStats() {

    document
        .getElementById(
            "xp-count"
        )
        .innerText =
        progress.xp;

    document
        .getElementById(
            "heart-count"
        )
        .innerText =
        progress.hearts;

    document
        .getElementById(
            "streak-count"
        )
        .innerText =
        progress.streak;

}

/* ---------- BUTTON ---------- */

function setupButtons() {

    /* CHECK */

    document
        .getElementById(
            "btn-check"
        )
        .onclick =
        () => {

            const lesson =
                filteredLessons[
                currentIndex
                ];

            const ok =
                checkAnswer(
                    lesson,
                    currentDifficulty
                );

            const feedback =
                document
                    .getElementById(
                        "feedback-msg"
                    );

            if (ok) {

                feedback.innerHTML =
                    "🎉 Chính xác! +10 XP";

                progress.xp += 10;
                progress.streak += 1;

                saveProgress();

                updateStats();

                setTimeout(
                    () => {

                        next();

                    },
                    900
                );

            } else {

                feedback.innerHTML =
                    "❌ Sai rồi thử lại nhé";

                progress.hearts -= 1;

                if (
                    progress.hearts
                    < 0
                ) {
                    progress.hearts =
                        0;
                }

                saveProgress();

                updateStats();
            }
        };

    /* NEXT */

    document
        .getElementById(
            "btn-next"
        )
        .onclick =
        next;

    /* BACK */

    document
        .getElementById(
            "btn-back"
        )
        .onclick =
        back;

    /* REPEAT */

    document
        .getElementById(
            "btn-repeat"
        )
        .onclick =
        () => {

            const lesson =
                filteredLessons[
                currentIndex
                ];

            const utter =
                new SpeechSynthesisUtterance(
                    lesson.word
                );

            utter.lang =
                "en-US";

            utter.rate =
                0.9;

            speechSynthesis
                .cancel();

            speechSynthesis
                .speak(
                    utter
                );

        };

    /* HINT */

    document
        .getElementById(
            "btn-hint"
        )
        .onclick =
        () => {

            const lesson =
                filteredLessons[
                currentIndex
                ];

            document
                .getElementById(
                    "word-display"
                )
                .innerText =

                lesson.word
                    .slice(0, 2)
                    .toUpperCase()

                +

                " _ _";

        };

    /* ANSWER */

    document
        .getElementById(
            "btn-answer"
        )
        .onclick =
        () => {

            const lesson =
                filteredLessons[
                currentIndex
                ];

            document
                .getElementById(
                    "word-display"
                )
                .innerText =
                lesson.word
                    .toUpperCase();

        };

}

/* ---------- NAV ---------- */

function next() {

    if (
        currentIndex
        <
        filteredLessons.length - 1
    ) {

        currentIndex++;

        render();

    } else {

        alert(
            "🎉 Hoàn thành!"
        );

    }

}

function back() {

    if (
        currentIndex
        > 0
    ) {

        currentIndex--;

        render();

    }

}

/* ---------- MUSIC ---------- */

function setupMusic() {

    const music =
        document.getElementById(
            "bg-music"
        );

    const button =
        document.getElementById(
            "music-toggle"
        );

    let playing =
        false;

    music.volume = 0.3;
    console.log("music ready");

    button.onclick =
        async () => {

            try {

                if (!playing) {

                    await music.play();

                    playing =
                        true;

                    button.innerText =
                        "🔊";

                    button.style.transform =
                        "scale(1.1)";
                    console.log("clicked music");
                } else {

                    music.pause();

                    playing =
                        false;

                    button.innerText =
                        "🎵";

                    button.style.transform =
                        "scale(1)";
                    console.log("clicked music");
                }

            } catch (error) {

                console.error(
                    "Music error:",
                    error
                );

                alert(
                    "Không phát được nhạc nền"
                );
            }
        };
}