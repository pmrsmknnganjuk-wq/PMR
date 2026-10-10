// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    const sections = document.querySelectorAll('section[id], header[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== AUTH SYSTEM =====
const authModal = document.getElementById('authModal');
const authModalClose = document.getElementById('authModalClose');
const authModalBackdrop = document.getElementById('authModalBackdrop');
const loginForm = document.getElementById('loginForm');
const authError = document.getElementById('authError');
const authErrorMsg = document.getElementById('authErrorMsg');
const passwordToggle = document.getElementById('passwordToggle');
const navAuth = document.getElementById('navAuth');
const authGate = document.getElementById('authGate');
const keuanganContent = document.getElementById('keuanganContent');
const openLoginBtn = document.getElementById('openLoginBtn');
const keuanganLink = document.querySelector('.nav-locked');
const lockIcon = document.getElementById('lockIcon');
const welcomeUser = document.getElementById('welcomeUser');
const adminPanel = document.getElementById('adminPanel');

// Buka modal login
function openLoginModal() {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('loginUsername').focus(), 100);
}

// Tutup modal login
function closeLoginModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
    loginForm.reset();
    authError.style.display = 'none';
}

openLoginBtn.addEventListener('click', openLoginModal);
authModalClose.addEventListener('click', closeLoginModal);
authModalBackdrop.addEventListener('click', closeLoginModal);

// Klik link keuangan → buka login jika belum login
keuanganLink.addEventListener('click', (e) => {
    if (!AuthManager.isLoggedIn()) {
        e.preventDefault();
        openLoginModal();
    }
});

// ESC untuk tutup modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('active')) {
        closeLoginModal();
    }
});

// Toggle password visibility
passwordToggle.addEventListener('click', () => {
    const pwd = document.getElementById('loginPassword');
    const icon = passwordToggle.querySelector('i');
    if (pwd.type === 'password') {
        pwd.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        pwd.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
});

// Submit login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;
    
    const result = AuthManager.login(username, password, remember);
    
    if (result.success) {
        authError.style.display = 'none';
        closeLoginModal();
        updateUIAfterLogin(result.user);
        
        // Scroll ke section keuangan
        setTimeout(() => {
            document.getElementById('keuangan').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    } else {
        authErrorMsg.textContent = result.message;
        authError.style.display = 'flex';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginPassword').focus();
    }
});

// Update UI setelah login
function updateUIAfterLogin(user) {
    // Tampilkan konten keuangan
    authGate.style.display = 'none';
    keuanganContent.style.display = 'block';
    
    // Update welcome message
    welcomeUser.textContent = user.fullname;
    
    // Update nav link keuangan
    keuanganLink.classList.add('unlocked');
    if (lockIcon) lockIcon.style.display = 'none';
    
    // Update nav auth button
    renderNavAuth(user);
    
    // Show admin panel jika admin
    if (user.role === 'admin') {
        adminPanel.style.display = 'block';
        renderMembersTable();
    } else {
        adminPanel.style.display = 'none';
    }
    
    // Render keuangan
    if (typeof renderFinance === 'function') renderFinance();
}

// Update UI setelah logout
function updateUIAfterLogout() {
    authGate.style.display = 'flex';
    keuanganContent.style.display = 'none';
    adminPanel.style.display = 'none';
    
    keuanganLink.classList.remove('unlocked');
    if (lockIcon) lockIcon.style.display = '';
    
    renderNavAuth(null);
}

// Render tombol login/logout di navbar
function renderNavAuth(user) {
    if (user) {
        navAuth.innerHTML = `
            <button class="nav-auth-btn logged-in" id="logoutBtn" title="Logout">
                <i class="fas fa-user-circle"></i>
                <span>${user.fullname.split(' ')[0]}</span>
                <i class="fas fa-sign-out-alt"></i>
            </button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    } else {
        navAuth.innerHTML = `
            <button class="nav-auth-btn" id="loginBtn" title="Login">
                <i class="fas fa-sign-in-alt"></i>
                <span>Login</span>
            </button>
        `;
        document.getElementById('loginBtn').addEventListener('click', openLoginModal);
    }
}

// Logout
function handleLogout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        AuthManager.logout();
        updateUIAfterLogout();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===== ADMIN PANEL =====
const adminTabs = document.querySelectorAll('.admin-tab');
const adminTabContents = document.querySelectorAll('.admin-tab-content');

adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        
        adminTabs.forEach(t => t.classList.remove('active'));
        adminTabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`tab-${target}`).classList.add('active');
    });
});

// Render tabel anggota
function renderMembersTable() {
    const tbody = document.getElementById('membersTableBody');
    const users = AuthManager.getUsers();
    const currentUser = AuthManager.getCurrentUser();
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr class="empty-state"><td colspan="6">Belum ada anggota terdaftar.</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map((u, i) => {
        const isSelf = u.id === currentUser.id;
        return `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${u.username}</strong>${isSelf ? ' <small style="color:var(--gold)">(Anda)</small>' : ''}</td>
                <td>${u.fullname}</td>
                <td><span class="role-badge ${u.role}">${u.role === 'admin' ? 'Admin' : 'Anggota'}</span></td>
                <td><span class="status-badge ${u.status}">${u.status === 'active' ? 'Aktif' : 'Nonaktif'}</span></td>
                <td>
                    ${!isSelf ? `
                        <button class="action-btn" onclick="toggleMemberStatus(${u.id})" title="${u.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}">
                            <i class="fas fa-${u.status === 'active' ? 'ban' : 'check'}"></i>
                        </button>
                        <button class="action-btn" onclick="resetPasswordPrompt(${u.id}, '${u.username}')" title="Reset Password">
                            <i class="fas fa-key"></i>
                        </button>
                        <button class="action-btn" onclick="deleteMemberConfirm(${u.id}, '${u.fullname}')" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : '<small style="color:var(--gray-500)">—</small>'}
                </td>
            </tr>
        `;
    }).join('');
}

// Global functions for admin actions
function toggleMemberStatus(id) {
    const result = AuthManager.toggleMemberStatus(id);
    alert(result.message);
    if (result.success) renderMembersTable();
}

function deleteMemberConfirm(id, name) {
    if (confirm(`Hapus anggota "${name}"?\n\nTindakan ini tidak dapat dibatalkan.`)) {
        const result = AuthManager.deleteMember(id);
        alert(result.message);
        if (result.success) renderMembersTable();
    }
}

function resetPasswordPrompt(id, username) {
    const newPwd = prompt(`Reset password untuk "${username}"\n\nMasukkan password baru (minimal 6 karakter):`);
    if (newPwd === null) return;
    
    const result = AuthManager.resetPassword(id, newPwd);
    alert(result.message);
}

// Form tambah anggota
document.getElementById('addMemberForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('newUsername').value.trim();
    const fullname = document.getElementById('newFullname').value.trim();
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;
    
    const result = AuthManager.addMember(username, password, fullname, role);
    
    if (result.success) {
        alert(`✅ ${result.message}\n\nUsername: ${username}\nRole: ${role}\n\nSilakan sampaikan credentials ini kepada anggota yang bersangkutan.`);
        e.target.reset();
        renderMembersTable();
        
        // Pindah ke tab kelola anggota
        document.querySelector('.admin-tab[data-tab="members"]').click();
    } else {
        alert(`❌ ${result.message}`);
    }
});

// ===== KEUANGAN =====
const financeForm = document.getElementById('financeForm');
const financeTableBody = document.getElementById('financeTableBody');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const totalBalanceEl = document.getElementById('totalBalance');
const filterBulan = document.getElementById('filterBulan');
const exportBtn = document.getElementById('exportBtn');
const resetBtn = document.getElementById('resetBtn');
const tanggalInput = document.getElementById('tanggal');

tanggalInput.valueAsDate = new Date();

function renderFinance() {
    const filter = filterBulan.value;
    const transactions = KeuanganManager.getTransactions(filter);
    const summary = KeuanganManager.getSummary(filter);
    
    totalIncomeEl.textContent = KeuanganManager.formatRupiah(summary.income);
    totalExpenseEl.textContent = KeuanganManager.formatRupiah(summary.expense);
    totalBalanceEl.textContent = KeuanganManager.formatRupiah(summary.balance);
    
    if (transactions.length === 0) {
        financeTableBody.innerHTML = `
            <tr class="empty-state">
                <td colspan="7">Belum ada transaksi${filter !== 'all' ? ' pada bulan ini' : ''}.</td>
            </tr>`;
        return;
    }
    
    financeTableBody.innerHTML = transactions.map((t, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${KeuanganManager.formatTanggal(t.tanggal)}</td>
            <td class="jenis-${t.jenis}">
                <i class="fas fa-${t.jenis === 'masuk' ? 'arrow-down' : 'arrow-up'}"></i>
                ${t.jenis === 'masuk' ? 'Masuk' : 'Keluar'}
            </td>
            <td>${t.kategori}</td>
            <td>${t.keterangan}</td>
            <td class="jenis-${t.jenis}">
                ${t.jenis === 'masuk' ? '+' : '-'} ${KeuanganManager.formatRupiah(parseInt(t.jumlah))}
            </td>
            <td>
                <button class="action-btn" onclick="deleteTransaction(${t.id})" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteTransaction(id) {
    if (confirm('Hapus transaksi ini?')) {
        KeuanganManager.deleteTransaction(id);
        renderFinance();
    }
}

financeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const transaction = {
        tanggal: tanggalInput.value,
        jenis: document.getElementById('jenis').value,
        kategori: document.getElementById('kategori').value,
        jumlah: document.getElementById('jumlah').value,
        keterangan: document.getElementById('keterangan').value.trim()
    };
    
    if (!transaction.keterangan) {
        alert('Mohon isi keterangan transaksi.');
        return;
    }
    
    KeuanganManager.addTransaction(transaction);
    financeForm.reset();
    tanggalInput.valueAsDate = new Date();
    renderFinance();
    
    const btn = financeForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Tersimpan!';
    btn.style.background = 'var(--success)';
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 1500);
});

filterBulan.addEventListener('change', renderFinance);
exportBtn.addEventListener('click', () => KeuanganManager.exportCSV());
resetBtn.addEventListener('click', () => {
    if (KeuanganManager.resetAll()) renderFinance();
});

// ===== INIT APP =====
function initApp() {
    const user = AuthManager.getCurrentUser();
    if (user) {
        updateUIAfterLogin(user);
    } else {
        updateUIAfterLogout();
    }
}

// Jalankan saat DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.kegiatan-card, .vm-card, .struktur-card, .kontak-card, .summary-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});