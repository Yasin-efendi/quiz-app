# 📚 Kuis Pembelajaran SD - Next.js 15

Aplikasi kuis interaktif untuk latihan Ujian Sekolah Kelas 3 SD, dibangun dengan **Next.js 15 (App Router)**, **TypeScript**, dan penyimpanan data lokal persisten.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## ✨ Fitur Utama

### 🎓 Untuk Siswa
- ✅ Dashboard mata pelajaran & pertemuan yang terstruktur
- ✅ Kuis interaktif dengan navigasi soal (sebelumnya/selanjutnya)
- ✅ Render konten HTML aman (`<br>`, `<b>`, `<i>`) pada soal
- ✅ Halaman hasil dengan skor, rangkuman, dan pembahasan detail
- ✅ Responsive design (mobile & desktop friendly)

### 🛠️ Untuk Admin (Tanpa Auth - Development Only)
- ✅ CRUD lengkap: Pelajaran → Pertemuan → Bank Soal
- ✅ Form input dengan preview HTML untuk soal & pembahasan
- ✅ Cascade delete: hapus pertemuan otomatis menghapus soal terkait
- ✅ Real-time update: data langsung tersedia di halaman publik

### ⚙️ Teknis
- ✅ Persistent database lokal via `db.json` + `fs/promises`
- ✅ API Routes terisolasi (semua I/O hanya di server)
- ✅ Next.js 15 `async params` pattern (`await params`)
- ✅ Sanitasi HTML dasar untuk mencegah XSS
- ✅ Loading states & error boundaries per route segment

---

## 🚀 Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.x |
| **Styling** | CSS Modules + CSS Variables |
| **State** | React Hooks (`useState`, `useEffect`) |
| **Storage** | Local JSON (`db.json`) via Node.js `fs/promises` |
| **Routing** | File-based dynamic routing (`[slug]`) |
| **API** | Next.js Route Handlers (`app/api/**/route.ts`) |

---

## 📦 Instalasi & Setup

### Prerequisites
- Node.js 18+ 
- npm / yarn / pnpm

### Langkah Instalasi
```bash
# 1. Clone repository
git clone https://github.com/username/quiz-app-sd.git
cd quiz-app-sd

# 2. Install dependencies
npm install

# 3. Jalankan server development
npm run dev

# 4. Buka browser
http://localhost:3000
```

### 🌱 Seed Data (Opsional)
Untuk langsung mengisi data contoh, timpa file `db.json` di root proyek:
```json
{
  "subjects": [],
  "meetings": [],
  "questions": []
}
```
*Server akan otomatis menginisialisasi struktur default jika file kosong.*

---

## 📁 Struktur Proyek

```
quiz-app-sd/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout + metadata
│   │   ├── page.tsx                   # Dashboard: daftar pelajaran
│   │   ├── globals.css                # Global styles + CSS variables
│   │   ├── quiz/[slug]/
│   │   │   ├── page.tsx              # Halaman kuis (client component)
│   │   │   ├── loading.tsx           # Loading state
│   │   │   └── error.tsx             # Error boundary
│   │   ├── result/[slug]/
│   │   │   ├── page.tsx              # Halaman hasil + pembahasan
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Admin navigation wrapper
│   │   │   ├── page.tsx              # Dashboard admin
│   │   │   ├── subjects/page.tsx     # CRUD Pelajaran
│   │   │   ├── meetings/page.tsx     # CRUD Pertemuan
│   │   │   └── questions/page.tsx    # CRUD Bank Soal
│   │   └── api/
│   │       ├── quiz/route.ts         # GET all data
│   │       ├── quiz/[slug]/route.ts  # GET by meeting slug
│   │       └── admin/
│   │           ├── subjects/
│   │           │   ├── route.ts      # POST create subject
│   │           │   └── [id]/route.ts # PUT/DELETE subject
│   │           ├── meetings/
│   │           │   ├── route.ts      # POST create meeting
│   │           │   └── [id]/route.ts # PUT/DELETE meeting (+ cascade)
│   │           └── questions/
│   │               ├── route.ts      # POST create question
│   │               └── [id]/route.ts # PUT/DELETE question
│   ├── lib/
│   │   ├── db.ts                     # readDB/writeDB + utils
│   │   └── sanitize.ts               # HTML sanitization
│   └── components/
│       └── SafeHTML.tsx              # Reusable sanitized HTML renderer
├── db.json                           # Persistent local database
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🔌 API Documentation

### Public Endpoints
| Method | Endpoint | Deskripsi | Response |
|--------|----------|-----------|----------|
| `GET` | `/api/quiz` | Ambil semua data (subjects, meetings, questions) | `{ subjects: [], meetings: [], questions: [] }` |
| `GET` | `/api/quiz/[slug]` | Ambil soal berdasarkan slug pertemuan | `{ meeting: {}, questions: [] }` |

### Admin Endpoints (No Auth - Dev Only)
| Method | Endpoint | Deskripsi | Payload |
|--------|----------|-----------|---------|
| `POST` | `/api/admin/subjects` | Tambah pelajaran | `{ title: string, description?: string }` |
| `PUT` | `/api/admin/subjects/[id]` | Edit pelajaran | `{ title?: string, description?: string }` |
| `DELETE` | `/api/admin/subjects/[id]` | Hapus pelajaran | - |
| `POST` | `/api/admin/meetings` | Tambah pertemuan | `{ title: string, subjectId: string }` |
| `PUT` | `/api/admin/meetings/[id]` | Edit pertemuan | `{ title?: string, subjectId?: string }` |
| `DELETE` | `/api/admin/meetings/[id]` | Hapus pertemuan (+ cascade delete questions) | - |
| `POST` | `/api/admin/questions` | Tambah soal | `{ content, meetingId, options[4], correctIndex, explanation? }` |
| `PUT` | `/api/admin/questions/[id]` | Edit soal | Partial question object |
| `DELETE` | `/api/admin/questions/[id]` | Hapus soal | - |

> ⚠️ **Catatan**: Semua endpoint admin **tidak memiliki autentikasi**. Hanya untuk penggunaan localhost/development.

---

## 🎮 Panduan Penggunaan

### Untuk Siswa
1. Buka `http://localhost:3000`
2. Pilih mata pelajaran → klik "Mulai Kuis" pada pertemuan yang diinginkan
3. Jawab semua soal (navigasi: Sebelumnya / Selanjutnya)
4. Klik "Selesai & Lihat Hasil" untuk melihat skor
5. Klik "Lihat Pembahasan" untuk review jawaban + penjelasan

### Untuk Admin
1. Buka `http://localhost:3000/admin`
2. Gunakan menu navigasi untuk mengelola:
   - **Pelajaran**: Tambah/edit/hapus mata pelajaran utama
   - **Pertemuan**: Atur subtema di dalam setiap pelajaran
   - **Bank Soal**: Kelola soal dengan opsi, kunci jawaban, dan pembahasan
3. Semua perubahan langsung tersimpan ke `db.json` dan tersedia di halaman publik

### 💡 Tips Input Soal
- Gunakan tag HTML sederhana untuk formatting:
  ```html
  <!-- Line break -->
  Apa hasil dari <br> 2 + 2?
  
  <!-- Bold -->
  Kata <b>book</b> berarti...
  
  <!-- Italic -->
  Ejaan <i>sepuluh</i> adalah...
  ```
- Tag berbahaya (`<script>`, `on*`, `iframe`) akan otomatis disaring.

---

## ⚠️ Catatan Penting

### Development Only
- 🔐 **Tidak ada autentikasi**: Panel admin terbuka untuk siapa saja. Jangan deploy ke production tanpa middleware auth.
- 💾 **JSON File Storage**: `db.json` cocok untuk localhost. Untuk production, ganti dengan database relasional (PostgreSQL/MySQL) atau headless CMS.
- 🔄 **Concurrent Writes**: Tidak ada lock mechanism. Hindari multiple admin editing bersamaan.

### Next.js 15 Pattern
```ts
// ✅ Benar: await params di dynamic routes
export async function GET(
  request: Request, 
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // Wajib di-await!
  // ...logic
}
```

### Sanitasi HTML
Semua konten HTML dari database diproses melalui `lib/sanitize.ts` sebelum dirender:
- ✅ Diizinkan: `<b>`, `<i>`, `<br>`, `<u>`, `<em>`, `<strong>`
- ❌ Diblokir: `<script>`, `on*`, `javascript:`, `<iframe>`, `<form>`, dll.

---

## 🛠️ Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `styled-jsx cannot be imported from Server Component` | Pindahkan animasi ke `globals.css`, jangan gunakan `style jsx` di `loading.tsx`/`error.tsx` |
| Data tidak muncul setelah restart | Pastikan `db.json` ada di root proyek dan writable |
| Slug tidak unik | Sistem otomatis generate slug: `${subject.slug}-${toSlug(title)}` |
| Error `params is not awaitable` | Pastikan menggunakan Next.js 15+ dan `await params` di route handlers |

### Clear Cache
Jika terjadi error build aneh:
```bash
rm -rf .next && npm run dev
```

---

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur: `git checkout -b fitur/baru`
3. Commit perubahan: `git commit -m 'feat: tambah fitur X'`
4. Push ke branch: `git push origin fitur/baru`
5. Buka Pull Request

---

## 📄 License

Dibagikan di bawah lisensi [MIT](LICENSE). Bebas digunakan, dimodifikasi, dan didistribusikan untuk tujuan edukasi.

---

> 🎯 **Dibuat dengan ❤️ untuk mendukung pembelajaran digital siswa SD Indonesia.**  
> *Next.js 15 • TypeScript • App Router • Local JSON Storage*