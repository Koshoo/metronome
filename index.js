const startStopButton = document.querySelector('.start-stop');
const bpmSlider = document.querySelector('.bpm-slider-value');
const bpmValue = document.querySelector('.bpm-value');
const beatsPerMeasureSelector = document.querySelector('.beats-per-measure');
const tapTempoButton = document.querySelector('.tap-tempo');
const notificationElement = document.querySelector('.notification');
const soundsRadioButtons = document.querySelectorAll('.sounds');

let currentSound = 'regular';
let click1;
let click2;

// interval set to 0 to pass startStop if statement
let timer = 0;

// default values
let bpm = 120;
let beatsPerMeasure = 4;

// init values
let count = 1;
let playing = false;
let delta = 0;

const playClick = () => {
  // setClickSound
  if (currentSound != getCheckedSound()) {
    console.log('here');
    switch (getCheckedSound()) {
      case 'regular':
        setSounds('regular');
        break;
      case 'clave':
        setSounds('clave');
        break;
      case 'metro':
        setSounds('metro');
      default:
        break;
    }
  }
  // determine which click sound to play and play it
  count % beatsPerMeasure === 0 ? click1.play() : click2.play();
  count = (count + 1) % beatsPerMeasure;
};

const startStop = () => {
  if (timer) {
    // if timer is truthy then clear interval and reset values
    clearInterval(timer);
    playing = false;
    count = 1;
    timer = 0;

    startStopButton.textContent = 'Start';
    startStopButton.style.background = '#4ba52f';
  } else {
    // start the metronome
    playing = true;
    beatsPerMeasure = getBeatsPerMeasure();

    // setting the interval in bpm intervals
    timer = setInterval(() => {
      playClick();
    }, (60 / bpm) * 1000);
    click1.play();

    startStopButton.textContent = 'Stop';
    startStopButton.style.backgroundColor = '#c94d46';
  }
};

const restartWithDifferentOptions = () => {
  clearInterval(timer);
  bpm = +bpmSlider.value;
  beatsPerMeasure = getBeatsPerMeasure();
  timer = setInterval(() => {
    playClick();
  }, (60 / bpm) * 1000);
  click1.play();
};

const getBeatsPerMeasure = () => {
  return +beatsPerMeasureSelector.selectedOptions[0].value;
};

const getCheckedSound = () => {
  let result;
  for (i of soundsRadioButtons) {
    i.checked ? (result = i.value) : '';
  }
  return result;
};

const setSounds = (name) => {
  click1 = new Audio(`./assets/sounds/${name}1.wav`);
  click2 = new Audio(`./assets/sounds/${name}2.wav`);
};

startStopButton.addEventListener('click', () => {
  startStop();
});

bpmSlider.addEventListener('input', ({ target }) => {
  bpm = target.value;
  bpmValue.textContent = `${bpm} BPM`;
});

bpmSlider.addEventListener('change', () => {
  if (playing) {
    restartWithDifferentOptions();
  }
});

beatsPerMeasureSelector.addEventListener('change', () => {
  if (playing) {
    restartWithDifferentOptions();
  }
});

tapTempoButton.addEventListener('click', () => {
  // tap tempo logic
  if (!playing) {
    let d = new Date();
    let temp = parseInt(d.getTime(), 10);
    let result = Math.ceil(60000 / (temp - delta));
    bpm = result;
    bpmValue.textContent = `${result} BPM`;
    bpmSlider.value = result;
    delta = temp;
  } else {
    //if metronome is running display a notification
    notificationElement.classList.remove('hidden');
    setTimeout(() => {
      notificationElement.classList.add('hidden');
    }, 5000);
  }
});

soundsRadioButtons.forEach((rb) =>
  rb.addEventListener('input', () => {
    currentSound = getCheckedSound();
    setSounds(currentSound);
  })
);

// initialize sounds
setSounds(currentSound);
