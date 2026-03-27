## 📱 About the App: Ungker

**Ungker** adalah aplikasi berbasis *scripting* yang dirancang sebagai mesin otomatisasi ringan. Nama "Ungker" (kepompong) melambangkan fase persiapan sebelum menjadi sesuatu yang terbang bebas—seperti repository ini yang menyiapkan lingkungan eksekusi untuk berbagai tugas teknis secara efisien.

---

### ⚙️ Core Functionality
* **On-Demand Execution:** Dirancang khusus untuk dijalankan melalui **GitHub Actions (`workflow_dispatch`)**, memberikan kontrol penuh untuk memulai tugas secara manual tanpa ketergantungan pada *push event*.
* **Headless Environment:** Optimal untuk dijalankan di lingkungan *server-side* atau *virtual runner* (Ubuntu-Latest) tanpa memerlukan antarmuka grafis (GUI).
* **Cross-Platform Ready:** Meskipun berjalan di GitHub Cloud, script ini dikembangkan agar tetap kompatibel untuk dijalankan secara lokal pada perangkat **Android (via Termux)** maupun PC.

### 🛠️ Technical Stack
* **Automation Engine:** GitHub Actions (YAML)
* **Primary Logic:** Python / Shell Scripting (Bergantung pada script utama di dalam repo)
* **Environment:** Virtualized Linux Environment (Runner)

### 🌟 Key Features
* **Input Parametrization:** Mendukung input dinamis saat *runtime*, memungkinkan satu workflow digunakan untuk berbagai parameter berbeda tanpa mengubah kode.
* **Log Management:** Setiap proses terdokumentasi dengan rapi di dalam tab *Actions logs* untuk memudahkan *debugging* jika terjadi kendala pada script.
* **Dependency Isolation:** Menggunakan sistem *environment setup* yang bersih dan terisolasi setiap kali script dijalankan.

---
> **Note:** Pastikan semua dependensi telah terdaftar di `requirements.txt` agar workflow dapat berjalan dengan sempurna di GitHub Runner.
