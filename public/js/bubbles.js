const bubbleCount = 50;

const container = document.getElementById('bubble-container');

function createBubble()
{
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');

  const size = Math.random() * 30 + 8;
  const left = Math.random() * 100;
  const duration = Math.random() * 8 + 6;
  const delay = Math.random() * 10;
  const zLayer = 0.5 + Math.random() * 0.5;

  bubble.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    animation-duration: ${duration * (3 - zLayer)}s;
    animation-delay: -${delay}s;
    border: 1.5px solid rgba(56, 189, 248, ${0.5* zLayer * zLayer * zLayer* zLayer});
  `;

  bubble.addEventListener('click', (e) => {
    e.stopPropagation();
    bubble.style.transition = 'transform 0.1s ease-out, opacity 0.1s ease-out';
    bubble.style.transform = 'scale(0.4)';
    bubble.style.opacity = '0';
    setTimeout(() => {
      bubble.remove();
      container.appendChild(createBubble());
    }, 100);
  });

  return bubble;
}

for (let i = 0; i < bubbleCount; i++) {
  container.appendChild(createBubble());
}