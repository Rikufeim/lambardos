import React, { useState, useEffect, useRef, useCallback, useContext, createContext } from 'react';
import { Menu, X, Phone, Mail, MapPin, Hammer, CheckCircle, AlertTriangle, FileText, ChevronRight, Heart, Wrench, Ruler, User, Square, ArrowDown, Home, BookOpen, Calculator, Contact, MessageCircle } from 'lucide-react';

// --- APUKOMPONENTIT ---

const Logo = () => (
  <div className="flex items-center gap-2 font-bold text-xl md:text-2xl tracking-tighter cursor-pointer hover:opacity-90 transition-opacity">
    <span className="text-slate-900">I</span>
    <Heart className="w-6 h-6 text-red-600 fill-current" />
    <span className="text-slate-900">KITCHEN</span>
  </div>
);

const Spotlight = ({ className = "", fill = "white", fillOpacity = 0.15 }) => {
  const gradientId = `spotlight-gradient-${fill.replace('#', '')}`;
  return (
    <svg
      className={`pointer-events-none absolute z-[1] top-0 left-0 ${className}`}
      width="100%"
      height="100%"
      viewBox="0 0 500 500"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="0" cy="0" r="500" fill={`url(#${gradientId})`} fillOpacity={fillOpacity} />
      <defs>
        <radialGradient
          id={gradientId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(0 0) rotate(90) scale(500)"
        >
          <stop stopColor={fill} stopOpacity="1" />
          <stop offset="1" stopColor={fill} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

// --- 3D CARD COMPONENTS ---

const MouseEnterContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined);

const CardContainer = ({ children, className, containerClassName }: { children: React.ReactNode; className?: string; containerClassName?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y * -1}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={`flex items-center justify-center ${containerClassName}`}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center justify-center relative transition-all duration-200 ease-linear ${className}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={`h-auto w-auto [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] ${className}`}
    >
      {children}
    </div>
  );
};

interface CardItemProps {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  [key: string]: any;
}

const CardItem = ({ as: Tag = "div", children, className, translateX = 0, translateY = 0, translateZ = 0, rotateX = 0, rotateY = 0, rotateZ = 0, ...rest }: CardItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(MouseEnterContext);
  const isMouseEntered = context ? context[0] : false;

  useEffect(() => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

  return (
    <Tag
      ref={ref}
      className={`w-fit transition-transform duration-200 ease-linear ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

// --- AUTOMAATTINEN PELI (LOOP) ---
const HeroGameLoop = ({ active }: { active: boolean }) => {
  const obstacleX = useRef(110);
  const playerY = useRef(0);
  const velocity = useRef(0);
  const statusRef = useRef('running');
  const [status, setStatus] = useState('running');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const obstacleRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  // Kiinteät arvot - ei skaalata
  const JUMP_FORCE = 12;
  const GRAVITY = 0.6;
  const COLLISION_THRESHOLD = 30;

  // Synkronoi status ref:iin
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Hyppytoiminto - käyttää refsiä
  const jump = useCallback(() => {
    // Jump only if on ground and game is running
    if (playerY.current <= 0 && statusRef.current === 'running') {
        velocity.current = JUMP_FORCE;
    }
  }, []);

  const resetGame = useCallback(() => {
    obstacleX.current = 110;
    playerY.current = 0;
    velocity.current = 0;
    statusRef.current = 'running';
    setStatus('running');
  }, []);

  useEffect(() => {
    if (!active) return;

    let animationId: number;

    const animate = () => {
      if (statusRef.current === 'running') {
          // Liikuta estettä
          obstacleX.current -= 0.5; 

          // Reset loop
          if (obstacleX.current < -20) {
              obstacleX.current = 110;
          }

          // Fysiikka (Painovoima)
          playerY.current += velocity.current;
          if (playerY.current > 0) {
              velocity.current -= GRAVITY;
          } else {
              playerY.current = 0;
              velocity.current = 0;
          }

          // Törmäys - Mahdoton voittaa
          if (obstacleX.current < 22 && obstacleX.current > 10) {
              if (playerY.current < COLLISION_THRESHOLD) { 
                  statusRef.current = 'crash';
                  setStatus('crash');
                  setTimeout(() => {
                      resetGame();
                  }, 2500);
              }
          }
      }

      // DOM päivitykset
      if (obstacleRef.current) {
          obstacleRef.current.style.left = `${obstacleX.current}%`;
          
          if (statusRef.current === 'crash') {
              obstacleRef.current.style.transform = 'rotate(-45deg)';
          } else {
              obstacleRef.current.style.transform = 'rotate(0deg)';
          }
      }
      
      if (playerRef.current) {
          playerRef.current.style.bottom = `${playerY.current}px`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    
    return () => {
        if (animationId) cancelAnimationFrame(animationId);
    };
  }, [active, resetGame]);

  return (
    <div 
        ref={containerRef}
        className="relative w-full h-full bg-white overflow-hidden flex flex-col items-center justify-center border-b-8 border-slate-200 cursor-pointer select-none touch-none"
        onPointerDown={jump}
        onTouchStart={jump}
    >
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        {/* Ohje */}
        {status === 'running' && playerY.current === 0 && (
            <div className="absolute top-4 text-[10px] sm:text-xs text-slate-400 font-mono animate-pulse pointer-events-none uppercase tracking-widest z-20 px-2 text-center">
                KLIKKAA HYPÄTÄKSESI
            </div>
        )}
        
        {status === 'crash' && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] animate-in zoom-in duration-200 pointer-events-none px-2">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 mb-2 drop-shadow-md" />
                <h2 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tighter drop-shadow-xl mb-1 text-center">
                    Meille ei käy näin
                </h2>
                <p className="text-slate-600 font-bold bg-white/90 px-3 py-0.5 rounded shadow-sm border border-slate-200 text-[10px]">GAME OVER</p>
            </div>
        )}

        {/* Pelaaja */}
        <div ref={playerRef} className="absolute left-[15%] w-6 h-10 sm:w-8 sm:h-12 bg-green-500 rounded-lg border-2 border-green-600 shadow-xl z-10 pointer-events-none" style={{ bottom: 0 }}>
            <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-1 right-4 w-2 h-2 bg-white rounded-full"></div>
        </div>

        {/* Este (Kaappi) */}
        <div ref={obstacleRef} className="absolute w-10 h-20 sm:w-12 sm:h-24 bg-amber-100 border-4 border-amber-800 rounded-sm shadow-2xl origin-bottom-left pointer-events-none transition-transform duration-300" style={{ left: '110%', bottom: 0 }}>
            <div className="w-full h-1 bg-amber-800/20 mt-3 sm:mt-4"></div>
            <div className="absolute top-8 sm:top-10 right-1.5 sm:right-2 w-1 h-6 sm:h-8 bg-amber-200 rounded-full border border-amber-300"></div>
        </div>

        <div className="absolute bottom-0 w-full h-2 bg-slate-200 pointer-events-none"></div>
    </div>
  );
};

// --- KELLUVA VALIKKO (Floating Dock - Fixed Base) ---
interface DockItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

const FloatingDock = ({ items, isVisible }: { items: DockItem[]; isVisible: boolean }) => {
  const [mouseX, setMouseX] = useState<number | null>(null);

  // Jos ei näkyvissä, piilotetaan ruudun alareunan alle
  const containerStyle = {
    transform: isVisible ? 'translateX(-50%) translateY(0%)' : 'translateX(-50%) translateY(150%)',
    opacity: isVisible ? 1 : 0,
  };

  return (
    <div 
      className="fixed bottom-6 left-1/2 z-50 transition-all duration-500 ease-in-out"
      style={containerStyle}
      onMouseLeave={() => setMouseX(null)}
    >
      <div 
        className="flex items-center gap-2 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full border-2 border-green-500 shadow-2xl shadow-green-900/10 h-14"
        onMouseMove={(e) => setMouseX(e.clientX)}
      >
        {items.map((item, index) => (
          <DockIcon 
            key={index} 
            mouseX={mouseX} 
            {...item} 
          />
        ))}
      </div>
    </div>
  );
};

const DockIcon = ({ mouseX, icon: Icon, href, title }: { mouseX: number | null; icon: React.ElementType; href: string; title: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (mouseX === null || !ref.current) {
      setScale(1);
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const iconCenterX = rect.left + rect.width / 2;
    const distance = Math.abs(mouseX - iconCenterX);
    
    // Lasketaan skaalauskerroin etäisyyden perusteella
    const maxDistance = 100;
    const maxScale = 1.5; // Max suurennus

    if (distance < maxDistance) {
      // Gaussian curve approximation for smooth scaling
      const val = (1 + Math.cos((distance / maxDistance) * Math.PI)) / 2;
      const s = 1 + val * (maxScale - 1);
      setScale(s);
    } else {
      setScale(1);
    }
  }, [mouseX]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Jos linkki alkaa #, se on sisäinen ankkuri -> preventDefault ja scrollaus
    if (href.startsWith('#')) {
      e.preventDefault();
      if (href === '#hero' || href === '#top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Muuten annetaan selaimen hoitaa (mailto:, tel:, jne.)
  };

  return (
    <div className="w-10 h-10 flex items-center justify-center relative">
        <a 
        href={href}
        ref={ref}
        onClick={handleClick}
        className="absolute flex items-center justify-center rounded-full bg-white border border-green-100 hover:bg-green-50 transition-colors group cursor-pointer shadow-sm w-10 h-10 origin-bottom"
        style={{ 
            transform: `scale(${scale}) translateY(${scale > 1 ? (scale - 1) * -10 : 0}px)`, 
            transition: 'transform 0.1s ease-out'
        }}
        >
        {/* Tooltip */}
        <span 
            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
            style={{ transform: `scale(${1/scale})` }}
        >
            {title}
        </span>
        
        <Icon 
            className="text-slate-600 group-hover:text-green-600 transition-colors w-5 h-5" 
        />
        </a>
    </div>
  );
};

// --- HERO PARALLAX COMPONENT (About Section) ---

interface Product {
  title: string;
  thumbnail: string;
}

const HeroParallax = ({ products }: { products: Product[] }) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    
    // Alustetaan arvot heti
    if (typeof window !== 'undefined') {
        setElementTop(ref.current.offsetTop);
        setClientHeight(window.innerHeight);
    }
    
    const onResize = () => {
      if (ref.current) {
        setElementTop(ref.current.offsetTop);
        setClientHeight(window.innerHeight);
      }
    };
    
    window.addEventListener("resize", onResize);
    
    const onScroll = () => {
        requestAnimationFrame(() => {
            setScrollY(window.scrollY);
        });
    };
    
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const safeHeight = clientHeight || 800; 
  const progress = Math.max(0, Math.min(1, (scrollY - elementTop + safeHeight) / (safeHeight * 2)));
  
  const translateX = (progress - 0.5) * 1000; 
  const rotateX = 15 - progress * 15;
  const opacity = Math.min(1, progress * 2);
  const rotateZ = 10 - progress * 10;

  return (
    <div
      ref={ref}
      className="relative flex flex-col self-auto overflow-hidden antialiased py-24 bg-white"
      style={{ perspective: "1000px" }}
    >
      <Header />
      
      <div
        style={{
            transform: `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`,
            opacity: isNaN(opacity) ? 0 : opacity,
            willChange: 'transform, opacity'
        }}
      >
        <div className="flex flex-row-reverse space-x-reverse space-x-10 mb-10">
            {firstRow.map((product, idx) => (
            <ProductCard
                product={product}
                translate={translateX}
                key={"first-"+idx}
            />
            ))}
        </div>
        <div className="flex flex-row mb-10 space-x-10">
            {secondRow.map((product, idx) => (
            <ProductCard
                product={product}
                translate={-translateX} 
                key={"second-"+idx}
            />
            ))}
        </div>
        <div className="flex flex-row-reverse space-x-reverse space-x-10">
            {thirdRow.map((product, idx) => (
            <ProductCard
                product={product}
                translate={translateX}
                key={"third-"+idx}
            />
            ))}
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-16 px-4 w-full left-0 top-0 text-center">
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-2">
        TARINAMME
      </h1>
      <div className="w-32 h-1.5 bg-green-600 mx-auto rounded-full mb-12"></div>
      
      <div className="max-w-3xl mx-auto space-y-8 text-lg text-slate-600 font-medium leading-relaxed">
        <p>
          <strong className="text-slate-900">Rakennusliike Lambardos Oy</strong> ei ole vain yritys, se on perintö. 
          Juuremme ulottuvat 1900-luvun alkupuoliskolle, jolloin puuseppä <strong className="text-slate-900">Juho Nurmi</strong> valmisti käsityönä kulutus- ja käyttötuotteita.
        </p>
        <p>
          Nykymuotoinen yritys perustettiin vuonna 2011 jatkamaan tätä kunniakasta perinnettä. 
          Vaikka työkalut ovat vaihtuneet vasaroista laser-mittoihin, periksiantamaton asenne ja rakkaus lajiin ovat säilyneet ennallaan.
        </p>
        <p className="pt-4 text-xl md:text-2xl text-slate-800 italic font-serif border-l-4 border-green-600 pl-6 text-left">
          "Meille ei riitä 'ihan kiva'. Teemme työn niin, että voimme olla siitä ylpeitä vielä vuosienkin päästä."
        </p>
      </div>
    </div>
  );
};

const ProductCard = ({ product, translate }: { product: Product; translate: number }) => {
  return (
    <div
      style={{
        transform: `translateX(${translate}px)`,
      }}
      className="group/product h-72 w-[24rem] relative flex-shrink-0"
    >
      <div
        className="block group-hover/product:shadow-2xl bg-slate-100 rounded-xl overflow-hidden h-full w-full border border-slate-200 relative"
      >
        {/* Placeholder for image - Empty as requested */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-300 font-bold uppercase tracking-widest text-2xl">
            {/* Image Placeholder */}
        </div>
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-bold transition-opacity duration-300 pointer-events-none">
          {product.title}
        </h2>
      </div>
    </div>
  );
};

// --- PÄÄSIVUSTON OSAT ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navItems = [
    { id: 'project', label: 'Projektinhallinta' },
    { id: 'pricing', label: 'Hinnoittelu' },
    { id: 'contact', label: 'Yhteystiedot' },
  ];

  return (
    <nav className="sticky top-0 z-40 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo />
          </div>
          
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-slate-600 hover:text-slate-900 hover:text-green-600 text-sm font-bold uppercase tracking-wider transition-colors"
              >
                {item.label}
              </button>
            ))}
            {/* Puhelinnumero navissa */}
            <a 
              href="tel:0401234567"
              className="text-green-600 hover:text-green-700 font-mono font-black text-lg tracking-wide border border-green-600/20 bg-green-50 px-4 py-2 rounded transition-colors"
            >
              0401234567
            </a>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <a href="tel:0401234567" className="text-green-600 font-bold text-sm">040 123 4567</a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { scrollToSection(item.id); setIsOpen(false); }}
                className="block w-full text-left px-3 py-4 hover:bg-slate-50 text-slate-700 text-base font-medium uppercase"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const HeroSection = () => (
  // Wrapper luomaan taustan kortin alle.
  <div className="bg-white w-full pb-12 pt-24 sm:pt-28">
    <section 
      id="hero" 
      // Changed min-h-[40rem] to min-h-[35rem] and justify-center to justify-start to move content up
      className="min-h-[35rem] rounded-[2.5rem] flex flex-col items-start justify-start bg-slate-50 antialiased relative overflow-hidden border border-slate-200 shadow-xl w-full"
    >
      <Spotlight fill="black" fillOpacity={0.05} />
      
      {/* Punainen sävy vasemmassa yläkulmassa */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3 z-0"></div>

      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none"></div>

      {/* Content - Changed flex alignment and padding */}
      <div className="p-8 md:p-12 max-w-7xl mx-auto relative z-20 w-full flex flex-col items-start justify-start text-left pt-20 md:pt-32">
        
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
          Ammattilaisen kädenjälki <br />
          <span className="text-green-600 relative z-10">näkyy lopputuloksessa.</span>
        </h1>
        
        <p className="text-slate-600 text-lg max-w-md leading-relaxed mt-6">
           Toteutamme keittiö-, wc- ja komerokalusteiden asennukset uudis- ja perusparannuskohteisiin.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-start items-center mt-10">
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-[4px] transition-all duration-300 hover:scale-105 hover:shadow-md flex items-center gap-2 group shadow-lg"
          >
            Pyydä tarjous
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
             onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
             className="flex items-center gap-2 px-6 py-4 text-slate-900 font-medium hover:text-green-600 transition-colors"
          >
             <CheckCircle className="text-slate-900" size={20} />
             <span>Lue lisää meistä</span>
          </button>
        </div>
      </div>
    </section>
  </div>
);

// --- NEW GAME SECTION WITH 3D CARD ---
const GameSection = () => {
  return (
    <section className="py-24 bg-white flex flex-col items-center justify-center relative overflow-hidden">
       {/* Background decoration */}
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-white pointer-events-none"></div>

       <div className="text-center mb-12 px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Miksi valita ammattilainen?</h2>
          <p className="text-slate-600 max-w-xl mx-auto">Koska tee-se-itse -projekteissa yllätykset ovat harvoin positiivisia. Me hoidamme homman kerralla maaliin.</p>
       </div>
       
       <CardContainer className="inter-var">
         <CardBody className="bg-white relative group/card border-slate-200 w-[90vw] max-w-[30rem] h-auto rounded-xl p-6 border shadow-2xl hover:shadow-green-500/10">
           <CardItem translateZ={50} className="text-xl font-bold text-slate-900 mb-4 w-full text-center">
             Meille ei käy näin
           </CardItem>
           <CardItem translateZ={100} className="w-full mt-4">
             <div className="h-60 w-full rounded-xl overflow-hidden border border-slate-100 relative">
               <HeroGameLoop active={true} />
             </div>
           </CardItem>
           <div className="flex justify-between items-center mt-8">
             <CardItem translateZ={20} as="p" className="text-slate-500 text-sm max-w-[200px]">
                Vältä turha säätö, päänvaiva ja kaatuvat kaapit.
             </CardItem>
             <CardItem 
               translateZ={20} 
               as="button" 
               className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors" 
               onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
             >
               Ota yhteyttä
             </CardItem>
           </div>
         </CardBody>
       </CardContainer>
    </section>
  )
}

const AboutSection = () => {
  // Placeholder products for the parallax effect - Images removed as requested
  const products = [
    { title: "Historia", thumbnail: "" },
    { title: "Perinteet", thumbnail: "" },
    { title: "Laatu", thumbnail: "" },
    { title: "Ammattitaito", thumbnail: "" },
    { title: "Käsityö", thumbnail: "" },
    { title: "Kokemus", thumbnail: "" },
    { title: "Luotettavuus", thumbnail: "" },
    { title: "Tarkkuus", thumbnail: "" },
    { title: "Viimeistely", thumbnail: "" },
    { title: "Asenne", thumbnail: "" },
    { title: "Ylpeys", thumbnail: "" },
    { title: "Vastuu", thumbnail: "" },
    { title: "Takuu", thumbnail: "" },
    { title: "Palvelu", thumbnail: "" },
    { title: "Asiakas", thumbnail: "" },
  ];

  return (
    <section id="about" className="relative">
      <HeroParallax products={products} />
    </section>
  );
};

const ProjectSection = () => (
  <section id="project" className="py-24 bg-white border-t border-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
         <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-green-100 blur-3xl opacity-50 rounded-full"></div>
            <div className="relative bg-white border border-slate-200 rounded-xl p-8 shadow-2xl space-y-4">
               <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-400 text-xs font-mono ml-auto">LÄHDE Solutions v2.0</span>
               </div>
               <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between text-slate-600"><span className="text-green-600">✓</span> <span>Kohde: Asunto Oy Esimerkki</span> <span className="text-slate-400">10:00</span></div>
                  <div className="flex justify-between text-slate-600"><span className="text-green-600">✓</span> <span>Tuntikirjaus: Asennus</span> <span className="text-slate-400">2h 30min</span></div>
                  <div className="flex justify-between text-slate-600"><span className="text-green-600">✓</span> <span>Dokumentointi: Valmis</span> <span className="text-slate-400">OK</span></div>
                  <div className="w-full bg-slate-100 h-2 rounded mt-4 overflow-hidden">
                     <div className="w-3/4 bg-green-500 h-full"></div>
                  </div>
               </div>
            </div>
         </div>

         <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase mb-6">Moderni <br/><span className="text-green-600">Projektinhallinta</span></h2>
            <p className="text-lg text-slate-600 mb-8">
              Käytämme <span className="text-slate-900 font-bold">LÄHDE Solutionsin</span> projektinhallintajärjestelmää. Se takaa, että tieto kulkee ja vasara pysyy kädessä, eikä aika kulu puhelimessa roikkumiseen.
            </p>
            
            <ul className="space-y-6">
               {[
                 { title: "Reaaliaikainen tieto", desc: "Työmaalla on aina ajantasaiset kuvat ja ohjeet." },
                 { title: "Tarkka seuranta", desc: "Aukoton historiatieto ja täsmälliset tuntikirjaukset." },
                 { title: "Turvallisuus edellä", desc: "Työturvallisuus- ja Valttikortit aina mukana." }
               ].map((item, idx) => (
                 <li key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200">
                       <CheckCircle className="text-green-600" />
                    </div>
                    <div>
                       <h4 className="text-slate-900 font-bold uppercase">{item.title}</h4>
                       <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                 </li>
               ))}
            </ul>
         </div>
      </div>
    </div>
  </section>
);

const PricingSection = () => (
  <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-black text-slate-900 uppercase mb-6">Hinnoittelu</h2>
      <p className="text-xl text-slate-600 mb-12">
        Reilu peli, ei piilokuluja. Hinnoittelu perustuu sopimuksen mukaan joko urakka- tai tuntihinnoitteluun.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-green-500/50 transition-colors shadow-sm">
           <h3 className="text-2xl font-bold text-slate-900 uppercase mb-4">Urakka</h3>
           <p className="text-slate-500 mb-6">Sopii kohteisiin, joissa sisältö ja laajuus on tarkasti tiedossa etukäteen.</p>
           <div className="text-green-600 font-bold uppercase tracking-wider text-sm">Kiinteä hinta</div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-green-500/50 transition-colors shadow-sm">
           <h3 className="text-2xl font-bold text-slate-900 uppercase mb-4">Tuntityö</h3>
           <p className="text-slate-500 mb-6">Joustava malli saneerauskohteisiin tai muutostöihin.</p>
           <div className="text-green-600 font-bold uppercase tracking-wider text-sm">Tuntiveloitus</div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-white rounded-lg inline-block shadow-sm border border-slate-100">
         <p className="text-slate-900 font-bold mb-2">Suosimme sähköistä laskutusta</p>
         <p className="text-slate-500 text-sm">Se on nopeaa, varmaa ja ympäristöystävällistä.</p>
      </div>
    </div>
  </section>
);

const ContactSection = () => (
  <section id="contact" className="py-24 bg-green-50 relative">
    {/* Texture overlay */}
    <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
    
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-12 border border-slate-100">
        
        <div className="text-center mb-12">
           <h2 className="text-3xl font-black text-slate-900 uppercase mb-2">Ota yhteyttä</h2>
           <p className="text-slate-500">Vastaamme tiedusteluihin nopeasti.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-lg p-6 flex flex-col items-center text-center border border-slate-200 hover:border-green-500/50 transition-colors">
               <div className="bg-green-100 p-4 rounded-full mb-4">
                  <Phone className="text-green-600 w-8 h-8" />
               </div>
               <div className="text-xs text-slate-500 uppercase font-bold mb-1">Soita meille</div>
               <div className="text-slate-900 text-xl font-bold mb-1">040 123 4567</div>
               <div className="text-slate-500 text-sm">Juha Aarnilampi</div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 flex flex-col items-center text-center border border-slate-200 hover:border-green-500/50 transition-colors">
               <div className="bg-green-100 p-4 rounded-full mb-4">
                  <Mail className="text-green-600 w-8 h-8" />
               </div>
               <div className="text-xs text-slate-500 uppercase font-bold mb-1">Lähetä sähköpostia</div>
               <div className="text-slate-900 font-medium mb-1">info@lambardos.fi</div>
               <div className="text-slate-500 text-xs break-all">etunimi.sukunimi@lambardos.fi</div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 flex flex-col items-center text-center border border-slate-200 hover:border-green-500/50 transition-colors">
               <div className="bg-green-100 p-4 rounded-full mb-4">
                  <MapPin className="text-green-600 w-8 h-8" />
               </div>
               <div className="text-xs text-slate-500 uppercase font-bold mb-1">Tule käymään</div>
               <div className="text-slate-900 font-medium mb-1">Mäensyrjä 10</div>
               <div className="text-slate-500 text-sm">01900 Nurmijärvi</div>
            </div>
        </div>

      </div>
    </div>
  </section>
);

const Footer = ({ hasFloatingNav }: { hasFloatingNav: boolean }) => (
  <footer className={`bg-slate-50 border-t border-slate-200 py-12 text-center text-slate-500 text-sm rounded-t-[3rem] mx-auto mt-[-2rem] relative z-20 transition-all duration-300 ${hasFloatingNav ? 'pb-32' : 'pb-12'}`}>
    <div className="flex justify-center mb-4 opacity-80 hover:opacity-100 transition-opacity">
       <Logo />
    </div>
    <p className="mb-4">Rakennusliike Lambardos Oy - Laadukasta kalusteasennusta jo vuodesta 2011.</p>
    <div className="flex justify-center gap-4">
       <a href="#" className="hover:text-green-600">Tietosuojalauseke</a>
       <span>|</span>
       <a href="#" className="hover:text-green-600">Evästeasetukset</a>
    </div>
    <p className="mt-8 text-xs text-slate-400">© {new Date().getFullYear()} Rakennusliike Lambardos Oy</p>
  </footer>
);

// --- MAIN APP ---

const Index = () => {
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
        // Show floating nav after scrolling past hero (approx 500px)
        setShowFloatingNav(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const floatingNavItems = [
    { title: "Etusivu", icon: Home, href: "#hero" }, // Changed href to #hero to go top
    { title: "Kotisivu", icon: User, href: "#about" }, 
    { title: "Viesti", icon: MessageCircle, href: "#contact" }, 
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-green-500 selection:text-white overflow-x-hidden relative">
      <Navbar />
      <HeroSection />
      
      {/* Floating Dock Navigation */}
      <FloatingDock items={floatingNavItems} isVisible={showFloatingNav} />
      
      <GameSection />
      <AboutSection />
      <ProjectSection />
      <PricingSection />
      <ContactSection />
      <Footer hasFloatingNav={showFloatingNav} />
    </div>
  );
};

export default Index;
