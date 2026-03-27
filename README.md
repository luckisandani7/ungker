# Ungker 🐛

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/luckisandani7/ungker/main.yml?branch=main&style=flat-square)](https://github.com/luckisandani7/ungker/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Ungker** adalah repository otomatisasi sederhana yang dirancang untuk menjalankan tugas-tugas tertentu secara terjadwal atau manual menggunakan GitHub Actions.

## 🚀 Fitur Utama
* **Manual Trigger:** Menggunakan `workflow_dispatch` untuk menjalankan script kapan saja tanpa perlu push code.
* **Automated Execution:** Konfigurasi workflow yang siap pakai di lingkungan GitHub Runner.
* **Lightweight:** Struktur kode yang minimalis dan fokus pada fungsionalitas.

## 🛠️ Cara Penggunaan

### Menjalankan Secara Manual
1.  Buka tab **Actions** di repository ini.
2.  Pilih workflow yang ingin dijalankan di sidebar sebelah kiri.
3.  Klik dropdown **Run workflow**.
4.  Pilih branch (biasanya `main`) dan klik tombol hijau **Run workflow**.

### Menjalankan Secara Lokal
Jika Anda ingin mencoba script ini di mesin lokal atau melalui terminal (seperti Termux):

```bash
# Clone repository
git clone [https://github.com/luckisandani7/ungker.git](https://github.com/luckisandani7/ungker.git)

# Masuk ke direktori
cd ungker

# Jalankan script utama (sesuaikan dengan nama file Anda, misal: main.py atau script.sh)
python main.py
