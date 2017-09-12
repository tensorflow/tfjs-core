/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// import '../style/keyboard.css'
// import {Roll} from './Roll'
import {Note} from './Note'

const offsets = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6]

class KeyboardElement {

	constructor(container, lowest=36, octaves=4){
		this._container = document.createElement('div')
		this._container.id = 'keyboard'
		container.appendChild(this._container)

		this._keys = {}

		this.resize(lowest, octaves)
		// Roll.appendTo(container)
		this._notes = {}
	}

	resize(lowest, octaves){
		this._keys = {}
		// clear the previous ones
		this._container.innerHTML = ''
		// each of the keys
		const keyWidth = (1 / 7) / octaves
		for (let i = lowest; i < lowest + octaves * 12; i++){
			let key = document.createElement('div')
			key.classList.add('key')
			let isSharp = ([1, 3, 6, 8, 10].indexOf(i % 12) !== -1)
			key.classList.add(isSharp ? 'black' : 'white')
			this._container.appendChild(key)
			// position the element
			
			let noteOctave = Math.floor(i / 12) - Math.floor(lowest / 12)
			let offset = offsets[i % 12] + noteOctave * 7
			key.style.width = `${keyWidth * 100}%`
			key.style.left = `${offset * keyWidth * 100}%`
			key.id = i.toString()

			const fill = document.createElement('div')
			fill.id = 'fill'
			key.appendChild(fill)
			this._keys[i] = key
		}
	}

	keyDown(noteNum){
		if (this._keys.hasOwnProperty(noteNum)){
			const key = this._keys[noteNum]
			key.classList.remove('hover')

			const note = new Note(key.querySelector('#fill'))
			if (!this._notes[noteNum]){
				this._notes[noteNum] = []
			}
			this._notes[noteNum].push(note)
		}
	}

	keyUp(noteNum){
		if (this._keys.hasOwnProperty(noteNum)){
			if (!(this._notes[noteNum] && this._notes[noteNum].length)){
				console.warn('note off before note on')
			} else {
				this._notes[noteNum].shift().noteOff()
			}
		}	
	}
}

export {KeyboardElement}