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

      const savedApplications = JSON.parse(localStorage.getItem('yahyaAidEntries') || '[]');
      const entry = {
        id: `YA-${Date.now()}`,
        type: formType,
        submittedAt: new Date().toISOString(),
        ...formData,
      };

      savedApplications.push(entry);
      localStorage.setItem('yahyaAidEntries', JSON.stringify(savedApplications));

      setTimeout(() => {
        if (statusEl) {
          statusEl.textContent = formType === 'application'
            ? `An yi aikace-aikace da nasara. Lambar kiɗa ce ${entry.id}.`
            : 'An aika saƙonku da nasara.';
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
