import { FaFacebook, FaInstagram, FaMapPin, FaPhone } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

import { Logo, TwitterIcon } from "./icons";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-zinc-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo height={60} width={60} />
              <span className="text-xl font-bold text-foreground">
                Kotacoffee.id
              </span>
            </div>
            <p className="text-foreground-500 text-sm leading-relaxed">
              Marketplace kopi berkualitas yang menghubungkan petani lokal
              dengan pecinta kopi. Dapatkan biji kopi terbaik langsung dari
              sumbernya.
            </p>
            <div className="flex space-x-4">
              <FaFacebook className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer transition-colors" />
              <FaInstagram className="w-5 h-5 text-rose-500 hover:text-rose-600 cursor-pointer transition-colors" />
              <TwitterIcon className="w-5 h-5 text-sky-500 hover:text-sky-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Menu Utama</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-foreground-500 hover:text-success transition-colors"
                  href="#"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  className="text-foreground-500 hover:text-success transition-colors"
                  href="#products"
                >
                  Produk
                </a>
              </li>
              <li>
                <a
                  className="text-foreground-500 hover:text-success transition-colors"
                  href="#categories"
                >
                  Kategori
                </a>
              </li>
              <li>
                <a
                  className="text-foreground-500 hover:text-success transition-colors"
                  href="#"
                >
                  Tentang Kami
                </a>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Untuk Pedagang</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-foreground-500 hover:text-success transition-colors"
                  href="#"
                >
                  Daftar Jual
                </a>
              </li>
              <li>
                <a
                  className="text-foreground-500 hover:text-success transition-colors"
                  href="#"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Kontak Kami</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4 text-success" />
                <span className="text-foreground-500">info@kotacoffee.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhone className="w-4 h-4 text-success" />
                <span className="text-foreground-500">0821-7756-1275</span>
              </div>
              <div className="flex items-start space-x-2">
                <FaMapPin className="w-4 h-4 text-success mt-0.5" />
                <span className="text-foreground-500">
                  Jl. A.P. Pettarani
                  <br />
                  Makassar, Sulawesi Selatan
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-y-zinc-900 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-foreground">
              © 2026 KotaCoffee. Semua hak cipta dilindungi.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                className="text-foreground hover:text-fresh transition-colors"
                href="#"
              >
                Syarat & Ketentuan
              </a>
              <a
                className="text-foreground hover:text-fresh transition-colors"
                href="#"
              >
                Kebijakan Privasi
              </a>
              <a
                className="text-foreground hover:text-fresh transition-colors"
                href="#"
              >
                Bantuan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
