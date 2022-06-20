import { Volume, EQ3,Chorus, LFO,Gain, Oscillator,MidiClass,Noise,Distortion,BitCrusher,FeedbackDelay,Reverb, BiquadFilter} from "tone";

let osc = [...Array(32)];
let gains = [...Array(32)];
let freq = [...Array(32)];
let numberofSineDrone = 15;

function exponentialGain(index, dropgains, loudnessControl) {
    const scaledIndex = index / 32;
    const random = Math.ceil(Math.random() * 32);
    let exponentialGainValue = Math.round(Math.pow(scaledIndex - 1, 2) * 100) / loudnessControl;
    exponentialGainValue *= Math.round(Math.random() * 10) / 10;

    if (random <= dropgains) return (exponentialGainValue);
    else return 0;
}

freq.forEach((item, index) => {
    freq[index] = MidiClass.mtof(MidiClass.ftom(Math.pow(index + 2, 2)));
});


export class Drone {

    out;

    constructor(volume) {

        this.out = new Volume(volume);
        this.eq = new EQ3(0, 0, 0);
        this.distortion = new Distortion({
            distortion: 0.5,
            wet: 0
        });
        this.chorus = new Chorus({
            frequency: '4n',
            delayTime: 2.5,
            depth: 0.5,
            wet: 0,
        });

        this.gain = new Gain(1);

        this.gains = gains.map((item, index) => {
            return (new Gain({
                gain: exponentialGain(index, numberofSineDrone, 800)
            }).connect(this.gain));
        });

        this.osc = osc.map((item, index) => {
            return (new Oscillator({
                frequency: freq[index],
                type: "sine"
            })).connect(this.gains[index]);
        });

        console.log('Drone ready');
        this.gain.chain(this.distortion,this.chorus,this.eq, this.out);

    };   
}

export class DroneNoise {

    out;
    noise;

    constructor(volume){

        this.out = new Volume(volume);
        this.eq = new EQ3(0, 0, 0);
        this.bitcrusher = new BitCrusher(10);
        this.bitcrusher.wet.value = 0;
        this.distortion = new Distortion(1);
        this.distortion.wet.value = 0;
        this.filter = new BiquadFilter(2000, 'highpass');
        this.lfo = new LFO({
            frequency: 0.1,
            min: 1000,
            max: 4500,
            amplitude: 1,
            phase: 0
        }).connect(this.filter.frequency);
        
        this.gain = new Volume(-50);
        this.noise = new Noise("pink");

        this.noise.chain(this.gain,this.filter,this.bitcrusher,this.distortion,this.eq, this.out);
    }

}