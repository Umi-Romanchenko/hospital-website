function validateStep(step) {
  var valid = true;

  if (step === 1) {
    valid = validateName('fullName') && valid;
    valid = validateDate('birthDate') && valid;
    valid = validateSelect('gender') && valid;
    valid = validateSelect('patientStatus') && valid;
    valid = validateSelect('docType') && valid;
    valid = validateDocNumber('docNumber') && valid;
  } else if (step === 2) {
    // Шаг 2 теперь необязательный – ничего не проверяем
    // Можно оставить проверку файла, если он выбран, но необязательно
    var fileInput = document.getElementById('referralFile');
    if (fileInput && fileInput.files.length > 0) {
      valid = validateFile('referralFile') && valid;
    }
    return true; // всегда пропускаем
  } else if (step === 3) {
    valid = validatePhone('phone') && valid;
    
    var email = document.getElementById('email').value.trim();
    if (email) {
      valid = validateEmail('email') && valid;
    }
    
    if (document.getElementById('smsCode').disabled === false) {
      valid = validateSmsCode('smsCode') && valid;
    }
    
    valid = validateCheckbox('consentPd') && valid;
    valid = validateCheckbox('consentRules') && valid;
    valid = validateCheckbox('consentTrue') && valid;
  }
  
  return valid;
}

function showError(id, message) {
  var el = document.getElementById(id);
  var errorEl = document.getElementById(id + 'Error');
  if (el) el.classList.add('input-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function clearError(id) {
  var el = document.getElementById(id);
  var errorEl = document.getElementById(id + 'Error');
  if (el) el.classList.remove('input-error');
  if (errorEl) errorEl.style.display = 'none';
}

function validateName(id) {
  var value = document.getElementById(id).value.trim();
  var regex = /^[А-ЯЁ][а-яё]+(?:-[А-ЯЁ][а-яё]+)?\s[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/;
  if (!regex.test(value)) {
    showError(id, 'Введите ФИО полностью кириллицей (три слова).');
    return false;
  }
  clearError(id);
  return true;
}

function validateDate(id) {
  var value = document.getElementById(id).value;
  if (!value) {
    showError(id, 'Выберите дату рождения.');
    return false;
  }
  if (new Date(value) > new Date()) {
    showError(id, 'Дата рождения не может быть в будущем.');
    return false;
  }
  clearError(id);
  return true;
}

function validateSelect(id) {
  var value = document.getElementById(id).value;
  if (!value) {
    showError(id, 'Выберите значение из списка.');
    return false;
  }
  clearError(id);
  return true;
}

function validateDocNumber(id) {
  var value = document.getElementById(id).value.trim();
  var docType = document.getElementById('docType').value;
  
  if (docType === 'passport') {
    if (!/^\d{4}\s?\d{6}$/.test(value)) {
      showError(id, 'Формат паспорта РФ: 4 цифры, пробел, 6 цифр.');
      return false;
    }
  } else if (docType === 'military_id' || docType === 'officer_id') {
    if (value.length < 3) {
      showError(id, 'Введите номер документа.');
      return false;
    }
  } else {
    showError(id, 'Сначала выберите тип документа.');
    return false;
  }
  clearError(id);
  return true;
}

function validateFile(id) {
  var fileInput = document.getElementById(id);
  if (fileInput.files.length === 0) {
    // файл необязателен, ошибку не показываем
    return true;
  }
  var file = fileInput.files[0];
  var allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.indexOf(file.type) === -1) {
    showError(id, 'Допустимые форматы: PDF, JPG, PNG.');
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    showError(id, 'Размер файла не должен превышать 5 МБ.');
    return false;
  }
  clearError(id);
  return true;
}

function validatePhone(id) {
  var value = document.getElementById(id).value.replace(/[\s()-]/g, '');
  if (!/^\+7\d{10}$/.test(value)) {
    showError(id, 'Введите номер в формате +7XXXXXXXXXX.');
    return false;
  }
  clearError(id);
  return true;
}

function validateEmail(id) {
  var value = document.getElementById(id).value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    showError(id, 'Введите корректный адрес электронной почты.');
    return false;
  }
  clearError(id);
  return true;
}

function validateSmsCode(id) {
  var value = document.getElementById(id).value.trim();
  if (value !== '1234') {
    showError(id, 'Неверный код подтверждения.');
    return false;
  }
  clearError(id);
  return true;
}

function validateCheckbox(id) {
  var el = document.getElementById(id);
  if (!el.checked) {
    // вместо alert покажем сообщение в блоке результата
    var resultEl = document.getElementById('appointmentResult');
    if (resultEl) {
      resultEl.innerHTML = 'Необходимо дать все обязательные согласия.';
      resultEl.style.color = 'var(--alert-red)';
      resultEl.style.padding = '1rem';
      resultEl.style.border = '1px solid var(--alert-red)';
      resultEl.style.background = '#FFF5F5';
    }
    return false;
  }
  return true;
}

// Очистка ошибок при вводе
document.querySelectorAll('input, select').forEach(function(el) {
  el.addEventListener('input', function() {
    this.classList.remove('input-error');
    var err = document.getElementById(this.id + 'Error');
    if (err) err.style.display = 'none';
  });
});