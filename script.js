/* ============================================================
   1:1 CONCEPTS — Business Card Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Ocean Waves Background Animation ---
  const canvas = document.getElementById('ocean-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Wave layer configuration — multiple layers for depth
    const waveLayers = [
      { amplitude: 40, wavelength: 0.003, speed: 0.012, yOffset: 0.55, color: 'rgba(0,0,0,0.06)', fill: true },
      { amplitude: 30, wavelength: 0.005, speed: 0.018, yOffset: 0.60, color: 'rgba(0,0,0,0.08)', fill: true },
      { amplitude: 25, wavelength: 0.007, speed: 0.025, yOffset: 0.65, color: 'rgba(0,0,0,0.05)', fill: true },
      { amplitude: 35, wavelength: 0.004, speed: 0.015, yOffset: 0.70, color: 'rgba(0,0,0,0.07)', fill: true },
      { amplitude: 20, wavelength: 0.009, speed: 0.030, yOffset: 0.75, color: 'rgba(0,0,0,0.04)', fill: true },
      // Stroke-only waves for detail
      { amplitude: 18, wavelength: 0.006, speed: 0.020, yOffset: 0.50, color: 'rgba(0,0,0,0.08)', fill: false, lineWidth: 1.2 },
      { amplitude: 22, wavelength: 0.004, speed: 0.014, yOffset: 0.58, color: 'rgba(0,0,0,0.06)', fill: false, lineWidth: 0.8 },
      { amplitude: 15, wavelength: 0.008, speed: 0.028, yOffset: 0.68, color: 'rgba(0,0,0,0.05)', fill: false, lineWidth: 0.6 },
      { amplitude: 28, wavelength: 0.003, speed: 0.010, yOffset: 0.45, color: 'rgba(0,0,0,0.04)', fill: false, lineWidth: 1.0 },
      { amplitude: 12, wavelength: 0.010, speed: 0.035, yOffset: 0.80, color: 'rgba(0,0,0,0.03)', fill: false, lineWidth: 0.5 },
    ];

    function drawWave(layer) {
      const { amplitude, wavelength, speed, yOffset, color, fill, lineWidth } = layer;
      const w = canvas.width;
      const h = canvas.height;
      const baseY = h * yOffset;

      ctx.beginPath();
      ctx.moveTo(0, baseY);

      for (let x = 0; x <= w; x += 2) {
        const y = baseY
          + Math.sin(x * wavelength + time * speed) * amplitude
          + Math.sin(x * wavelength * 2.2 + time * speed * 1.3) * (amplitude * 0.3)
          + Math.sin(x * wavelength * 0.5 + time * speed * 0.7) * (amplitude * 0.5);
        ctx.lineTo(x, y);
      }

      if (fill) {
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth || 1;
        ctx.stroke();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw all wave layers back to front
      for (const layer of waveLayers) {
        drawWave(layer);
      }

      time += 1;
      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Pause animation when tab is hidden for performance
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });
  }

  // --- Intersection Observer for scroll reveal ---
  const revealElements = document.querySelectorAll('.person-card, .section-divider, .card-header, .card-footer');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- Ripple effect on action buttons ---
  document.querySelectorAll('.action-btn, .social-icon').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(0,0,0,0.08);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // --- Add ripple keyframes dynamically ---
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleEffect {
      from {
        transform: scale(0);
        opacity: 1;
      }
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // --- Tilt effect on founder card (subtle, mobile-friendly) ---
  const founderCard = document.getElementById('founder-card');
  if (founderCard && window.matchMedia('(hover: hover)').matches) {
    founderCard.addEventListener('mousemove', (e) => {
      const rect = founderCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      founderCard.style.transform = `perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });

    founderCard.addEventListener('mouseleave', () => {
      founderCard.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
    });
  }

  // --- Haptic-like feedback on touch (visual bounce) ---
  document.querySelectorAll('.person-card').forEach((card) => {
    card.addEventListener('touchstart', () => {
      card.style.transform = 'scale(0.98)';
    }, { passive: true });

    card.addEventListener('touchend', () => {
      card.style.transform = 'scale(1)';
    }, { passive: true });
  });
});
