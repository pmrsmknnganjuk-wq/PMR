// ===== PMR Authentication Manager =====
const AuthManager = (function() {
    const USERS_KEY = 'pmr_smkn1nganjuk_users';
    const SESSION_KEY = 'pmr_smkn1nganjuk_session';
    
    // Simple hash function (bukan untuk keamanan tinggi, hanya obfuscation)
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'h_' + Math.abs(hash).toString(36);
    }
    
    // Inisialisasi user default jika belum ada
    function initDefaultUsers() {
        const users = localStorage.getItem(USERS_KEY);
        if (!users) {
            const defaultUsers = [
                {
                    id: 1,
                    username: 'admin',
                    password: simpleHash('pmrsmkn1'),
                    fullname: 'Administrator PMR',
                    role: 'admin',
                    status: 'active',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
        }
    }
    
    // Get semua users
    function getUsers() {
        initDefaultUsers();
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    }
    
    // Save users
    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    // Login
    function login(username, password, remember = true) {
        const users = getUsers();
        const hashedPassword = simpleHash(password);
        
        const user = users.find(u => 
            u.username.toLowerCase() === username.toLowerCase() && 
            u.password === hashedPassword &&
            u.status === 'active'
        );
        
        if (!user) {
            return { success: false, message: 'Username atau password salah' };
        }
        
        const session = {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            role: user.role,
            loginAt: new Date().toISOString()
        };
        
        if (remember) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } else {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }
        
        return { success: true, user: session };
    }
    
    // Logout
    function logout() {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
    }
    
    // Get current session
    function getCurrentUser() {
        const session = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    }
    
    // Check if logged in
    function isLoggedIn() {
        return getCurrentUser() !== null;
    }
    
    // Check if admin
    function isAdmin() {
        const user = getCurrentUser();
        return user && user.role === 'admin';
    }
    
    // Tambah anggota (hanya admin)
    function addMember(username, password, fullname, role = 'member') {
        if (!isAdmin()) {
            return { success: false, message: 'Akses ditolak. Hanya admin yang dapat menambah anggota.' };
        }
        
        const users = getUsers();
        
        // Cek username sudah ada
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            return { success: false, message: 'Username sudah digunakan' };
        }
        
        // Validasi
        if (username.length < 3) {
            return { success: false, message: 'Username minimal 3 karakter' };
        }
        if (password.length < 6) {
            return { success: false, message: 'Password minimal 6 karakter' };
        }
        if (!fullname.trim()) {
            return { success: false, message: 'Nama lengkap wajib diisi' };
        }
        
        const newUser = {
            id: Date.now(),
            username: username.toLowerCase().trim(),
            password: simpleHash(password),
            fullname: fullname.trim(),
            role: role,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        saveUsers(users);
        
        return { success: true, message: 'Anggota berhasil ditambahkan' };
    }
    
    // Hapus anggota (hanya admin, tidak bisa hapus diri sendiri)
    function deleteMember(id) {
        if (!isAdmin()) {
            return { success: false, message: 'Akses ditolak' };
        }
        
        const currentUser = getCurrentUser();
        if (currentUser.id === id) {
            return { success: false, message: 'Tidak dapat menghapus akun sendiri' };
        }
        
        const users = getUsers().filter(u => u.id !== id);
        saveUsers(users);
        
        return { success: true, message: 'Anggota berhasil dihapus' };
    }
    
    // Toggle status anggota
    function toggleMemberStatus(id) {
        if (!isAdmin()) {
            return { success: false, message: 'Akses ditolak' };
        }
        
        const users = getUsers();
        const user = users.find(u => u.id === id);
        
        if (!user) return { success: false, message: 'User tidak ditemukan' };
        
        const currentUser = getCurrentUser();
        if (currentUser.id === id) {
            return { success: false, message: 'Tidak dapat menonaktifkan akun sendiri' };
        }
        
        user.status = user.status === 'active' ? 'inactive' : 'active';
        saveUsers(users);
        
        return { success: true, message: `Status berhasil diubah menjadi ${user.status}` };
    }
    
    // Reset password (hanya admin)
    function resetPassword(id, newPassword) {
        if (!isAdmin()) {
            return { success: false, message: 'Akses ditolak' };
        }
        
        if (newPassword.length < 6) {
            return { success: false, message: 'Password minimal 6 karakter' };
        }
        
        const users = getUsers();
        const user = users.find(u => u.id === id);
        
        if (!user) return { success: false, message: 'User tidak ditemukan' };
        
        user.password = simpleHash(newPassword);
        saveUsers(users);
        
        return { success: true, message: 'Password berhasil direset' };
    }
    
    return {
        login,
        logout,
        getCurrentUser,
        isLoggedIn,
        isAdmin,
        getUsers,
        addMember,
        deleteMember,
        toggleMemberStatus,
        resetPassword,
        initDefaultUsers
    };
})();

// Inisialisasi saat script dimuat
AuthManager.initDefaultUsers();