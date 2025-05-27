// This is where the games Logic lies!!

let paragraphs = [];
let currentText = "";
let startTime;
let timerInterval;

async function loadParagraphs() {
    const res = await fetch("paragraphs.json");
    paragraphs = await res.json();
    loadNewParagraph();
}

function loadNewParagraph() {
    document.getElementById("input-area").disabled = false;
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    currentText = paragraphs[randomIndex];
    document.getElementById("lyrics-display").textContent = currentText;
    document.getElementById("input-area").value = "";
    document.getElementById("wpm").textContent = "0";
    document.getElementById("accuracy").textContent = "100";
    document.getElementById("timer").textContent = "0";
    document.getElementById("progress-bar").style.width = "0%";
    clearInterval(timerInterval);
    startTime = null;
}

function calculateStats(input) {
    const elapsed = (Date.now() - startTime) / 1000;
    const words = input.trim().split(/\s+/).length;
    const correctChars = input.split("").filter((c, i) => c === currentText[i]).length;
    const accuracy = Math.round((correctChars / currentText.length) * 100);
    const wpm = Math.round((words / elapsed) * 60);

    const isComplete = input.length >= currentText.length;

    document.getElementById("wpm").textContent = isNaN(wpm) ? "0" : wpm;
    document.getElementById("accuracy").textContent = isNaN(accuracy) ? "100" : accuracy;
    document.getElementById("timer").textContent = Math.floor(elapsed);

    const progress = Math.min(100, (input.length / currentText.length) * 100);
    document.getElementById("progress-bar").style.width = `${progress}%`;

    updateTextHighlight(input);

    if (isComplete) {
        clearInterval(timerInterval); // Stop updates
        document.getElementById("input-area").disabled = true; // Optional: prevent further typing
    }

  /*
  document.getElementById("wpm").textContent = isNaN(wpm) ? "0" : wpm;
  document.getElementById("accuracy").textContent = isNaN(accuracy) ? "100" : accuracy;
  document.getElementById("timer").textContent = Math.floor(elapsed);

  const progress = Math.min(100, (input.length / currentText.length) * 100);
  document.getElementById("progress-bar").style.width = `${progress}%`;

  updateTextHighlight(input);
  */
}

function updateTextHighlight(input) {
    const display = document.getElementById("lyrics-display");
    let formatted = "";
    for (let i = 0; i < currentText.length; i++) {
        const char = currentText[i];
        if (i < input.length) {
            const typedChar = input[i];
            const className = typedChar === char ? "correct" : "incorrect";
            formatted += `<span class="${className}">${char}</span>`;
        } else {
            formatted += char;
        }
    }
    display.innerHTML = formatted;
}

document.getElementById("input-area").addEventListener("input", e => {
    const input = e.target.value;

    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const input = document.getElementById("input-area").value;
            calculateStats(input); 
        }, 1000); // 1 second, 500 - 0.5 seconds
    }
    calculateStats(input);
});

document.getElementById("restart").addEventListener("click", loadNewParagraph);

document.getElementById("theme-change-btn").addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    let nextTheme = "light";
    if (currentTheme === "light") {
        nextTheme = "dark";
    } else if (currentTheme === "dark") {
        nextTheme = "pastel";
    } else if (currentTheme === "pastel") {
        nextTheme = "light";
    }
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
});

window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    loadParagraphs();
});
