# Website PMR SMKN 1 Nganjuk

Website resmi Palang Merah Remaja (PMR) SMKN 1 Nganjuk dengan tema profesional dan elegan.

## 🎨 Fitur Utama

- **Beranda**: Hero section dengan informasi utama PMR
- **Tentang**: Sejarah, Tri Bakti PMR, Visi & Misi, Struktur Organisasi
- **Kegiatan**: Program kerja dan jadwal latihan rutin
- **Galeri**: Dokumentasi kegiatan
- **Keuangan**: Sistem pencatatan keuangan lengkap
- **Kontak**: Informasi kontak PMR
- **Login**: user: admin pw: pmrsmkn1

## 💰 Fitur Pencatatan Keuangan

- ✅ Input pemasukan & pengeluaran
- ✅ 8 kategori transaksi (Iuran, Dana Sekolah, Donasi, dll)
- ✅ Ringkasan otomatis (Total Masuk, Keluar, Saldo)
- ✅ Filter berdasarkan bulan
- ✅ Export ke CSV (Excel)
- ✅ Data tersimpan otomatis di browser (localStorage)
- ✅ Hapus transaksi individual
- ✅ Reset semua data

## 📂 Struktur File

## 🚀 Deployment

### Option 1: Deploy ke Vercel (Recommended) ⭐

#### Cara Cepat (Tanpa GitHub):
1. Download semua file website ini
2. Buka [vercel.com](https://vercel.com)
3. Login dengan GitHub/GitLab/Email
4. Klik **"Add New Project"**
5. Pilih **"Import Third-Party Git Repository"** atau drag & drop folder
6. Framework Preset: **"Other"**
7. Klik **"Deploy"**
8. Tunggu 1-2 menit → Website live!

#### Cara Otomatis (Dengan GitHub):
```bash
# 1. Buat repository GitHub baru
# Buka github.com → New repository → nama: pmr-smkn1-nganjuk

# 2. Initialize git di folder project
cd pmr-smkn1-nganjuk
git init

# 3. Add semua file
git add .
git commit -m "Initial commit: PMR SMKN 1 Nganjuk website"

# 4. Push ke GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pmr-smkn1-nganjuk.git
git push -u origin main

# 5. Deploy di Vercel
# - Buka vercel.com
# - Import Git Repository → pilih "pmr-smkn1-nganjuk"
# - Framework Preset: "Other"
# - Klik "Deploy"
# - Selesai! Website live di: pmr-smkn1-nganjuk.vercel.app