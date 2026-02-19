// Animations: trigger visibility classes and handle offcanvas link stagger + toggler rotation
(function () {
  const infoContent = document.getElementById('infoContent');
  const imageBox = document.getElementById('imageBox');
  const offcanvasEl = document.getElementById('offcanvasNavbar');
  const toggler = document.getElementById('navToggler');
  const links = offcanvasEl.querySelectorAll('.nav-link');

  // Reveal main content with a short delay for pleasant entrance
  document.addEventListener('DOMContentLoaded', function () {
    // small timeout to allow paint
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (infoContent) infoContent.classList.add('is-visible');
        if (imageBox) imageBox.classList.add('is-visible');
      }, 90);
    });
  });

  // When offcanvas opens, animate nav links in a staggered fashion
  offcanvasEl.addEventListener('show.bs.offcanvas', function () {
    // rotate toggler icon
    toggler.classList.add('toggled');

    links.forEach((link, i) => {
      link.classList.remove('is-visible');
      // staggered reveal
      setTimeout(() => link.classList.add('is-visible'), i * 55 + 80);
    });
  });

  // When offcanvas hides, reverse changes
  offcanvasEl.addEventListener('hide.bs.offcanvas', function () {
    toggler.classList.remove('toggled');
    links.forEach(link => link.classList.remove('is-visible'));
  });

  // Optional: small parallax on mousemove for desktop image (subtle)
  let supportsPointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  if (imageBox && supportsPointer) {
    let lastX = 0, lastY = 0, raf = null;
    imageBox.addEventListener('mousemove', function (e) {
      const rect = imageBox.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 -> 0.5
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      lastX = cx;
      lastY = cy;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          imageBox.style.transform = `translate(${lastX * 6}px, ${lastY * 6}px) scale(1.01)`;
          raf = null;
        });
      }
    });
    imageBox.addEventListener('mouseleave', function () {
      imageBox.style.transform = '';
    });
  }

  // Respect reduced-motion: avoid JS animations if user requested reduced motion
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce && reduce.matches) {
    // remove classes that animate or alter transitions
    if (infoContent) infoContent.classList.add('is-visible');
    if (imageBox) imageBox.classList.add('is-visible');
    links.forEach(link => link.classList.add('is-visible'));
  }
})();

// Scoped slider JS (only targets elements inside .slider-wrap)
document.addEventListener('DOMContentLoaded', () => {
  const sliderRoot = document.querySelector('.slider-wrap');
  if (!sliderRoot) return;

  const cards = Array.from(sliderRoot.querySelectorAll('.card'));
  const dots = Array.from(sliderRoot.querySelectorAll('.dot'));

  // Per-slide data (title, description, extra) — edit as needed
  const slideInfos = [
    {
      title: 'Blend A',
      desc: 'Rich aroma, light roast. Bright citrus notes with mild acidity.',
      extra: 'Roast: Light • 250g'
    },
    {
      title: 'Blend B',
      desc: 'Smooth and balanced with a creamy mouthfeel.',
      extra: 'Roast: Medium • 500g'
    },
    {
      title: 'Signature',
      desc: 'Our classic, full-bodied blend with a chocolatey finish.',
      extra: 'Roast: Medium • 250g'
    },
    {
      title: 'Organic',
      desc: '100% organic, mild taste and eco-friendly farming.',
      extra: 'Roast: Light-Med • 250g'
    },
    {
      title: 'Limited',
      desc: 'Rare seasonal small-batch roast. Notes of berries and caramel.',
      extra: 'Limited release • 200g'
    }
  ];

  let active = 2; // starting index (center)
  const total = cards.length;

  // helper to set ARIA selected on tab buttons
  function setAriaSelectedOnDots() {
    dots.forEach((d, i) => d.setAttribute('aria-selected', i === active ? 'true' : 'false'));
  }

  function update() {
    cards.forEach((card, i) => {
      // reset classes cleanly while preserving the label span
      card.className = 'card';
      const diff = (i - active + total) % total;

      if (diff === 0) {
        card.classList.add('center');
        card.setAttribute('aria-hidden', 'false');
      } else if (diff === total - 1) {
        card.classList.add('back', 'left');
        card.setAttribute('aria-hidden', 'true');
      } else if (diff === 1) {
        card.classList.add('back', 'right');
        card.setAttribute('aria-hidden', 'true');
      } else {
        card.classList.add('hidden');
        card.setAttribute('aria-hidden', 'true');
      }
    });

    dots.forEach(d => d.classList.remove('active'));
    if (dots[active]) dots[active].classList.add('active');
    setAriaSelectedOnDots();

    // Update info columns with the active slide's data
    const info1 = document.getElementById('info1');
    const info2 = document.getElementById('info2');

    if (info1) {
      info1.innerHTML = `
            <div class="info-title">${escapeHtml(slideInfos[active].title)}</div>
            <p class="info-desc">${escapeHtml(slideInfos[active].desc)}</p>
            <div class="info-extra">${escapeHtml(slideInfos[active].extra)}</div>
          `;
    }

    // Info2 shows a different/complimentary view (customize as needed)
    if (info2) {
      info2.innerHTML = `
            <div class="info-title">About ${escapeHtml(slideInfos[active].title)}</div>
            <p class="info-desc">Tasting notes: ${escapeHtml(getTastingNotes(slideInfos[active].desc))}</p>
            <div class="info-extra">More: ${escapeHtml(slideInfos[active].extra)}</div>
          `;
    }
  }

  // small helper to extract a short tasting-note-ish snippet
  function getTastingNotes(desc) {
    // naive: return first sentence or full desc if one sentence
    const idx = desc.indexOf('.');
    return idx !== -1 ? desc.slice(0, idx + 1) : desc;
  }

  // escape any potential text (defensive)
  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // click/dot handlers
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      active = i;
      update();
    });
  });

  // clicking a visible card can focus it to center
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      active = i;
      update();
    });
  });

  // keyboard navigation (left/right)
  const frame = sliderRoot.querySelector('.frame');
  if (frame) {
    frame.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { active = (active + 1) % total; update(); }
      if (e.key === 'ArrowLeft') { active = (active - 1 + total) % total; update(); }
    });
  }

  // Auto-advance (optional) with pause-on-hover
  const AUTO_MS = 3000;
  let autoId = setInterval(() => { active = (active + 1) % total; update(); }, AUTO_MS);

  sliderRoot.addEventListener('mouseenter', () => clearInterval(autoId));
  sliderRoot.addEventListener('mouseleave', () => {
    clearInterval(autoId);
    autoId = setInterval(() => { active = (active + 1) % total; update(); }, AUTO_MS);
  });

  // initialize labels from slideInfos (so span.label matches data)
  cards.forEach((card, i) => {
    const labelSpan = card.querySelector('.label');
    if (labelSpan) labelSpan.textContent = slideInfos[i].title;
  });

  // initial update
  update();
});

// Fallback JS for smooth scrolling (in case CSS doesn't work)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});


/* =========================================
   SERVICE MODAL LOGIC
   ========================================= */

const serviceModalEl = document.getElementById('serviceModal');
// We need a way to open the modal via JS. 
// Bootstrap 5 uses `new bootstrap.Modal('#id')` or `bootstrap.Modal.getOrCreateInstance('#id')`

let serviceModalInstance = null;

function openServiceModal(serviceName) {
  // 1. Set the modal title
  const modalTitle = document.getElementById('serviceModalLabel');
  if (modalTitle) {
    modalTitle.textContent = `Inquire about ${serviceName}`;
  }

  // 2. Reset the form state (default to no selection or "Start Project")
  // Let's default to hiding both specific sections until they click a button, 
  // OR default to "Start Project" active. Let's reset to "clean slate".
  document.getElementById('projectForm').classList.add('d-none');
  document.getElementById('meetingForm').classList.add('d-none');

  // Reset active button states
  document.getElementById('btnStartProject').classList.remove('active', 'btn-primary');
  document.getElementById('btnStartProject').classList.add('btn-outline-primary');

  document.getElementById('btnSetMeeting').classList.remove('active', 'btn-success');
  document.getElementById('btnSetMeeting').classList.add('btn-outline-success');

  // 3. Show the modal
  if (!serviceModalInstance) {
    serviceModalInstance = new bootstrap.Modal(serviceModalEl);
  }
  serviceModalInstance.show();
}

function toggleForm(type) {
  const projectForm = document.getElementById('projectForm');
  const meetingForm = document.getElementById('meetingForm');
  const btnProject = document.getElementById('btnStartProject');
  const btnMeeting = document.getElementById('btnSetMeeting');

  if (type === 'project') {
    // Show Project, Hide Meeting
    projectForm.classList.remove('d-none');
    meetingForm.classList.add('d-none');

    // Update Buttons
    btnProject.classList.add('active', 'btn-primary');
    btnProject.classList.remove('btn-outline-primary');

    btnMeeting.classList.remove('active', 'btn-success');
    btnMeeting.classList.add('btn-outline-success');

  } else if (type === 'meeting') {
    // Show Meeting, Hide Project
    meetingForm.classList.remove('d-none');
    projectForm.classList.add('d-none');

    // Update Buttons
    btnMeeting.classList.add('active', 'btn-success');
    btnMeeting.classList.remove('btn-outline-success');

    btnProject.classList.remove('active', 'btn-primary');
    btnProject.classList.add('btn-outline-primary');
  }
}

// Expose functions to global scope so onclick works
window.openServiceModal = openServiceModal;
window.toggleForm = toggleForm;

/* =========================================
   INQUIRY PAGE LOGIC (DYNAMIC THEME)
   ========================================= */

const SERVICE_THEMES = {
  'Web Development': {
    color: '#e94560', // Red/Pink
    icon: '🌐',
    title: 'Ready to Build?',
    text: 'From landing pages to complex web apps, we code your vision.',
    stats: [
      { val: '99%', label: 'Performance' },
      { val: 'SEO', label: 'Optimized' },
      { val: 'Modern', label: 'Stack' }
    ],
    code: `const web = {\n  framework: 'React/Vue',\n  speed: 'Lightning',\n  responsive: true\n};`,
    showTech: true
  },
  'Mobile App Development': {
    color: '#4cc9f0', // Cyan
    icon: '📱',
    title: 'Ready to Go Mobile?',
    text: 'Native and cross-platform apps that engage users on the go.',
    stats: [
      { val: 'iOS', label: '& Android' },
      { val: '60fps', label: 'Smooth' },
      { val: 'User', label: 'Centric' }
    ],
    code: `const app = {\n  platform: 'Cross-Native',\n  ux: 'Fluid',\n  offline: true\n};`,
    showTech: true
  },
  'Web Designing': {
    color: '#f72585', // Hot Pink
    icon: '🎨',
    title: 'Ready to Inspire?',
    text: 'UI/UX designs that captivate and convert.',
    stats: [
      { val: '100%', label: 'Custom' },
      { val: 'UX', label: 'Focused' },
      { val: 'Pixel', label: 'Perfect' }
    ],
    code: `const design = {\n  style: 'Modern',\n  theme: 'Dark/Light',\n  feel: 'Premium'\n};`,
    showTech: false
  },
  'Poster Making': {
    color: '#ff9f1c', // Orange
    icon: '🖼️',
    title: 'Ready to Stand Out?',
    text: 'Creative visuals for your marketing campaigns.',
    stats: [
      { val: 'Print', label: 'Ready' },
      { val: 'High', label: 'Res' },
      { val: 'Bold', label: 'Impact' }
    ],
    code: `const art = {\n  format: 'Vector',\n  color: 'CMYK',\n  vibe: 'Bold'\n};`,
    showTech: false
  },
  'IT Support': {
    color: '#4361ee', // Blue
    icon: '🛠️',
    title: 'Need Support?',
    text: 'Reliable technical assistance to keep you running.',
    stats: [
      { val: '24/7', label: 'Support' },
      { val: 'Remote', label: '& On-site' },
      { val: 'Fast', label: 'Fix' }
    ],
    code: `const sys = {\n  status: 'Online',\n  security: 'High',\n  bugs: 0\n};`,
    showTech: false
  },
  'SEO Optimization': {
    color: '#2ec4b6', // Teal
    icon: '📈',
    title: 'Ready to Rank?',
    text: 'Climb the search results and drive traffic.',
    stats: [
      { val: '#1', label: 'Rank' },
      { val: 'Organic', label: 'Growth' },
      { val: 'ROI', label: 'focused' }
    ],
    code: `const seo = {\n  index: true,\n  traffic: 'Growing',\n  keywords: ['Top']\n};`,
    showTech: false
  },
  'Automation Services': {
    color: '#7209b7', // Purple
    icon: '🤖',
    title: 'Ready to Automate?',
    text: 'Streamline workflows with intelligent bots.',
    stats: [
      { val: '10x', label: 'Faster' },
      { val: '0', label: 'Errors' },
      { val: '24/7', label: 'Running' }
    ],
    code: `while(true) {\n  automate('Everything');\n  saveTime();\n}`,
    showTech: true
  },
  'Training & Workshops': {
    color: '#fee440', // Yellow
    title: 'Ready to Learn?',
    icon: '🎓',
    text: 'Empowering your team with the latest skills.',
    stats: [
      { val: 'Hands-on', label: 'Labs' },
      { val: 'Expert', label: 'Mentors' },
      { val: 'Cert', label: 'Provided' }
    ],
    code: `class Student {\n  learn() {\n    return 'Success';\n  }\n}`,
    showTech: true
  }
};

function initInquiryPage() {
  const params = new URLSearchParams(window.location.search);
  let service = params.get('service');

  // Default if service not found or empty
  if (!service || !SERVICE_THEMES[service]) {
    service = 'Web Development'; // Default fallback
  }

  const theme = SERVICE_THEMES[service];

  // 1. Update Hidden Input & Display Name
  const displayEl = document.getElementById('serviceNameDisplay');
  const inputEl = document.getElementById('selectedServiceInput');
  if (displayEl) {
    displayEl.textContent = service;
    displayEl.style.color = theme.color;
  }
  if (inputEl) inputEl.value = service;

  // 2. Apply Theme to Left Panel
  document.getElementById('missionTitle').textContent = theme.title;
  document.getElementById('missionText').textContent = theme.text;

  // Update Stats
  const statsContainer = document.getElementById('missionStats');
  statsContainer.innerHTML = theme.stats.map(s => `
            <div class="stat-item">
                <span class="h2 d-block" style="color: ${theme.color}">${s.val}</span>
                <small>${s.label}</small>
            </div>
        `).join('');

  // Update Code Visual
  document.querySelector('#codeVisual code').textContent = theme.code;

  // Update Border Colors via CSS Var
  document.documentElement.style.setProperty('--theme-accent', theme.color);
  document.querySelector('.content-left').style.borderLeftColor = theme.color;

  // 3. Show/Hide Tech Stack
  const techGrid = document.querySelector('.tech-grid');
  if (techGrid) {
    if (theme.showTech) {
      techGrid.parentElement.classList.remove('d-none'); // Show label + grid
    } else {
      techGrid.parentElement.classList.add('d-none'); // Hide label + grid
    }
  }
}

function setInquiryType(type) {
  // Hide selection step
  document.getElementById('stepSelection').classList.add('d-none');
  document.getElementById('stepSelection').classList.remove('active-step');

  // Show specific step
  if (type === 'project') {
    document.getElementById('stepProject').classList.remove('d-none');
    document.getElementById('stepProject').classList.add('active-step');
  } else {
    document.getElementById('stepMeeting').classList.remove('d-none');
    document.getElementById('stepMeeting').classList.add('active-step');
  }
}

function showStep(stepId) {
  // Hide all steps
  document.querySelectorAll('.form-step').forEach(el => {
    el.classList.add('d-none');
    el.classList.remove('active-step');
  });

  // Show target
  const target = document.getElementById(stepId);
  if (target) {
    target.classList.remove('d-none');
    target.classList.add('active-step');
  }
}

// Expose for usage
window.initInquiryPage = initInquiryPage;
window.setInquiryType = setInquiryType;
window.showStep = showStep;
