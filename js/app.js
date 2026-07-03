(() => {
  // DOM refs
  const navContainer = document.getElementById('navContainer');
  const content = document.getElementById('content');
  const crumbCurrent = document.getElementById('crumbCurrent');
  const mobileToggle = document.getElementById('mobileToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const searchInput = document.getElementById('searchInput');
  const backToTop = document.getElementById('backToTop');
  const kbdHint = document.getElementById('kbdHint');

  // ===========================
  // BUILD NAV + SECTIONS
  // ===========================
  let currentGroup = null;

  sections.forEach((s, i) => {
    if (s.group !== currentGroup) {
      currentGroup = s.group;
      const label = document.createElement('div');
      label.className = 'nav-group-label';
      label.textContent = currentGroup;
      navContainer.appendChild(label);
    }

    const item = document.createElement('div');
    item.className = 'nav-item';
    item.dataset.id = s.id;
    item.innerHTML = `<span class="nav-num">${i + 1}</span><span>${s.title}</span>`;
    item.onclick = () => navigateTo(s.id);
    navContainer.appendChild(item);

    const sec = document.createElement('div');
    sec.className = 'section';
    sec.id = `sec-${s.id}`;
    sec.innerHTML = s.html + navFooterHTML(i);
    content.appendChild(sec);
  });

  function navFooterHTML(i) {
    const prev = sections[i - 1];
    const next = sections[i + 1];
    let html = '<div class="nav-footer">';
    html += prev
      ? `<div class="nav-btn prev" onclick="navigateTo('${prev.id}')"><div class="lbl">← Sebelumnya</div><div class="name">${prev.title}</div></div>`
      : '<div></div>';
    html += next
      ? `<div class="nav-btn next" onclick="navigateTo('${next.id}')"><div class="lbl">Berikutnya →</div><div class="name">${next.title}</div></div>`
      : '<div></div>';
    html += '</div>';
    return html;
  }

  // ===========================
  // NAVIGATION
  // ===========================
  function showSection(id) {
    document.querySelectorAll('.section').forEach((s) => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));

    const sec = document.getElementById(`sec-${id}`);
    const navItem = document.querySelector(`.nav-item[data-id="${id}"]`);

    if (sec) sec.classList.add('active');
    if (navItem) {
      navItem.classList.add('active');
      navItem.scrollIntoView({ block: 'nearest' });
    }

    const s = sections.find((x) => x.id === id);
    if (s) crumbCurrent.textContent = s.title;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    initCopyButtons();
  }

  function navigateTo(id) {
    window.location.hash = id;
  }

  function onHashChange() {
    const hash = window.location.hash.slice(1);
    const valid = sections.find((s) => s.id === hash);
    if (valid) {
      showSection(hash);
      closeSidebar();
    }
  }

  window.addEventListener('hashchange', onHashChange);
  window.navigateTo = navigateTo;

  // Init
  onHashChange();
  if (!window.location.hash) showSection('ringkasan');

  // ===========================
  // MOBILE SIDEBAR
  // ===========================
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }

  mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', closeSidebar);

  // ===========================
  // SEARCH
  // ===========================
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const navItems = document.querySelectorAll('.nav-item');

    if (!query) {
      navItems.forEach((item) => (item.style.display = ''));
      document.querySelectorAll('.nav-group-label').forEach((l) => (l.style.display = ''));
      return;
    }

    // Filter nav items
    navItems.forEach((item) => {
      const id = item.dataset.id;
      const s = sections.find((x) => x.id === id);
      const match =
        s &&
        (s.title.toLowerCase().includes(query) ||
          s.group.toLowerCase().includes(query) ||
          s.html.toLowerCase().includes(query));
      item.style.display = match ? '' : 'none';
    });

    // Hide group labels if all children hidden
    document.querySelectorAll('.nav-group-label').forEach((label) => {
      let next = label.nextElementSibling;
      let hasVisible = false;
      while (next && !next.classList.contains('nav-group-label')) {
        if (next.classList.contains('nav-item') && next.style.display !== 'none') {
          hasVisible = true;
          break;
        }
        next = next.nextElementSibling;
      }
      label.style.display = hasVisible ? '' : 'none';
    });

    // Auto-navigate to first match
    if (query.length >= 2) {
      const firstVisible = document.querySelector('.nav-item[style=""],.nav-item:not([style])');
      if (firstVisible) {
        const id = firstVisible.dataset.id;
        const sec = document.getElementById(`sec-${id}`);
        if (sec && !sec.classList.contains('active')) {
          showSection(id);
          window.history.replaceState(null, '', `#${id}`);
        }
      }
    }
  });

  // ===========================
  // BACK TO TOP
  // ===========================
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    },
    { passive: true },
  );

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===========================
  // ON-SCROLL TOC HIGHLIGHT
  // ===========================
  const sectionElements = () => document.querySelectorAll('.section.active');

  function updateScrollHighlight() {
    const active = document.querySelector('.section.active');
    if (!active) return;

    const h2s = active.querySelectorAll('h2');
    let currentId = null;

    h2s.forEach((h2) => {
      const rect = h2.getBoundingClientRect();
      if (rect.top <= 120) {
        // Find which section this h2 belongs to by checking nearby content
        currentId = h2.textContent.trim();
      }
    });

    // Highlight corresponding nav item based on scroll
    const sections_arr = Array.from(active.querySelectorAll('h2'));
    const scrollPos = window.scrollY + 120;

    // Simple: highlight active section's nav item (already done by showSection)
    // For sub-section tracking, we'd need intersection observer
  }

  // Use IntersectionObserver for efficient scroll tracking
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('sec-', '');
            const navItem = document.querySelector(`.nav-item[data-id="${id}"]`);
            if (navItem && !navItem.classList.contains('active')) {
              // Don't auto-switch, just visual indicator
            }
          }
        });
      },
      { threshold: 0.3 },
    );

    // Observe all sections after they're created
    setTimeout(() => {
      document.querySelectorAll('.section').forEach((sec) => observer.observe(sec));
    }, 100);
  }

  // ===========================
  // KEYBOARD NAVIGATION
  // ===========================
  function showKbdHint(text) {
    kbdHint.textContent = text;
    kbdHint.classList.add('visible');
    setTimeout(() => kbdHint.classList.remove('visible'), 1500);
  }

  document.addEventListener('keydown', (e) => {
    // Don't trigger if typing in search
    if (document.activeElement === searchInput) {
      if (e.key === 'Escape') {
        searchInput.blur();
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
      }
      return;
    }

    const currentHash = window.location.hash.slice(1);
    const currentIndex = sections.findIndex((s) => s.id === currentHash);

    switch (e.key) {
      case '/':
        e.preventDefault();
        searchInput.focus();
        showKbdHint('Ketik untuk mencari, Esc untuk tutup');
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < sections.length - 1) {
          navigateTo(sections[currentIndex + 1].id);
          showKbdHint(`${currentIndex + 2} / ${sections.length}`);
        }
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          navigateTo(sections[currentIndex - 1].id);
          showKbdHint(`${currentIndex} / ${sections.length}`);
        }
        break;
      case 'Home':
        e.preventDefault();
        navigateTo(sections[0].id);
        showKbdHint(`1 / ${sections.length}`);
        break;
      case 'End':
        e.preventDefault();
        navigateTo(sections[sections.length - 1].id);
        showKbdHint(`${sections.length} / ${sections.length}`);
        break;
    }
  });

  // ===========================
  // COPY BUTTON ON CODE BLOCKS
  // ===========================
  function initCopyButtons() {
    document.querySelectorAll('.code-block').forEach((block) => {
      // Skip if already wrapped
      if (block.parentElement.classList.contains('code-block-wrapper')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      block.parentNode.insertBefore(wrapper, block);
      wrapper.appendChild(block);

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Salin';
      btn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(block.textContent);
          btn.textContent = 'Tersalin!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Salin';
            btn.classList.remove('copied');
          }, 2000);
        } catch {
          btn.textContent = 'Gagal';
          setTimeout(() => {
            btn.textContent = 'Salin';
          }, 2000);
        }
      };
      wrapper.appendChild(btn);
    });
  }

  // Init copy buttons on load
  initCopyButtons();
})();
