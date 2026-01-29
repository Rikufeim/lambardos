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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link
              to="/"
              className="hover:opacity-90 transition-opacity"
            >
              <img src={lambardosLogo} alt="Rakennusliike Lambardos" className="h-12 w-auto object-contain" />
            </Link>
            <div className="hidden md:flex space-x-6 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-slate-600 hover:text-green-600 text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                >
                  {link.label === "Etusivu" && <Home size={14} />}
                  {link.label === "Laskutus" && <FileText size={14} />}
                  {link.label === "Tietosuoja" && <Shield size={14} />}
                  {link.label}
                </Link>
              ))}
              <a 
                href="tel:0401234567"
                className="text-green-600 hover:text-green-700 font-mono font-black text-lg tracking-wide border border-green-600/20 bg-green-50 px-4 py-2 rounded transition-colors"
              >
                0401234567
              </a>
            </div>
            <div className="md:hidden flex items-center gap-4">
              <a href="tel:0401234567" className="text-green-600 font-bold text-sm">040 123 4567</a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <h1 className="text-4xl font-black text-slate-900 uppercase mb-8">Laskutus</h1>

        {/* Hinnoittelu */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <FileText className="text-green-600" />
            Hinnoittelu
          </h2>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <p className="text-slate-600 mb-4">
              Hinnoittelumme perustuu sopimuksen mukaan joko urakkaan tai tuntilaskutukseen. 
              Hinnoittelutapaan vaikuttavat muun muassa työsuoritteen tyyppi, sekä ennakkotiedot.
            </p>
            <p className="text-green-600 font-bold text-lg">
              Kysy rohkeasti tarjous!
            </p>
          </div>
        </section>

        {/* Laskutusosoite */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <Building className="text-green-600" />
            Laskutusosoite
          </h2>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-6">
            <p className="text-slate-600">
              Käytössämme on sähköinen taloushallinta, joten toivoisimme saavamme laskumme sähköisenä.
            </p>

            <div className="border-l-4 border-green-600 pl-4">
              <p className="font-bold text-slate-900">Rakennusliike Lambardos Oy</p>
              <p className="text-slate-600">Y-tunnus: 2596064-9</p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">Verkkolaskutusosoite*:</h3>
              <p className="text-slate-600 font-mono">003725960649</p>
              <p className="text-slate-500 text-sm mt-1">*) Verkkolaskuosoitteemme on sama, kuin OVT-tunnuksemme</p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">Operaattori:</h3>
              <p className="text-slate-600">Apix Messaging Oy (003723327487)</p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Mail className="text-green-600" size={18} />
                Ostolaskujen sähköpostiskannaus:
              </h3>
              <p className="text-slate-600 font-mono break-all">003725960649@procountor.apix.fi</p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">Paperiset ostolaskut:</h3>
              <div className="text-slate-600">
                <p>Rakennusliike Lambardos Oy (Apix skannauspalvelu)</p>
                <p>PL 16112</p>
                <p>00021 LASKUTUS</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <div className="flex justify-center mb-4">
          <img src={lambardosLogo} alt="Rakennusliike Lambardos" className="h-10 w-auto object-contain opacity-80" />
        </div>
        <p>© {new Date().getFullYear()} Rakennusliike Lambardos Oy</p>
      </footer>
    </div>
  );
};

export default Laskutus;
