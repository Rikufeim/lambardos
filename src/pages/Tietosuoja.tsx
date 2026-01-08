import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Shield, ExternalLink, X, FileText } from 'lucide-react';

const Tietosuoja = () => {
  const [showPrivacyStatement, setShowPrivacyStatement] = useState(false);
  const navLinks = [
    { label: "Etusivu", to: "/" },
    { label: "Laskutus", to: "/laskutus" },
    { label: "Tietosuoja", to: "/tietosuoja" },
  ];

  const handleNav = (to: string) => {
    window.location.href = to;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <button
              onClick={() => handleNav("/")}
              className="text-slate-900 font-black tracking-tight text-base sm:text-lg"
            >
              Rakennusliike Lambardos
            </button>
            <div className="hidden md:flex space-x-6 items-center">
              {navLinks.map((link) => (
                <button
                  key={link.to}
                  onClick={() => handleNav(link.to)}
                  className="text-slate-600 hover:text-green-600 text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                >
                  {link.label === "Etusivu" && <Home size={14} />}
                  {link.label === "Laskutus" && <FileText size={14} />}
                  {link.label === "Tietosuoja" && <Shield size={14} />}
                  {link.label}
                </button>
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
        <h1 className="text-4xl font-black text-slate-900 uppercase mb-8 flex items-center gap-4">
          <Shield className="text-green-600" />
          Tietosuoja
        </h1>

        {/* GDPR Info */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            GDPR – EU:n tietosuoja-asetus voimaan 25.5.2018
          </h2>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
            <p className="text-slate-600">
              Tietosuoja-asetus koskee kaikkia yrityksiä, jotka käsittelevät EU-kansalaisten henkilötietoja. 
              Yrityksessämme otetaan huomioon tietosuoja-asetuksen vaatimukset.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://tietosuoja.fi/gdpr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                <ExternalLink size={16} />
                Lue lisää tietosuoja-asetuksesta Tietosuojavaltuutetun sivuilta
              </a>
              <a 
                href="https://eur-lex.europa.eu/legal-content/FI/TXT/?uri=CELEX%3A32016R0679" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                <ExternalLink size={16} />
                Koko tietosuoja-asetus
              </a>
            </div>
          </div>
        </section>

        {/* Tietosuojaseloste Link */}
        <section className="mb-12">
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <p className="text-slate-700 mb-4">
              Yrityksemme tietosuojaseloste on luettavissa{' '}
              <button 
                onClick={() => setShowPrivacyStatement(true)}
                className="text-green-600 hover:text-green-700 font-bold underline transition-colors"
              >
                tästä
              </button>.
            </p>
          </div>
        </section>
      </main>

      {/* Privacy Statement Modal */}
      {showPrivacyStatement && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Asiakkaiden henkilötietojen käsittely</h2>
              <button 
                onClick={() => setShowPrivacyStatement(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-slate-600">
              {/* Rekisterinpitäjä */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">Rekisterinpitäjä:</h3>
                <p>Rakennusliike Lambardos Oy</p>
                <p>p. 045-2388663</p>
                <p>info@lambardos.fi</p>
                <p>Y-tunnus: 2595054-9</p>
              </div>

              {/* Yleistä */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Yleistä henkilötietojen käsittelystä</h3>
                <p>
                  EU:n yleistä tietosuoja-asetusta (General Data Protection Regulation, EU 2016/679) sovelletaan 25.5.2018 alkaen kaikissa EU:n jäsenmaissa.
                  Henkilötietoja tarvitaan asioinnin yhteydessä palvelun toteuttamiseksi eikä palvelua voida toteuttaa ilman näiden henkilötietojen antamista. 
                  Henkilötietoja käsitellään ehdottoman luottamuksellisesti. Sähköisen viestinnän palveluista säädetään erikseen laissa 917/2014.
                </p>
              </div>

              {/* Käsiteltävät henkilötietoryhmät */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Käsiteltävät henkilötietoryhmät ja tietojenkäsittelyn oikeusperusteet</h3>
                <p className="mb-2">
                  Asiakasrekisteriin kerätään seuraavat henkilötiedot: Etu- ja sukunimi, osoite, puhelinnumero, sähköpostiosoite, asiakasnumero. 
                  Laskutusasiakkaiden tietoja käsitellään sen verran kuin on tarpeen luottokelpoisuuden varmistamiseksi.
                </p>
                <p className="mb-2">
                  Tietojen käsittelyn oikeusperuste on rekisterinpitäjän oikeutettu etu, rekisterinpitäjän ja asiakkaan välillä on asiakassuhde. 
                  Henkilötietoja tarvitaan palvelun toteuttamiseksi ja lakisääteisten velvoitteiden täyttämiseksi eikä palvelua voida toteuttaa ilman näiden henkilötietojen antamista.
                </p>
                <p className="mb-2">
                  Rekisterinpitäjän verkkopalvelu käyttää evästeitä, jotka tallentuvat käyttäjän päätelaitteelle. 
                  Verkkopalveluiden osalta käsiteltäviä tietoja ovat IP-osoite, käyttöjärjestelmä, selain ja muut palvelun käyttöön liittyvät tiedot. 
                  Tiedot eivät ole suoraan yhdistettävissä yksittäiseen henkilöön. Asiakas voi kieltää evästeiden käytön laitteellaan muuttamalla selaimen asetuksia. 
                  Kaikki sivuston osat eivät välttämättä toimi, mikäli evästeiden käyttö on kielletty.
                </p>
                <p>
                  Yhteydenpitoon voidaan käyttää sähköisiä palveluita kuten tekstiviestit, sähköposti, Whatsapp. 
                  Tällöin asiakkaan tulee tutustua kyseisten palveluntarjoajien tietosuojakäytäntöihin. 
                  Rekisterinpitäjä voi oikeutettuun etuun perustuen tallentaa muista palveluista saamansa henkilötiedot (nimi, yhteystiedot) palvelunsa toteuttamiseksi.
                </p>
              </div>

              {/* Henkilötietojen lähteet */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Henkilötietojen lähteet</h3>
                <p>
                  Pääasiallinen henkilötietojen lähde on asiakas. Tietoja voidaan saada myös asiakkaan toimeksiannosta yhteistyökumppaneilta. 
                  Tietoja voidaan tarvittaessa hankkia yleisesti saatavilla olevista lähteistä kuten numeropalvelusta. 
                  Verkkopalvelun käyttöön liittyvää tietoa kerätään verkkopalvelussa evästeiden avulla.
                </p>
              </div>

              {/* Tietojen siirto ja luovutus */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Tietojen siirto ja luovutus</h3>
                <p className="mb-2">
                  Asiakasrekisteristä tietoja siirretään varmuuskopiointia varten palveluntarjoajan ylläpitämään palvelinympäristöön, joka täyttää EU-lainsäädännön vaatimukset. 
                  Lisäksi osa tiedoista on paperimuodossa kansioissa.
                </p>
                <p className="mb-2">
                  Henkilötietoja voidaan luovuttaa yhteistyökumppaneille (esimerkiksi tilitoimistot, perintätoimistot) kun siihen on palvelun tarjoamisen tai rekisterinpitäjän oikeutetun edun kannalta asianmukainen syy.
                </p>
                <p className="mb-2">
                  Henkilötietoja voidaan luovuttaa viranomaisille kulloinkin voimassaolevan lainsäädännön määräämissä tapauksissa.
                </p>
                <p>
                  Rekisterinpitäjä voi käyttää palveluiden toteuttamiseen alihankkijoita, jotka siirtävät tietoja EU:n ulkopuolelle Euroopan talousalueen ulkopuolelle. 
                  Tällöin rekisterinpitäjä pyrkii parhaan kykynsä mukaan huolehtimaan että tietojenkäsittelijä täyttää EU-lainsäädännön vaatimukset (EU-U.S. Privacy Shield tai vastaava).
                </p>
              </div>

              {/* Säilyttämisaika */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Henkilötietojen säilyttämisaika</h3>
                <p className="mb-2">
                  Asiakasta koskevat tiedot säilytetään viiden vuoden ajan viimeisen tapahtuman kirjaamisen jälkeen. 
                  Tietoja kuitenkin voidaan säilyttää viiden vuoden jälkeen, mikäli sille on peruste. 
                  Esimerkiksi laskutusasiakkaiden osoitetiedot säilytetään tiliasiakkuuden keston ajan siihen asti, että laskuista on saatu maksusuoritus.
                </p>
                <p className="mb-2">
                  Kirjanpitoraportit (laskutusreskontra yms.) säilytetään 10 vuotta tilikauden päättymisen jälkeen.
                </p>
                <p>
                  Asiakkaiden pyynnöt saada pääsy henkilötietoihinsa ja pyynnöt saada käyttää oikeuksiaan säilytetään 12 vuotta allekirjoituspäiväyksestä. 
                  Tiedot tietosuojarikkomuksista, mikäli niitä ilmenee, säilytetään 12 vuotta.
                </p>
              </div>

              {/* Profilointi */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Profilointi ja automaattinen päätöksenteko</h3>
                <p>
                  Rekisterinpitäjä ei tee automaattiseen päätöksentekoon perustuvia päätöksiä eikä profilointia käsittelemiensä henkilötietojen perusteella.
                </p>
              </div>

              {/* Rekisteröidyn oikeudet */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Rekisteröidyn (asiakkaan) oikeudet</h3>
                <p className="mb-2">
                  Asiakkaalla on oikeus tarkastaa hänestä tallennetut tiedot esittämällä tarkastuspyyntö toimittamalla allekirjoitettu tai sitä vastaavalla tavalla varmennettu asiakirja kirjallisesti tai sähköisesti rekisterinpitäjälle. 
                  Rekisterinpitäjä toimittaa edellä mainitut tiedot asiakkaalle 30 päivän kuluessa tarkastuspyynnön esittämisestä, ellei perustellusta syystä tietojen toimittamiseen tarvita pidempää aikaa. 
                  Asiakkaalla on oikeus oikaista itseään koskevat henkilötiedot siltä osin kuin ne ovat virheellisiä.
                </p>
                <p className="mb-2">
                  Asiakkaalla on tietosuoja-asetuksen mukaisesti oikeus vastustaa henkilötietojensa käsittelyä tai pyytää tietojensa käsittelyn rajoittamista sekä lain vaatimissa tilanteissa oikeus siirtää tiedot toisen tahon pitämään järjestelmään. 
                  Rekisterinpitäjä säilyttää kuitenkin siirretyt tiedot tämän tietosuojaselosteen mukaisesti.
                </p>
                <p className="mb-2">
                  Henkilötietojen käsittelyn perustuessa asiakkaan suostumukseen, on asiakkaalla oikeus peruuttaa suostumus milloin tahansa. 
                  On huomioitava, että suuri osa rekisterinpitäjän tallentamista henkilötiedoista tallennetaan muuhun tietojenkäsittelyperusteeseen kuin suostumukseen perustuen.
                </p>
                <p>
                  Asiakkaalla on oikeus saattaa asia tietosuojavaltuutetun käsittelyyn, jos rekisterinpitäjä ei noudata asiakkaan oikaisu- tai muuta pyyntöä.
                </p>
              </div>

              {/* Lisätietoja */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Lisätietoja</h3>
                <p>
                  Rekisterinpitäjä pidättää oikeuden tämän selosteen tietojen muuttamiseen ilman erillistä ilmoitusta ja suosittelee tarkastamaan selosteen ajoittain.
                </p>
              </div>

              <div className="text-sm text-slate-400 pt-4 border-t border-slate-200">
                versio 25.05.2018/0.1
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Rakennusliike Lambardos Oy</p>
      </footer>
    </div>
  );
};

export default Tietosuoja;
