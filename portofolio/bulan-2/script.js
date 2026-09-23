document.addEventListener('DOMContentLoaded', () => {
    const topButton = document.createElement('button');
    topButton.className = 'top-button';
    topButton.type = 'button';
    topButton.textContent = 'Ke atas';
    topButton.setAttribute('aria-label', 'Kembali ke bagian atas halaman');

    const toolbar = document.createElement('div');
    toolbar.className = 'page-tools';
    toolbar.innerHTML = `
        <label class="search-label" for="cariJudul">Cari bab</label>
        <input id="cariJudul" type="search" placeholder="Cari judul...">
        <button class="search-button" type="button">Cari</button>
        <button class="theme-button" type="button">Mode gelap</button>
    `;
    document.body.append(toolbar, topButton);

    const searchInput = toolbar.querySelector('#cariJudul');
    const headings = [...document.querySelectorAll('h1, h2')];
    const searchButton = toolbar.querySelector('.search-button');
    const themeButton = toolbar.querySelector('.theme-button');

    const search = () => {
        const keyword = searchInput.value.trim().toLowerCase();
        headings.forEach((heading) => heading.classList.remove('search-match'));
        if (!keyword) return;

        const match = headings.find((heading) => heading.textContent.toLowerCase().includes(keyword));
        if (match) {
            match.classList.add('search-match');
            match.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            searchInput.setCustomValidity('Judul bab tidak ditemukan.');
            searchInput.reportValidity();
            searchInput.setCustomValidity('');
        }
    };

    searchButton.addEventListener('click', search);
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') search();
    });

    themeButton.addEventListener('click', () => {
        const dark = document.body.classList.toggle('dark-mode');
        themeButton.textContent = dark ? 'Mode terang' : 'Mode gelap';
    });

    document.querySelectorAll('img').forEach((image) => {
        image.title = 'Klik untuk memperbesar';
        image.addEventListener('click', () => image.classList.toggle('is-zoomed'));
        image.addEventListener('error', () => {
            image.classList.add('image-missing');
            image.alt = `Gambar tidak tersedia: ${image.alt}`;
        }, { once: true });
    });

    const updateTopButton = () => {
        topButton.classList.toggle('is-visible', window.scrollY > 500);
    };
    window.addEventListener('scroll', updateTopButton, { passive: true });
    topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    updateTopButton();

    window.addEventListener('scroll', () => {
        const current = headings.filter((heading) => heading.offsetTop <= window.scrollY + 120).at(-1);
        if (current) document.title = `${current.textContent.trim()} | Ensiklopedia Indonesia`;
    }, { passive: true });

    const stats = document.createElement('div');
    stats.className = 'load-notice';
    stats.textContent = `${document.querySelectorAll('h1').length} bab | ${document.querySelectorAll('h2').length} subbab | ${document.querySelectorAll('img').length} gambar | ${document.querySelectorAll('iframe').length} video`;
    document.body.appendChild(stats);
    window.setTimeout(() => stats.remove(), 4500);
});
