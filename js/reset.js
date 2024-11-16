export function setupGameReset(canvas, resetGame) {
  // Create a restart button
  const restartButton = document.createElement('img');
  restartButton.id = 'restartButton';
  restartButton.src = 'images/reset.png'; // Replace with the path to your reset image
  restartButton.style.position = 'absolute';
  restartButton.style.left = `${canvas.offsetLeft + canvas.width / 2 - 50}px`;
  restartButton.style.top = `${canvas.offsetTop + canvas.height / 2 - 50}px`;
  restartButton.style.width = '100px';
  restartButton.style.height = '100px';
  restartButton.style.cursor = 'pointer';
  document.body.appendChild(restartButton);

  // Add event listener to the restart button
  restartButton.addEventListener('click', resetGame);
}

export function removeGameReset() {
  // Remove the restart button if it exists
  const restartButton = document.getElementById('restartButton');
  if (restartButton) {
    restartButton.remove();
  }
}