# Aplikasi Todo Sederhana (NestJS + React)

Ini adalah proyek todo sederhana yang dibangun dengan NestJS sebagai backend dan React sebagai frontend.

## Versi Node yang Digunakan

Node.js v22.12.0

## Cara Menjalankan Aplikasi

### 1. Menjalankan Backend (NestJS)

Buka terminal dan masuk ke direktori `backend`.

Install dependensi:

```sh
yarn install
```

Jalankan server dalam mode development (dengan auto-reload):

```sh
yarn start:dev
```

Backend akan berjalan di [http://localhost:3000](http://localhost:3000).

### 2. Menjalankan Frontend (React)

Buka terminal baru dan masuk ke direktori `frontend`.

Install dependensi:

```sh
yarn install
```

Jalankan aplikasi React:

```sh
yarn dev
```

Frontend akan terbuka secara otomatis di browser pada [http://localhost:5173](http://localhost:5173).

## Keputusan Teknis

- **Penyimpanan In-Memory (Backend):** Data todos disimpan dalam sebuah array di service NestJS. Ini dipilih untuk menyederhanakan proyek dan fokus pada fundamental API NestJS tanpa perlu setup database. Konsekuensinya, data akan hilang setiap kali server backend di-restart.
- **Validasi dengan DTO (Backend):** Menggunakan class-validator dan DTO (`CreateTodoDto`) untuk validasi request `POST /api/todos`. Ini adalah praktik standar di NestJS untuk memastikan data yang masuk ke aplikasi sesuai dengan format yang diharapkan, meningkatkan keamanan dan keandalan API.
- **Filtering Client-Side (Frontend):** Fitur pencarian todo diimplementasikan di sisi klien (React) menggunakan `useMemo`. Untuk jumlah data yang kecil, ini memberikan pengalaman pengguna yang sangat cepat dan responsif karena tidak perlu melakukan request ulang ke server setiap kali user mengetik.
