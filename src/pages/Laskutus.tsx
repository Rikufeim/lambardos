import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, Mail, Building, Shield } from 'lucide-react';
import lambardosLogo from "@/assets/lambardos-logo.png";

const Laskutus = () => {
  const navLinks = [
    { label: "Etusivu", to: "/" },
    { label: "Laskutus", to: "/laskutus" },
    { label: "Tietosuoja", to: "/tietosuoja" },
  ];

  const handleNav = (to: string) => {
    window.location.href = to;
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-100/90 backdrop-blur-md border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <button
              onClick={() => handleNav("/")}
              className="hover:opacity-90 transition-opacity"
            >
              <img src={lambardosLogo} alt="Rakennusliike Lambardos" className="h-12 w-auto object-contain" />
            </button>
            <div className="hidden md:flex space-x-6 items-center">
              {navLinks.map((link) => (
                <button
                  key={link.to}
                  onClick={() => handleNav(link.to)}
                  className="text-gray-700 hover:text-red-600 text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                >
                  {link.label === "Etusivu" && <Home size={14} />}
                  {link.label === "Laskutus" && <FileText size={14} />}
                  {link.label === "Tietosuoja" && <Shield size={14} />}
                  {link.label}
                </button>
              ))}
              <a 
                href="tel:0401234567"
                className="text-gray-900 hover:text-red-600 font-mono font-black text-lg tracking-wide border border-gray-900/20 bg-gray-200 px-4 py-2 rounded transition-colors"
              >
                0401234567
              </a>
            </div>
            <div className="md:hidden flex items-center gap-4">
              <a href="tel:0401234567" className="text-red-600 font-bold text-sm">040 123 4567</a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <h1 className="text-4xl font-black text-gray-900 uppercase mb-8">Laskutus</h1>

        {/* Hinnoittelu */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <FileText className="text-red-600" />
            Hinnoittelu
          </h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-300">
            <p className="text-gray-700 mb-4">
              Hinnoittelumme perustuu sopimuksen mukaan joko urakkaan tai tuntilaskutukseen. 
              Hinnoittelutapaan vaikuttavat muun muassa työsuoritteen tyyppi, sekä ennakkotiedot.
            </p>
            <p className="text-red-600 font-bold text-lg">
              Kysy rohkeasti tarjous!
            </p>
          </div>
        </section>

        {/* Laskutusosoite */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Building className="text-red-600" />
            Laskutusosoite
          </h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-300 space-y-6">
            <p className="text-gray-700">
              Käytössämme on sähköinen taloushallinta, joten toivoisimme saavamme laskumme sähköisenä.
            </p>

            <div className="border-l-4 border-red-600 pl-4">
              <p className="font-bold text-gray-900">Rakennusliike Lambardos Oy</p>
              <p className="text-gray-700">Y-tunnus: 2596064-9</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Verkkolaskutusosoite*:</h3>
              <p className="text-gray-700 font-mono">003725960649</p>
              <p className="text-gray-600 text-sm mt-1">*) Verkkolaskuosoitteemme on sama, kuin OVT-tunnuksemme</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Operaattori:</h3>
              <p className="text-gray-700">Apix Messaging Oy (003723327487)</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Mail className="text-red-600" size={18} />
                Ostolaskujen sähköpostiskannaus:
              </h3>
              <p className="text-gray-700 font-mono break-all">003725960649@procountor.apix.fi</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Paperiset ostolaskut:</h3>
              <div className="text-gray-700">
                <p>Rakennusliike Lambardos Oy (Apix skannauspalvelu)</p>
                <p>PL 16112</p>
                <p>00021 LASKUTUS</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 border-t border-gray-300 py-8 text-center text-gray-600 text-sm">
        <div className="flex justify-center mb-4">
          <img src={lambardosLogo} alt="Rakennusliike Lambardos" className="h-10 w-auto object-contain opacity-80" />
        </div>
        <p>© {new Date().getFullYear()} Rakennusliike Lambardos Oy</p>
      </footer>
    </div>
  );
};

export default Laskutus;
