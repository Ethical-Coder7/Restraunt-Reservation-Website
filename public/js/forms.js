import { validateName, validateEmail, validateDate, validateSelect, validateMessage, clearState, ERRORS } from './validation.js';
import { db } from '../firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= CONFIRMATION POPUP =================

function showConfirmation({ title, lines }) {
  const existing = document.getElementById('confirm-popup');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'confirm-popup';
  overlay.innerHTML = `
    <div class="confirm-box">
      <div class="confirm-icon">✓</div>
      <h3>${title}</h3>
      ${lines.map(l => `<p>${l}</p>`).join('')}
      <button class="confirm-close-btn" id="confirmCloseBtn">Done</button>
    </div>
  `;

  if (!document.getElementById('confirm-popup-styles')) {
    const style = document.createElement('style');
    style.id = 'confirm-popup-styles';
    style.textContent = `
      #confirm-popup {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeInOverlay 0.2s ease;
      }
      @keyframes fadeInOverlay {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .confirm-box {
        background: #fff;
        border-radius: 16px;
        padding: 40px 36px 32px;
        max-width: 420px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        animation: slideUp 0.25s ease;
      }
      @keyframes slideUp {
        from { transform: translateY(24px); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
      .confirm-icon {
        width: 56px;
        height: 56px;
        background: #d4a843;
        color: #fff;
        border-radius: 50%;
        font-size: 1.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
      }
      .confirm-box h3 {
        font-family: 'Playfair Display', serif;
        font-size: 1.4rem;
        margin: 0 0 10px;
        color: #1a1a1a;
      }
      .confirm-box p {
        font-size: 0.92rem;
        color: #555;
        margin: 4px 0;
        line-height: 1.5;
      }
      .confirm-close-btn {
        margin-top: 24px;
        padding: 12px 36px;
        background: #d4a843;
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }
      .confirm-close-btn:hover { background: #b8902e; }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(overlay);

  const close = () => {
    overlay.style.animation = 'fadeInOverlay 0.15s ease reverse';
    setTimeout(() => overlay.remove(), 150);
  };

  document.getElementById('confirmCloseBtn').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
}

// ================= TOAST (for errors) =================

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4500);
}

// ================= FORMS =================

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];

  // ----- Reservation Form -----
  const resForm = document.getElementById('reservationForm');
  if (resForm) {
    resForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name   = document.getElementById('name').value;
      const email  = document.getElementById('email').value;
      const date   = document.getElementById('date').value;
      const time   = document.getElementById('time').value;
      const guests = document.getElementById('guests').value;

      const valid = [
        validateName(name,     'fg-name'),
        validateEmail(email,   'fg-email'),
        validateDate(date,     'fg-date', today),
        validateSelect(time,   'fg-time',   ERRORS.time_empty),
        validateSelect(guests, 'fg-guests', ERRORS.guests_empty)
      ];

      if (valid.includes(false)) {
        const firstErr = document.querySelector('.form-group.error input, .form-group.error select');
        if (firstErr) firstErr.focus();
        return;
      }

      const btn = document.getElementById('reserveBtn');
      btn.textContent = 'Reserving…';
      btn.disabled = true;
      btn.classList.add('loading');

      try {
        await addDoc(collection(db, 'reservations'), {
          name:      name.trim(),
          email:     email.trim(),
          date,
          time,
          guests:    Number(guests),
          createdAt: serverTimestamp()
        });

        this.reset();
        ['fg-name','fg-email','fg-date','fg-time','fg-guests'].forEach(clearState);

        showConfirmation({
          title: 'Table Reserved!',
          lines: [
            `Thank you, <strong>${name.trim()}</strong>!`,
            `Your table for <strong>${guests}</strong> on <strong>${date}</strong> at <strong>${time}</strong> is confirmed.`,
            `A confirmation will be sent to <strong>${email.trim()}</strong>.`
          ]
        });

      } catch (err) {
        console.error('Firestore error:', err);
        showToast('❌ Something went wrong. Please try again.');
      } finally {
        btn.textContent = 'Reserve Now';
        btn.disabled = false;
        btn.classList.remove('loading');
      }
    });
  }

  // ----- Contact Form -----
  const conForm = document.getElementById('contactForm');
  if (conForm) {
    conForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name    = document.getElementById('cname').value;
      const email   = document.getElementById('cemail').value;
      const message = document.getElementById('cmessage').value;

      const valid = [
        validateName(name,       'fg-cname'),
        validateEmail(email,     'fg-cemail'),
        validateMessage(message, 'fg-cmessage')
      ];

      if (valid.includes(false)) {
        const firstErr = document.querySelector('.form-group.error input, .form-group.error textarea');
        if (firstErr) firstErr.focus();
        return;
      }

      const btn = document.querySelector('.submit-btn');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        await addDoc(collection(db, 'contactMessages'), {
          name:      name.trim(),
          email:     email.trim(),
          message:   message.trim(),
          createdAt: serverTimestamp()
        });

        this.reset();
        ['fg-cname','fg-cemail','fg-cmessage'].forEach(clearState);

        showConfirmation({
          title: 'Message Sent!',
          lines: [
            `Thanks for reaching out, <strong>${name.trim()}</strong>!`,
            `We've received your message and will reply to <strong>${email.trim()}</strong> shortly.`
          ]
        });

      } catch (err) {
        console.error('Firestore error:', err);
        showToast('❌ Something went wrong. Please try again.');
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }
});