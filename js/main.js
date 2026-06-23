/**
 * Complete Tactile Installation — Main JavaScript
 * Handles: confirmation modals, form validation, Web3Forms submission
 */
(function() {
  'use strict';

  // ===== Confirmation Modal =====
  var modal = document.getElementById('confirmModal');
  var modalTitle = document.getElementById('modalTitle');
  var modalDesc = document.getElementById('modalDesc');
  var modalDetail = document.getElementById('modalDetail');
  var modalConfirm = document.getElementById('modalConfirm');
  var modalCancel = document.getElementById('modalCancel');

  function openModal(title, desc, detailHTML, href) {
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalDetail.innerHTML = detailHTML;
    modalConfirm.setAttribute('href', href);
    modal.classList.add('active');
    modalCancel.focus();
  }
  function closeModal() {
    modal.classList.remove('active');
  }

  modalCancel.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Hero "Get a Free Quote" button
  document.getElementById('heroQuoteBtn').addEventListener('click', function() {
    openModal(
      'Get a Free Quote',
      'This will open your email app to send a quote request to:',
      '<a href="mailto:sarojnagarkoti01@gmail.com">sarojnagarkoti01@gmail.com</a>',
      'mailto:sarojnagarkoti01@gmail.com?subject=' + encodeURIComponent('Quote Request - Complete Tactile Installation')
    );
  });

  // Hero "Call Us" button
  document.getElementById('heroCallBtn').addEventListener('click', function() {
    openModal(
      'Call Complete Tactile Installation',
      'You are about to call:',
      '<a href="tel:+61459664406">+61 459 664 406</a>',
      'tel:+61459664406'
    );
  });

  // ===== Quote Form (Web3Forms) =====
  var form = document.getElementById('quoteForm');
  var statusEl = document.getElementById('formStatus');

  function showStatus(type, message) {
    statusEl.className = 'form-status status-' + type;
    statusEl.textContent = message;
  }
  function hideStatus() {
    statusEl.className = 'form-status';
    statusEl.textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function isValidPhone(phone) {
    return /^[\d\s\+\-\(\)]{7,20}$/.test(phone);
  }
  function showError(inputId, errorId) {
    document.getElementById(inputId).classList.add('invalid');
    document.getElementById(errorId).style.display = 'block';
  }
  function clearError(inputId, errorId) {
    document.getElementById(inputId).classList.remove('invalid');
    document.getElementById(errorId).style.display = 'none';
  }

  // Live clear errors on input
  var fields = [
    ['q_name', 'err-name'],
    ['q_email', 'err-email'],
    ['q_phone', 'err-phone'],
    ['q_service', 'err-service']
  ];
  fields.forEach(function(pair) {
    var el = document.getElementById(pair[0]);
    el.addEventListener('input', function() { clearError(pair[0], pair[1]); });
    el.addEventListener('change', function() { clearError(pair[0], pair[1]); });
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    hideStatus();
    var valid = true;

    // Validate name
    var name = document.getElementById('q_name').value.trim();
    if (!name) { showError('q_name', 'err-name'); valid = false; }

    // Validate email
    var email = document.getElementById('q_email').value.trim();
    if (!email || !isValidEmail(email)) { showError('q_email', 'err-email'); valid = false; }

    // Validate phone
    var phone = document.getElementById('q_phone').value.trim();
    if (!phone || !isValidPhone(phone)) { showError('q_phone', 'err-phone'); valid = false; }

    // Validate service
    var service = document.getElementById('q_service').value;
    if (!service) { showError('q_service', 'err-service'); valid = false; }

    if (!valid) return;

    // Submit via Web3Forms
    showStatus('loading', 'Sending your quote request\u2026');

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: form.querySelector('[name="access_key"]').value,
        subject: form.querySelector('[name="subject"]').value,
        from_name: 'Complete Tactile Installation Website',
        name: name,
        email: email,
        phone: phone,
        location: document.getElementById('q_location').value.trim() || 'Not provided',
        service: document.getElementById('q_service').options[document.getElementById('q_service').selectedIndex].text,
        message: document.getElementById('q_message').value.trim() || 'None',
        botcheck: form.querySelector('[name="botcheck"]').checked
      })
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
      if (data.success) {
        form.style.display = 'none';
        showStatus('success', 'Thank you! Your quote request has been received. We\'ll get back to you shortly.');
      } else {
        showStatus('error', 'Something went wrong. Please try again or email us directly at sarojnagarkoti01@gmail.com');
      }
    })
    .catch(function() {
      showStatus('error', 'Network error. Please try again or email us directly at sarojnagarkoti01@gmail.com');
    });
  });
})();
