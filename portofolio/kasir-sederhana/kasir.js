// --- Data Dummy ---
let dummyProducts = [
    { id: 1, nama: "Kopi Arabika", kategori: "Minuman", harga: 15000, stok: 50 },
    { id: 2, nama: "Roti Coklat", kategori: "Makanan", harga: 8000, stok: 120 },
    { id: 3, nama: "Air Mineral 600ml", kategori: "Minuman", harga: 3000, stok: 200 },
    { id: 4, nama: "Kentang Goreng Porsi Besar", kategori: "Makanan", harga: 20000, stok: 75 },
    { id: 5, nama: "Teh Tarik", kategori: "Minuman", harga: 10000, stok: 0 },
    { id: 6, nama: "Donat Coklat", kategori: "Makanan", harga: 7000, stok: 4 },
    { id: 7, nama: "Es Teh Manis", kategori: "Minuman", harga: 5000, stok: 150 },
    { id: 8, nama: "Burger Sapi Spesial", kategori: "Makanan", harga: 35000, stok: 30 },
];

let dummyTransactions = [
    { id: 101, tanggal: "2024-07-25 10:30:00", total: 41000, items: [{nama: "Kopi Arabika", jumlah: 1, subtotal: 15000}, {nama: "Roti Coklat", jumlah: 1, subtotal: 8000}, {nama: "Air Mineral 600ml", jumlah: 4, subtotal: 12000}, {nama: "Teh Tarik", jumlah: 1, subtotal: 6000}] },
    { id: 102, tanggal: "2024-07-26 14:15:00", total: 70000, items: [{nama: "Burger Sapi Spesial", jumlah: 2, subtotal: 70000}] },
    { id: 103, tanggal: "2024-07-27 09:05:00", total: 25000, items: [{nama: "Kentang Goreng Porsi Besar", jumlah: 1, subtotal: 20000}, {nama: "Air Mineral 600ml", jumlah: 1, subtotal: 3000}] },
];

let currentProducts = [...dummyProducts]; 
let cart = []; 
let user = null; 

const TAX_RATE = 0.11; // 11%

// --- DOM Elements ---
const sidebarItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('login-message');
const logoutButton = document.getElementById('logout-button');
const adminNameDisplay = document.querySelectorAll('.user-profile, #admin-name-sidebar');

const current_date_el = document.getElementById('current-date');
const total_revenue_el = document.getElementById('total-revenue');
const total_transactions_el = document.getElementById('total-transactions');
const total_items_sold_el = document.getElementById('total-items-sold');
const low_stock_count_el = document.getElementById('low-stock-count');
const best_seller_table_body = document.getElementById('best-seller-table');
const low_stock_list_el = document.getElementById('low-stock-list');

const jumlah_transaksi_stat_el = document.getElementById('jumlah-transaksi');
const total_pendapatan_stat_el = document.getElementById('total-pendapatan');
const produk_terlaris_stat_el = document.getElementById('produk-terlaris');
const stok_menipis_list_stat_el = document.getElementById('stok-menipis-list');

const productForm = document.getElementById('product-form');
const productIdInput = document.getElementById('product-id');
const productNameInput = document.getElementById('nama');
const productCategoryInput = document.getElementById('kategori');
const productPriceInput = document.getElementById('harga');
const productStockInput = document.getElementById('stok');
const productFormTitle = document.getElementById('form-title');
const btnCancel = document.getElementById('btn-cancel');
const productTableBody = document.getElementById('product-table-body');
const searchInputProduk = document.getElementById('search-input-produk');

const searchProdukInput = document.getElementById('searchProduk');
const produkGrid = document.getElementById('produkGrid');
const filterKategoriSelect = document.getElementById('filterKategori');
const kategoriGrid = document.getElementById('kategoriGrid');

const cartCountEl = document.getElementById('cart-count');
const cartTableBody = document.getElementById('cart-table-body');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartDiscountInput = document.getElementById('cart-discount');
const cartDiscountAmountEl = document.getElementById('cart-discount-amount');
const cartTaxEl = document.getElementById('cart-tax');
const cartTotalEl = document.getElementById('cart-total');
const uangDiterimaInput = document.getElementById('uang-diterima');
const uangKembalianEl = document.getElementById('uang-kembalian');
const checkoutButton = document.getElementById('checkout-button');
const clearCartButton = document.getElementById('clear-cart-button');
const cartEmptyMessage = document.getElementById('cart-empty-message');
const cartTableWrapper = document.getElementById('cart-table-wrapper');
const cartSummary = document.getElementById('cart-summary');

const riwayatBody = document.getElementById('riwayatBody');
const refreshRiwayatButton = document.getElementById('refresh-riwayat');

const modalDetailTransaksi = document.getElementById('modal-detail-transaksi');
const modalTransaksiIdEl = document.getElementById('modal-transaksi-id');
const modalTanggalEl = document.getElementById('modal-tanggal');
const modalTotalEl = document.getElementById('modal-total');
const modalDetailBody = document.getElementById('modal-detail-body');
const closeModalButton = modalDetailTransaksi ? modalDetailTransaksi.querySelector('.close-button') : null;


// --- Helper Functions ---

function formatRupiah(angka, prefix = 'Rp ') {
    if (angka === null || isNaN(angka)) return prefix + '0';
    const number_string = String(Math.abs(angka)).replace(/[^,\d]/g, '');
    const split = number_string.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    let hasil = prefix + rupiah;
    return angka < 0 ? '-' + hasil : hasil;
}

function updateCartCount() {
    if (!cartCountEl) return;
    const count = cart.reduce((sum, item) => sum + item.jumlah, 0);
    cartCountEl.textContent = count;
}

function calculateCartTotals() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.harga * item.jumlah;
    });

    const discountPercent = parseFloat(cartDiscountInput.value) || 0;
    const discountAmount = (subtotal * (discountPercent / 100));
    const tax = subtotal * TAX_RATE;
    const total = subtotal - discountAmount + tax;

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatRupiah(subtotal);
    if (cartDiscountAmountEl) cartDiscountAmountEl.textContent = `Rp ${discountAmount.toFixed(0)}`;
    if (cartTaxEl) cartTaxEl.textContent = formatRupiah(tax);
    if (cartTotalEl) cartTotalEl.textContent = formatRupiah(total);

    const uangDiterima = parseFloat(uangDiterimaInput.value) || 0;
    const kembalian = uangDiterima - total;
    if (uangKembalianEl) uangKembalianEl.textContent = formatRupiah(kembalian);

    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0 || total <= 0 || uangDiterima < total;
    }
}

function toggleCartUI() {
    if (!cartEmptyMessage) return;
    if (cart.length === 0) {
        cartEmptyMessage.style.display = 'block';
        if (cartTableWrapper) cartTableWrapper.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'none';
        if (checkoutButton) checkoutButton.disabled = true;
    } else {
        cartEmptyMessage.style.display = 'none';
        if (cartTableWrapper) cartTableWrapper.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'block';
    }
}

function renderCartTable() {
    if (!cartTableBody) return;
    cartTableBody.innerHTML = '';
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nama}</td>
            <td>${formatRupiah(item.harga)}</td>
            <td>
                <div class="cart-item-quantity">
                    <button type="button" class="btn-quantity" onclick="updateCartItem(${index}, -1)">-</button>
                    <span>${item.jumlah}</span>
                    <button type="button" class="btn-quantity" onclick="updateCartItem(${index}, 1)">+</button>
                </div>
            </td>
            <td>${formatRupiah(item.harga * item.jumlah)}</td>
            <td class="actions">
                <button type="button" class="btn btn-danger btn-small" onclick="removeFromCart(${index})">Hapus</button>
            </td>
        `;
        cartTableBody.appendChild(row);
    });
    updateCartCount();
    calculateCartTotals();
    toggleCartUI();
}

function updateCartItem(index, quantityChange) {
    const item = cart[index];
    item.jumlah += quantityChange;

    if (item.jumlah <= 0) {
        cart.splice(index, 1);
    } else {
        const product = currentProducts.find(p => p.id === item.id);
        if (product && item.jumlah > product.stok) {
            item.jumlah = product.stok;
        }
    }
    renderCartTable();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCartTable();
}

function addToCart(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return;

    if (product.stok <= 0) {
        alert(`Maaf, stok ${product.nama} habis.`);
        return;
    }

    const existingItemIndex = cart.findIndex(item => item.id === productId);

    if (existingItemIndex > -1) {
        const item = cart[existingItemIndex];
        if (item.jumlah < product.stok) {
            item.jumlah++;
        } else {
            alert(`Jumlah maksimum ${product.nama} yang bisa ditambahkan adalah ${product.stok}.`);
        }
    } else {
        cart.push({ ...product, jumlah: 1 });
    }
    renderCartTable();
}

// --- Authentication ---
function login(event) {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === 'owner' && password === 'Yudagagah05') {
        user = { name: 'Admin', role: 'owner' };
        loginMessage.style.display = 'none';
        loginForm.reset();
        showPage('dashboard');
        updateAdminName(user.name);
        initializeApp();
        
        document.querySelector('.nav-item.active')?.classList.remove('active');
        document.querySelector('.nav-item[data-target="dashboard"]')?.classList.add('active');
    } else {
        loginMessage.textContent = 'Username atau Password salah!';
        loginMessage.className = 'error';
        loginMessage.style.display = 'block';
    }
}

function logout() {
    user = null;
    cart = [];
    renderCartTable();
    updateAdminName("Admin");
    usernameInput.value = '';
    passwordInput.value = '';
    loginMessage.style.display = 'none';
    showPage('login');
    
    document.querySelector('.nav-item.active')?.classList.remove('active');
    document.querySelector('.nav-item[data-target="dashboard"]')?.classList.add('active');
}

function updateAdminName(name) {
    adminNameDisplay.forEach(el => el.textContent = name);
}

// --- Page Navigation ---
function showPage(pageId) {
    if (!user && pageId !== 'login') {
        alert("Silakan login terlebih dahulu.");
        pageId = 'login';
    }

    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`page-${pageId}`)?.classList.add('active');

    sidebarItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-target') === pageId) {
            item.classList.add('active');
        }
    });

    const renderFunction = window[`render${pageId.charAt(0).toUpperCase() + pageId.slice(1)}Page`];
    if (typeof renderFunction === 'function') {
        renderFunction();
    }

    if (pageId === 'login') {
        document.body.classList.add('login-view');
    } else {
        document.body.classList.remove('login-view');
    }
}

// --- Rendering Functions ---

function renderDashboardPage() {
    if (!current_date_el) return;
    current_date_el.textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const todayStr = new Date().toISOString().split('T')[0];
    const todayTransactions = dummyTransactions.filter(t => t.tanggal.startsWith(todayStr));
    const totalRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = todayTransactions.length;
    const totalItemsSold = todayTransactions.reduce((sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.jumlah, 0), 0);

    const lowStockItems = currentProducts.filter(p => p.stok < 5);

    const soldCounts = {};
    dummyTransactions.forEach(t => {
        t.items.forEach(item => {
            soldCounts[item.nama] = (soldCounts[item.nama] || 0) + item.jumlah;
        });
    });
    const sortedSellers = Object.entries(soldCounts).sort(([, a], [, b]) => b - a).slice(0, 5);

    total_revenue_el.textContent = formatRupiah(totalRevenue);
    total_transactions_el.textContent = totalTransactions;
    total_items_sold_el.textContent = totalItemsSold;
    low_stock_count_el.textContent = lowStockItems.length;

    best_seller_table_body.innerHTML = '';
    if (sortedSellers.length > 0) {
        sortedSellers.forEach(([nama, jumlah]) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${nama}</td><td>${jumlah} pcs</td>`;
            best_seller_table_body.appendChild(row);
        });
    } else {
        best_seller_table_body.innerHTML = '<tr><td colspan="2">Belum ada data</td></tr>';
    }

    low_stock_list_el.innerHTML = '';
    if (lowStockItems.length > 0) {
        lowStockItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.nama} (Stok: ${item.stok})`;
            low_stock_list_el.appendChild(li);
        });
    } else {
        low_stock_list_el.innerHTML = '<li>Tidak ada stok menipis</li>';
    }
}

function renderStatistikPage() {
    if (!jumlah_transaksi_stat_el) return;
    const totalRevenue = dummyTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = dummyTransactions.length;

    const soldCounts = {};
    dummyTransactions.forEach(t => {
        t.items.forEach(item => {
            soldCounts[item.nama] = (soldCounts[item.nama] || 0) + item.jumlah;
        });
    });
    const topSeller = Object.entries(soldCounts).length > 0
        ? Object.entries(soldCounts).reduce((prev, curr) => prev[1] > curr[1] ? prev : curr)[0]
        : 'Belum ada data';

    const lowStockItems = currentProducts.filter(p => p.stok < 5);

    jumlah_transaksi_stat_el.textContent = totalTransactions;
    total_pendapatan_stat_el.textContent = formatRupiah(totalRevenue);
    produk_terlaris_stat_el.textContent = topSeller;

    stok_menipis_list_stat_el.innerHTML = '';
    if (lowStockItems.length > 0) {
        lowStockItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.nama} (Sisa: ${item.stok})`;
            stok_menipis_list_stat_el.appendChild(li);
        });
    } else {
        stok_menipis_list_stat_el.innerHTML = '<li>Stok aman</li>';
    }
}

function renderProdukPage() {
    renderProductTable();
    populateCategoryFilter();
    resetProductForm();
}

function renderProductTable(products = currentProducts) {
    if (!productTableBody) return;
    productTableBody.innerHTML = '';
    if (products.length === 0) {
        productTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Produk tidak ditemukan.</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.nama}</td>
            <td>${product.kategori}</td>
            <td>${formatRupiah(product.harga)}</td>
            <td>${product.stok} ${product.stok < 5 ? '<span class="badge warning">Menipis!</span>' : ''}</td>
            <td class="actions">
                <button type="button" class="btn btn-primary btn-small" onclick="editProduct(${product.id})">Edit</button>
                <button type="button" class="btn btn-danger btn-small" onclick="deleteProduct(${product.id})">Hapus</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

function saveProduct(event) {
    event.preventDefault();
    const id = parseInt(productIdInput.value);
    const nama = productNameInput.value.trim();
    const kategori = productCategoryInput.value.trim();
    const harga = parseInt(productPriceInput.value);
    const stok = parseInt(productStockInput.value);

    if (!nama || !kategori || isNaN(harga) || harga < 0 || isNaN(stok) || stok < 0) {
        alert('Mohon lengkapi semua field dengan benar.');
        return;
    }

    if (id) {
        const productIndex = currentProducts.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            currentProducts[productIndex] = { id, nama, kategori, harga, stok };
            alert('Produk berhasil diperbarui!');
        }
    } else {
        const newId = currentProducts.length > 0 ? Math.max(...currentProducts.map(p => p.id)) + 1 : 1;
        currentProducts.push({ id: newId, nama, kategori, harga, stok });
        alert('Produk berhasil ditambahkan!');
    }

    dummyProducts = [...currentProducts];
    resetProductForm();
    renderProductTable();
    populateCategoryFilter();
}

function editProduct(id) {
    const product = currentProducts.find(p => p.id === id);
    if (!product) return;

    productIdInput.value = product.id;
    productNameInput.value = product.nama;
    productCategoryInput.value = product.kategori;
    productPriceInput.value = product.harga;
    productStockInput.value = product.stok;

    productFormTitle.textContent = 'Edit Produk';
    btnCancel.style.display = 'inline-block';
    productForm.scrollIntoView({ behavior: 'smooth' });
}

function deleteProduct(id) {
    if (!confirm('Anda yakin ingin menghapus produk ini?')) return;

    currentProducts = currentProducts.filter(p => p.id !== id);
    dummyProducts = [...currentProducts];

    resetProductForm();
    renderProductTable();
    populateCategoryFilter();
    alert('Produk berhasil dihapus!');
}

function resetProductForm() {
    productForm.reset();
    productIdInput.value = '';
    productFormTitle.textContent = 'Tambah Produk Baru';
    btnCancel.style.display = 'none';
}

function searchProducts() {
    const query = searchInputProduk.value.toLowerCase().trim();
    const filteredProducts = currentProducts.filter(p =>
        p.nama.toLowerCase().includes(query) ||
        p.kategori.toLowerCase().includes(query)
    );
    renderProductTable(filteredProducts);
}

function renderPencarianPage() {
    if (!produkGrid) return;
    produkGrid.innerHTML = '<p class="placeholder-text">Ketik minimal 2 karakter untuk mencari...</p>';
    searchProdukInput.value = '';
}

function searchProductsGlobal() {
    const query = searchProdukInput.value.toLowerCase().trim();
    if (query.length < 2) {
        produkGrid.innerHTML = '<p class="placeholder-text">Ketik minimal 2 karakter untuk mencari...</p>';
        return;
    }

    const results = currentProducts.filter(p =>
        p.nama.toLowerCase().includes(query) ||
        p.kategori.toLowerCase().includes(query)
    );

    renderProductGrid(results, produkGrid);
}

function populateCategoryFilter() {
    if (!filterKategoriSelect) return;
    const categories = [...new Set(currentProducts.map(p => p.kategori))].sort();
    filterKategoriSelect.innerHTML = '<option value="">Semua Kategori</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filterKategoriSelect.appendChild(option);
    });
    filterProductsByCategory();
}

function filterProductsByCategory() {
    if (!kategoriGrid) return;
    const selectedCategory = filterKategoriSelect.value;
    let filteredProducts = currentProducts;

    if (selectedCategory) {
        filteredProducts = currentProducts.filter(p => p.kategori === selectedCategory);
    }

    renderProductGrid(filteredProducts, kategoriGrid);
}

function renderProductGrid(products, gridElement) {
    if (!gridElement) return;
    gridElement.innerHTML = '';
    if (products.length === 0) {
        gridElement.innerHTML = '<p class="placeholder-text">Produk tidak ditemukan.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const isLowStock = product.stok < 5;
        card.innerHTML = `
            <h3>${product.nama}</h3>
            <p>${product.kategori}</p>
            <div class="price">${formatRupiah(product.harga)}</div>
            <div class="stock ${isLowStock ? 'low' : ''}">Stok: ${product.stok} ${isLowStock ? '(!)' : ''}</div>
            <button type="button" class="btn btn-primary add-to-cart-btn" onclick="addToCart(${product.id})" ${product.stok <= 0 ? 'disabled' : ''}>
                ${product.stok <= 0 ? 'Habis' : 'Tambah ke Keranjang'}
            </button>
        `;
        gridElement.appendChild(card);
    });
}

function renderRiwayatPage() {
    renderRiwayatTable();
}

function renderRiwayatTable() {
    if (!riwayatBody) return;
    riwayatBody.innerHTML = '';
    if (dummyTransactions.length === 0) {
        riwayatBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Belum ada riwayat transaksi.</td></tr>';
        return;
    }

    dummyTransactions.forEach(transaksi => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${transaksi.id}</td>
            <td>${transaksi.tanggal}</td>
            <td>${formatRupiah(transaksi.total)}</td>
            <td class="actions">
                <button type="button" class="btn btn-secondary btn-small" onclick="viewTransactionDetail(${transaksi.id})">Detail</button>
            </td>
        `;
        riwayatBody.appendChild(row);
    });
}

function viewTransactionDetail(id) {
    const transaksi = dummyTransactions.find(t => t.id === id);
    if (!transaksi) return;

    modalTransaksiIdEl.textContent = transaksi.id;
    modalTanggalEl.textContent = transaksi.tanggal;
    modalTotalEl.textContent = formatRupiah(transaksi.total);

    modalDetailBody.innerHTML = '';
    transaksi.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nama}</td>
            <td>${item.jumlah}</td>
            <td>${formatRupiah(item.subtotal)}</td>
        `;
        modalDetailBody.appendChild(row);
    });

    modalDetailTransaksi.style.display = 'block';
}

function processCheckout() {
    if (cart.length === 0) {
        alert("Keranjang belanja kosong!");
        return;
    }

    const now = new Date();
    const newTransaction = {
        id: dummyTransactions.length > 0 ? Math.max(...dummyTransactions.map(t => t.id)) + 1 : 101,
        tanggal: now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0],
        total: parseFloat(cartTotalEl.textContent.replace(/[^0-9]/g, '')),
        items: cart.map(item => ({
            nama: item.nama,
            jumlah: item.jumlah,
            subtotal: item.harga * item.jumlah
        }))
    };
    dummyTransactions.unshift(newTransaction);

    cart.forEach(cartItem => {
        const productIndex = currentProducts.findIndex(p => p.id === cartItem.id);
        if (productIndex !== -1) {
            currentProducts[productIndex].stok -= cartItem.jumlah;
            if (currentProducts[productIndex].stok < 0) currentProducts[productIndex].stok = 0;
        }
    });

    dummyProducts = [...currentProducts];
    alert(`Checkout berhasil! Total: ${formatRupiah(newTransaction.total)}`);

    cart = [];
    if (uangDiterimaInput) uangDiterimaInput.value = '';
    if (cartDiscountInput) cartDiscountInput.value = '';
    
    renderCartTable();
    renderDashboardPage();
    renderStatistikPage();
    renderProductTable();
    showPage('riwayat');
}

function initializeApp() {
    renderDashboardPage();
    renderStatistikPage();
    renderProductTable();
    populateCategoryFilter();
    renderProductGrid(currentProducts, produkGrid);
    renderProductGrid(currentProducts, kategoriGrid);
    renderCartTable();
    renderRiwayatTable();
    updateCartCount();
}

// --- Event Listeners Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    if (loginForm) loginForm.addEventListener('submit', login);

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            if (confirm('Anda yakin ingin keluar?')) {
                logout();
            }
        });
    }

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            if (target) {
                showPage(target);
            }
        });
    });

    if (productForm) productForm.addEventListener('submit', saveProduct);
    if (btnCancel) btnCancel.addEventListener('click', resetProductForm);
    if (searchInputProduk) searchInputProduk.addEventListener('input', searchProducts);
    if (searchProdukInput) searchProdukInput.addEventListener('input', searchProductsGlobal);
    if (filterKategoriSelect) filterKategoriSelect.addEventListener('change', filterProductsByCategory);

    if (cartDiscountInput) cartDiscountInput.addEventListener('input', calculateCartTotals);
    if (uangDiterimaInput) uangDiterimaInput.addEventListener('input', calculateCartTotals);
    if (checkoutButton) checkoutButton.addEventListener('click', processCheckout);
    
    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            if (confirm('Anda yakin ingin mengosongkan keranjang?')) {
                cart = [];
                renderCartTable();
            }
        });
    }

    if (refreshRiwayatButton) refreshRiwayatButton.addEventListener('click', renderRiwayatTable);

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            modalDetailTransaksi.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modalDetailTransaksi) {
            modalDetailTransaksi.style.display = 'none';
        }
    });

    showPage('login');
});