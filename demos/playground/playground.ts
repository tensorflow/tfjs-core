import * as dl from '../deeplearn';

for (const prop in dl) {
  // tslint:disable-next-line:no-any
  (window as any)[prop] = (dl as any)[prop];
}

hljs.initHighlightingOnLoad();

const saveButtonElement = document.getElementById('save');
const runButtonElement = document.getElementById('run');
const jscontentElement = document.getElementById('jscontent');
const htmlcontentElement = document.getElementById('htmlcontent');
const gistUrlElement = document.getElementById('gist-url') as HTMLInputElement;
const consoleElement = document.getElementById('console');
const htmlconsoleElement = document.getElementById('html');

saveButtonElement.addEventListener('click', async () => {
  gistUrlElement.value = '...saving...';

  const content = {
    'description': 'gist ',
    'public': true,
    'files': {
      'js': {'content': jscontentElement.innerText},
      'html': {'content': htmlcontentElement.innerText}
    }
  };

  const init: RequestInit = {method: 'POST', body: JSON.stringify(content)};
  const result = await fetch('https://api.github.com/gists', init);

  const json = await result.json();

  gistUrlElement.value = json['html_url'];

  window.location.hash = '#' + json['id'];
});

window.console.log = (str: string) => {
  consoleElement.innerText += str + '\n';
};

function run() {
  htmlconsoleElement.innerHTML = htmlcontentElement.innerText;
  consoleElement.innerText = '';
  eval(jscontentElement.innerText);
}

runButtonElement.addEventListener('click', run);

async function checkURL() {
  if (window.location.hash && window.location.hash !== '#') {
    const gistId = window.location.hash.substr(1);

    const result = await fetch('https://api.github.com/gists/' + gistId);
    const json = await result.json();

    const jsFile = json['files']['js']['raw_url'];
    const htmlFile = json['files']['html']['raw_url'];

    const jsResult = await fetch(jsFile);
    const jsCode = await jsResult.text();

    jscontentElement.innerText = jsCode;
    gistUrlElement.value = json['html_url'];

    const htmlResult = await fetch(htmlFile);
    const htmlCode = await htmlResult.text();

    htmlcontentElement.innerText = htmlCode;

    hljs.highlightBlock(htmlcontentElement);
    hljs.highlightBlock(jscontentElement);

    run();
  } else {
    gistUrlElement.value = 'unsaved';
  }
}

jscontentElement.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.keyCode === 13 && e.shiftKey) {
    run();
    e.preventDefault();
  }
});

htmlcontentElement.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.keyCode === 13 && e.shiftKey) {
    run();
    e.preventDefault();
  }
});

let lastTimeoutIdJs = 0;
jscontentElement.addEventListener('keyup', () => {
  lastTimeoutIdJs++;

  // tslint:disable-next-line:only-arrow-functions
  setTimeout(function(id: number) {
    if (id < lastTimeoutIdJs) {
      return;
    }
    hljs.highlightBlock(jscontentElement);
  }.bind(null, lastTimeoutIdJs), 5000);
});

let lastTimeoutIdHtml = 0;

htmlcontentElement.addEventListener('keyup', () => {
  // const selection = window.getSelection();
  // const offset = selection.focusOffset;
  lastTimeoutIdHtml++;

  // tslint:disable-next-line:only-arrow-functions
  setTimeout(function(id: number) {
    if (id < lastTimeoutIdHtml) {
      return;
    }
    hljs.highlightBlock(htmlcontentElement);
  }.bind(null, lastTimeoutIdHtml), 5000);
});

checkURL();
