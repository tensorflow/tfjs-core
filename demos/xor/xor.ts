import '../demo-header';
import '../demo-footer';

import {learnXOR} from './learn-xor';

Polymer({is: 'xor-demo', properties: {}});

const trainButton = document.getElementById('train') as HTMLButtonElement;

trainButton.addEventListener('click', () => {
  const result = learnXOR();
  console.log(result);
});
