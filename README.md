# SDET UI Automation Test

## Framework
*   **Framework Automation**: Playwright (version ^1.61.1)
*   **Bahasa Pemrograman**: JavaScript (Node.js)

## Cara Menjalankan Test
Berikut adalah langkah-langkah untuk menginstal dependency dan menjalankan automation test:
1. Clone repository ini ke mesin lokal Anda.
2. Buka terminal pada root folder project dan jalankan perintah berikut untuk menginstal dependency:
   ```bash
   npm install
   ```
3. Instal browser yang dibutuhkan oleh Playwright dengan perintah:
   ```bash
   npx playwright install
   ```
4. Buat file `.env` di root folder dan konfigurasikan environment variables berikut (sesuaikan dengan kredensial OrangeHRM Anda):
   ```env
   BASE_URL=https://opensource-demo.orangehrmlive.com
   USERNAME=Admin
   PASSWORD=admin123
   ```
5. Jalankan UI automation test menggunakan perintah:
   ```bash
   npx playwright test
   ```
6. (Opsional) Untuk melihat hasil laporan HTML dari test, jalankan:
   ```bash
   npx playwright show-report
   ```

## Struktur Project
*   `tests/`: Direktori yang berisi file pengujian utama (`orangeHRM.spec.js`) serta file pengaturan autentikasi awal (`auth.setup.js`).
*   `pages/`: Implementasi pola *Page Object Model* (POM). Berisi class yang merepresentasikan interaksi dan lokator pada halaman web (`LoginPage.js`, `PimPage.js`).
*   `.auth/`: Direktori untuk menyimpan status sesi (session state) seperti file `user.json` setelah login, sehingga test lain tidak perlu melakukan login ulang berulang kali.
*   `playwright.config.js`: File konfigurasi utama untuk Playwright, mengatur hal seperti *timeout*, pengaturan *browser*, proyek setup, dan *test reporter*.
*   `.env`: Menyimpan environment variables secara aman dan tidak di-commit ke source control (di-ignore).

## Strategi Locator
Pendekatan locator yang digunakan adalah memprioritaskan locator bawaan Playwright yang meniru interaksi pengguna (User-facing locators):
*   `getByPlaceholder`: Digunakan untuk mencari elemen input text yang memiliki atribut placeholder, seperti `First Name`, `Middle Name`, dan `Last Name`. Strategi ini sangat mudah dibaca.
*   `getByRole`: Digunakan untuk elemen dengan peran aksesibilitas yang spesifik seperti tombol (`button`), contohnya: tombol 'Search' dan 'Yes, Delete'.
*   `getByText`: Digunakan untuk memverifikasi teks yang muncul secara dinamis di UI, seperti memverifikasi *toast notification* `'Successfully Saved'`.
*   **CSS Locator / `locator`**: Digunakan untuk elemen UI kompleks yang tidak memiliki atribut unik dan aksesibilitas, misalnya mengklik tombol trash pada baris spesifik (`button:has(i.bi-trash)`) atau menghitung baris tabel (`.oxd-table-card`).

## Handling Data dengan Nama Sama
Script menangani data duplikat dengan nama "Mardi" melalui pendekatan berikut di `PimPage.js`:
1. **Pencarian**: Script mencari karyawan menggunakan fungsi `searchEmployeeByName(employeeName)`.
2. **Penghitungan**: Script menghitung jumlah data yang muncul di tabel menggunakan fungsi `countEmployee()`.
3. **Penghapusan**: Terdapat perulangan `while` di dalam `deleteDuplicateEmployeeName()` yang akan terus dieksekusi selama jumlah baris tabel > 1.
4. **Strategi Pemilihan Indeks**: Di dalam perulangan, script secara konsisten memanggil `deleteEmployeeByIndex(1)` (menghapus indeks ke-1 / data kedua). Karena indeks 0 selalu dipertahankan, proses ini akan menghapus semua duplikat satu per satu dari bawah hingga hanya menyisakan tepat 1 data paling atas.

## Assertion
Assertion digunakan untuk memastikan skenario pengujian berjalan sesuai ekspektasi:
*   `await expect(page.locator('[type*="button"]:has-text("Add")')).toBeVisible()`: Memastikan bahwa halaman PIM telah dimuat dengan benar dan tombol Add Employee telah muncul di DOM.
*   `await expect(page.getByText('Successfully Saved')).toBeVisible()`: Memastikan bahwa data karyawan yang baru diinput berhasil disimpan ke dalam sistem dengan munculnya notifikasi sukses.
*   `await expect(page.locator('h6.oxd-text')).toHaveText('Dashboard')`: (Pada `auth.setup.js`) Memastikan bahwa proses autentikasi berhasil dengan memvalidasi teks header di halaman Dashboard.

## Penggunaan AI
Berikut adalah detail penggunaan asisten AI dalam pengembangan script ini:
*   **Prompt**: "Bantu saya buatkan fungsi Javascript untuk generate data string berdasarkan tanggal dengan maksimum 10 character."
*   **Konteks**: Kebutuhan untuk membuat Employee ID yang unik secara acak saat melakukan *Add Employee* di file `PimPage.js` agar data tidak konflik dengan ID karyawan yang sudah ada.
*   **Output AI**: AI memberikan beberapa pendekatan untuk membuat *random string* angka, termasuk penggunaan `Date.now()` dan `Math.random()`.
*   **Bagian yang digunakan**: Menggunakan fungsi bawaan Javascript yaitu kombinasi `Date.now()` dan `Math.random()`, diubah menjadi string, lalu dipotong maksimal 10 karakter menggunakan `.slice(-10)`. Eksekusi kodenya: `Math.floor((Date.now() - Math.random() * 1000000)).toString().slice(-10)`.
*   **Bagian yang diperbaiki**: Menggabungkan dan menyesuaikan perhitungan matematika bawaan AI agar selalu menghasilkan string angka (tanpa desimal) yang konsisten 10 karakter untuk ditaruh di field Employee ID.

## Catatan Tambahan
*   **Kendala**: Aplikasi terkadang membutuhkan waktu *rendering* ketika melakukan pencarian data. Hal ini diatasi dengan memberikan perintah tunggu eksplisit: `await this.itemsFirst.waitFor({ state: "visible" })`.
*   **Asumsi**: Dianggap bahwa form penambahan karyawan (*Add Employee*) hanya mewajibkan inputan pada *First Name* dan *Last Name* serta ID yang dibuat secara auto-generate *random*, tanpa field mandatori lainnya.
*   **Improvement**: 
    - Menghindari *hardcode* test data di dalam skrip `orangeHRM.spec.js`. Sebaiknya membuat file terpisah (contoh: `test-data.json`) untuk menampung data nama (Mardi) atau konfigurasi input.
    - Menambahkan penanganan *Error Handling* menggunakan block `try-catch` saat melakukan klik 'Yes, Delete' untuk berjaga-jaga apabila pop-up konfirmasi *delete* gagal tertangkap oleh skrip.
