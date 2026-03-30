const REGEX = {
  name: /^[A-Za-z\u00C0-\u024F]+([ '\-][A-Za-z\u00C0-\u024F]+)*$/,
  email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  message: /^[\s\S]{10,}$/
};

const ERRORS = {
  name_empty:   'Name is required',
  name_invalid: 'Only letters, spaces, hyphens & apostrophes allowed',
  name_short:   'Name must be at least 2 characters',
  email_empty:  'Email is required',
  email_invalid:'Enter a valid email (e.g. you@example.com)',
  date_empty:   'Please pick a date',
  date_past:    'Date must be today or in the future',
  time_empty:   'Please select a time slot',
  guests_empty: 'Please select number of guests',
  msg_empty:    'Message is required',
  msg_short:    'Message must be at least 10 characters'
};

function setError(groupId, msg) {
  const fg = document.getElementById(groupId);
  if (!fg) return;
  fg.classList.remove('success');
  fg.classList.add('error');
  const span = fg.querySelector('.err-msg');
  if (span) span.textContent = msg;
}

function setSuccess(groupId) {
  const fg = document.getElementById(groupId);
  if (!fg) return;
  fg.classList.remove('error');
  fg.classList.add('success');
}

function clearState(groupId) {
  const fg = document.getElementById(groupId);
  if (!fg) return;
  fg.classList.remove('error', 'success');
}

// ================= VALIDATION FUNCTIONS =================

function validateName(value, groupId) {
  const v = value.trim();
  if (!v)         { setError(groupId, ERRORS.name_empty);   return false; }
  if (v.length<2) { setError(groupId, ERRORS.name_short);   return false; }
  if (!REGEX.name.test(v)) { setError(groupId, ERRORS.name_invalid); return false; }
  setSuccess(groupId); return true;
}

function validateEmail(value, groupId) {
  const v = value.trim();
  if (!v) { setError(groupId, ERRORS.email_empty);   return false; }
  if (!REGEX.email.test(v)) { setError(groupId, ERRORS.email_invalid); return false; }
  setSuccess(groupId); return true;
}

function validateDate(value, groupId, todayStr) {
  if (!value)         { setError(groupId, ERRORS.date_empty); return false; }
  if (value<todayStr) { setError(groupId, ERRORS.date_past);  return false; }
  setSuccess(groupId); return true;
}

function validateSelect(value, groupId, emptyMsg) {
  if (!value) { setError(groupId, emptyMsg); return false; }
  setSuccess(groupId); return true;
}

function validateMessage(value, groupId) {
  const v = value.trim();
  if (!v) { setError(groupId, ERRORS.msg_empty); return false; }
  if (!REGEX.message.test(v)) { setError(groupId, ERRORS.msg_short); return false; }
  setSuccess(groupId); return true;
}

// ================= INPUT RESTRICTION =================

function blockInvalidNameChars(e) {
  const allowed = /^[A-Za-z\u00C0-\u024F '\-]$/;
  const controlKeys = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
  if (!controlKeys.includes(e.key) && !allowed.test(e.key)) {
    e.preventDefault();
    const input = e.target;
    input.style.borderColor = '#e74c3c';
    setTimeout(() => input.style.borderColor = '', 400);
  }
}

// ================= LIVE EVENT LISTENERS =================

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];

  const dateInput = document.getElementById('date');
  if (dateInput) dateInput.setAttribute('min', today);

  // Home form
  const nameEl = document.getElementById('name');
  if (nameEl) {
    nameEl.addEventListener('keydown', blockInvalidNameChars);
    nameEl.addEventListener('blur',  () => validateName(nameEl.value, 'fg-name'));
    nameEl.addEventListener('input', () => {
      if (document.getElementById('fg-name').classList.contains('error'))
        validateName(nameEl.value, 'fg-name');
    });
  }

  const emailEl = document.getElementById('email');
  if (emailEl) {
    emailEl.addEventListener('blur',  () => validateEmail(emailEl.value, 'fg-email'));
    emailEl.addEventListener('input', () => {
      if (document.getElementById('fg-email').classList.contains('error'))
        validateEmail(emailEl.value, 'fg-email');
    });
  }

  const dateEl = document.getElementById('date');
  if (dateEl) dateEl.addEventListener('change', () => validateDate(dateEl.value, 'fg-date', today));

  const timeEl = document.getElementById('time');
  if (timeEl) timeEl.addEventListener('change', () => validateSelect(timeEl.value, 'fg-time', ERRORS.time_empty));

  const guestsEl = document.getElementById('guests');
  if (guestsEl) guestsEl.addEventListener('change', () => validateSelect(guestsEl.value, 'fg-guests', ERRORS.guests_empty));

  // Contact form
  const cnameEl = document.getElementById('cname');
  if (cnameEl) {
    cnameEl.addEventListener('keydown', blockInvalidNameChars);
    cnameEl.addEventListener('blur',  () => validateName(cnameEl.value, 'fg-cname'));
    cnameEl.addEventListener('input', () => {
      if (document.getElementById('fg-cname').classList.contains('error'))
        validateName(cnameEl.value, 'fg-cname');
    });
  }

  const cemailEl = document.getElementById('cemail');
  if (cemailEl) {
    cemailEl.addEventListener('blur',  () => validateEmail(cemailEl.value, 'fg-cemail'));
    cemailEl.addEventListener('input', () => {
      if (document.getElementById('fg-cemail').classList.contains('error'))
        validateEmail(cemailEl.value, 'fg-cemail');
    });
  }
});

// ================= EXPORTS =================
export { validateName, validateEmail, validateDate, validateSelect, validateMessage, clearState, ERRORS };