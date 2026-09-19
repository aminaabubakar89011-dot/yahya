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

  const createRulesModal = (form, onContinue) => {
    const modal = document.createElement('div');
    modal.className = 'rules-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'rules-title');
    modal.innerHTML = `
      <div class="rules-modal__card">
        <button type="button" class="rules-modal__close" aria-label="Rufe dokoki">&times;</button>
        <h2 id="rules-title">Dokoki kafin a kammala</h2>
        <ol>
          <li>Ka tabbatar ka cika dukkan bayanan da ake buƙata.</li>
          <li>Danna maɓallin da ke ƙasa domin ci gaba zuwa shafin da aka tanada.</li>
          <li>Jira na daƙiƙa 5 kafin a kammala aika bayananka.</li>
        </ol>
        <p class="rules-modal__countdown" aria-live="polite">Danna “Ci gaba” domin farawa.</p>
        <button type="button" class="btn btn-primary rules-modal__continue">Ci gaba</button>
      </div>
    `;

    const close = () => {
      modal.remove();
      onContinue(false);
    };

    modal.querySelector('.rules-modal__close').addEventListener('click', close);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) close();
    });

    modal.querySelector('.rules-modal__continue').addEventListener('click', () => {
      const continueButton = modal.querySelector('.rules-modal__continue');
      const countdown = modal.querySelector('.rules-modal__countdown');
      continueButton.disabled = true;

      window.open(redirectLink, '_blank', 'noopener,noreferrer');

      let remaining = 5;
      countdown.textContent = `Ana kammalawa cikin ${remaining}...`;
      const timer = setInterval(() => {
        remaining -= 1;
        if (remaining > 0) {
          countdown.textContent = `Ana kammalawa cikin ${remaining}...`;
          return;
        }

        clearInterval(timer);
        countdown.textContent = 'Ana aika bayananka...';
        setTimeout(() => {
          modal.remove();
          onContinue(true);
        }, 400);
      }, 1000);
    });

    form.appendChild(modal);
    modal.querySelector('.rules-modal__continue').focus();
  };

  const handleFormSubmit = (form, formType) => {
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = Object.fromEntries(new FormData(form).entries());
      const statusEl = form.querySelector('.form-status');
      const submitBtn = form.querySelector('.submit-btn');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Ana shirya...';
      }

      createRulesModal(form, (completed) => {
        if (!completed) {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = formType === 'application' ? 'Aikace Aikace' : 'Aika Saƙo';
          }
          return;
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

        if (statusEl) {
          statusEl.textContent = formType === 'application'
            ? 'An karɓi bayananku cikin nasara. Za mu tuntube ku ta lambar wayar da kuka bayar.'
            : 'An karɓi saƙonku cikin nasara. Za mu tuntube ku idan ya cancanta.';
          statusEl.classList.add('is-visible');
        }

        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = formType === 'application' ? 'Aikace Aikace' : 'Aika Saƙo';
        }
      });
    });
  };

  handleFormSubmit(document.querySelector('[data-form="application"]'), 'application');
  handleFormSubmit(document.querySelector('[data-form="contact"]'), 'contact');
});
