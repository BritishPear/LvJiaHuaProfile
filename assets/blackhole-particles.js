(() => {
  const canvas = document.querySelector('.blackhole-particles');
  if (!canvas) return;
  const context = canvas.getContext('2d', {alpha: true});
  if (!context) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const image = new Image();
  let pixels, imageWidth = 1920, imageHeight = 1080;
  let width = 0, height = 0, pixelRatio = 1;
  let coverScale = 1, offsetX = 0, offsetY = 0;
  let frame = 0, lastTime = 0, elapsed = 0;
  let seed = 1719;
  const random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const particles = [];
  const ringTilt = -8 * Math.PI / 180;
  const diskTilt = -17 * Math.PI / 180;
  for (let index = 0; index < 1900; index++) {
    const disk = index >= 1050;
    const lane = random();
    particles.push({
      disk,
      phase: random() * Math.PI * 2,
      a: disk ? 1490 + lane * 170 : 406 + lane * 122,
      b: disk ? 139 + lane * 63 : 391 + lane * 112,
      tilt: disk ? diskTilt : ringTilt,
      speed: disk ? .027 + random() * .027 : .105 + random() * .085,
      tail: disk ? .003 + random() * .006 : .006 + random() * .013,
      weight: .65 + random() * .9,
      alpha: .17 + random() * .19,
      green: 182 + Math.floor(random() * 63),
      blue: 100 + Math.floor(random() * 80)
    });
  }
  const point = (particle, angle) => {
    const u = particle.a * Math.cos(angle);
    const v = particle.b * Math.sin(angle);
    const cosine = Math.cos(particle.tilt), sine = Math.sin(particle.tilt);
    return {x: 1695 + u * cosine - v * sine, y: 390 + u * sine + v * cosine};
  };
  const luminanceAt = (x, y) => {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= imageWidth || y >= imageHeight) return 0;
    const index = (y * imageWidth + x) * 4;
    return (pixels[index] * .2126 + pixels[index + 1] * .7152 + pixels[index + 2] * .0722) / 255;
  };
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height;
    pixelRatio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    coverScale = Math.max(width / imageWidth, height / imageHeight);
    offsetX = (width - imageWidth * coverScale) / 2;
    offsetY = (height - imageHeight * coverScale) / 2;
  }
  function paint(time) {
    frame = 0;
    if (!pixels || motion.matches || document.hidden) return;
    if (!lastTime) lastTime = time;
    elapsed += Math.min((time - lastTime) / 1000, .05);
    lastTime = time;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(pixelRatio * coverScale, 0, 0, pixelRatio * coverScale, pixelRatio * offsetX, pixelRatio * offsetY);
    context.globalCompositeOperation = 'lighter';
    context.lineCap = 'round';
    for (const particle of particles) {
      // Increasing angles in screen coordinates produce clockwise orbits.
      const angle = particle.phase + elapsed * particle.speed;
      if (particle.disk && Math.sin(angle) < 0) continue;
      const head = point(particle, angle);
      if (head.x < 650 || head.x > imageWidth || head.y < 0 || head.y > imageHeight) continue;
      const tail = point(particle, angle - particle.tail);
      const light = Math.min(luminanceAt(head.x, head.y), luminanceAt(tail.x, tail.y));
      const mask = Math.max(0, Math.min(1, (light - .13) / .55));
      const leftFalloff = Math.max(0, Math.min(1, (head.x - 650) / 400));
      const opacity = particle.alpha * mask * leftFalloff;
      if (opacity < .012) continue;
      context.lineWidth = particle.weight;
      context.strokeStyle = `rgba(255,${particle.green},${particle.blue},${opacity})`;
      context.beginPath();
      context.moveTo(tail.x, tail.y);
      context.lineTo(head.x, head.y);
      context.stroke();
      context.fillStyle = `rgba(255,242,214,${opacity * .85})`;
      context.beginPath();
      context.arc(head.x, head.y, particle.weight * .48, 0, Math.PI * 2);
      context.fill();
    }
    frame = requestAnimationFrame(paint);
  }
  function syncMotion() {
    cancelAnimationFrame(frame); frame = 0; lastTime = 0;
    if (motion.matches || document.hidden) {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
    } else if (pixels) frame = requestAnimationFrame(paint);
  }
  image.onload = () => {
    imageWidth = image.naturalWidth; imageHeight = image.naturalHeight;
    const source = document.createElement('canvas');
    source.width = imageWidth; source.height = imageHeight;
    const sourceContext = source.getContext('2d', {willReadFrequently: true});
    sourceContext.drawImage(image, 0, 0);
    pixels = sourceContext.getImageData(0, 0, imageWidth, imageHeight).data;
    resize(); syncMotion();
  };
  addEventListener('resize', resize, {passive: true});
  document.addEventListener('visibilitychange', syncMotion);
  motion.addEventListener('change', syncMotion);
  image.src = 'assets/blackhole.jpg';
})();
