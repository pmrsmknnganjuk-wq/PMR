// ===== PMR Keuangan Manager =====
const KeuanganManager = (function() {
    const STORAGE_KEY = 'pmr_smkn1nganjuk_keuangan';
    
    // Load data dari localStorage
    function getData() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }
    
    // Save data ke localStorage
    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    
    // Format Rupiah
    function formatRupiah(angka) {
        return 'Rp ' + angka.toLocaleString('id-ID');
    }
    
    // Format tanggal
    function formatTanggal(dateStr) {
        const date = new Date(dateStr);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    }
    
    // Tambah transaksi
    function addTransaction(transaction) {
        const data = getData();
        transaction.id = Date.now();
        transaction.createdAt = new Date().toISOString();
        data.push(transaction);
        saveData(data);
        return transaction;
    }
    
    // Hapus transaksi
    function deleteTransaction(id) {
        const data = getData().filter(t => t.id !== id);
        saveData(data);
    }
    
    // Hitung summary
    function getSummary(filterBulan = 'all') {
        let data = getData();
        
        if (filterBulan !== 'all') {
            const bulan = parseInt(filterBulan);
            data = data.filter(t => new Date(t.tanggal).getMonth() === bulan);
        }
        
        const income = data.filter(t => t.jenis === 'masuk')
            .reduce((sum, t) => sum + parseInt(t.jumlah), 0);
        const expense = data.filter(t => t.jenis === 'keluar')
            .reduce((sum, t) => sum + parseInt(t.jumlah), 0);
        
        return {
            income,
            expense,
            balance: income - expense,
            count: data.length
        };
    }
    
    // Get all transactions (sorted by date desc)
    function getTransactions(filterBulan = 'all') {
        let data = getData();
        
        if (filterBulan !== 'all') {
            const bulan = parseInt(filterBulan);
            data = data.filter(t => new Date(t.tanggal).getMonth() === bulan);
        }
        
        return data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    }
    
    // Reset semua data
    function resetAll() {
        if (confirm('Apakah Anda yakin ingin menghapus SEMUA data transaksi? Tindakan ini tidak dapat dibatalkan.')) {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        }
        return false;
    }
    
    // Export ke CSV
    function exportCSV() {
        const data = getData();
        if (data.length === 0) {
            alert('Belum ada data transaksi untuk diexport.');
            return;
        }
        
        const header = ['No', 'Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Jumlah'];
        const rows = data.map((t, i) => [
            i + 1,
            t.tanggal,
            t.jenis === 'masuk' ? 'Pemasukan' : 'Pengeluaran',
            t.kategori,
            `"${t.keterangan}"`,
            t.jumlah
        ]);
        
        const csvContent = [header, ...rows]
            .map(row => row.join(','))
            .join('\n');
        
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `keuangan_pmr_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    return {
        getData,
        addTransaction,
        deleteTransaction,
        getSummary,
        getTransactions,
        resetAll,
        exportCSV,
        formatRupiah,
        formatTanggal
    };
})();