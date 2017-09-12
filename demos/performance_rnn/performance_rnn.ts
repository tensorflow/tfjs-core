/* Copyright 2017 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

import {Array1D, Array2D, CheckpointLoader, NDArrayMath, NDArrayMathGPU,
    Scalar} from '../deeplearnjs';
import {KeyboardElement} from './js/Element';

const Piano:any = require('tone-piano').Piano;

let lstmKernel1: any;
let lstmBias1: any;
let lstmKernel2: any;
let lstmBias2: any;
let lstmKernel3: any;
let lstmBias3: any;
let c: any;
let h: any;
let fullyConnectedBiases: any;
let fullyConnectedWeights: any;
const forgetBias = Scalar.new(1.0);

let currentTime = 0;
let currentVelocity = 1;
const math = new NDArrayMathGPU();

const INPUT_SIZE = 388;
const PRIMER_IDX = 355; // shift 1s.
let lastSample = PRIMER_IDX;


const container = document.querySelector('#container');
let keyboardInterface = new KeyboardElement(container, 0, 4);

const piano = new Piano({velocities : 4}).toMaster();
let output: any;

piano.load('https://tambien.github.io/Piano/Salamander/').then(() => {
	const reader = new CheckpointLoader('.');
	return reader.getAllVariables();
}).then((vars: any) => {
	document.querySelector('#status').classList.add('hidden');

	lstmKernel1 = vars[
		'rnn/multi_rnn_cell/cell_0/basic_lstm_cell/kernel'] as Array2D;
	lstmBias1 = vars[
		'rnn/multi_rnn_cell/cell_0/basic_lstm_cell/bias'] as Array1D;

	lstmKernel2 = vars[
		'rnn/multi_rnn_cell/cell_1/basic_lstm_cell/kernel'] as Array2D;
	lstmBias2 = vars[
		'rnn/multi_rnn_cell/cell_1/basic_lstm_cell/bias'] as Array1D;

	lstmKernel3 = vars[
		'rnn/multi_rnn_cell/cell_2/basic_lstm_cell/kernel'] as Array2D;
	lstmBias3 = vars[
		'rnn/multi_rnn_cell/cell_2/basic_lstm_cell/bias'] as Array1D;

	fullyConnectedBiases = vars['fully_connected/biases'] as Array1D;
	fullyConnectedWeights = vars['fully_connected/weights'] as Array2D;
	c = [
		Array2D.zeros([1, lstmBias1.shape[0] / 4]),
		Array2D.zeros([1, lstmBias2.shape[0] / 4]),
		Array2D.zeros([1, lstmBias3.shape[0] / 4]),
	];
	h = [
		Array2D.zeros([1, lstmBias1.shape[0] / 4]),
		Array2D.zeros([1, lstmBias2.shape[0] / 4]),
		Array2D.zeros([1, lstmBias3.shape[0] / 4]),
	];
	//start it at the audio context current time
	currentTime = piano.now();
	generateStep();
});

window.addEventListener('resize', resize);

function resize() {
	const keyWidth = 20;
	let octaves = Math.round((window.innerWidth / keyWidth) / 12);
	octaves = Math.max(octaves, 2);
	octaves = Math.min(octaves, 7);
	let baseNote = 48;
	if (octaves > 5){
		baseNote -= (octaves - 5) * 12;
	}
	keyboardInterface.resize(baseNote, octaves)
}

resize();

function generateStep(){

	math.scope((keep, track) => {
		
		const lstm1 = math.basicLSTMCell.bind(math, forgetBias, lstmKernel1,
		  lstmBias1);
		const lstm2 = math.basicLSTMCell.bind(math, forgetBias, lstmKernel2,
		  lstmBias2);
		const lstm3 = math.basicLSTMCell.bind(math, forgetBias, lstmKernel3,
		  lstmBias3);	

		let input = track(Array2D.zeros([1, INPUT_SIZE]));
		input.set(1.0, 0, lastSample);
		//generate some notes
		for (let i = 0; i < 10; i++) {

			output = math.multiRNNCell([lstm1, lstm2, lstm3], input, c, h);
			output[0].map((val:Array2D) => {
				keep(val);
			});
			output[1].map((val:Array2D) => {
				keep(val);
			});
			c = output[0];
			h = output[1];

			const outputH = h[2];
			const weightedResult = math.matMul(outputH, fullyConnectedWeights);
			const logits = math.add(weightedResult, fullyConnectedBiases);

			const softmax = math.softmax(logits.as1D());
			const sampledOutput = sampleFromSoftmax(math, softmax);

			playOutput(sampledOutput);
			lastSample = sampledOutput

			// use output as the next input.
			input = track(Array2D.zeros([1, INPUT_SIZE]));
			input.set(1.0, 0, lastSample);
		}
	});
	// document.querySelector('#status').textContent = `Playing ${currentTime} ${piano.now()}`
	const delta = currentTime - piano.now()
	setTimeout(() => generateStep(), delta * 1000)
}


const MIN_MIDI_PITCH = 0;
const MAX_MIDI_PITCH = 127;
const VELOCITY_BINS = 32;
const MAX_SHIFT_STEPS = 100;
const STEPS_PER_SECOND = 100;

const EVENT_RANGES = [
    ['note_on', MIN_MIDI_PITCH, MAX_MIDI_PITCH],
    ['note_off', MIN_MIDI_PITCH, MAX_MIDI_PITCH],
    ['time_shift', 1, MAX_SHIFT_STEPS],
    ['velocity_change', 1, VELOCITY_BINS],
];

function playOutput(index: number) {
	let offset = 0;
	for(const eventRange of EVENT_RANGES) {
		const eventType = eventRange[0] as string;
		const minValue = eventRange[1] as number;
		const maxValue = eventRange[2] as number;
		if (offset <= index && index <= offset + maxValue - minValue) {
			if (eventType === 'note_on') {
				const noteNum = index - offset;
				// keyboardInterface.keyDown(noteNum);
				setTimeout(function() { 
					keyboardInterface.keyDown(noteNum); 
					setTimeout(function() {
						keyboardInterface.keyUp(noteNum);
					}, 100);
				}, (currentTime - piano.now())*1000);
				return piano.keyDown(noteNum, currentTime, currentVelocity)
			} else if (eventType === 'note_off') {
				const noteNum = index - offset;
				// setTimeout(function() { keyboardInterface.keyUp(noteNum); }, (currentTime - piano.now())*1000);
				// console.log('Note: ' + index + ' off: ' + (currentTime - piano.now()));
				// console.log('up' + noteNum );
				return 	piano.keyUp(noteNum, currentTime)
			} else if (eventType === 'time_shift') {
				currentTime += (index - offset + 1) / STEPS_PER_SECOND
				return currentTime
			} else if (eventType === 'velocity_change') {
				currentVelocity = (index - offset + 1) * Math.ceil(127 / VELOCITY_BINS)
				currentVelocity = currentVelocity/127
				return currentVelocity
			} else {
				throw new Error('Could not decode eventType: ' + eventType);
			}
		}
		offset += maxValue - minValue + 1;
	}
	throw new Error('Could not decode index: ' + index);
}


/**
* Sample from a softmax.
*/
function sampleFromSoftmax(math: NDArrayMath, softmax: Array1D): number {
	const softmaxValues = softmax.getValues();
	const rand = Scalar.randUniform([], 0, 1).get();
	let cdf = 0;
	for(let i = 0; i < softmaxValues.length; i++) {
		cdf += softmaxValues[i];
		if (cdf > rand) {
			return i;
		}
	}
	throw new Error('Could not sample from softmax.');
}
