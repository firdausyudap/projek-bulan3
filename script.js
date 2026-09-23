/* =========================================================
    YUDA // THE DARK WOLF PORTFOLIO
   DARK CINEMATIC SYSTEM
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const loader = document.getElementById("loader");
    const navbar = document.getElementById("navbar");

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    const navLinks = document.querySelectorAll(".nav-menu a");
    const sections = document.querySelectorAll("main section[id]");

    const backTop = document.getElementById("backTop");

    const revealElements = document.querySelectorAll(".reveal");

    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    const particleContainer =
        document.getElementById("wolfParticles");

    const heroCharacter =
        document.querySelector(".hero-character");

    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");
    const chatSubmit = document.getElementById("chatSubmit");
    const serviceOrderForms = document.querySelectorAll(".service-order-form");
    const projectCards = document.querySelectorAll(".project-card[data-project-target], .project-card[data-project-url]");
    const gallerySection = document.getElementById("gallery");
    const chromeStar = document.querySelector(".chrome-star");
    const cinematicTunnel = document.querySelector(".cinematic-tunnel");

    /* =====================================================
       LOADER
    ===================================================== */

    document.body.classList.add("loading");

    if (loader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                loader.classList.add("hidden");
                document.body.classList.remove("loading");
            }, 900);
        });
    } else {
        document.body.classList.remove("loading");
    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function closeMenu() {
        if (!navMenu || !menuToggle) return;

        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen =
                navMenu.classList.toggle("active");

            menuToggle.classList.toggle(
                "active",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    }


    /* =====================================================
       NAV LINK
    ===================================================== */

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });


    /* =====================================================
       NAVBAR SCROLL
    ===================================================== */

    function updateNavbar() {
        if (!navbar) return;

        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 60
        );
    }


    /* =====================================================
       BACK TO TOP
    ===================================================== */

    function updateBackTop() {
        if (!backTop) return;

        backTop.classList.toggle(
            "show",
            window.scrollY > 500
        );
    }

    if (backTop) {
        backTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    function updateActiveNav() {
        if (!sections.length || !navLinks.length) {
            return;
        }

        const scrollPosition =
            window.scrollY +
            (navbar ? navbar.offsetHeight : 80) +
            150;

        let currentId = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionBottom =
                sectionTop + section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {
                currentId =
                    section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            const href =
                link.getAttribute("href");

            link.classList.toggle(
                "active",
                href === `#${currentId}`
            );
        });
    }

    function updateGalleryScene() {
        if (!gallerySection || !chromeStar || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const bounds = gallerySection.getBoundingClientRect();
        const progress = Math.max(-1, Math.min(1, -bounds.top / Math.max(bounds.height, 1)));
        chromeStar.style.setProperty("--star-y", `${progress * 85}px`);
        chromeStar.style.setProperty("--star-tilt", `${progress * 24}deg`);

        if (cinematicTunnel) {
            const tunnelBounds = cinematicTunnel.getBoundingClientRect();
            const tunnelProgress = Math.max(-1, Math.min(1, -tunnelBounds.top / Math.max(tunnelBounds.height, 1)));
            cinematicTunnel.style.setProperty("--tunnel-progress", tunnelProgress.toString());
        }
    }


    /* =====================================================
       SCROLL EVENT
    ===================================================== */

    let scrollTicking = false;

    function handleScroll() {
        if (scrollTicking) return;

        scrollTicking = true;

        requestAnimationFrame(() => {
            updateNavbar();
            updateBackTop();
            updateActiveNav();
            updateGalleryScene();

            scrollTicking = false;
        });
    }

    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    updateNavbar();
    updateBackTop();
    updateActiveNav();
    updateGalleryScene();


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const id =
                        link.getAttribute("href");

                    if (!id || id === "#") {
                        return;
                    }

                    let target;

                    try {
                        target =
                            document.querySelector(id);
                    } catch {
                        return;
                    }

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    const offset =
                        navbar
                            ? navbar.offsetHeight
                            : 0;

                    const targetPosition =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        offset;

                    window.scrollTo({
                        top: Math.max(
                            0,
                            targetPosition
                        ),
                        behavior: "smooth"
                    });

                }
            );

        });

    serviceOrderForms.forEach((form) => {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const message = form.querySelector(".service-form-message");
            const button = form.querySelector("button[type='submit']");
            const formData = new FormData(form);
            formData.append("service", form.dataset.service || "layanan");
            message.textContent = "Mengirim permintaan...";
            button.disabled = true;

            try {
                const response = await fetch("/api/service-order", {
                    method: "POST",
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: { "Content-Type": "application/json" }
                });
                const data = await response.json();
                message.textContent = data.message;
                if (response.ok && data.success) form.reset();
            } catch (error) {
                message.textContent = "Terjadi kesalahan. Silakan coba lagi.";
                console.error(error);
            } finally {
                button.disabled = false;
            }
        });
    });

    projectCards.forEach((card) => {
        const openProjectDetail = () => {
            if (card.dataset.projectUrl) {
                window.open(card.dataset.projectUrl, "_blank", "noopener,noreferrer");
                return;
            }

            const target = document.querySelector(card.dataset.projectTarget);
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        };

        card.addEventListener("click", openProjectDetail);
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProjectDetail();
            }
        });
    });


    /* =====================================================
       REVEAL ANIMATION
    ===================================================== */

    if (
        "IntersectionObserver" in window &&
        revealElements.length
    ) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "active"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("active");
        });

    }


    /* =====================================================
       WOLF PARTICLES
    ===================================================== */

    function createParticles() {

        if (!particleContainer) return;

        // Hapus particle lama jika fungsi dipanggil ulang
        particleContainer.innerHTML = "";

        const amount =
            window.innerWidth < 600
                ? 25
                : 55;

        const fragment =
            document.createDocumentFragment();

        for (let i = 0; i < amount; i++) {

            const particle =
                document.createElement("span");

            particle.className =
                "wolf-particle";

            const size =
                Math.random() * 3 + 1;

            const duration =
                4 + Math.random() * 7;

            particle.style.width =
                `${size}px`;

            particle.style.height =
                `${size}px`;

            particle.style.left =
                `${Math.random() * 100}%`;

            particle.style.top =
                `${Math.random() * 100}%`;

            particle.style.setProperty(
                "--delay",
                `${Math.random() * 6}s`
            );

            particle.style.setProperty(
                "--duration",
                `${duration}s`
            );

            fragment.appendChild(particle);
        }

        particleContainer.appendChild(
            fragment
        );
    }

    createParticles();


    /* =====================================================
       POWER CARD TILT
    ===================================================== */

    function enableCardTilt(
        selector,
        strength = 5
    ) {

        const cards =
            document.querySelectorAll(selector);

        cards.forEach((card) => {

            card.addEventListener(
                "mousemove",
                (event) => {

                    if (window.innerWidth < 800) {
                        return;
                    }

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;

                    const rotateY =
                        (x / rect.width - 0.5) *
                        strength;

                    const rotateX =
                        (y / rect.height - 0.5) *
                        -strength;

                    card.style.transform = `
                        translateY(-8px)
                        perspective(900px)
                        rotateX(${rotateX}deg)
                        rotateY(${rotateY}deg)
                    `;
                }
            );

            card.addEventListener(
                "mouseleave",
                () => {
                    card.style.transform = "";
                }
            );

        });
    }

    enableCardTilt(
        ".power-card",
        7
    );

    enableCardTilt(
        ".project-card",
        5
    );


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                const name =
                    document
                        .getElementById("name")
                        ?.value
                        .trim() || "";

                const email =
                    document
                        .getElementById("email")
                        ?.value
                        .trim() || "";

                const message =
                    document
                        .getElementById("message")
                        ?.value
                        .trim() || "";


                /* =========================
                   VALIDATION
                ========================= */

                if (!name || !email || !message) {

                    if (formMessage) {

                        formMessage.textContent =
                            "PLEASE COMPLETE ALL FIELDS.";

                        formMessage.classList.add(
                            "error"
                        );
                    }

                    return;
                }


                /* =========================
                   EMAIL VALIDATION
                ========================= */

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailPattern.test(email)) {

                    if (formMessage) {

                        formMessage.textContent =
                            "PLEASE ENTER A VALID EMAIL.";

                        formMessage.classList.add(
                            "error"
                        );
                    }

                    return;
                }


                /* =========================
                   SUCCESS
                ========================= */

                if (formMessage) {

                    formMessage.classList.remove(
                        "error"
                    );

                    formMessage.textContent =
                        "WOLF SIGNAL SENT ✓";

                }

                contactForm.reset();


                setTimeout(() => {

                    if (formMessage) {
                        formMessage.textContent = "";
                    }

                }, 4000);

            }
        );
    }

    /* =====================================================
       GEMINI CHATBOT
    ===================================================== */

    function addChatMessage(text, type) {
        if (!chatMessages) return;

        const message = document.createElement("p");
        message.className = `chat-message ${type}`;
        message.textContent = text;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (chatForm && chatInput && chatMessages && chatSubmit) {
        chatForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const prompt = chatInput.value.trim();
            if (!prompt) return;

            addChatMessage(prompt, "user");
            chatInput.value = "";
            chatInput.disabled = true;
            chatSubmit.disabled = true;

            const submitIndicator = chatSubmit.querySelector("span");
            if (submitIndicator) {
                submitIndicator.textContent = "...";
            }

            try {
                const isLocalHost =
                    ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

                const isPortfolioServer =
                    isLocalHost && ["3000", "80", ""].includes(window.location.port);

                const apiUrl = isPortfolioServer
                    ? `${window.location.origin}/api/gemini`
                    : isLocalHost
                        ? "http://127.0.0.1:3000/api/gemini"
                        : "/api/gemini";

                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ prompt })
                });

                const responseText = await response.text();
                let data = {};

                if (responseText.trim()) {
                    try {
                        data = JSON.parse(responseText);
                    } catch {
                        throw new Error(
                            `Server mengirim response tidak valid (HTTP ${response.status}).`
                        );
                    }
                }

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        `Gemini request gagal (HTTP ${response.status}).`
                    );
                }

                const answer = data.response;

                addChatMessage(
                    answer || "Gemini belum mengirim jawaban.",
                    "bot"
                );
            } catch (error) {
                addChatMessage(
                    error.message || "Gagal terhubung ke Gemini.",
                    "bot"
                );
            } finally {
                chatInput.disabled = false;
                chatSubmit.disabled = false;

                if (submitIndicator) {
                    submitIndicator.textContent = "→";
                }

                chatInput.focus();
            }
        });
    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        }
    );


    /* =====================================================
       HERO PARALLAX
    ===================================================== */

    if (heroCharacter) {

        let mouseX = 0;
        let mouseY = 0;

        let currentX = 0;
        let currentY = 0;

        function animateParallax() {

            currentX +=
                (mouseX - currentX) * 0.08;

            currentY +=
                (mouseY - currentY) * 0.08;

            if (window.innerWidth >= 900) {

                heroCharacter.style.transform =
                    `translate3d(
                        ${currentX}px,
                        ${currentY}px,
                        0
                    )`;

            }

            requestAnimationFrame(
                animateParallax
            );
        }

        window.addEventListener(
            "mousemove",
            (event) => {

                if (window.innerWidth < 900) {
                    return;
                }

                mouseX =
                    (event.clientX /
                        window.innerWidth -
                        0.5) * 12;

                mouseY =
                    (event.clientY /
                        window.innerHeight -
                        0.5) * 8;

            },
            { passive: true }
        );

        animateParallax();
    }


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 768
            ) {
                closeMenu();
            }

            if (
                particleContainer
            ) {
                createParticles();
            }

        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updateNavbar();
    updateBackTop();
    updateActiveNav();

});