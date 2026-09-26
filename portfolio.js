document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabButtons.length && tabPanels.length) {
    const activateTab = (targetName) => {
      tabButtons.forEach((button) => {
        const isActive = button.dataset.tab === targetName;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', String(isActive));
      });

      tabPanels.forEach((panel) => {
        const isActive = panel.dataset.panel === targetName;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
      });
    };

    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activateTab(button.dataset.tab);
      });
    });

    const defaultTab = document.querySelector('.tab-button.active')?.dataset.tab || 'overview';
    activateTab(defaultTab);
  }

  const typedElement = document.getElementById('typed');
  if (typedElement) {
    const phrases = ['web development.', 'cybersecurity.', 'artificial intelligence.'];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      typedElement.textContent = 'building for ' + phrases.join(' ');
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;
      const prefix = 'building for ';

      const tick = () => {
        const currentPhrase = phrases[phraseIndex];

        if (!deleting) {
          charIndex += 1;
          typedElement.textContent = prefix + currentPhrase.slice(0, charIndex);

          if (charIndex === currentPhrase.length) {
            deleting = true;
            setTimeout(tick, 1400);
            return;
          }
        } else {
          charIndex -= 1;
          typedElement.textContent = prefix + currentPhrase.slice(0, charIndex);

          if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
          }
        }

        setTimeout(tick, deleting ? 35 : 55);
      };

      tick();
    }
  }

  const profileUpload = document.getElementById('profileUpload');
  const profileImage = document.getElementById('profileImage');
  const profileFallback = document.getElementById('profileFallback');

  const applyProfileImage = (src) => {
    if (!profileImage || !profileFallback) {
      return;
    }

    profileImage.src = src;
    profileImage.style.display = 'block';
    profileFallback.style.display = 'none';
    localStorage.setItem('portfolioProfileImage', src);
  };

  const savedProfile = localStorage.getItem('portfolioProfileImage');
  if (savedProfile && profileImage) {
    applyProfileImage(savedProfile);
  }

  if (profileUpload && profileImage) {
    profileUpload.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];

      if (!file) {
        return;
      }

      if (!file.type.startsWith('image/')) {
        window.alert('Please choose a valid image file.');
        profileUpload.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (typeof loadEvent.target?.result === 'string') {
          applyProfileImage(loadEvent.target.result);
        }
        profileUpload.value = '';
      };

      reader.readAsDataURL(file);
    });
  }

  const certificateUpload = document.getElementById('certificateUpload');
  const addCertificateButton = document.getElementById('addCertificateBtn');
  const certificateGrid = document.getElementById('certificateGrid');

  const defaultCertificates = [
    {
      id: 'cert-picture-1',
      name: 'Introduction to Python',
      issuer: 'SoloLearn',
      src: 'Picture1.png',
      type: 'image',
      issued: 'Issued 05 March, 2024'
    },
    {
      id: 'cert-picture-2',
      name: 'Introduction to SQL',
      issuer: 'SoloLearn',
      src: 'Picture2.png',
      type: 'image',
      issued: 'Issued 06 February, 2025'
    },
    {
      id: 'cert-picture-3',
      name: 'Python Intermediate',
      issuer: 'SoloLearn',
      src: 'Picture3.png',
      type: 'image',
      issued: 'Issued 04 April, 2024'
    },
    {
      id: 'cert-picture-4',
      name: 'Python Developer',
      issuer: 'SoloLearn',
      src: 'Picture4.png',
      type: 'image',
      issued: 'Issued 14 April, 2024'
    },
    {
      id: 'cert-picture-5',
      name: 'AI Builders Conference with IBM Bob',
      issuer: 'IBM',
      src: 'Picture5.png',
      type: 'image',
      issued: 'September 16th, 2026'
    },
    {
      id: 'cert-picture-6',
      name: 'Introduction to Cybersecurity',
      issuer: 'Cisco Networking Academy',
      src: 'Picture6.png',
      type: 'image',
      issued: 'Issued 19 Sep 2026'
    },
    {
      id: 'cert-picture-7',
      name: 'Introduction to Critical Infrastructure Protection',
      issuer: 'OPSWAT Academy',
      src: 'Picture7.png',
      type: 'image',
      issued: 'Issued 09/26/2026',
      expires: 'Expires 09/26/2027',
      description: 'Credential ID nwPXVnUf5w'
    }
  ];

  const saveCertificates = (certificates) => {
    localStorage.setItem('portfolioCertificates', JSON.stringify(certificates));
  };

  const getCertificates = () => {
    try {
      const saved = localStorage.getItem('portfolioCertificates');

      if (!saved) {
        localStorage.removeItem('portfolioCertificates');
        saveCertificates(defaultCertificates);
        return defaultCertificates;
      }

      const parsed = JSON.parse(saved);
      const isExactDefaultMatch = Array.isArray(parsed)
        && parsed.length === defaultCertificates.length
        && parsed.every((certificate, index) => {
          const expected = defaultCertificates[index];
          return certificate
            && expected
            && certificate.name === expected.name
            && certificate.issuer === expected.issuer
            && certificate.src === expected.src
            && certificate.issued === expected.issued
            && certificate.expires === expected.expires
            && certificate.description === expected.description;
        });

      if (!isExactDefaultMatch) {
        localStorage.removeItem('portfolioCertificates');
        saveCertificates(defaultCertificates);
        return defaultCertificates;
      }

      return parsed;
    } catch (error) {
      localStorage.removeItem('portfolioCertificates');
      saveCertificates(defaultCertificates);
      return defaultCertificates;
    }
  };

  const getCertificateTypeLabel = (certificate) => {
    if (certificate.type === 'pdf') return 'PDF';
    if (certificate.type === 'doc') return 'DOC';
    return 'FILE';
  };

  const createCertificateCard = (certificate) => {
    const article = document.createElement('article');
    article.className = 'cert-card';

    const isImage = certificate.type === 'image' && Boolean(certificate.src);
    const isPdf = certificate.type === 'pdf';
    const isDoc = certificate.type === 'doc';

    const previewMarkup = isImage
      ? `<img src="${certificate.src}" alt="${certificate.name} certificate" />`
      : certificate.src
        ? `<div class="cert-preview"><div class="cert-file-meta"><div class="cert-file-badge">${getCertificateTypeLabel(certificate)}</div><div>${isPdf ? 'PDF' : isDoc ? 'DOC' : 'FILE'}</div></div></div>`
        : `<div class="cert-placeholder" style="display: flex;">Upload certificate file</div>`;

    const dateText = [certificate.issued, certificate.expires].filter(Boolean).join('<br>');
    const description = certificate.description || '';

    article.innerHTML = `
      ${previewMarkup}
      <div class="cert-copy">
        <div class="cert-name">${certificate.name}</div>
        <div class="cert-issuer">${certificate.issuer}</div>
        ${dateText ? `<div class="cert-meta">${dateText}</div>` : ''}
        ${description ? `<div class="cert-description">${description}</div>` : ''}
      </div>
      <div class="cert-card-actions">
        <button class="mini-btn replace-cert" type="button" data-id="${certificate.id}">Replace</button>
        <button class="mini-btn remove-cert" type="button" data-id="${certificate.id}">Remove</button>
      </div>
    `;

    return article;
  };

  const renderCertificates = () => {
    if (!certificateGrid) return;

    const certificates = getCertificates();
    certificateGrid.innerHTML = '';

    certificates.forEach((certificate) => {
      certificateGrid.appendChild(createCertificateCard(certificate));
    });
  };

  const getFileType = (file) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return 'pdf';
    if (file.type === 'application/msword' || file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) return 'doc';
    return 'file';
  };

  const buildCertificateDescription = (fileName) => {
    const cleanName = fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
    return cleanName
      ? `${cleanName} certification earned through continued learning and professional development.`
      : 'Professional certification demonstrating skills, knowledge, and commitment to continuous growth.';
  };

  const loadFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve({
      name: file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
      issuer: 'Uploaded certificate',
      src: typeof event.target?.result === 'string' ? event.target.result : '',
      type: getFileType(file),
      description: buildCertificateDescription(file.name)
    });
    reader.onerror = () => reject(new Error('Unable to read file.'));
    reader.readAsDataURL(file);
  });

  const handleNewCertificates = async (files) => {
    if (!files || !files.length) return;

    const validFiles = Array.from(files).filter((file) => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isDoc = file.type === 'application/msword'
        || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        || file.name.toLowerCase().endsWith('.doc')
        || file.name.toLowerCase().endsWith('.docx');
      return isImage || isPdf || isDoc;
    });

    if (!validFiles.length) {
      window.alert('Please choose an image, PDF, or document file for your certificate.');
      return;
    }

    const loaded = await Promise.all(validFiles.map((file) => loadFileAsDataUrl(file)));
    const certificates = getCertificates();
    const nextCertificates = [...certificates, ...loaded.map((cert, index) => ({
      id: `upload-${Date.now()}-${index}`,
      name: cert.name || `Certificate ${certificates.length + index + 1}`,
      issuer: cert.issuer,
      src: cert.src,
      type: cert.type,
      description: cert.description || buildCertificateDescription(cert.name || 'certificate')
    }))];

    saveCertificates(nextCertificates);
    renderCertificates();

    if (certificateUpload) {
      certificateUpload.value = '';
    }
  };

  if (addCertificateButton && certificateUpload) {
    addCertificateButton.addEventListener('click', () => {
      certificateUpload.click();
    });

    certificateUpload.addEventListener('change', async (event) => {
      await handleNewCertificates(event.target.files);
    });
  }

  if (certificateGrid) {
    certificateGrid.addEventListener('click', (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const id = target.dataset.id;
      if (!id) return;

      const certificates = getCertificates();
      const certificateIndex = certificates.findIndex((certificate) => certificate.id === id);

      if (target.classList.contains('remove-cert')) {
        if (certificateIndex >= 0) {
          certificates.splice(certificateIndex, 1);
          saveCertificates(certificates);
          renderCertificates();
        }
        return;
      }

      if (target.classList.contains('replace-cert')) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,.pdf,.doc,.docx';
        input.addEventListener('change', async (changeEvent) => {
          const [file] = changeEvent.target.files || [];
          if (!file) return;

          const isImage = file.type.startsWith('image/');
          const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
          const isDoc = file.type === 'application/msword'
            || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            || file.name.toLowerCase().endsWith('.doc')
            || file.name.toLowerCase().endsWith('.docx');

          if (!isImage && !isPdf && !isDoc) {
            window.alert('Please choose an image, PDF, or document file.');
            return;
          }

          const loaded = await loadFileAsDataUrl(file);
          const updated = getCertificates();
          if (certificateIndex >= 0) {
            updated[certificateIndex] = {
              ...updated[certificateIndex],
              name: loaded.name || updated[certificateIndex].name,
              issuer: 'Uploaded certificate',
              src: loaded.src,
              type: loaded.type,
              description: loaded.description || updated[certificateIndex].description
            };
            saveCertificates(updated);
            renderCertificates();
          }
        });
        input.click();
      }
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const message = String(formData.get('message') || '').trim();

      if (!name || !email || !message) {
        return;
      }

      const recipient = 'alertaalyzza2@gmail.com';
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );

      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
      contactForm.reset();
    });
  }

  renderCertificates();
});
