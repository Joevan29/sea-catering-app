# SEA Catering - Aplikasi Web Full-Stack

Aplikasi web full-stack untuk SEA Catering, sebuah layanan katering makanan sehat yang sedang berkembang pesat. Aplikasi ini dirancang untuk memodernisasi proses bisnis, mulai dari pemesanan oleh pelanggan hingga manajemen dan analisis data oleh admin, sesuai dengan *technical challenge* yang diberikan.

-----

## 📸 Screenshot

*Tampilan Website*

*<img src="https://i.ibb.co/Myp7z0Mk/Screenshot-2025-06-26-181503.png" alt="Screenshot-2025-06-26-181503" border="0">*

-----

## ✨ Fitur Utama

Aplikasi ini memiliki tiga tingkat akses dengan fitur yang berbeda untuk setiap peran.

#### **Fitur Publik (Untuk Semua Pengunjung):**

  - [x] **Homepage:** Halaman utama yang menarik dengan informasi tentang layanan.
  - [x] **Lihat Paket Menu:** Menampilkan semua paket makanan yang tersedia dengan detail dan gambar.
  - [x] **Halaman Kontak:** Informasi kontak perusahaan.
  - [x] **Form Testimoni:** Pengunjung yang sudah login dapat memberikan review dan rating.
  - [x] **Testimoni Dinamis:** Menampilkan daftar testimoni yang diambil langsung dari database.

#### **Fitur Pengguna Terdaftar (User):**

  - [x] **Autentikasi Aman:** Sistem Registrasi dan Login yang aman.
  - [x] **Formulir Langganan:** Form multi-langkah yang intuitif untuk membuat pesanan langganan baru.
  - [x] **Kalkulasi Harga Real-time:** Total harga langganan akan ter-update secara otomatis saat pengguna memilih paket.
  - [x] **User Dashboard:** Halaman pribadi untuk melihat ringkasan langganan yang sedang aktif.

#### **Fitur Administrator (Admin):**

  - [x] **Layout Terisolasi:** Lingkungan admin yang sepenuhnya terpisah dari tampilan publik untuk keamanan dan fokus.
  - [x] **Dashboard Analitik:** Menampilkan Key Performance Indicators (KPIs) utama seperti Total Revenue, Langganan Baru, dan User Aktif yang diambil dari database.
  - [x] **Visualisasi Data:** Grafik tren pendapatan untuk memantau pertumbuhan bisnis.
  - [x] **Manajemen Langganan:** Menampilkan tabel berisi **semua** data langganan dari semua pengguna.
  - **[x]** **Manajemen Pengguna:** Menampilkan tabel berisi **semua** pengguna terdaftar dan memiliki fungsionalitas untuk mengubah role atau menghapus user.

-----

## 🏗️ Arsitektur Proyek

Proyek ini dibangun dengan arsitektur **monorepo-like**, memisahkan dengan jelas antara logika frontend dan backend.

  * **`/client`**: Berisi semua kode frontend yang dibangun menggunakan **React (Vite)**. Bertanggung jawab untuk semua hal yang dilihat dan diinteraksikan oleh pengguna.
  * **`/server`**: Berisi semua kode backend yang dibangun menggunakan **Node.js & Express.js**. Bertanggung jawab untuk logika bisnis, API, dan komunikasi dengan database.

-----

## 🛠️ Teknologi yang Digunakan

**Frontend:**

  * React.js (with Vite)
  * React Router DOM (untuk routing)
  * Axios (untuk pemanggilan API)
  * React Hook Form (untuk manajemen form yang efisien)
  * React Toastify (untuk notifikasi)
  * Recharts (untuk visualisasi data/grafik)
  * React Icons

**Backend:**

  * Node.js
  * Express.js
  * PostgreSQL (dengan `node-postgres` a.k.a `pg`)
  * Bcrypt.js (untuk hashing password)
  * JSON Web Token (JWT) (untuk autentikasi)
  * CORS
  * Dotenv

-----

## 🚀 Instalasi & Menjalankan Proyek

Berikut adalah langkah-langkah untuk menjalankan proyek ini di lingkungan lokal.

### **Prasyarat**

  * Node.js (v18 atau lebih baru)
  * NPM
  * PostgreSQL

### **1. Clone Repository**

```bash
git clone https://github.com/Joevan29/sea-catering-app.git
cd sea-catering-app
```

### **2. Setup Backend**

```bash
# Masuk ke folder server
cd server

# Install semua dependensi
npm install

# Buat file .env (lihat di bawah)
```

### **3. Setup Frontend**

```bash
# Dari folder server, kembali ke root lalu masuk ke client
cd ../client

# Install semua dependensi
npm install
```

### **4. Setup Database**

1.  Buka tool database Anda (DBeaver, pgAdmin, dll).
2.  Buat sebuah database baru dengan nama `sea_catering`.
3.  Jalankan seluruh skrip SQL yang ada di file `server/database.sql` untuk membuat tabel `users` `testimonials` dan `subscriptions`.

### **5. Setup Environment Variables (`.env`)**

Di dalam folder **`/server`**, buat sebuah file baru bernama `.env` dan isi dengan konfigurasi database dan kunci JWT Anda.

```env
# Ganti dengan kredensial PostgreSQL Anda
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=sea_catering
DB_PASSWORD=password_postgres_anda
DB_PORT=5432

# Ganti dengan teks rahasia acak yang panjang dan aman
JWT_SECRET=inikuncirahasiajwt_gantidenganapyangaman
```

### **6. Menjalankan Aplikasi**

Anda perlu menjalankan **dua terminal** secara bersamaan.

**Di Terminal 1 (untuk Backend):**

```bash
cd server
npm start
```

Server akan berjalan di `http://localhost:5000`.

**Di Terminal 2 (untuk Frontend):**

```bash
cd client
npm run dev
```

Aplikasi akan bisa diakses di `http://localhost:5173` (atau port lain yang ditampilkan di terminal).

-----

## 👮 Cara Membuat Akun Admin

Ada dua cara untuk memiliki akun dengan role `admin` untuk keperluan testing.

**Cara 1: Akun Default**
Saat Anda menjalankan skrip `database.sql`, satu akun admin sudah otomatis dibuat:

  * **Email:** `admin@sea.com`
  * **Password:** `password123`

**Cara 2: Mengubah Role Secara Manual**

1.  Daftarkan akun baru melalui form registrasi di website.
2.  Buka tool database Anda dan jalankan perintah SQL berikut:

<!-- end list -->

```sql
UPDATE users SET role = 'admin' WHERE email = 'email_yang_baru_didaftarkan@example.com';
```
