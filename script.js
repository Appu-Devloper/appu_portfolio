const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

const parallaxItems = document.querySelectorAll('[data-parallax]');
if (parallaxItems.length) {
  const handleParallax = () => {
    const scrollTop = window.scrollY;
    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax) || 0.1;
      item.style.setProperty('--parallax-offset', `${scrollTop * speed}px`);
    });
  };

  window.addEventListener('scroll', handleParallax, { passive: true });
  handleParallax();
}

const projectMedia = document.querySelectorAll('.project-media');
projectMedia.forEach((media) => {
  const asset = media.dataset.asset;
  if (asset) {
    media.classList.add('has-image');
    media.style.backgroundImage = `url('${asset}')`;
    const fallback = media.querySelector('.project-fallback');
    if (fallback) {
      fallback.style.display = 'none';
    }
  }
});

const form = document.getElementById('contact-form');
const note = document.querySelector('.form-note');

const carouselTracks = document.querySelectorAll('.cert-carousel');
carouselTracks.forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const prev = carousel.querySelector('.carousel-btn.prev');
  const next = carousel.querySelector('.carousel-btn.next');

  if (!track || !prev || !next) {
    return;
  }

  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 0;
    next.disabled = track.scrollLeft >= maxScroll - 1;
  };

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
  });

  next.addEventListener('click', () => {
    track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();
});

const projectCarousels = document.querySelectorAll('.project-carousel');
projectCarousels.forEach((carousel) => {
  const track = carousel.querySelector('.project-carousel-track');
  const prev = carousel.querySelector('.carousel-btn.prev');
  const next = carousel.querySelector('.carousel-btn.next');

  if (!track || !prev || !next) {
    return;
  }

  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 0;
    next.disabled = track.scrollLeft >= maxScroll - 1;
  };

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
  });

  next.addEventListener('click', () => {
    track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();
});

if (form && note) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const message = form.elements['message'].value.trim();

    if (!name || !email || !message) {
      note.textContent = 'Please fill in all fields before sending.';
      note.style.color = '#c77a3f';
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      note.textContent = 'Please enter a valid email address.';
      note.style.color = '#c77a3f';
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
    }

    note.textContent = 'Sending your message...';
    note.style.color = '#0f3d3e';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      if (!response.ok) {
        throw new Error('Failed to send message.');
      }

      note.textContent = 'Thanks! Your message has been sent.';
      note.style.color = '#0f3d3e';
      form.reset();
    } catch (error) {
      note.textContent = 'Sorry, something went wrong sending your message.';
      note.style.color = '#c77a3f';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

