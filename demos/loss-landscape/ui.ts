const statusElement = document.getElementById('status');
const messageElement = document.getElementById('message');
// const imagesElement = document.getElementById('images');

export function isTraining() {
  statusElement.innerText = 'Training...';
}
export function trainingLog(message: string) {
  messageElement.innerText = `${message}\n`;
  console.log(message);
}
