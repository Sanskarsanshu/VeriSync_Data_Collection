'use strict';

(() => {
  const role = document.body.dataset.role;
  const mode = document.body.dataset.mode || 'login';
  const roleNames = {admin:'Admin', teacher:'Teacher', student:'Student'};

  document.querySelectorAll('[data-icon]').forEach(el => {
    el.innerHTML = VeriSync.icons[el.dataset.icon] || VeriSync.icons.logo;
  });

  VeriSync.initDB();

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', event => {
      event.preventDefault();
      const submit = loginForm.querySelector('button[type="submit"]');
      const email = loginForm.email.value;
      const password = loginForm.password.value;
      submit.disabled = true;
      submit.textContent = 'Signing in…';
      setTimeout(() => {
        const result = VeriSync.login(role, email, password);
        if (!result.ok) {
          VeriSync.showToast('Sign-in failed', result.message, 'error');
          submit.disabled = false;
          submit.textContent = `Sign in to ${roleNames[role]} Portal`;
          return;
        }
        window.location.href = `${role}.html`;
      }, 450);
    });
  }

  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    const verifyBtn = document.getElementById('verifyEmailBtn');
    const verificationCode = document.getElementById('verificationCode');
    let generatedCode = '';

    verifyBtn?.addEventListener('click', () => {
      const email = registrationForm.email.value.trim();
      if (!email || !email.includes('@')) {
        VeriSync.showToast('Enter a valid email', 'A verification code can only be sent to a valid email address.', 'error');
        return;
      }
      generatedCode = String(Math.floor(100000 + Math.random() * 900000));
      verificationCode.closest('.form-group').classList.remove('hidden');
      VeriSync.showToast('Demo verification code generated', `Use ${generatedCode} to verify the email in this frontend demo.`);
      verificationCode.focus();
    });

    registrationForm.addEventListener('submit', event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(registrationForm));
      if (data.password !== data.confirmPassword) {
        VeriSync.showToast('Passwords do not match', 'Enter the same password in both fields.', 'error');
        return;
      }
      if (!generatedCode || data.verificationCode !== generatedCode) {
        VeriSync.showToast('Email not verified', 'Generate and enter the correct demo verification code.', 'error');
        return;
      }
      if (!data.consent) {
        VeriSync.showToast('Consent is required', 'Accept the privacy and biometric consent statement.', 'error');
        return;
      }

      if (role === 'student') {
        VeriSync.updateDB(db => {
          const exists = db.students.some(s => s.email.toLowerCase() === data.email.toLowerCase() || s.roll.toLowerCase() === data.roll.toLowerCase());
          if (!exists) {
            db.students.push({
              id: VeriSync.uid('stu'),
              roll: data.roll,
              name: data.fullName,
              email: data.email,
              phone: data.phone,
              department: data.department,
              programme: data.programme,
              session: data.session,
              year: data.year,
              semester: data.semester,
              section: data.section,
              attendance: 0,
              faceStatus: 'Pending',
              status: 'Pending Approval'
            });
          }
          return db;
        });
      } else if (role === 'teacher') {
        VeriSync.updateDB(db => {
          const exists = db.teachers.some(t => t.email.toLowerCase() === data.email.toLowerCase());
          if (!exists) {
            db.teachers.push({
              id: VeriSync.uid('tch'),
              name: data.fullName,
              employeeId: data.employeeId,
              email: data.email,
              phone: data.phone,
              department: data.department,
              designation: data.designation,
              subjects: [],
              status: 'Pending',
              verified: true,
              lastLogin: 'Never'
            });
          }
          return db;
        });
      }

      VeriSync.openModal({
        title: 'Registration submitted',
        body: `<div class="empty-state"><div class="empty-icon">${VeriSync.icons.check}</div><h3>Your ${roleNames[role].toLowerCase()} registration is under review</h3><p>The admin must approve the account before portal access becomes active. Face verification is represented as a frontend workflow in this MVP.</p></div>`,
        footer: `<a class="btn btn-primary" href="${role}-login.html">Return to login</a>`
      });
    });
  }

  document.querySelectorAll('[data-password-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      input.type = input.type === 'password' ? 'text' : 'password';
      button.textContent = input.type === 'password' ? 'Show' : 'Hide';
    });
  });
})();
