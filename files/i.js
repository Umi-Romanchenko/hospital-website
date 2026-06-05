function validateAndNext() {
  let isValid = true;
  
  // ФИО
  let fio = document.getElementById('fullName').value.trim();
  let fioRegex = /^[А-ЯЁ][а-яё]+(?:-[А-ЯЁ][а-яё]+)?\s[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/;
  if (!fioRegex.test(fio)) {
    showError('fullNameError', 'Введите ФИО полностью кириллицей');
    isValid = false;
  }
  
  // Телефон
  let phone = document.getElementById('phone').value.replace(/[\s()-]/g, '');
  if (!/^\+7\d{10}$/.test(phone)) {
    showError('phoneError', 'Формат: +7XXXXXXXXXX');
    isValid = false;
  }
  
  // Email (если заполнен)
  let email = document.getElementById('email').value.trim();
  if (email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('emailError', 'Неверный email');
    isValid = false;
  }
  
  if (isValid) {
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
  }
}

function showError(id, msg) {
  let errDiv = document.getElementById(id);
  errDiv.textContent = msg;
  errDiv.style.display = 'block';
  setTimeout(() => errDiv.style.display = 'none', 3000);
}