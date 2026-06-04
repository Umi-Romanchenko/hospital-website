(function() {
  const html = document.documentElement;
  const body = document.body;
  const btnNormal = document.getElementById('normalFont');
  const btnLarge = document.getElementById('largeFont');
  const btnXl = document.getElementById('xlFont');
  const btnContrast = document.getElementById('contrastToggle');
  const btnReset = document.getElementById('resetAccess');

  if (!btnNormal || !btnLarge || !btnXl || !btnContrast || !btnReset) return;

  function setActiveButton(mode) {
    btnNormal.classList.remove('active');
    btnLarge.classList.remove('active');
    btnXl.classList.remove('active');
    if (mode === 'large') btnLarge.classList.add('active');
    else if (mode === 'xl') btnXl.classList.add('active');
    else btnNormal.classList.add('active');
  }

  function applyFontSize(mode) {
    if (mode === 'large') {
      body.classList.add('font-large');
      body.classList.remove('font-xl');
      html.style.setProperty('--base-font-size', '18px');
    } else if (mode === 'xl') {
      body.classList.add('font-xl');
      body.classList.remove('font-large');
      html.style.setProperty('--base-font-size', '22px');
    } else {
      body.classList.remove('font-large', 'font-xl');
      html.style.setProperty('--base-font-size', '16px');
    }
    setActiveButton(mode);
  }

  // Восстановление
  const savedFont = localStorage.getItem('hospitalFontSize');
  const savedContrast = localStorage.getItem('hospitalContrast');
  if (savedFont === 'large') applyFontSize('large');
  else if (savedFont === 'xl') applyFontSize('xl');
  else applyFontSize('normal');

  if (savedContrast === 'true') {
    body.classList.add('high-contrast');
    btnContrast.classList.add('active');
  }

  btnNormal.addEventListener('click', () => {
    applyFontSize('normal');
    localStorage.setItem('hospitalFontSize', 'normal');
  });
  btnLarge.addEventListener('click', () => {
    applyFontSize('large');
    localStorage.setItem('hospitalFontSize', 'large');
  });
  btnXl.addEventListener('click', () => {
    applyFontSize('xl');
    localStorage.setItem('hospitalFontSize', 'xl');
  });
  btnContrast.addEventListener('click', () => {
    body.classList.toggle('high-contrast');
    btnContrast.classList.toggle('active');
    localStorage.setItem('hospitalContrast', body.classList.contains('high-contrast'));
  });
  btnReset.addEventListener('click', () => {
    body.classList.remove('font-large', 'font-xl', 'high-contrast');
    btnContrast.classList.remove('active');
    html.style.setProperty('--base-font-size', '16px');
    setActiveButton('normal');
    localStorage.removeItem('hospitalFontSize');
    localStorage.removeItem('hospitalContrast');
  });
})();