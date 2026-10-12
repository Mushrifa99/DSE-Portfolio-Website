document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       ELEMENTS
    ================================================= */

    const sections = document.querySelectorAll(".page-section");
    const navLinks = document.querySelectorAll("[data-section-link]");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navMenu = document.getElementById("navMenu");


    /* =================================================
       SHOW SECTION
    ================================================= */

    function showSection(sectionId, replaceHistory = false) {

        const targetSection = document.getElementById(sectionId);

        if (!targetSection) {
            return;
        }

        sections.forEach(section => {
            section.classList.remove("active-section");
        });

        targetSection.classList.add("active-section");

        navLinks.forEach(link => {
            link.classList.remove("active");

            if (link.dataset.sectionLink === sectionId) {
                link.classList.add("active");
            }
        });

        closeMobileMenu();

        window.scrollTo({ top: 0, behavior: "smooth" });

        if (window.location.hash !== "#" + sectionId) {
            if (replaceHistory) {
                history.replaceState(null, "", "#" + sectionId);
            } else {
                history.pushState(null, "", "#" + sectionId);
            }
        }
    }


    /* =================================================
       MOBILE MENU HELPERS
    ================================================= */

    function closeMobileMenu() {

        if (navMenu) {
            navMenu.classList.remove("open");
        }

        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute("aria-expanded", "false");
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }


    /* =================================================
       NAVIGATION CLICK
    ================================================= */

    navLinks.forEach(link => {

        link.addEventListener("click", event => {

            const sectionId = link.dataset.sectionLink;

            if (!sectionId) {
                return;
            }

            event.preventDefault();
            showSection(sectionId);
        });
    });


    /* =================================================
       INITIAL SECTION
    ================================================= */

    const initialHash = window.location.hash.replace("#", "");

    if (initialHash && document.getElementById(initialHash)) {
        showSection(initialHash, true);
    } else {
        showSection("home", true);
    }


    /* =================================================
       BROWSER BACK / FORWARD
    ================================================= */

    window.addEventListener("popstate", () => {
        const hash = window.location.hash.replace("#", "") || "home";
        showSection(hash, true);
    });


    /* =================================================
       MOBILE MENU
    ================================================= */

    if (mobileMenuBtn && navMenu) {

        mobileMenuBtn.addEventListener("click", () => {

            const isOpen = navMenu.classList.toggle("open");

            mobileMenuBtn.setAttribute("aria-expanded", isOpen);

            mobileMenuBtn.innerHTML = isOpen
                ? '<i class="fas fa-xmark"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }

    document.addEventListener("click", event => {

        if (!navMenu || !mobileMenuBtn) {
            return;
        }

        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedButton = mobileMenuBtn.contains(event.target);

        if (!clickedInsideMenu && !clickedButton) {
            closeMobileMenu();
        }
    });


    /* =================================================
       PROJECT IMAGE LIGHTBOX
    ================================================= */

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");
    const zoomButtons = document.querySelectorAll(".zoom-btn");

    zoomButtons.forEach(button => {

        button.addEventListener("click", () => {

            const imagePath = button.dataset.image;

            if (!imagePath || !lightbox || !lightboxImage) {
                return;
            }

            lightboxImage.src = imagePath;
            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        });
    });

    function closeLightbox() {

        if (!lightbox) {
            return;
        }

        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (lightboxImage) {
            lightboxImage.src = "";
        }
    }

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener("click", event => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeLightbox();
        }
    });


    /* =================================================
       EMAIL VALIDATION
       Checks format, dots, domain, TLD and common typos.
       (A browser cannot check if the mailbox really exists.)
    ================================================= */

    const COMMON_TYPOS = {
        "gmial.com": "gmail.com",
        "gmai.com": "gmail.com",
        "gamil.com": "gmail.com",
        "gnail.com": "gmail.com",
        "gmail.co": "gmail.com",
        "gmail.con": "gmail.com",
        "gmail.cm": "gmail.com",
        "yahooo.com": "yahoo.com",
        "yaho.com": "yahoo.com",
        "yahoo.con": "yahoo.com",
        "hotmial.com": "hotmail.com",
        "hotmail.con": "hotmail.com",
        "outlok.com": "outlook.com",
        "outlook.con": "outlook.com"
    };

    function validateEmail(email) {

        if (!email) {
            return { valid: false, message: "Please enter your email address." };
        }

        if (/\s/.test(email)) {
            return { valid: false, message: "Email address cannot contain spaces." };
        }

        if (email.length > 254) {
            return { valid: false, message: "Email address is too long." };
        }

        const parts = email.split("@");

        if (parts.length < 2) {
            return { valid: false, message: "Invalid email: the @ symbol is missing." };
        }

        if (parts.length > 2) {
            return { valid: false, message: "Invalid email: only one @ symbol is allowed." };
        }

        const local = parts[0];
        const domain = parts[1].toLowerCase();

        if (!local) {
            return { valid: false, message: "Invalid email: nothing before the @ symbol." };
        }

        if (local.length > 64) {
            return { valid: false, message: "Invalid email: the part before @ is too long." };
        }

        if (/^\.|\.$|\.\./.test(local)) {
            return { valid: false, message: "Invalid email: check the dots before the @ symbol." };
        }

        if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) {
            return { valid: false, message: "Invalid email: it contains unsupported characters." };
        }

        if (!domain) {
            return { valid: false, message: "Invalid email: nothing after the @ symbol." };
        }

        if (!domain.includes(".")) {
            return { valid: false, message: "Invalid email: the domain needs a dot, like gmail.com." };
        }

        if (/^\.|\.$|\.\./.test(domain)) {
            return { valid: false, message: "Invalid email: check the dots in the domain." };
        }

        const labels = domain.split(".");

        for (const label of labels) {
            if (!/^[a-z0-9-]{1,63}$/.test(label) || /^-|-$/.test(label)) {
                return { valid: false, message: "Invalid email: the domain name is not valid." };
            }
        }

        const tld = labels[labels.length - 1];

        if (!/^[a-z]{2,}$/.test(tld)) {
            return { valid: false, message: "Invalid email: the ending (like .com) is not valid." };
        }

        if (COMMON_TYPOS[domain]) {
            return {
                valid: false,
                message: `Invalid email: did you mean ${local}@${COMMON_TYPOS[domain]}?`
            };
        }

        return { valid: true, message: "" };
    }


    /* =================================================
       CONTACT FORM
    ================================================= */

    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    if (contactForm && formMessage) {

        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const projectInput = document.getElementById("projectType");
        const messageInput = document.getElementById("message");
        const submitBtn = contactForm.querySelector(".submit-btn");
        const submitText = submitBtn ? submitBtn.querySelector("span") : null;
        const fields = [nameInput, emailInput, projectInput, messageInput];

        let messageTimer;

        function showMessage(text, type) {
            clearTimeout(messageTimer);
            formMessage.textContent = text;
            formMessage.className = "form-message " + type;
        }

        function clearMessage() {
            formMessage.textContent = "";
            formMessage.className = "form-message";
        }

        function setFieldError(field, text) {
            field.classList.add("input-error");
            showMessage(text, "error");
            field.focus();
        }

        function clearFieldErrors() {
            fields.forEach(field => field.classList.remove("input-error"));
        }

        /* Remove the red border as soon as the user edits a field */
        fields.forEach(field => {
            field.addEventListener("input", () => {
                field.classList.remove("input-error");
                if (formMessage.classList.contains("error")) {
                    clearMessage();
                }
            });
        });

        /* Live check when leaving the email field */
        emailInput.addEventListener("blur", () => {

            const value = emailInput.value.trim();

            if (!value) {
                return;
            }

            const result = validateEmail(value);

            if (!result.valid) {
                emailInput.classList.add("input-error");
                showMessage(result.message, "error");
            }
        });


        contactForm.addEventListener("submit", async event => {

            event.preventDefault();

            clearFieldErrors();

            /* Spam trap: bots tick this hidden box */
            const botcheck = document.getElementById("botcheck");
            if (botcheck && botcheck.checked) {
                return;
            }

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const projectType = projectInput.value;
            const message = messageInput.value.trim();


            /* ---------- VALIDATION ---------- */

            if (!name) {
                return setFieldError(nameInput, "Please enter your name.");
            }

            if (name.length < 2) {
                return setFieldError(nameInput, "Your name must be at least 2 characters.");
            }

            const emailResult = validateEmail(email);

            if (!emailResult.valid) {
                return setFieldError(emailInput, emailResult.message);
            }

            if (!projectType) {
                return setFieldError(projectInput, "Please select a project type.");
            }

            if (!message) {
                return setFieldError(messageInput, "Please enter your message.");
            }

            if (message.length < 10) {
                return setFieldError(messageInput, "Your message must be at least 10 characters.");
            }


            /* ---------- SENDING ---------- */

            const originalText = submitText ? submitText.textContent : "";

            submitBtn.disabled = true;

            if (submitText) {
                submitText.textContent = "Sending...";
            }

            showMessage("Sending your message...", "success");

            try {

                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData.entries());
                delete data.botcheck;

                /* If the Web3Forms key is not added yet, run in demo mode */
                if (data.access_key === "YOUR_WEB3FORMS_ACCESS_KEY") {

                    console.warn("Demo mode: add your Web3Forms access key to send real emails.");

                    await new Promise(resolve => setTimeout(resolve, 900));

                } else {

                    const response = await fetch("https://api.web3forms.com/submit", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();

                    if (!response.ok || !result.success) {
                        throw new Error(result.message || "Request failed");
                    }
                }

                showMessage("Success! Your message has been sent. I will reply soon.", "success");
                contactForm.reset();

            } catch (error) {

                showMessage("Error: your message could not be sent. Please try again later.", "error");

            } finally {

                submitBtn.disabled = false;

                if (submitText) {
                    submitText.textContent = originalText;
                }

                messageTimer = setTimeout(clearMessage, 6000);
            }
        });
    }


    /* =================================================
       FOOTER YEAR
    ================================================= */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =================================================
       REVEAL ANIMATION DELAY
    ================================================= */

    sections.forEach(section => {

        const revealItems = section.querySelectorAll(".reveal");

        revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index * 0.05, 0.35)}s`;
        });
    });

});
