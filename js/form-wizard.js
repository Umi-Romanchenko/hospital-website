var currentStep = 1;

function nextStep(step) {
  // Шаг 1 и 3 проверяем, шаг 2 пропускаем без проверок
  if (currentStep === 1) {
    if (typeof validateStep === 'function' && !validateStep(1)) return;
  } else if (currentStep === 2) {
    // Ничего не проверяем – просто переходим
  } else if (currentStep === 3) {
    if (typeof validateStep === 'function' && !validateStep(3)) return;
  }

  document.querySelectorAll('.wizard-step').forEach(function(el) {
    el.classList.remove('active');
  });
  document.getElementById('step' + step).classList.add('active');
  currentStep = step;
  document.getElementById('stepIndicator').textContent = step;
}

function prevStep(step) {
  document.querySelectorAll('.wizard-step').forEach(function(el) {
    el.classList.remove('active');
  });
  document.getElementById('step' + step).classList.add('active');
  currentStep = step;
  document.getElementById('stepIndicator').textContent = step;
}

function sendSmsCode() {
  var phone = document.getElementById('phone').value.replace(/[\s()-]/g, '');
  if (!/^\+7\d{10}$/.test(phone)) {
    if (typeof showError === 'function') showError('phone', 'Введите корректный номер телефона.');
    return;
  }
  alert('Код подтверждения отправлен (имитация). Введите 1234');
  document.getElementById('smsCode').disabled = false;
}

function submitAppointment() {
  if (typeof validateStep === 'function' && !validateStep(3)) {
    var resultEl = document.getElementById('appointmentResult');
    if (resultEl) {
      resultEl.innerHTML = 'Пожалуйста, исправьте ошибки в форме перед отправкой.';
      resultEl.style.color = 'var(--alert-red)';
      resultEl.style.padding = '1rem';
      resultEl.style.border = '1px solid var(--alert-red)';
      resultEl.style.background = '#FFF5F5';
    }
    return;
  }
  
  var talonNumber = 'T-' + Math.floor(Math.random() * 100000);
  var resultEl = document.getElementById('appointmentResult');
  if (resultEl) {
    resultEl.innerHTML = 'Запись принята. Номер талона: <strong>' + talonNumber + '</strong>. Подтверждение будет направлено в течение 2 часов.';
    resultEl.style.color = 'var(--safe-green)';
    resultEl.style.padding = '1rem';
    resultEl.style.border = '1px solid var(--safe-green)';
    resultEl.style.background = '#F0FFF4';
  }
}