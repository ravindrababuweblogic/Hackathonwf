let nameInput = document.getElementById('name');
let emailInput = document.getElementById('email');
let recordButton = document.getElementById('recordButton');
let audioPlayer = document.getElementById('audioPlayer');
let filenameInput = document.getElementById('filename');

// Initialize Recorder.js
let recorder;
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    recorder = new Recorder(stream);
  });

recordButton.addEventListener('click', () => {
  recorder.record();
});

let recording = false;

function createDownloadLink() {
  recorder && recorder.exportWAV(function(blob) {
    let url = URL.createObjectURL(blob);
    audioPlayer.src = url;
    audioPlayer.style.display = "";
    filenameInput.value = url;
  });
}

function setInputFile() {
  filenameInput.value = audioPlayer.src;
}

// Add event listener to stop recording when audio player stops playing
audioPlayer.addEventListener('ended', createDownloadLink);

// Add event listener to form submission
let myForm = document.getElementById('myForm');
myForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (recording) {
    recorder.stop();
    recording = false;
  } else {
    createDownloadLink();
    setInputFile();
  }
});
