var context;

// --- buffer loader
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function (url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function () {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function (buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function (error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function () {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function () {
  for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
}

// --- init buffers

// Keep track of all loaded buffers.
var BUFFERS = {};

// An object to track the buffers to load {name: path}
var BUFFERS_TO_LOAD = {
  kick: 'sounds/kick.wav',
  snare: 'sounds/snare.wav',
  hihat: 'sounds/hihat.wav',
};

// Loads all sound samples into the buffers object.
function loadBuffers() {
  // Array-ify
  var names = [];
  var paths = [];
  for (var name in BUFFERS_TO_LOAD) {
    var path = BUFFERS_TO_LOAD[name];
    names.push(name);
    paths.push(path);
  }
  bufferLoader = new BufferLoader(context, paths, function (bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      var name = names[i];
      BUFFERS[name] = buffer;
    }
  });
  bufferLoader.load();
}

// --- Rythm

var Rhythm = {
};

Rhythm.tempo = 80;
Rhythm.loop = true;
Rhythm.eighthNoteTime = function (tempo) {
  return (60 / tempo) / 2;
};
Rhythm.start = function () {
  this.loop = true;
  this.play();
}
Rhythm.stop = function () {
  this.loop = false;
}
Rhythm.play = function () {
  if (!this.loop) {
    return
  }
  function playSound(buffer, time) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    if (!source.start)
      source.start = source.noteOn;
    source.start(time);
  }

  var kick = BUFFERS.kick;
  var snare = BUFFERS.snare;
  var hihat = BUFFERS.hihat;

  // We'll start playing the rhythm 100 milliseconds from "now"
  var startTime = context.currentTime + 0.100;
  var tempo = this.tempo;
  var eighthNoteTime = this.eighthNoteTime(tempo);
  document.getElementById('loop-bpm').innerHTML = tempo;

  var time = startTime + eighthNoteTime;

  // Play the bass (kick) drum on beats 1, 5
  playSound(kick, time);
  playSound(kick, time + 4 * eighthNoteTime);

  // Play the snare drum on beats 3, 7
  playSound(snare, time + 2 * eighthNoteTime);
  playSound(snare, time + 6 * eighthNoteTime);

  // Play the hi-hat every eighthh note.
  for (var i = 0; i < 8; ++i) {
    playSound(hihat, time + i * eighthNoteTime);
  }

  setTimeout(function () { Rhythm.play(); }, (8 * eighthNoteTime * 1000));
};






window.addEventListener('load', init, false);
function init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    // Load buffers
    loadBuffers();
  }
  catch (e) {
    alert('Web Audio API is not supported in this browser');
  }
}


function updateUI(audioParams) {
  document.getElementById('bpm').innerHTML = audioParams.bpm
  Rhythm.tempo = audioParams.bpm
}

document.addEventListener('DOMContentLoaded', function () {
  const poller = new XMLHttpRequest()
  setInterval(function () {
    poller.open('GET', '/audio-params')
    poller.responseType = 'json'
    poller.onload = () => updateUI(poller.response)
    poller.send()
  }, 3000);
});
