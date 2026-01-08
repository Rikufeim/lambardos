import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Mail, Building } from 'lucide-react';

const Laskutus = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-green-600 transition-colors">
              <ArrowLeft size={20} />
              <span className="font-medium">Takaisin</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
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
        <p>© {new Date().getFullYear()} Rakennusliike Lambardos Oy</p>
      </footer>
    </div>
  );
};

export default Laskutus;
