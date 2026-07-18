interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
}

export function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const colors = [
    '#ef4444', // Crimson Red
    '#b91c1c', // Dark Red
    '#f87171', // Bright Coral Red
    '#18181b', // Dark Gray
    '#ffffff', // White
    '#fca5a5'  // Light Pinkish Red
  ];

  const particles: Particle[] = [];
  const particleCount = 130;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height * 0.5 - 20, // Start scattered above viewport
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: Math.random() * 3 - 1.5,
      speedY: Math.random() * 4 + 3,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 6 - 3
    });
  }

  let animationId: number;
  let framesElapsed = 0;
  const maxFrames = 200; // ~3.3 seconds at 60fps

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      // Add gentle swaying wind
      p.speedX += Math.sin(framesElapsed / 20) * 0.03;

      if (p.y < canvas.height + 20) {
        active = true;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      // Draw rectangular confetti piece
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 1.8);
      ctx.restore();
    });

    framesElapsed++;

    if (active && framesElapsed < maxFrames) {
      animationId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  };

  animate();
}
