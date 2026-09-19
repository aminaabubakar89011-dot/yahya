document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  const redirectLink = 'https://omg10.com/4/11245408';

  const handleFormSubmit = (form, formType) => {
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = Object.fromEntries(new FormData(form).entries());
      const statusEl = form.querySelector('.form-status');
      const submitBtn = form.querySelector('.submit-btn');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Ana aikawa...';
      }

      let savedEntries = [];
      try {
        savedEntries = JSON.parse(localStorage.getItem('yahyaAidEntries') || '[]');
        if (!Array.isArray(savedEntries)) savedEntries = [];
      } catch (error) {
        savedEntries = [];
      }

      const entry = {
        id: `YA-${Date.now()}`,
        type: formType,
        submittedAt: new Date().toISOString(),
        ...formData,
      };

      savedEntries.push(entry);
      localStorage.setItem('yahyaAidEntries', JSON.stringify(savedEntries));

      setTimeout(() => {
        if (statusEl) {
          statusEl.innerHTML = formType === 'application'
            ? `An aika bayananku cikin nasara. <a class="notification-link" href="${redirectLink}" target="_blank" rel="noopener noreferrer">Danna nan don ci gaba</a>`
            : `An aika saƙonku da nasara. <a class="notification-link" href="${redirectLink}" target="_blank" rel="noopener noreferrer">Danna nan</a>`;
          statusEl.classList.add('is-visible');
        }

        form.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = formType === 'application' ? 'Aikace Aikace' : 'Aika Saƙo';
        }
      }, 500);
    });
  };

  handleFormSubmit(document.querySelector('[data-form="application"]'), 'application');
  handleFormSubmit(document.querySelector('[data-form="contact"]'), 'contact');
});
