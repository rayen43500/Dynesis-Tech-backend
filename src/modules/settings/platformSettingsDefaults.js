/** Default platform settings — mirrors current hardcoded site values. */
export const platformSettingsDefaults = {
  singletonKey: 'platform',
  branding: {
    siteName: { en: 'Dynesis Tech', fr: 'Dynesis Tech' },
    tagline: { en: 'Premium Software Agency Platform', fr: 'Plateforme d\'agence logicielle premium' },
    logoUrl: '',
    logoMark: 'D'
  },
  contact: {
    email: 'contact@dynesis.tech',
    phone: '+1 (555) 245-0192',
    location: { en: 'Paris, France', fr: 'Paris, France' },
    hours: { en: 'Mon - Fri, 09:00 - 18:00', fr: 'Lun - Ven, 09:00 - 18:00' },
    about: {
      en: 'Premium software agency focused on human-centered digital products, reliable delivery, and long-term client collaboration.',
      fr: 'Agence logicielle premium spécialisée dans les produits numériques centrés sur l\'humain, une livraison fiable et une collaboration durable avec nos clients.'
    },
    locations: []
  },
  social: {
    x: '',
    linkedin: '',
    github: ''
  },
  copyright: { en: '© 2026 Dynesis Tech. All rights reserved.', fr: '© 2026 Dynesis Tech. Tous droits réservés.' },
  theme: {
    defaultMode: 'system',
    global: {
      light: {
        accent: '156 42% 35%',
        accent2: '156 42% 26%',
        bg: '0 0% 100%',
        surface: '210 40% 98%',
        text: '222 47% 11%',
        muted: '215 16% 47%',
        border: '214 32% 90%'
      },
      dark: {
        accent: '156 42% 43%',
        accent2: '156 42% 35%',
        bg: '220 22% 10%',
        surface: '220 18% 14%',
        text: '210 35% 92%',
        muted: '220 10% 70%',
        border: '220 16% 28%'
      }
    },
    home: {
      accent: '#2d6a4f',
      accentLight: '#d1e8dc',
      heroCardBg: '#2d5a1b',
      btnPrimary: '#1a1a1a',
      btnSecondary: '#ffffff',
      check: '#2d6a4f',
      star: '#f59e0b'
    }
  },
  homeContent: {
    hero: {
      headline1: { en: 'Premium Software,', fr: 'Logiciel premium,' },
      headline2: { en: 'Built for Your Growth.', fr: 'conçu pour votre croissance.' },
      subheading: {
        en: 'From strategy to launch, we deliver digital products that perform — built with precision, clarity, and zero compromise on quality.',
        fr: 'De la stratégie au lancement, nous livrons des produits numériques performants — avec précision, clarté et sans compromis sur la qualité.'
      },
      feature1: { en: 'Strategy-led delivery', fr: 'Livraison orientée stratégie' },
      feature2: { en: 'Experienced engineers', fr: 'Ingénieurs expérimentés' },
      feature3: { en: 'Enterprise-grade quality', fr: 'Qualité entreprise' },
      heroImage: '/images/hero-developer.png',
      techStack: ['HuggingFace', 'PyTorch', 'LangChain', 'OpenAI', 'AWS', 'FastAPI'],
      ctaPrimary: { en: 'Book a discovery call', fr: 'Réserver un appel découverte' },
      ctaPrimaryHref: '/contact',
      ctaSecondary: { en: 'Explore our platform', fr: 'Explorer notre plateforme' },
      ctaSecondaryHref: '/work-with-us',
      matchBadge: { en: '100% Match', fr: '100 % compatible' },
      featuredName: { en: 'Thomas R.', fr: 'Thomas R.' },
      featuredRole: { en: 'Senior Full Stack Engineer', fr: 'Ingénieur full stack senior' }
    },
    ratings: {
      score: '4.7',
      reviewCount: { en: '329 reviews', fr: '329 avis' }
    },
    testimonials: {
      heading: { en: 'Trusted by teams who value clarity', fr: 'Ils nous font confiance pour avancer avec clarté' },
      items: [
        {
          quote: {
            en: '"Dynesis brought structure and calm to a complex roadmap. We shipped on time with a level of quality our stakeholders noticed."',
            fr: '« Dynesis a apporté structure et sérénité à une feuille de route complexe. Nous avons livré dans les délais avec une qualité remarquée par nos parties prenantes. »'
          },
          name: { en: 'Olivia M.', fr: 'Olivia M.' },
          role: { en: 'Product Lead · SaaS', fr: 'Lead produit · SaaS' }
        },
        {
          quote: {
            en: '"Clear communication, strong design execution, and engineering rigor. The process felt enterprise-grade from day one."',
            fr: '« Communication claire, exécution design solide et rigueur technique. Le processus a été de niveau entreprise dès le premier jour. »'
          },
          name: { en: 'Daniel R.', fr: 'Daniel R.' },
          role: { en: 'CTO · Fintech', fr: 'CTO · Fintech' }
        },
        {
          quote: {
            en: '"They helped us move fast without sacrificing maintainability. The handover was clean and the codebase is a joy to extend."',
            fr: '« Ils nous ont permis d\'aller vite sans sacrifier la maintenabilité. La passation a été propre et la base de code est un plaisir à faire évoluer. »'
          },
          name: { en: 'Sofia A.', fr: 'Sofia A.' },
          role: { en: 'Engineering Manager · B2B', fr: 'Engineering Manager · B2B' }
        },
        {
          quote: {
            en: '"A premium partner. Discovery was sharp, estimates were transparent, and delivery was consistent week after week."',
            fr: '« Un partenaire premium. La phase de cadrage était précise, les estimations transparentes et la livraison constante semaine après semaine. »'
          },
          name: { en: 'Michael T.', fr: 'Michael T.' },
          role: { en: 'Founder · Startup', fr: 'Fondateur · Startup' }
        }
      ]
    },
    intro: {
      line1: { en: 'One platform to design,', fr: 'Une plateforme pour concevoir,' },
      line2: { en: 'build, and grow your product', fr: 'construire et faire grandir votre produit' }
    },
    scrollTabs: {
      design: {
        label: { en: 'Product Design & Build', fr: 'Design produit & développement' },
        tag: { en: 'PRODUCT DESIGN', fr: 'DESIGN PRODUIT' },
        headline1: { en: 'Design and ship products', fr: 'Concevez et livrez des produits' },
        headline2: { en: 'your users love', fr: 'que vos utilisateurs adorent' },
        c1: { en: 'UX research & wireframing', fr: 'Recherche UX & wireframes' },
        c2: { en: 'UI design & design systems', fr: 'Design UI & design systems' },
        c3: { en: 'Prototyping & user testing', fr: 'Prototypage & tests utilisateurs' },
        c4: { en: 'Handoff-ready Figma deliverables', fr: 'Livrables Figma prêts pour le handoff' },
        person: { en: 'Sarah Chen', fr: 'Sarah Chen' },
        role: { en: 'Lead Product Designer', fr: 'Lead designer produit' },
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
        tags: ['Figma', 'Design Systems'],
        learnHref: '/work-with-us'
      },
      development: {
        label: { en: 'Web & Mobile Development', fr: 'Développement web & mobile' },
        tag: { en: 'WEB & MOBILE', fr: 'WEB & MOBILE' },
        headline1: { en: 'Build fast, clean,', fr: 'Construisez vite, proprement,' },
        headline2: { en: 'production-ready apps', fr: 'des apps prêtes pour la production' },
        c1: { en: 'React, Next.js & Node.js', fr: 'React, Next.js & Node.js' },
        c2: { en: 'iOS & Android mobile apps', fr: 'Applications mobiles iOS & Android' },
        c3: { en: 'API design & backend systems', fr: 'Conception d\'API & systèmes backend' },
        c4: { en: 'Performance & scalability built-in', fr: 'Performance & scalabilité intégrées' },
        person: { en: 'Marcus Webb', fr: 'Marcus Webb' },
        role: { en: 'Senior Full-Stack Engineer', fr: 'Ingénieur full-stack senior' },
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
        tags: ['React', 'Node.js'],
        learnHref: '/developers'
      },
      transformation: {
        label: { en: 'Digital Transformation', fr: 'Transformation digitale' },
        tag: { en: 'DIGITAL TRANSFORMATION', fr: 'TRANSFORMATION DIGITALE' },
        headline1: { en: 'Evolve your business', fr: 'Faites évoluer votre entreprise' },
        headline2: { en: 'with modern digital systems', fr: 'avec des systèmes numériques modernes' },
        c1: { en: 'Legacy system modernization', fr: 'Modernisation de systèmes legacy' },
        c2: { en: 'Cloud architecture & DevOps', fr: 'Architecture cloud & DevOps' },
        c3: { en: 'Process automation & tooling', fr: 'Automatisation des processus & outillage' },
        c4: { en: 'Team training & technical upskilling', fr: 'Formation d\'équipe & montée en compétences' },
        person: { en: 'Elena Torres', fr: 'Elena Torres' },
        role: { en: 'Transformation Lead', fr: 'Lead transformation' },
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80',
        tags: ['AWS', 'DevOps'],
        learnHref: '/contact'
      }
    }
  },
  consultationAvailability: {
    enabled: true,
    timezone: 'UTC',
    config: {}
  }
};

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Deep-merge stored settings with defaults (defaults fill missing keys). */
export function mergeWithDefaults(stored) {
  if (!stored) return JSON.parse(JSON.stringify(platformSettingsDefaults));

  function merge(defaults, current) {
    if (Array.isArray(defaults)) {
      return Array.isArray(current) && current.length ? current : JSON.parse(JSON.stringify(defaults));
    }
    if (!isPlainObject(defaults)) {
      return current !== undefined && current !== null && current !== '' ? current : defaults;
    }
    const out = { ...defaults };
    for (const key of Object.keys(defaults)) {
      out[key] = merge(defaults[key], current?.[key]);
    }
    for (const key of Object.keys(current || {})) {
      if (!(key in out)) out[key] = current[key];
    }
    return out;
  }

  const merged = merge(platformSettingsDefaults, stored);
  merged.singletonKey = 'platform';
  return merged;
}
