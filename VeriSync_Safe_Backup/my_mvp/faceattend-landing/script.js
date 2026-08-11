(() => {
  "use strict";

  const page = document.body.dataset.page || "home";

  // Shared year
  document.querySelectorAll("#year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Reveal on scroll
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // Lightweight particle canvas
  const canvas = document.getElementById("particleCanvas");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(48, Math.max(20, Math.floor(width / 34)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.2 + 0.35
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.beginPath();
        ctx.fillStyle = "rgba(120, 220, 255, 0.42)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(95, 166, 255, ${0.08 * (1 - distance / 130)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame));
  }

  if (page === "home") {
    const header = document.querySelector(".site-header");
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");

    const onScroll = () => {
      header?.classList.toggle("scrolled", window.scrollY > 18);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    navToggle?.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle?.setAttribute("aria-expanded", "false");
      });
    });

    const timer = document.getElementById("qrTimer");
    if (timer) {
      let totalSeconds = 119;
      setInterval(() => {
        totalSeconds -= 1;
        if (totalSeconds < 0) totalSeconds = 119;
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        timer.textContent = `${minutes}:${seconds}`;
      }, 1000);
    }
  }

  if (page === "portal") {
    document.querySelectorAll("[data-role-card]").forEach((card) => {
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const primary = card.querySelector(".portal-actions .button");
          primary?.click();
        }
      });
    });
  }

  if (page === "auth") {
    const params = new URLSearchParams(window.location.search);
    const validRoles = ["student", "teacher", "admin"];
    const validModes = ["login", "register"];

    let role = params.get("role") || "student";
    let mode = params.get("mode") || "login";

    if (!validRoles.includes(role)) role = "student";
    if (!validModes.includes(mode)) mode = "login";
    if (role === "admin") mode = "login";

    const roleConfig = {
      student: {
        label: "Student portal",
        visualTitle: "Your attendance,\nalways clear.",
        visualText: "Access registered courses, verify attendance and review your personal analytics.",
        headingLogin: "Welcome back",
        subheadingLogin: "Sign in to continue to the student portal.",
        headingRegister: "Create student account",
        subheadingRegister: "Register using your approved college record.",
        loginButton: "Sign in to student portal",
        registerButton: "Create student account",
        title: "Student Access | VeriSync",
        icon: '<path d="m2 10 10-5 10 5-10 5-10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5M22 10v6"/>'
      },
      teacher: {
        label: "Teacher portal",
        visualTitle: "Run attendance,\nwithout friction.",
        visualText: "Activate assigned courses, launch secure attendance sessions and manage verified records.",
        headingLogin: "Welcome back, teacher",
        subheadingLogin: "Sign in with your verified faculty account.",
        headingRegister: "Create teacher account",
        subheadingRegister: "Submit your official faculty details for admin approval.",
        loginButton: "Sign in to teacher portal",
        registerButton: "Create teacher account",
        title: "Teacher Access | VeriSync",
        icon: '<path d="M4 19.5V5a2 2 0 0 1 2-2h11a3 3 0 0 1 3 3v15H6a2 2 0 0 1-2-1.5Z"/><path d="M8 7h8M8 11h6M8 15h4"/>'
      },
      admin: {
        label: "Admin portal",
        visualTitle: "Control access.\nProtect every record.",
        visualText: "Manage users, academic structures, course assignments, attendance rules and security.",
        headingLogin: "Admin sign in",
        subheadingLogin: "Use your authorised administrative account.",
        headingRegister: "",
        subheadingRegister: "",
        loginButton: "Sign in to admin portal",
        registerButton: "",
        title: "Admin Access | VeriSync",
        icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M9 12h6M12 9v6"/>'
      }
    };

    const config = roleConfig[role];

    const rolePill = document.getElementById("authRolePill");
    const visualTitle = document.getElementById("authVisualTitle");
    const visualText = document.getElementById("authVisualText");
    const heading = document.getElementById("authHeading");
    const subheading = document.getElementById("authSubheading");
    const loginButtonText = document.getElementById("loginButtonText");
    const registerButtonText = document.getElementById("registerButtonText");
    const authTabs = document.getElementById("authTabs");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const studentFields = document.getElementById("studentFields");
    const teacherFields = document.getElementById("teacherFields");
    const heroIcon = document.getElementById("authHeroIcon");
    const mobileIcon = document.querySelector("#authMobileIcon svg");
    const loginSwitchText = document.getElementById("loginSwitchText");

    document.title = config.title;
    rolePill.textContent = config.label;
    visualTitle.innerHTML = config.visualTitle.replace("\n", "<br>");
    visualText.textContent = config.visualText;
    loginButtonText.textContent = config.loginButton;
    registerButtonText.textContent = config.registerButton;

    heroIcon.innerHTML = config.icon;
    mobileIcon.innerHTML = config.icon;

    if (role === "admin") {
      authTabs.classList.add("hidden");
      loginSwitchText.classList.add("hidden");
    }

    if (role === "student") {
      studentFields.classList.remove("hidden");
      teacherFields.classList.add("hidden");
      studentFields.querySelectorAll("input, select").forEach((field) => {
        field.required = !field.name.includes("registrationNumber");
      });
      teacherFields.querySelectorAll("input, select").forEach((field) => {
        field.required = false;
      });
    } else if (role === "teacher") {
      studentFields.classList.add("hidden");
      teacherFields.classList.remove("hidden");
      studentFields.querySelectorAll("input, select").forEach((field) => {
        field.required = false;
      });
      teacherFields.querySelectorAll("input, select").forEach((field) => {
        field.required = true;
      });
    }

    const setMode = (nextMode, updateUrl = true) => {
      if (role === "admin") nextMode = "login";
      mode = nextMode;

      document.querySelectorAll(".auth-tab").forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.mode === mode);
      });

      const isLogin = mode === "login";
      loginForm.classList.toggle("hidden", !isLogin);
      registerForm.classList.toggle("hidden", isLogin);

      heading.textContent = isLogin ? config.headingLogin : config.headingRegister;
      subheading.textContent = isLogin ? config.subheadingLogin : config.subheadingRegister;

      if (updateUrl) {
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("role", role);
        nextUrl.searchParams.set("mode", mode);
        window.history.replaceState({}, "", nextUrl);
      }
    };

    document.querySelectorAll(".auth-tab").forEach((tab) => {
      tab.addEventListener("click", () => setMode(tab.dataset.mode));
    });

    document.querySelectorAll("[data-switch-mode]").forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.switchMode));
    });

    setMode(mode, false);

    document.querySelectorAll(".password-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const input = button.parentElement.querySelector("input");
        const showing = input.type === "text";
        input.type = showing ? "password" : "text";
        button.setAttribute("aria-label", showing ? "Show password" : "Hide password");
      });
    });

    const toast = document.getElementById("toast");
    const toastTitle = document.getElementById("toastTitle");
    const toastMessage = document.getElementById("toastMessage");
    let toastTimer = null;

    const showToast = (title, message) => {
      toastTitle.textContent = title;
      toastMessage.textContent = message;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
    };

    toast.querySelector("button").addEventListener("click", () => {
      toast.classList.remove("show");
    });

    const clearErrors = (form) => {
      form.querySelectorAll(".input-shell").forEach((shell) => shell.classList.remove("invalid"));
      form.querySelectorAll(".field-error").forEach((error) => {
        error.textContent = "";
      });
    };

    const validateForm = (form) => {
      clearErrors(form);
      let valid = true;

      [...form.elements].forEach((field) => {
        if (!field.matches("input, select") || field.type === "checkbox" || field.type === "button") return;
        if (field.closest(".hidden")) return;

        let message = "";

        if (field.required && !field.value.trim()) {
          message = "This field is required.";
        } else if (field.type === "email" && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          message = "Enter a valid email address.";
        } else if (field.minLength > 0 && field.value && field.value.length < field.minLength) {
          message = `Use at least ${field.minLength} characters.`;
        }

        if (message) {
          valid = false;
          const wrapper = field.closest(".form-field");
          wrapper?.querySelector(".input-shell")?.classList.add("invalid");
          const error = wrapper?.querySelector(".field-error");
          if (error) error.textContent = message;
        }
      });

      if (form === registerForm) {
        const password = form.elements.registerPassword;
        const confirmPassword = form.elements.confirmPassword;
        const terms = form.elements.terms;

        if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
          valid = false;
          const wrapper = confirmPassword.closest(".form-field");
          wrapper.querySelector(".input-shell").classList.add("invalid");
          wrapper.querySelector(".field-error").textContent = "Passwords do not match.";
        }

        if (!terms.checked) {
          valid = false;
          showToast("Confirmation required", "Please accept the verification confirmation before continuing.");
        }
      }

      return valid;
    };

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!validateForm(loginForm)) return;

      const data = Object.fromEntries(new FormData(loginForm));
      const submit = loginForm.querySelector('button[type="submit"]');
      submit.disabled = true;
      const originalText = submit.querySelector('span').textContent;
      submit.querySelector('span').textContent = 'Authenticating…';
      setTimeout(() => {
        const result = VeriSync.login(role, data.email, data.password);
        if (!result.ok) {
          showToast('Sign-in failed', result.message);
          submit.disabled = false;
          submit.querySelector('span').textContent = originalText;
          return;
        }
        window.location.href = `../${role}.html`;
      }, 450);
    });

    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!validateForm(registerForm)) return;

      const data = Object.fromEntries(new FormData(registerForm));
      const submit = registerForm.querySelector('button[type="submit"]');
      submit.disabled = true;
      const originalText = submit.querySelector('span').textContent;
      submit.querySelector('span').textContent = 'Submitting…';

      setTimeout(() => {
        if (role === 'student') {
          VeriSync.updateDB(db => {
            const exists = db.students.some(s => s.email.toLowerCase() === data.studentEmail.toLowerCase() || s.roll.toLowerCase() === data.rollNumber.toLowerCase());
            if (!exists) {
              db.students.push({
                id: VeriSync.uid('stu'),
                roll: data.rollNumber,
                name: data.fullName,
                email: data.studentEmail,
                phone: data.phone,
                department: data.department,
                programme: data.course,
                session: data.session,
                year: 'First Year',
                semester: data.semester.split(' ')[1] || 'I',
                section: data.section.split(' ')[1] || 'A',
                attendance: 0,
                faceStatus: 'Pending',
                status: 'Pending Approval'
              });
            }
            return db;
          });
        } else if (role === 'teacher') {
          VeriSync.updateDB(db => {
            const exists = db.teachers.some(t => t.email.toLowerCase() === data.teacherEmail.toLowerCase());
            if (!exists) {
              db.teachers.push({
                id: VeriSync.uid('tch'),
                name: data.teacherName,
                employeeId: data.facultyId,
                email: data.teacherEmail,
                phone: data.teacherPhone,
                department: data.teacherDepartment,
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

        submit.disabled = false;
        submit.querySelector('span').textContent = originalText;
        showToast(
          "Registration submitted",
          `Your ${role} registration is under review. Please login once approved.`
        );
        // Switch to login tab
        document.querySelector('.auth-tab[data-mode="login"]').click();
      }, 450);
    });

    document.getElementById("forgotPassword").addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Password recovery", `Connect this link to your ${role} forgot-password page.`);
    });
  }
})();
