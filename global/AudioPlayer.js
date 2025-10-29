const SONG_SRC = "/pages/sotm/song.mp3";
const SONG_TITLE = "Opioid Dose Live at the Richardson Clubhouse (Ed Mix Early2)";
const SONG_ARTIST = "Acid Fog";

window.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element References ---
  const audioPlayer = document.getElementById("audioPlayer");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  const volumeSlider = document.getElementById("volumeSlider");
  const currentTimeEl = document.getElementById("currentTime");
  const totalDurationEl = document.getElementById("totalDuration");
  const songTitleEl = document.getElementById("songTitle");
  const artistNameEl = document.getElementById("artistName");
  const canvas = document.getElementById("waveformCanvas");
  const canvasCtx = canvas.getContext("2d");
  const downloadBtn = document.getElementById("downloadBtn");

  // --- Audio API Setup ---
  let audioContext;
  let analyser;
  let source;
  let dataArray;
  let isAudioContextInitialized = false;

  // --- State Variables ---
  let hoverX = -1; // Tracks mouse X position for the hover indicator

  // --- Initialization ---
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  loadDefaultAudio();
  setDownloadName();

  /**
   * Loads a default audio file.
   */
  function loadDefaultAudio() {
    audioPlayer.src = SONG_SRC;
    songTitleEl.textContent = SONG_TITLE;
    artistNameEl.textContent = SONG_ARTIST;
  }

  /**
   * Initializes the AudioContext.
   */
  function initializeAudioContext() {
    if (isAudioContextInitialized) return;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source = audioContext.createMediaElementSource(audioPlayer);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    isAudioContextInitialized = true;
  }

  /**
   * Draws the waveform and hover indicator on the canvas.
   */
  function drawWaveform() {
    requestAnimationFrame(drawWaveform);

    canvasCtx.fillStyle = "#1a2b1a";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    if (!isAudioContextInitialized) {
      canvasCtx.strokeStyle = "#00ff00";
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, canvas.height / 2);
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    } else {
      analyser.getByteFrequencyData(dataArray);

      const bufferLength = analyser.frequencyBinCount;
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;
      const progress = audioPlayer.duration
        ? audioPlayer.currentTime / audioPlayer.duration
        : 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = Math.log(dataArray[i]) * (canvas.height / 255);
        const isPlayed = x / canvas.width < progress;
        canvasCtx.fillStyle = isPlayed ? "#00ff00" : "#005000";
        canvasCtx.fillRect(
          x,
          (canvas.height - barHeight) / 2,
          barWidth,
          barHeight,
        );
        x += barWidth + 1;
      }
    }

    // --- NEW: Draw Hover Indicator ---
    if (hoverX !== -1 && audioPlayer.duration) {
      canvasCtx.fillStyle = "#ffff00"; // Bright yellow for the indicator
      canvasCtx.fillRect(hoverX, 0, 2, canvas.height); // Draw a 2px wide vertical line
    }
  }

  /**
   * Toggles audio playback.
   */
  function togglePlayPause() {
    if (!audioPlayer.src) return;
    if (!isAudioContextInitialized) initializeAudioContext();

    if (audioPlayer.paused) {
      audioPlayer.play();
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    } else {
      audioPlayer.pause();
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
  }

  /**
   * Formats time in seconds to MM:SS.
   */
  function formatTime(time) {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  /**
   * Sets canvas dimensions.
   */
  function resizeCanvas() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
  }

  function setDownloadName() {
    downloadBtn.download = `${SONG_TITLE} - ${SONG_ARTIST}.mp3`;
  }

  // --- Event Listeners ---

  playPauseBtn.addEventListener("click", togglePlayPause);

  volumeSlider.addEventListener("input", (event) => {
    audioPlayer.volume = event.target.value;
  });

  audioPlayer.addEventListener("timeupdate", () => {
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  });

  audioPlayer.addEventListener("loadedmetadata", () => {
    totalDurationEl.textContent = formatTime(audioPlayer.duration);
  });

  canvas.addEventListener("click", (event) => {
    if (!audioPlayer.duration) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / rect.width;
    audioPlayer.currentTime = percentage * audioPlayer.duration;
  });

  // --- NEW: Listeners for the hover indicator ---
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    // Scale mouse position to canvas resolution
    hoverX = (event.clientX - rect.left) * window.devicePixelRatio;
  });

  canvas.addEventListener("mouseleave", () => {
    hoverX = -1; // Reset when mouse leaves the canvas
  });

  audioPlayer.addEventListener("ended", () => {
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  });

  // --- Start the animation loop ---
  drawWaveform();
});
