"use strict";
import {Delay, BiquadFilter,Volume, EQ3,Limiter,Destination, LFO, Waveform, Reverb, Tremolo, Noise, start, MidiClass, Part, Oscillator, Gain, Transport, AmplitudeEnvelope, Synth, Offline, ToneAudioBuffer, Player} from 'tone';
import * as Nexus from 'nexusui';

//import { asdf } from './stuff';

//import files
import audioFileUrlKick1 from 'url:./samples/kick01.mp3';
import audioFileUrlKick2 from 'url:./samples/kick02.mp3';
import audioFileUrlKick3 from 'url:./samples/kick03.mp3';
import audioFileUrlKick4 from 'url:./samples/kick04.mp3';

import audioFileUrlBass101 from 'url:./samples/bass101.mp3';
import audioFileUrlBass102 from 'url:./samples/bass103.mp3';
import audioFileUrlBass103 from 'url:./samples/bass102.mp3';
import audioFileUrlBass104 from 'url:./samples/bass104.mp3';
import audioFileUrlBass105 from 'url:./samples/bass105.mp3';

import audioFileUrlKlick1 from 'url:./samples/klick1.mp3';
import audioFileUrlKlick2 from 'url:./samples/klick2.mp3';
import audioFileUrlKlick3 from 'url:./samples/klick3.mp3';
import audioFileUrlKlick4 from 'url:./samples/klick4.mp3';
import audioFileUrlKlick5 from 'url:./samples/klick5.mp3';
import audioFileUrlKlick6 from 'url:./samples/klick6.mp3';
import audioFileUrlKlick7 from 'url:./samples/klick7.mp3';
import audioFileUrlKlick8 from 'url:./samples/klick8.mp3';
import audioFileUrlKlick9 from 'url:./samples/klick9.mp3';
import audioFileUrlKlick10 from 'url:./samples/klick10.mp3';
import audioFileUrlKlick11 from 'url:./samples/klick11.mp3';
import audioFileUrlKlick12 from 'url:./samples/klick12.mp3';
import audioFileUrlKlick13 from 'url:./samples/klick13.mp3';
import audioFileUrlKlick14 from 'url:./samples/klick14.mp3';
import audioFileUrlKlick15 from 'url:./samples/klick15.mp3';
import audioFileUrlKlick16 from 'url:./samples/klick16.mp3';

//initialize components
const rhythmfigure2MasterGain = new Gain(1).toDestination();
//const reverbRhythmFigure2 = new Reverb(5).connect(rhythmfigure2MasterGain);
const reverbRhythmFigure2 = new Reverb(5).toDestination();
reverbRhythmFigure2.wet = 0.1
var gaindDroneMaster = new Gain(0.6).toDestination();
const reverbDrone = new Reverb(200).connect(gaindDroneMaster);
let wave = new Waveform();


// initialize master chain
const limiter = new Limiter(0).toDestination();
limiter.threshold = -10;
const volMaster = new Volume(9).connect(limiter);
const eq = new EQ3(-6,-3,0).connect(volMaster);
eq.highFrequency = 8600;

//master gains
const masterGain = new Gain(1).connect(eq);
const kickMasterGain = new Volume(4).connect(masterGain);
const klickMasterGain = new Volume(3).connect(masterGain);
const masterRhythmFigureGain1 = new Volume(0).connect(masterGain);
const masterRhythmFigureGain2 = new Gain(1).connect(masterGain);
const masterNoiseGain = new Volume(0).connect(masterGain);
const bassMasterGain = new Volume(0).connect(masterGain);

var rhythmDensity = Math.floor(Math.random()*4);
//rhythmDensity = 2;
console.log(rhythmDensity);


const masterVolumeDrone = new Volume(6).connect(masterGain);
var filterFRQDrone = 200
if(rhythmDensity===1) filterFRQDrone= 500;
const autoFilterDrone = new BiquadFilter(filterFRQDrone,'highpass').connect(masterVolumeDrone);
const masterDroneGain = new Gain(1).connect(autoFilterDrone);

import p5 from 'p5';
let sketch = function(p) {
    let masterVolume = -6; // in decibel.

    let ready = false;

    let osc; // these two will be our audio oscillators
    let osc2;
    let lfo; // low frequency oscillator

    let wave; // this object allows us to draw waveforms
    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        

        // 4 differents types: sine (default), square, triangle and sawtooth
        osc = new Oscillator({
            type: "sine",
            frequency: 220,
            volume: -3
        });
        osc.toDestination(); // --> shorthand for "connect(Tone.Master)"

        osc2 = new Oscillator({
            type: "triangle",
            frequency: 220,
            volume: -3
        });
        osc2.frequency.value = 220; // 220hz -> A3
        osc2.toDestination(); // --> shorthand for "connect(Tone.Master)"

        lfo = new LFO("0.1hz", 210, 230);
        lfo.connect(osc.frequency);

        wave = new Waveform();
        Destination.connect(wave);

        Destination.volume.value = masterVolume;
    }

// On window resize, update the canvas size
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.draw = function() {

        p.background(0);

        if (ready) {
          // do the audio stuff

          osc.frequency.value = p.map(p.mouseX, 0, p.width, 110, 880);
      
          p.stroke(255);

          let buffer = wave.getValue(0);
      
          // look a trigger point where the samples are going from
          // negative to positive
          let start = 0;
          for (let i = 1; i < buffer.length; i++) {
            if (buffer[i - 1] < 0 && buffer[i] >= 0) {
              start = i;
              break; // interrupts a for loop
            }
          }
      
          // calculate a new end point such that we always
          // draw the same number of samples in each frame
          let end = start + buffer.length / 2;
    
          // drawing the waveform
          for (let i = start; i < end; i++) {
            let x1 = p.map(i - 1, start, end, 0, p.width);
            let y1 = p.map(buffer[i - 1], -1, 1, 0, p.height);
            let x2 = p.map(i, start, end, 0, p.width);
            let y2 = p.map(buffer[i], -1, 1, 0, p.height);
            p.line(x1, y1, x2, y2);
          }
        } else {
          p.fill(255);
          p.noStroke();
          p.textAlign(p.CENTER, p.CENTER);
          p.text("CLICK TO START", p.width / 2, p.height / 2);
        }

    };

    p.mousePressed = function() {
        if (!ready) {
          // ! --> not
          // start our audio objects here
      
          //osc.start();
          //osc2.start();
          //lfo.start();
      
          ready = true;
        }
        else {
          ready = false;
          osc.stop();
          osc2.stop();
          lfo.stop();
        }
      }
};
let myp5 = new p5(sketch);

//initialize kicks into buffer
const bufferKick1 = new ToneAudioBuffer();
const bufferKick2 = new ToneAudioBuffer();
const bufferKick3 = new ToneAudioBuffer();
const bufferKick4 = new ToneAudioBuffer();

const bufferBass101 = new ToneAudioBuffer();
const bufferBass102 = new ToneAudioBuffer();
const bufferBass103 = new ToneAudioBuffer();
const bufferBass104 = new ToneAudioBuffer();
const bufferBass105 = new ToneAudioBuffer();

const bufferKlick1 = new ToneAudioBuffer();
const bufferKlick2 = new ToneAudioBuffer();
const bufferKlick3 = new ToneAudioBuffer();
const bufferKlick4 = new ToneAudioBuffer();
const bufferKlick5 = new ToneAudioBuffer();
const bufferKlick6 = new ToneAudioBuffer();
const bufferKlick7 = new ToneAudioBuffer();
const bufferKlick8 = new ToneAudioBuffer();
const bufferKlick9 = new ToneAudioBuffer();
const bufferKlick10 = new ToneAudioBuffer();
const bufferKlick11 = new ToneAudioBuffer();
const bufferKlick12 = new ToneAudioBuffer();
const bufferKlick13 = new ToneAudioBuffer();
const bufferKlick14 = new ToneAudioBuffer();
const bufferKlick15 = new ToneAudioBuffer();
const bufferKlick16 = new ToneAudioBuffer();

klickMasterGain.connect(wave);

//initialize palyers
const playerKick1 = new Player(bufferKick1).connect(kickMasterGain);
const playerKick2 = new Player(bufferKick2).connect(kickMasterGain);
const playerKick3 = new Player(bufferKick3).connect(kickMasterGain);
const playerKick4 = new Player(bufferKick4).connect(kickMasterGain);
const playerBass = new Player(bufferBass101).connect(bassMasterGain);
const playerBass2 = new Player(bufferBass102).connect(bassMasterGain);
const playerBass3 = new Player(bufferBass103).connect(bassMasterGain);
const playerBass4 = new Player(bufferBass104).connect(bassMasterGain);
const playerBass5 = new Player(bufferBass105).connect(bassMasterGain);
const playerKlick1 = new Player(bufferKlick1).connect(klickMasterGain);
const playerKlick2 = new Player(bufferKlick2).connect(klickMasterGain);
const playerKlick3 = new Player(bufferKlick3).connect(klickMasterGain);
const playerKlick4 = new Player(bufferKlick4).connect(klickMasterGain);
const playerKlick5 = new Player(bufferKlick5).connect(klickMasterGain);
const playerKlick6 = new Player(bufferKlick6).connect(klickMasterGain);
const playerKlick7 = new Player(bufferKlick7).connect(klickMasterGain);
const playerKlick8 = new Player(bufferKlick8).connect(klickMasterGain);
const playerKlick9 = new Player(bufferKlick9).connect(klickMasterGain);
const playerKlick10 = new Player(bufferKlick10).connect(klickMasterGain);
const playerKlick11 = new Player(bufferKlick11).connect(klickMasterGain);
const playerKlick12 = new Player(bufferKlick12).connect(klickMasterGain);
const playerKlick13 = new Player(bufferKlick13).connect(klickMasterGain);
const playerKlick14 = new Player(bufferKlick14).connect(klickMasterGain);
const playerKlick15 = new Player(bufferKlick15).connect(klickMasterGain);
const playerKlick16 = new Player(bufferKlick16).connect(klickMasterGain);

//Sequencer Interface
var sequencer = new
Nexus.Sequencer('#seq',{
    'size': [750,250],
    'mode': 'toggle',
    'rows': 7,
    'columns': 48,
   });
sequencer.colorize("fill","#808080")
sequencer.colorize("accent","#000000")


//const buffer = new ToneAudioBuffer();
let oscillatorRhythmFigure1 = [...Array(32)]; // player voices
let gainsRythmFigure1 = [...Array(32)];
let oscillatorRhythmFigure2 = [...Array(32)]; // player voices
let gainsRythmFigure2 = [...Array(32)];
let oscillatorDrone = [...Array(32)];
let gainsDrone = [...Array(32)];
let tremoloDrone = [...Array(32)];
let lfoDrone = [...Array(32)];
let noise = [...Array(32)];
let randomGainValues= [...Array(32)];
let exponentialGainValues = [...Array(32)];
let arrayTest = [...Array(32)];
let frequencies =  [...Array(32)];
let offsetFRQ1 = 2;
let frequenciesRhythmFigure2 =  [...Array(32)];
let offsetFRQ2 = 10;
const synth = new Synth().toDestination();

const generateButton = document.getElementById('generate');
const hideButton = document.getElementById('hideall');

hideButton.addEventListener("keyup", function(event) {
    if (event.code === 65) {
       event.preventDefault();
       document.getElementById("hideall").click();
    }
 });

hideButton.addEventListener('click', async () => {
    var x = document.getElementById("seq");
    var z = document.getElementById("generate");
    var a = document.getElementById("hideall");



    if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    if (z.style.display === "none") {
      z.style.display = "block";
    } else {
      z.style.display = "none";
    }

    if (a.style.display === "none") {
        a.style.display = "block";
      } else {
        a.style.display = "none";
      }
});

function generateRandom(min, max) {

    // find diff
    let difference = max - min;

    // generate random number 
    let rand = Math.random();

    // multiply with difference 
    rand = Math.round(rand * difference*100)/100;

    // add with min value 
    rand = rand + min;

    return rand;
}

frequencies.forEach((item,index) => {
    frequencies[index] = MidiClass.mtof(MidiClass.ftom(Math.pow(index +offsetFRQ1,2)));
});

frequenciesRhythmFigure2.forEach((item,index) => {
    frequenciesRhythmFigure2[index] = MidiClass.mtof(MidiClass.ftom(Math.pow(index +offsetFRQ2,2)));
});

function exponentialGain(index,dropgains,loudnessControl){
    const scaledIndex = index / 32;
    const random = Math.ceil(Math.random()*32);
    let exponentialGainValue = Math.round(Math.pow(scaledIndex-1,2)*100)/loudnessControl;
    exponentialGainValue *= Math.round(Math.random()*10)/10;
    
    if (random <= dropgains) return (exponentialGainValue);
    else return 0;
}

const envRhythmFigure1 = new AmplitudeEnvelope({
    attack: 0.01,
    decay: 1.0,
    sustain: 0.0,
    release: 0.0,
}).connect(masterRhythmFigureGain1);

const envRhythmFigure1Noise = new AmplitudeEnvelope({
    attack: 0.01,
    decay: 0.3,
    sustain: 0.0,
    release: 0.0,
}).connect(masterNoiseGain);

const envRhythmFigure2 = new AmplitudeEnvelope({
    attack: 0.01,
    decay: 0.01,
    sustain: 0.6,
    release: 0.1,
}).connect(masterRhythmFigureGain2);

function shuffle(array) {
    const r = (from = 0, to = 1) => from + Math.random() * (to - from);
	var m = array.length,
		t,
		i;
	while (m) {
		i = Math.floor(r() * m--); 
		t = array[m]; // temporary storage
		array[m] = array[i];
		array[i] = t;
	}

	return array;
}


function triggerABS(array)
{   
    const arrayABS = [];
    var x = 0;
    var z = 0;
    var y = new Boolean(false);
    var a = new Boolean(false);

        for (var i = 0; i < 16; i++) {
            if (i === 15)
            {   
                z++;
                arrayABS[x] = z;
            }
            else if (array[i] === 0) {
                if (y === true){
                    a = true;
                    z++;
                }
            }
            else if (array[i] === 1){
                y = true;
                if (i > 0 && a === true){
                    z++;
                    arrayABS[x] = z;
                    x++;
                    z = 0;
                }
            }
          }
    return(arrayABS);

}

/*
1. Rule: every trigger lands on even index incl. 0:             [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]
2. Rule: every trigger has min 4 tringgers distance:            [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0]
3. Rule: expertion: last trigger can have 2 trigger dicance:    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0]
4. Rule: if there is a trigger on the 2nd last trigger of the bar before, the trigger cant land on the 2nd trigger becuase of 2. Rule: Bar1: [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0], Bar2: [0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0]*/
function kickRhythm(array,flag){

    //count how much triggers are in array
    var count = 0;
    array.forEach((e,i) =>{
        if(e===1) count++;
    });

    var arrayABS = [];
    while (true)
    {
        //1. Rule
        while(true) {
            array = shuffle(array);
            if (array.every((e,i) => {
                if(e === 1) return i % 2 === 0;
                else return true; // wenns kein schlag ist alles gut, soll weither ggehen
            })) {
                break;
            }
        }
    

        //2. Rule
        arrayABS = triggerABS(array);

        if(flag === 1){ // 4. Rule
            if(array[0] === 0){
                if (arrayABS.every((e,i) => {
                    if(e < 4 && i === count-1){ // 3. Rule
                        return true
                    }
                    else if(e < 4) return false;
                    else return true;
                })) {
                    break;
                }
            }
        }

        else if (flag === 0){ // 4. Rule
            if (arrayABS.every((e,i) => {
                if(e < 4 && i === count-1){ // 3.Rule
                    return true
                }
                else if(e < 4) return false;
                else return true;
            })) {
                break;
            }
        }



    }
    
return array;
}

/*
1. Rule: every trigger lands on even index incl. 0:             [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]
2. Rule: every trigger has min 4 tringgers distance:            [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0]
3. Rule: expertion: last trigger can have 2 trigger dicance:    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0]
4. Rule: if there is a trigger on the 2nd last trigger of the bar before, the trigger cant land on the 2nd trigger becuase of 2. Rule: Bar1: [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0], Bar2: [0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0]
5. Rule: tirgger can not land on Kick tirgger*/
function bassRhythm(array, fullKickOutput,flag,offset){

    //count how much triggers are in array
    var count = 0;
    array.forEach((e,i) =>{
        if(e===1) count++;
    });

    var arrayABS = [];

    while(true){
        while (true)
        {
            //1. Rule
            while(true) {
                array = shuffle(array);
                if (array.every((e,i) => {
                    if(e === 1) return i % 2 === 0;
                    else return true; // wenns kein schlag ist alles gut, soll weither ggehen
                })) {
                    break;
                }
            }
    
            //2. Rule
            arrayABS = triggerABS(array);
    
            if(flag === 1){ // 4. Rule
                if(array[0] === 0){
                    if (arrayABS.every((e,i) => {
                        if(e < 4 && i === count-1){ // 3. Rule
                            return true
                        }
                        else if(e < 4) return false;
                        else return true;
                    })) {
                        break;
                    }
                }
            }
    
            else if (flag === 0){ // 4. Rule
                if (arrayABS.every((e,i) => {
                    if(e < 4 && i === count-1){ // 3.Rule
                        return true
                    }
                    else if(e < 4) return false;
                    else return true;
                })) {
                    break;
                }
            }
    
    
    
        }

        // 5. Rule 
        if (array.every((e,i) => {

            if(array[i] === 1 && array[i] === fullKickOutput[offset][i])
            {
                return false;
            }
            else
            {   
                return true;
            }
    })) {
        break;
    }

    }

    return array;

}

/*
1. Rule: every trigger lands on even index incl. 0:             [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]
2. Rule: every trigger has min 4 tringgers distance:            [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0]
3. Rule: expertion: last trigger can have 2 trigger dicance:    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0]
4. Rule: if there is a trigger on the 2nd last trigger of the bar before, the trigger cant land on the 2nd trigger becuase of 2. Rule: Bar1: [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0], Bar2: [0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0]*/
function RhythmFigures(array, flag){

    //count how much triggers are in array
    var count = 0;
    array.forEach((e,i) =>{
        if(e===1) count++;
    });

    var arrayABS = [];

    while(true){
        while (true)
        {
            //1. Rule
            while(true) {
                array = shuffle(array);
                if (array.every((e,i) => {
                    if(e === 1) return i % 2 === 0;
                    else return true; // wenns kein schlag ist alles gut, soll weither ggehen
                })) {
                    break;
                }
            }
    
            //2. Rule
            arrayABS = triggerABS(array);
    
            if(flag === 1){ // 4. Rule
                if(array[0] === 0){
                    if (arrayABS.every((e,i) => {
                        if(e < 4 && i === count-1){ // 3. Rule
                            return true
                        }
                        else if(e < 4) return false;
                        else return true;
                    })) {
                        break;
                    }
                }
            }
    
            else if (flag === 0){ // 4. Rule
                if (arrayABS.every((e,i) => {
                    if(e < 4 && i === count-1){ // 3.Rule
                        return true
                    }
                    else if(e < 4) return false;
                    else return true;
                })) {
                    break;
                }
            }
    
        }
     {
        break;
    }

    }
    return array;
}

function checklastTrigger(array){
    if(array[14] === 1 ) return 1;
    else return 0;
}

/*
1. Rule: Klicks düfren überall laden
2. Rule: Klicks werden in zwei Gruppen abwechselnd abgespielt
3. Rule: Wenn Gruppe1(Klicks werde nicht gepielt, Pause) dann wird bis zu 4 Schläge lang keine Klicks abgespielt
4. Rule: Wenn Gruppe2(Klicks werden gepielt) dann werden bis zu 6 Klicks hintereinander abgespielt
5. Rule: Wenn Gruppe2(Klicks werden gepielt) dann werden kommt danach immer Gruppe1 mit einer Pause
6. Rule: Länge von beiden Gruppen sind zufällig
*/
function generateKlicks2(){
    var array = new Array(48).fill(0);
    array = array.map((e,i) => {
        if(i % 2 === 0) return 1;
        else return 0;
    });
    return array;
}

function generateKlicks3(){
    var array = new Array(48).fill(0);
    array = array.map((e,i) => {
        if(i % 6 === 0) return 1;
        else if(i % 6 === 2) {
            const random = Math.random()
            if(random>=0.5) return 1;
            else return 0;
        } 
        else return 0;
    });
    return array;
}
function generateKlicks5(){
    var array = new Array(48).fill(0);
    array = array.map((e,i) => {
        if(i % 8 === 2) return 1;
        else return 0;
    });
    return array;
}

generateButton.addEventListener('click', async () => {
    await start();
    Transport.start();
    Transport.bpm.value = 150;

    //Initialize Bar and Beat
    const bar = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    const quarterNote = [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0];
    sequencer.matrix.set.row(0,bar);
    sequencer.matrix.set.row(1,quarterNote);

    //Generate Kicks

    var bar1Kick = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var bar2Kick = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var bar3Kick = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    if(rhythmDensity === 0){
        bar1Kick = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        bar2Kick = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        bar3Kick = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        kickMasterGain.volume.value = 3;
        Transport.bpm.value = 140;
    }
    else if(rhythmDensity === 1){
        bar1Kick = [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        bar2Kick = [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        bar3Kick = [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        kickMasterGain.volume.value = 4;
        Transport.bpm.value = 160;
    }
    else if(rhythmDensity === 2){
        bar1Kick = [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        bar2Kick = [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0];
        bar3Kick = [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
    else{
        bar1Kick = [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0];
        bar2Kick = [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0];
        bar3Kick = [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0];
        
    }

   

    var flag = 0;
    const generatedBar1Kick = kickRhythm(bar1Kick,flag);
    flag = checklastTrigger(generatedBar1Kick);
    const generatedBar2Kick = kickRhythm(bar2Kick,flag);
    flag = checklastTrigger(generatedBar2Kick);
    const generatedBar3Kick = kickRhythm(bar3Kick,flag);

    const fullgeneratedKick = generatedBar1Kick.concat(generatedBar2Kick,generatedBar3Kick);
    var output = generatedBar1Kick.concat(generatedBar2Kick,generatedBar3Kick);
    sequencer.matrix.set.row(2,output);


    const fullKickOutput = [generatedBar1Kick, generatedBar2Kick, generatedBar3Kick];



    //Generate Bass
    var bar1Bass = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var bar2Bass = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var bar3Bass = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    if(rhythmDensity === 0){
         bar1Bass = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
         bar2Bass = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
         bar3Bass = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
         bassMasterGain.volume.value = 3;
    }
    else if(rhythmDensity === 1){
         bar1Bass = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
         bar2Bass = [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
         bar3Bass = [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
         bassMasterGain.volume.value = 5;
    }
    else if(rhythmDensity === 2){
         bar1Bass = [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
         bar2Bass = [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0];
         bar3Bass = [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
    else if(rhythmDensity === 3){
        bar1Bass = [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0];
        bar2Bass = [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0];
        bar3Bass = [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
    


    var flag = 0;
    const generatedBar1Bass = bassRhythm(bar1Bass,fullKickOutput,flag,0);
    flag = checklastTrigger(generatedBar1Bass);
    const generatedBar2Bass = bassRhythm(bar2Bass,fullKickOutput,flag,1);
    flag = checklastTrigger(generatedBar2Bass);
    const generatedBar3Bass = bassRhythm(bar3Bass,fullKickOutput,flag,2);

    const fullgeneratedBass = generatedBar1Bass.concat(generatedBar2Bass,generatedBar3Bass);
    var output = generatedBar1Bass.concat(generatedBar2Bass,generatedBar3Bass);
    sequencer.matrix.set.row(3,output);

    const fullBassOutput = [generatedBar1Kick, generatedBar2Kick, generatedBar3Kick];

    // Generate Rhythm Figure 1
    const bar1RhythmFigure1 = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    const bar2RhythmFigure1 = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    const bar3RhythmFigure1 = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    var flag = 0;
    const generatedRhythmFigure1Bar1 = RhythmFigures(bar1RhythmFigure1,flag);
    flag = checklastTrigger(generatedRhythmFigure1Bar1);
    const generatedRhythmFigure1Bar2 = RhythmFigures(bar2RhythmFigure1,flag);
    flag = checklastTrigger(generatedRhythmFigure1Bar2);
    const generatedRhythmFigure1Bar3 = RhythmFigures(bar3RhythmFigure1,flag);

    const fullgeneratedRhythmFigure1 = generatedRhythmFigure1Bar1.concat(generatedRhythmFigure1Bar2,generatedRhythmFigure1Bar3);

    // Generate Rhythm Figure 2
    const bar1RhythmFigure2 = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    const bar2RhythmFigure2 = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    const bar3RhythmFigure2 = [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    var flag = 0;
    const generatedRhythmFigure2Bar1 = RhythmFigures(bar1RhythmFigure2,flag);
    flag = checklastTrigger(generatedRhythmFigure2Bar1);
    const generatedRhythmFigure2Bar2 = RhythmFigures(bar2RhythmFigure2,flag);
    flag = checklastTrigger(generatedRhythmFigure2Bar2);
    const generatedRhythmFigure2Bar3 = RhythmFigures(bar3RhythmFigure2,flag);

    const fullgeneratedRhythmFigure2 = generatedRhythmFigure2Bar1.concat(generatedRhythmFigure2Bar2,generatedRhythmFigure2Bar3);

    // Generate Klicks
    var fullgeneratedKlicks
    if(rhythmDensity===0) {
        fullgeneratedKlicks = generateKlicks2();
    }
    if(rhythmDensity===1) {
        fullgeneratedKlicks = generateKlicks3();
    }
    if(rhythmDensity===2) {
        fullgeneratedKlicks = generateKlicks5();
    }
    if(rhythmDensity===3) {
        fullgeneratedKlicks = generateKlicks2();
    }
    
    
    // load audio samples
    await bufferKick1.load(audioFileUrlKick1);
    await bufferKick2.load(audioFileUrlKick2);
    await bufferKick3.load(audioFileUrlKick3);
    await bufferKick4.load(audioFileUrlKick4);

    await bufferBass101.load(audioFileUrlBass101);
    await bufferBass102.load(audioFileUrlBass102);
    await bufferBass103.load(audioFileUrlBass103);
    await bufferBass104.load(audioFileUrlBass104);
    await bufferBass105.load(audioFileUrlBass105);

    await bufferKlick1.load(audioFileUrlKlick1);
    await bufferKlick2.load(audioFileUrlKlick2);
    await bufferKlick3.load(audioFileUrlKlick3);
    await bufferKlick4.load(audioFileUrlKlick4);
    await bufferKlick5.load(audioFileUrlKlick5);
    await bufferKlick6.load(audioFileUrlKlick6);
    await bufferKlick7.load(audioFileUrlKlick7);
    await bufferKlick8.load(audioFileUrlKlick8);
    await bufferKlick9.load(audioFileUrlKlick9);
    await bufferKlick10.load(audioFileUrlKlick10);
    await bufferKlick11.load(audioFileUrlKlick11);
    await bufferKlick12.load(audioFileUrlKlick11);
    await bufferKlick12.load(audioFileUrlKlick12);
    await bufferKlick13.load(audioFileUrlKlick13);
    await bufferKlick14.load(audioFileUrlKlick14);
    await bufferKlick15.load(audioFileUrlKlick15);
    await bufferKlick16.load(audioFileUrlKlick16);

    //start transport
    Transport.start();

    //------>>>>play Kick 
    function playKick(time, note) {
        const random = Math.ceil(Math.random()*4);
        if(random === 3) playerKick1.start(time);
        else if(random === 2) playerKick2.start(time);
        else if (random === 1) playerKick3.start(time);
        else  playerKick4.start(time);
        
    };

    var current = 0;
    var patternKick = fullgeneratedKick
        .map((e,i) => {
            if(i<=15){
                current = i;
                return [e, `0:${Math.floor(current/4)}:${i%4}`]
            }
            else if(i>=16 && i<32) {
                current = i-16;
                return [e, `1:${Math.floor(current/4)}:${i%4}`]
            } 
            else{
                current = i-32;
                return [e, `2:${Math.floor(current/4)}:${i%4}`]
            }
        });
    patternKick = patternKick.filter(e => e[0] === 1)
    patternKick = patternKick.map((e,i) => [e[1], `C${i}`]);

    const partKick = new Part(playKick, patternKick);

    partKick.loopEnd = '3:0:0';
    partKick.loop = true;

    //------>>>>play Bass
    function playBass(time, note) {
        const random = Math.ceil(Math.random()*5);
        if(random === 5) playerBass.start(time);
        else if(random === 4) playerBass2.start(time);
        else if(random === 3) playerBass4.start(time);
        else if(random === 2) playerBass5.start(time);
        else playerBass3.start(time);
    };

    current = 0;
    var patternBass = fullgeneratedBass
        .map((e,i) => {
            if(i<=15){
                current = i;
                return [e, `0:${Math.floor(current/4)}:${i%4}`]
            }
            else if(i>=16 && i<32) {
                current = i-16;
                return [e, `1:${Math.floor(current/4)}:${i%4}`]
            } 
            else{
                current = i-32;
                return [e, `2:${Math.floor(current/4)}:${i%4}`]
            }
        });

    patternBass = patternBass.filter(e => e[0] === 1)
    patternBass = patternBass.map((e,i) => [e[1], `C${i}`]);

    const partBass = new Part(playBass, patternBass);

    partBass.loopEnd = '3:0:0';
    partBass.loop = true;
    

    //------>>>>play Rythm Figure 1
    gainsRythmFigure1 = gainsRythmFigure1.map((item,index) => {
        return (new Gain({gain: exponentialGain(index,16,150)}).connect(envRhythmFigure1)); //connect(env)
    });

    const gainNoiseRhythmFigure1 = new Gain(0.2).connect(envRhythmFigure1Noise);
    const noiseRhythmFigure1 = new Noise("pink").connect(gainNoiseRhythmFigure1).start();

    oscillatorRhythmFigure1 = oscillatorRhythmFigure1.map((item,index) => {
        return (new Oscillator({frequency: frequencies[index], type: "sine"})).connect(gainsRythmFigure1[index]).start();
    });

    function playRhythmFigure1(time, note) {
        envRhythmFigure1.decay = generateRandom(0.4,0.9)
        envRhythmFigure1Noise.decay = generateRandom(0.2,0.6)
        envRhythmFigure1Noise.triggerAttackRelease(time);
        envRhythmFigure1.triggerAttackRelease(time);
    };

    current = 0;
    var patternRhythmFigure1 = fullgeneratedRhythmFigure1
        .map((e,i) => {
            if(i<=15){
                current = i;
                return [e, `0:${Math.floor(current/4)}:${i%4}`]
            }
            else if(i>=16 && i<32) {
                current = i-16;
                return [e, `1:${Math.floor(current/4)}:${i%4}`]
            } 
            else{
                current = i-32;
                return [e, `2:${Math.floor(current/4)}:${i%4}`]
            }
        });
    
    patternRhythmFigure1 = patternRhythmFigure1.filter(e => e[0] === 1)
    patternRhythmFigure1 = patternRhythmFigure1.map((e,i) => [e[1], `C${i}`]);

    const partRhythmFigure1 = new Part(playRhythmFigure1, patternRhythmFigure1);

    partRhythmFigure1.loopEnd = '3:0:0';
    partRhythmFigure1.loop = true;

    //------>>>>play Rythm Figure 2
    gainsRythmFigure2 = gainsRythmFigure2.map((item,index) => {
        return (new Gain({gain: exponentialGain(index,0.7,500)}).connect(envRhythmFigure2)); //connect(env)
    });

    oscillatorRhythmFigure2 = oscillatorRhythmFigure2.map((item,index) => {
        return (new Oscillator({frequency: frequenciesRhythmFigure2[index], type: "sine"})).connect(gainsRythmFigure2[index]).start();
    });

    function playRhythmFigure2(time, note) {
        envRhythmFigure2.triggerAttackRelease(time,"8n");
    };

    current = 0;
    var patternRhythmFigure2 = fullgeneratedRhythmFigure2
        .map((e,i) => {
            if(i<=15){
                current = i;
                return [e, `0:${Math.floor(current/4)}:${i%4}`]
            }
            else if(i>=16 && i<32) {
                current = i-16;
                return [e, `1:${Math.floor(current/4)}:${i%4}`]
            } 
            else{
                current = i-32;
                return [e, `2:${Math.floor(current/4)}:${i%4}`]
            }
        });
    
    patternRhythmFigure2 = patternRhythmFigure2.filter(e => e[0] === 1)
    patternRhythmFigure2 = patternRhythmFigure2.map((e,i) => [e[1], `C${i}`]);

    const partRhythmFigure2 = new Part(playRhythmFigure2, patternRhythmFigure2);

    partRhythmFigure2.loopEnd = '3:0:0';
    partRhythmFigure2.loop = true;
    
    //------>>>>play Klick
    function playKlick(time, note) {
        const random = Math.floor(Math.random()*16);
        if (random === 0) playerKlick1.start(time);
        if (random === 1) playerKlick2.start(time);
        if (random === 2) playerKlick3.start(time);
        if (random === 3) playerKlick4.start(time);
        if (random === 4) playerKlick5.start(time);
        if (random === 5) playerKlick6.start(time);
        if (random === 6) playerKlick7.start(time);
        if (random === 7) playerKlick8.start(time);
        if (random === 8) playerKlick9.start(time);
        if (random === 9) playerKlick10.start(time);
        if (random === 10) playerKlick11.start(time);
        if (random === 11) playerKlick12.start(time);
        if (random === 12) playerKlick13.start(time);
        if (random === 13) playerKlick14.start(time);
        if (random === 14) playerKlick15.start(time);
        if (random === 15) playerKlick16.start(time);
    };

    current = 0;
    var patternKlick = fullgeneratedKlicks
        .map((e,i) => {
            if(i<=15){
                current = i;
                return [e, `0:${Math.floor(current/4)}:${i%4}`]
            }
            else if(i>=16 && i<32) {
                current = i-16;
                return [e, `1:${Math.floor(current/4)}:${i%4}`]
            } 
            else{
                current = i-32;
                return [e, `2:${Math.floor(current/4)}:${i%4}`]
            }
        });
    patternKlick = patternKlick.filter(e => e[0] === 1)
    patternKlick = patternKlick.map((e,i) => [e[1], `C${i}`]);

    const partKlick = new Part(playKlick, patternKlick);

    partKlick.loopEnd = '3:0:0';
    partKlick.loop = true;

    //------>>>>play Drone
    const droneTrigger = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    let randomDropGains = generateRandom(0.2,0.8)
    
    //if(rhythmDensity===1) randomDropGains = 0.01;
    //console.log(randomDropGains);
    gainsDrone = gainsDrone.map((item,index) => {
        return (new Gain({gain: exponentialGain(index,3,800)}).connect(masterDroneGain)); //connect(env)
    });

    let amplitudeLFODrone = 0;
    let minLFODrone = 0;

    if(rhythmDensity === 0){
        amplitudeLFODrone = 0.4;
        minLFODrone = 0.3;
    }
    else if(rhythmDensity === 1){
        amplitudeLFODrone = 0;
        masterVolumeDrone.volume.value = 3;
    }
    else if(rhythmDensity === 2){
        amplitudeLFODrone = 0.2;
    }
    else if(rhythmDensity === 3){
        amplitudeLFODrone = 0.15;
   }

    const lfoDrone = new LFO({frequency: "8n", min: 0, max: 1, amplitude: amplitudeLFODrone, phase: 125}).connect(masterDroneGain.gain).start();
    lfoDrone.amplitude = amplitudeLFODrone;
    //lfoDrone.min = minLFODrone;


    oscillatorDrone = oscillatorDrone.map((item,index) => {
        return (new Oscillator({frequency: frequencies[index], amplitude: 0,type: "sine"})).connect(gainsDrone[index]).start();
    });

    let numberofSineDrone = 15;
    if(rhythmDensity===1) numberofSineDrone = 32;

    function playDrone(time, note) {
        gainsDrone.forEach(
            (e,i) => {
                e.gain.rampTo(exponentialGain(i, numberofSineDrone, 800),0.6);
            });
        //envDrone.triggerAttackRelease(time, "3:0:0");
    };


    current = 0;
    var patternDrone = droneTrigger
        .map((e,i) => {
            if(i<=15){
                current = i;
                return [e, `0:${Math.floor(current/4)}:${i%4}`]
            }
            else if(i>=16 && i<32) {
                current = i-16;
                return [e, `1:${Math.floor(current/4)}:${i%4}`]
            } 
            else{
                current = i-32;
                return [e, `2:${Math.floor(current/4)}:${i%4}`]
            }
        });
    
    patternDrone = patternDrone.filter(e => e[0] === 1)
    patternDrone = patternDrone.map((e,i) => [e[1], `C${i}`]);

    const partDrone = new Part(playDrone, patternDrone);
    partDrone.loopEnd = '3:0:0';
    partDrone.loop = true;

    //------>>>>set seqeuncer

    
    //------>>>>set seqeuncer
    sequencer.matrix.set.row(4,fullgeneratedRhythmFigure1);
    sequencer.matrix.set.row(5,fullgeneratedRhythmFigure2);
    sequencer.matrix.set.row(6,fullgeneratedKlicks);

    partKick.start();
    partBass.start();
    partRhythmFigure1.start();
    //partRhythmFigure2.start();
    partKlick.start();
    partDrone.start();

});

