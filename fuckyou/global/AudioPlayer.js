const songSrc = '/pages/sotm/song.mp3';
const container = document.getElementById('audio-container');

const seekbarWidth = 2;
const targetBars = 192;

function createWaveformPlayer(container, songSrc) {
    let hoverX = null;

    const player = document.createElement("div");
    player.className = "player";

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 100;
    canvas.style.background = "#1e1e1e";
    canvas.style.border = "1px solid #333";
    canvas.style.cursor = "pointer";

    const controls = document.createElement("div");
    controls.className = "controls";
    controls.style.marginTop = "10px";
    controls.style.display = "flex";
    controls.style.alignItems = "center";
    controls.style.gap = "10px";

    const playPauseBtn = document.createElement("button");
    playPauseBtn.textContent = "▶️";

    const volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = 0.01;
    volumeSlider.value = 1;
    volumeSlider.style.width = "100px";

    const audio = document.createElement("audio");
    audio.src = songSrc;
    audio.crossOrigin = "anonymous";

    controls.appendChild(playPauseBtn);
    controls.appendChild(volumeSlider);
    player.appendChild(canvas);
    player.appendChild(controls);
    player.appendChild(audio);
    container.appendChild(player);

    const ctx = canvas.getContext("2d");

    const audioCtx = new window.AudioContext();
    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.85;

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    playPauseBtn.onclick = () => {
        if (audio.paused) {
            audioCtx.resume();
            audio.play();
            playPauseBtn.textContent = "⏸️";
        } else {
            audio.pause();
            playPauseBtn.textContent = "▶️";
        }
    };

    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value;
    });

    canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / canvas.width;
        audio.currentTime = percent * audio.duration;
    });

    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        hoverX = e.clientX - rect.left;
    });

    canvas.addEventListener("mouseleave", () => {
        hoverX = null;
    });

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        const progress = audio.currentTime / audio.duration || 0;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const playedWidth = canvasWidth * progress;

        // 1. Draw full dark background
        ctx.fillStyle = "#1e1e1e";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 2. Overlay "played" portion in lighter grey
        ctx.fillStyle = "#555"; // Light grey progress background
        ctx.fillRect(0, 0, playedWidth, canvasHeight);

        // 3. Draw bars on top
        const barWidth = canvasWidth / targetBars;
        const smoothed = downsampleArray(dataArray, targetBars);

        let barHeight;

        for (let i = 0; i < smoothed.length; i++) {
            barHeight = (smoothed[i] / 255) * canvasHeight;
            const x = i * barWidth;
            const y = canvasHeight - barHeight;

            const boostFactor = Math.pow(i / smoothed.length, 2);
            barHeight *= 1 + boostFactor * 1.2;

            ctx.fillStyle = "#4fc3f7";
            ctx.fillRect(x, y, barWidth - 1, barHeight);
        }

        if (hoverX !== null) {
            ctx.fillStyle = "#aaa";
            ctx.fillRect(hoverX - seekbarWidth / 2, 0, seekbarWidth, canvas.height);
        }
    }

    draw();
}

function downsampleArray(arr, targetCount) {
    const step = arr.length / targetCount;
    const result = [];
    for (let i = 0; i < targetCount; i++) {
        const start = Math.floor(i * step);
        const end = Math.floor((i + 1) * step);
        let avg = 0;
        for (let j = start; j < end; j++) {
            avg += arr[j] || 0;
        }
        avg /= (end - start || 1);
        result.push(avg);
    }
    return result;
}


if (container) {
    createWaveformPlayer(container, songSrc);
}