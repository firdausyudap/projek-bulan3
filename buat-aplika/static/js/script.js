const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const navbar = document.querySelector(".navbar");
const helloButton = document.getElementById("btnHello");
const helloResult = document.getElementById("hasil");
const technologyOrderForm = document.getElementById("technologyOrderForm");
const technologyOrderMessage = document.getElementById("technologyOrderMessage");
const educationOrderForm = document.getElementById("educationOrderForm");
const educationOrderMessage = document.getElementById("educationOrderMessage");
const creativeOrderForm = document.getElementById("creativeOrderForm");
const creativeOrderMessage = document.getElementById("creativeOrderMessage");
const projectModal = document.getElementById("projectModal");
const projectModalImage = document.getElementById("projectModalImage");
const projectModalCategory = document.getElementById("projectModalCategory");
const projectModalTitle = document.getElementById("projectModalTitle");
const projectModalDescription = document.getElementById("projectModalDescription");
const projectModalLink = document.getElementById("projectModalLink");
let lastFocusedProject = null;

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

if (navMenu && menuToggle) {
    document.querySelectorAll("#navMenu a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

if (helloButton && helloResult) {
    helloButton.addEventListener("click", () => {
        helloResult.textContent = "Halo! JavaScript berhasil dijalankan.";
    });
}

const updateScrollEffects = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    document.documentElement.style.setProperty("--scroll-progress", progress);
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
};

window.addEventListener("scroll", updateScrollEffects, { passive: true });
updateScrollEffects();

const revealElements = document.querySelectorAll(
    ".section-heading, .service-card, .project-card, .stat, .contact-grid, .technology-features article"
);

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
});

document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--mouse-y", `${event.clientY - bounds.top}px`);
    });
});

const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.hidden = true;
    document.body.style.overflow = "";
    lastFocusedProject?.focus();
};

if (projectModal) {
    document.querySelectorAll(".project-card").forEach((project) => {
        const openProjectModal = () => {
            projectModalImage.src = project.dataset.image;
            projectModalImage.alt = project.dataset.title;
            projectModalCategory.textContent = project.dataset.category;
            projectModalTitle.textContent = project.dataset.title;
            projectModalDescription.textContent = project.dataset.description;
            const serviceLinks = {
                Technology: "/teknologi",
                Education: "/edukasi",
                Creative: "/kreatif",
            };
            projectModalLink.href = serviceLinks[project.dataset.category] || "#layanan";
            lastFocusedProject = project;
            projectModal.hidden = false;
            document.body.style.overflow = "hidden";
            projectModal.querySelector(".project-modal-close").focus();
        };

        project.addEventListener("click", openProjectModal);
        project.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProjectModal();
            }
        });
    });

    projectModal.querySelectorAll("[data-close-project]").forEach((element) => {
        element.addEventListener("click", closeProjectModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !projectModal.hidden) closeProjectModal();
    });
}

const heroCard = document.querySelector(".hero-card");
if (heroCard && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroCard.addEventListener("pointermove", (event) => {
        const bounds = heroCard.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        heroCard.style.setProperty("--tilt-x", `${y * -8}deg`);
        heroCard.style.setProperty("--tilt-y", `${x * 8}deg`);
    });
    heroCard.addEventListener("pointerleave", () => {
        heroCard.style.setProperty("--tilt-x", "0deg");
        heroCard.style.setProperty("--tilt-y", "0deg");
    });
}

const stats = document.querySelectorAll(".stat strong");
const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const stat = entry.target;
            const original = stat.textContent.trim();
            const number = Number.parseInt(original, 10);
            const suffix = original.replace(String(number), "");
            const duration = 900;
            const start = performance.now();

            const updateCounter = (timestamp) => {
                const progress = Math.min((timestamp - start) / duration, 1);
                stat.textContent = `${Math.floor(progress * number)}${suffix}`;
                if (progress < 1) requestAnimationFrame(updateCounter);
            };

            requestAnimationFrame(updateCounter);
            statsObserver.unobserve(stat);
        });
    },
    { threshold: 0.7 }
);

stats.forEach((stat) => statsObserver.observe(stat));

if (contactForm && formMessage) contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formMessage.textContent = "Mengirim pesan...";

    try {
        const response = await fetch(contactForm.action, {
            method: "POST",
            body: new FormData(contactForm),
        });
        const data = await response.json();
        formMessage.textContent = data.message;
        if (response.ok && data.success) contactForm.reset();
    } catch (error) {
        formMessage.textContent = "Terjadi kesalahan. Silakan coba lagi.";
        console.error(error);
    }
});

if (technologyOrderForm && technologyOrderMessage) technologyOrderForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    technologyOrderMessage.textContent = "Mengirim permintaan...";

    try {
        const response = await fetch(technologyOrderForm.action, {
            method: "POST",
            body: new FormData(technologyOrderForm),
        });
        const data = await response.json();
        technologyOrderMessage.textContent = data.message;
        if (response.ok && data.success) technologyOrderForm.reset();
    } catch (error) {
        technologyOrderMessage.textContent = "Terjadi kesalahan. Silakan coba lagi.";
        console.error(error);
    }
});

if (educationOrderForm && educationOrderMessage) educationOrderForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    educationOrderMessage.textContent = "Mengirim permintaan...";

    try {
        const response = await fetch(educationOrderForm.action, {
            method: "POST",
            body: new FormData(educationOrderForm),
        });
        const data = await response.json();
        educationOrderMessage.textContent = data.message;
        if (response.ok && data.success) educationOrderForm.reset();
    } catch (error) {
        educationOrderMessage.textContent = "Terjadi kesalahan. Silakan coba lagi.";
        console.error(error);
    }
});

if (creativeOrderForm && creativeOrderMessage) creativeOrderForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    creativeOrderMessage.textContent = "Mengirim permintaan...";

    try {
        const response = await fetch(creativeOrderForm.action, {
            method: "POST",
            body: new FormData(creativeOrderForm),
        });
        const data = await response.json();
        creativeOrderMessage.textContent = data.message;
        if (response.ok && data.success) creativeOrderForm.reset();
    } catch (error) {
        creativeOrderMessage.textContent = "Terjadi kesalahan. Silakan coba lagi.";
        console.error(error);
    }
});

console.log("Yusdai Group website aktif");
