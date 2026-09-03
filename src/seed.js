import mongoose from 'mongoose';

import { env } from './config/env.js';
import { connectMongo } from './config/mongo.js';
import { HomepageConfig } from './modules/cms/models/HomepageConfig.model.js';
import { ClientProfile } from './modules/clients/models/ClientProfile.model.js';
import { DeveloperProfile } from './modules/developers/models/DeveloperProfile.model.js';
import { Inquiry } from './modules/inquiries/models/Inquiry.model.js';
import { Message } from './modules/messages/models/Message.model.js';
import { Project } from './modules/projects/models/Project.model.js';
import { Quote } from './modules/quotes/models/Quote.model.js';
import { Service } from './modules/services/models/Service.model.js';
import { PlatformSettings } from './modules/settings/models/PlatformSettings.model.js';
import { platformSettingsDefaults } from './modules/settings/platformSettingsDefaults.js';
import { User } from './modules/users/models/User.model.js';
import { Notification } from './modules/notifications/models/Notification.model.js';
import { DeveloperTask } from './modules/developer-work/models/DeveloperTask.model.js';
import { Pricing } from './modules/pricing/models/Pricing.model.js';
import { Blog } from './modules/blog/models/Blog.model.js';
import { hashPassword } from './shared/security/password.js';

const DEFAULT_ADMIN_EMAIL = 'admin@dynesis.tech';
const DEFAULT_ADMIN_PASSWORD = 'Admin123456!';
const DEFAULT_CLIENT_EMAIL = 'client@dynesis.tech';
const DEFAULT_CLIENT_PASSWORD = 'Client123456!';
const DEFAULT_DEVELOPER_EMAIL = 'developer@dynesis.tech';
const DEFAULT_DEVELOPER_PASSWORD = 'Developer123456!';
const DEFAULT_PM_EMAIL = 'pm@dynesis.tech';
const DEFAULT_PM_PASSWORD = 'Pm123456!';

const localized = (en, fr = en) => ({ en, fr });

async function seedAdminUser() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || (env.NODE_ENV === 'production' ? '' : DEFAULT_ADMIN_EMAIL);
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || (env.NODE_ENV === 'production' ? '' : DEFAULT_ADMIN_PASSWORD);
  const adminDisplayName = process.env.SEED_ADMIN_DISPLAY_NAME || 'Dynesis Admin';

  if (!adminEmail || !adminPassword) {
    console.log('Skipping admin seed: set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD.');
    return null;
  }

  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    existing.role = 'admin';
    existing.displayName = existing.displayName || adminDisplayName;
    existing.isActivated = true;
    if (env.NODE_ENV !== 'production' || process.env.SEED_ADMIN_PASSWORD) {
      existing.passwordHash = await hashPassword(adminPassword);
    }
    await existing.save();
    console.log(`Admin ready: ${adminEmail}`);
    return existing;
  }

  const admin = await User.create({
    email: adminEmail,
    role: 'admin',
    displayName: adminDisplayName,
    isActivated: true,
    passwordHash: await hashPassword(adminPassword)
  });

  console.log(`Admin created: ${adminEmail}`);
  return admin;
}

async function seedPlatformSettings() {
  await PlatformSettings.findOneAndUpdate(
    { singletonKey: 'platform' },
    { $set: platformSettingsDefaults },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Platform settings seeded.');
}

async function seedServices() {
  const services = [
    {
      title: localized('Product Strategy', 'Strategie produit'),
      shortDescription: localized(
        'Shape product direction, prioritize the roadmap, and turn early ideas into buildable scopes.',
        'Cadrez la direction produit, priorisez la roadmap et transformez les idees en perimetres realisables.'
      ),
      supportingTags: ['Discovery', 'Roadmapping', 'Product audits'],
      highlight: true,
      ordering: 10,
      cta: {
        label: localized('Plan a strategy call', 'Planifier un appel strategie'),
        href: '/contact',
        actionType: 'link'
      }
    },
    {
      title: localized('Web & Mobile Development', 'Developpement web et mobile'),
      shortDescription: localized(
        'Build reliable React, Node.js, and mobile applications with clean architecture and strong delivery practices.',
        'Construisez des applications React, Node.js et mobiles fiables avec une architecture propre.'
      ),
      supportingTags: ['React', 'Node.js', 'Mobile apps'],
      highlight: true,
      ordering: 20,
      cta: {
        label: localized('Start a build', 'Lancer un projet'),
        href: '/work-with-us',
        actionType: 'link'
      }
    },
    {
      title: localized('AI & Automation', 'IA et automatisation'),
      shortDescription: localized(
        'Automate internal workflows, add AI-assisted features, and connect business tools into one system.',
        'Automatisez les workflows internes, ajoutez des fonctionnalites IA et connectez vos outils metier.'
      ),
      supportingTags: ['OpenAI', 'Automation', 'Integrations'],
      highlight: false,
      ordering: 30,
      cta: {
        label: localized('Explore automation', 'Explorer l automatisation'),
        href: '/services',
        actionType: 'link'
      }
    }
  ];

  for (const service of services) {
    await Service.findOneAndUpdate(
      { 'title.en': service.title.en },
      { $set: { ...service, visible: true } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Services seeded: ${services.length}`);
}

async function seedDevelopers() {
  const developers = [
    {
      fullName: 'Maya Laurent',
      roleTitle: 'Senior Product Engineer',
      location: 'Paris, France',
      biography: localized(
        'Maya helps teams move from product ambiguity to polished web applications with strong UX and maintainable code.',
        'Maya aide les equipes a passer de l ambiguite produit a des applications web soignees et maintenables.'
      ),
      photo: '/images/hero-developer.png',
      memberSince: new Date('2024-02-01'),
      expertiseTags: ['React', 'Node.js', 'Product UX', 'Design Systems'],
      previousCompanies: [{ name: 'Finova Labs' }, { name: 'Northstar SaaS' }],
      experience: [
        {
          company: 'Finova Labs',
          role: 'Lead Frontend Engineer',
          startYear: 2021,
          endYear: 2024,
          bullets: ['Led dashboard rebuilds for fintech operations teams.', 'Improved release quality with component testing.'],
          technologies: ['React', 'TypeScript', 'Node.js']
        }
      ],
      education: [{ school: 'Epitech Paris', degree: 'Software Engineering', year: 2018 }],
      skills: [
        { name: 'React', years: 7 },
        { name: 'Node.js', years: 6 },
        { name: 'Product Strategy', years: 5 }
      ],
      portfolio: [
        {
          title: 'Fintech Operations Portal',
          description: 'A role-based dashboard for risk, payments, and support workflows.',
          technologies: ['React', 'Node.js', 'MongoDB'],
          category: 'SaaS'
        }
      ],
      yearsOfExperience: 8,
      availabilityStatus: 'available',
      highlightedExpertise: 'Product-led full-stack delivery',
      technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      categories: ['Web App', 'SaaS'],
      ordering: 10,
      homepageAccent: {
        accentColor: '#2d6a4f',
        glowColor: 'rgba(45, 106, 79, 0.24)',
        gradientTheme: 'product'
      }
    },
    {
      fullName: 'Adam Ben Salem',
      roleTitle: 'AI Automation Architect',
      location: 'Tunis, Tunisia',
      biography: localized(
        'Adam designs AI-assisted systems that reduce manual work while staying practical, observable, and secure.',
        'Adam concoit des systemes assistes par IA qui reduisent le travail manuel tout en restant fiables et securises.'
      ),
      photo: '',
      memberSince: new Date('2023-09-15'),
      expertiseTags: ['OpenAI', 'Python', 'FastAPI', 'Workflow Automation'],
      previousCompanies: [{ name: 'Atlas Cloud' }, { name: 'MedFlow' }],
      experience: [
        {
          company: 'Atlas Cloud',
          role: 'Automation Architect',
          startYear: 2020,
          endYear: 2023,
          bullets: ['Built internal AI assistants for operations teams.', 'Integrated CRM, support, and analytics workflows.'],
          technologies: ['Python', 'FastAPI', 'OpenAI', 'AWS']
        }
      ],
      education: [{ school: 'INSAT Tunis', degree: 'Computer Science', year: 2017 }],
      skills: [
        { name: 'Python', years: 8 },
        { name: 'AI Automation', years: 4 },
        { name: 'Cloud Architecture', years: 6 }
      ],
      portfolio: [
        {
          title: 'Support Automation Engine',
          description: 'A triage and response assistant connected to CRM and ticketing systems.',
          technologies: ['OpenAI', 'FastAPI', 'PostgreSQL'],
          category: 'Automation'
        }
      ],
      yearsOfExperience: 9,
      availabilityStatus: 'limited',
      highlightedExpertise: 'AI workflows for operational teams',
      technologies: ['Python', 'OpenAI', 'FastAPI', 'AWS'],
      categories: ['AI', 'Automation'],
      ordering: 20,
      homepageAccent: {
        accentColor: '#1f7a8c',
        glowColor: 'rgba(31, 122, 140, 0.22)',
        gradientTheme: 'automation'
      }
    }
  ];

  const seededDevelopers = [];

  for (const developer of developers) {
    const seeded = await DeveloperProfile.findOneAndUpdate(
      { fullName: developer.fullName },
      { $set: { ...developer, availability: developer.availabilityStatus !== 'unavailable', visible: true, verifiedBadge: true } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    seededDevelopers.push(seeded);
  }

  console.log(`Developers seeded: ${seededDevelopers.length}`);
  return seededDevelopers;
}

async function seedHomepage(developers) {
  const featuredDevelopers = developers.map((developer, index) => ({
    developerId: developer._id,
    accentColor: developer.homepageAccent?.accentColor || '',
    glowColor: developer.homepageAccent?.glowColor || '',
    gradientTheme: developer.homepageAccent?.gradientTheme || '',
    featuredMode: index === 0 ? 'primary' : 'default',
    heroShortDescription: localized(developer.highlightedExpertise),
    highlightedExpertise: developer.highlightedExpertise,
    cta: {
      label: localized('View profile', 'Voir le profil'),
      href: `/developers/${developer._id}`,
      actionType: 'link'
    }
  }));

  await HomepageConfig.findOneAndUpdate(
    { ordering: 0 },
    {
      $set: {
        enabled: true,
        visible: true,
        ordering: 0,
        hero: {
          title: localized('Dynesis Tech'),
          subtitle: localized('Senior software teams for ambitious digital products', 'Equipes logicielles seniors pour produits numeriques ambitieux'),
          description: localized(
            'Plan, design, and ship web, mobile, and AI-powered products with a team built for clarity and execution.',
            'Planifiez, concevez et livrez des produits web, mobiles et IA avec une equipe orientee clarte et execution.'
          ),
          ctas: [
            { label: localized('Book a discovery call', 'Reserver un appel decouverte'), href: '/contact', actionType: 'link' },
            { label: localized('Meet developers', 'Voir les developpeurs'), href: '/developers', actionType: 'link' }
          ],
          theme: {
            accentColor: '#2d6a4f',
            glowColor: 'rgba(45, 106, 79, 0.2)',
            gradientTheme: 'agency',
            featuredMode: 'primary',
            floatingExpertiseTags: ['React', 'Node.js', 'OpenAI', 'AWS']
          }
        },
        accentTheme: {
          accentColor: '#2d6a4f',
          glowColor: 'rgba(45, 106, 79, 0.2)',
          gradientTheme: 'agency',
          featuredMode: 'primary',
          floatingExpertiseTags: ['Strategy', 'Design', 'Engineering']
        },
        featuredDevelopers
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Homepage config seeded.');
}

async function seedDemoClientAndProject(adminUser) {
  let clientUser = await User.findOne({ email: DEFAULT_CLIENT_EMAIL }).select('+passwordHash');

  if (clientUser) {
    clientUser.role = 'client';
    clientUser.isActivated = true;
    if (env.NODE_ENV !== 'production') {
      clientUser.passwordHash = await hashPassword(DEFAULT_CLIENT_PASSWORD);
    }
    await clientUser.save();
  } else {
    clientUser = await User.create({
      email: DEFAULT_CLIENT_EMAIL,
      role: 'client',
      displayName: 'Demo Client',
      isActivated: true,
      passwordHash: await hashPassword(DEFAULT_CLIENT_PASSWORD),
      createdBy: adminUser?._id || null
    });
  }

  let developerUser = await User.findOne({ email: DEFAULT_DEVELOPER_EMAIL }).select('+passwordHash');
  if (developerUser) {
    developerUser.role = 'developer';
    developerUser.isActivated = true;
    if (env.NODE_ENV !== 'production') {
      developerUser.passwordHash = await hashPassword(DEFAULT_DEVELOPER_PASSWORD);
    }
    await developerUser.save();
  } else {
    developerUser = await User.create({
      email: DEFAULT_DEVELOPER_EMAIL,
      role: 'developer',
      displayName: 'Demo Developer',
      isActivated: true,
      passwordHash: await hashPassword(DEFAULT_DEVELOPER_PASSWORD),
      createdBy: adminUser?._id || null
    });
  }

  let pmUser = await User.findOne({ email: DEFAULT_PM_EMAIL }).select('+passwordHash');
  if (pmUser) {
    pmUser.role = 'project_manager';
    pmUser.isActivated = true;
    if (env.NODE_ENV !== 'production') {
      pmUser.passwordHash = await hashPassword(DEFAULT_PM_PASSWORD);
    }
    await pmUser.save();
  } else {
    pmUser = await User.create({
      email: DEFAULT_PM_EMAIL,
      role: 'project_manager',
      displayName: 'Demo Project Manager',
      isActivated: true,
      passwordHash: await hashPassword(DEFAULT_PM_PASSWORD),
      createdBy: adminUser?._id || null
    });
  }

  const clientProfile = await ClientProfile.findOneAndUpdate(
    { userId: clientUser._id },
    {
      $set: {
        companyName: 'Northstar Retail',
        contactName: 'Olivia Martin',
        contactEmail: DEFAULT_CLIENT_EMAIL,
        phone: '+1 (555) 245-0192',
        location: 'New York, USA',
        officeLocations: ['New York', 'Remote'],
        visible: true
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const project = await Project.findOneAndUpdate(
    { clientId: clientProfile._id, title: 'Customer Portal Modernization' },
    {
      $set: {
        clientId: clientProfile._id,
        projectManagerId: pmUser._id,
        assignedDeveloperIds: [developerUser._id],
        title: 'Customer Portal Modernization',
        status: 'active',
        paymentStatus: 'unpaid',
        consultationNotes: 'Demo project seeded for the client dashboard.',
        roadmap: [
          { title: 'Discovery and architecture', order: 10, completed: true },
          { title: 'Design system and core flows', order: 20, completed: false },
          { title: 'Pilot release', order: 30, completed: false }
        ],
        milestones: [
          { title: 'Prototype review', dueDate: new Date('2026-08-15'), status: 'planned', notes: 'Review authenticated flows.' },
          { title: 'Beta launch', dueDate: new Date('2026-09-12'), status: 'planned', notes: 'Limited release for selected customers.' }
        ],
        activityTimeline: [
          { eventType: 'kickoff', message: 'Project kickoff completed.' },
          { eventType: 'roadmap', message: 'Roadmap approved by client.' }
        ]
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await DeveloperTask.findOneAndUpdate(
    { projectId: project._id, title: 'Implement authentication flows' },
    {
      $set: {
        projectId: project._id,
        assigneeId: developerUser._id,
        reporterId: pmUser._id,
        title: 'Implement authentication flows',
        description: 'Build login, registration, and password reset screens.',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date('2026-08-01'),
        estimatedHours: 16,
        checklist: [
          { label: 'Login page', completed: true },
          { label: 'Registration flow', completed: false },
          { label: 'Password reset', completed: false }
        ]
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await DeveloperTask.findOneAndUpdate(
    { projectId: project._id, title: 'Design system tokens' },
    {
      $set: {
        projectId: project._id,
        assigneeId: developerUser._id,
        reporterId: pmUser._id,
        title: 'Design system tokens',
        description: 'Define color, spacing, and typography tokens.',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2026-08-10'),
        estimatedHours: 8
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Notification.findOneAndUpdate(
    { userId: clientUser._id, title: 'Project kickoff completed' },
    {
      $set: {
        userId: clientUser._id,
        type: 'project',
        title: 'Project kickoff completed',
        body: 'Your Customer Portal Modernization project has started.',
        link: '/dashboard/client/projects'
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Demo client ready: ${DEFAULT_CLIENT_EMAIL}`);
  console.log(`Demo developer ready: ${DEFAULT_DEVELOPER_EMAIL}`);
  console.log(`Demo project manager ready: ${DEFAULT_PM_EMAIL}`);
  return clientUser;
}

async function seedRequests(clientUser) {
  await Quote.findOneAndUpdate(
    { email: 'olivia@northstar.example', projectType: 'Web application' },
    {
      $set: {
        projectType: 'Web application',
        budget: '$25k - $50k',
        timeline: '3 months',
        description: 'Modernize our customer portal with better onboarding, billing, and support workflows.',
        name: 'Olivia Martin',
        email: 'olivia@northstar.example',
        company: 'Northstar Retail',
        wantsDiscoveryCall: true,
        status: 'reviewed',
        adminNotes: 'Good fit for product strategy plus web development.',
        userId: clientUser?._id || null
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Inquiry.findOneAndUpdate(
    { 'clientInfo.email': 'samir@atlas.example', projectType: 'AI automation' },
    {
      $set: {
        projectType: 'AI automation',
        budgetRange: '$10k - $25k',
        timeline: '6-8 weeks',
        projectDetails: localized(
          'We want to automate support triage and summarize customer issues before human review.',
          'Nous voulons automatiser le tri support et resumer les problemes clients avant revue humaine.'
        ),
        clientInfo: {
          name: 'Samir Haddad',
          email: 'samir@atlas.example',
          company: 'Atlas Services',
          phone: '+216 55 123 456',
          location: 'Tunis, Tunisia'
        },
        status: 'contacted',
        consultationNotes: 'Seed inquiry for admin workflow testing.'
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Message.findOneAndUpdate(
    { email: 'hello@brightpath.example', subject: 'Partnership inquiry' },
    {
      $set: {
        name: 'Nora James',
        email: 'hello@brightpath.example',
        phone: '+1 (555) 019-2200',
        company: 'BrightPath',
        subject: 'Partnership inquiry',
        message: 'We are exploring a long-term development partner for a new analytics product.',
        isGuest: true,
        status: 'new'
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Demo requests seeded.');
}

async function seedPricing() {
  const count = await Pricing.countDocuments();
  if (count > 0) {
    console.log(`Pricing: ${count} plans already exist, skipping.`);
    return;
  }

  await Pricing.insertMany([
    {
      name: 'Site Vitrine',
      description: 'Idéal pour présenter votre activité en ligne avec un site professionnel, rapide et responsive.',
      price: '990€',
      priceNote: '/ projet',
      category: 'vitrine',
      highlighted: false,
      ctaLabel: 'Démarrer mon projet',
      ctaHref: '/contact',
      ctaType: 'contact',
      badgeLabel: '',
      features: [
        { label: 'Design moderne & responsive', included: true },
        { label: 'Jusqu\'à 8 pages', included: true },
        { label: 'Formulaire de contact', included: true },
        { label: 'SEO de base', included: true },
        { label: '3 mois de support', included: true },
        { label: 'Hébergement inclus', included: false },
        { label: 'E-commerce', included: false }
      ],
      visible: true,
      order: 1
    },
    {
      name: 'Blockchain & Web3',
      description: 'Pour les projets nécessitant traçabilité, smart contracts et intégration Web3.',
      price: '2 900€',
      priceNote: '/ projet',
      category: 'blockchain',
      highlighted: true,
      ctaLabel: 'Discuter de mon projet',
      ctaHref: '/contact',
      ctaType: 'contact',
      badgeLabel: 'Populaire',
      features: [
        { label: 'Smart contracts Solidity', included: true },
        { label: 'Intégration Ethereum / Polygon', included: true },
        { label: 'Tableau de bord de suivi blockchain', included: true },
        { label: 'Authentification Web3', included: true },
        { label: '6 mois de support', included: true },
        { label: 'Audit de sécurité smart contract', included: true },
        { label: 'Tokenomique & conseil', included: false }
      ],
      visible: true,
      order: 2
    },
    {
      name: 'Application sur mesure',
      description: 'Plateformes SaaS, applications mobiles, APIs complexes — nous construisons votre vision.',
      price: 'Sur devis',
      priceNote: 'selon le projet',
      category: 'custom',
      highlighted: false,
      ctaLabel: 'Obtenir un devis',
      ctaHref: '/contact',
      ctaType: 'quote',
      badgeLabel: 'Premium',
      features: [
        { label: 'Architecture sur mesure', included: true },
        { label: 'Application web / mobile', included: true },
        { label: 'API REST / GraphQL', included: true },
        { label: 'Intégration IA & automatisation', included: true },
        { label: 'Support dédié prioritaire', included: true },
        { label: 'SLA personnalisé', included: true },
        { label: 'Formation équipe client', included: true }
      ],
      visible: true,
      order: 3
    }
  ]);

  console.log('Pricing: 3 plans seeded.');
}

async function seedBlog() {
  const removed = await Blog.deleteOne({ slug: 'handoff-figma-vers-code-sans-perte-en-ligne' });
  if (removed.deletedCount) {
    console.log('Blog: removed example article handoff-figma-vers-code-sans-perte-en-ligne');
  }

  const count = await Blog.countDocuments();
  if (count > 0) {
    console.log(`Blog: ${count} article(s) already exist, skipping.`);
    return;
  }

  const now = new Date();
  const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

  await Blog.insertMany([
    {
      slug: 'design-produit-que-les-equipes-peuvent-livrer',
      title: localized(
        'Product design your teams can actually ship',
        'Un design produit que vos équipes peuvent vraiment livrer'
      ),
      excerpt: localized(
        'From research to handoff, a product design process that keeps engineering, brand and users on the same page.',
        'De la recherche au handoff, un process design qui aligne ingénierie, marque et utilisateurs.'
      ),
      content: localized(
        'Great product design is not a layer of polish at the end. It starts with how people actually work, what they need to decide, and what engineering can ship without friction.\n\nWe map journeys, test early, and hand off Figma files that developers can trust. The result is a product that looks considered and behaves clearly, from first click to launch.',
        'Un bon design produit n’est pas une couche de finition. Il part de la façon dont les gens travaillent, de ce qu’ils doivent décider, et de ce que l’ingénierie peut livrer sans friction.\n\nNous cartographions les parcours, testons tôt, et transmettons des fichiers Figma fiables pour les développeurs. Le résultat : un produit soigné, clair du premier clic jusqu’au lancement.'
      ),
      authorName: 'Dynesis Tech',
      categories: ['Design produit & développement'],
      tags: ['Product Design & Build', 'UX', 'UI'],
      coverImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=80',
      published: true,
      publishedAt: daysAgo(18),
      seo: {
        metaTitle: localized('Product design your teams can actually ship', 'Un design produit que vos équipes peuvent vraiment livrer'),
        metaDescription: localized(
          'A product design process from research to developer handoff.',
          'Un process de design produit, de la recherche au handoff développeur.'
        )
      }
    },
    {
      slug: 'apps-web-et-mobile-pretes-pour-la-production',
      title: localized(
        'Web and mobile apps built for production, not demos',
        'Des apps web et mobile pensées pour la prod, pas pour la démo'
      ),
      excerpt: localized(
        'React, native mobile and solid APIs: how we ship fast products that stay maintainable after launch.',
        'React, mobile natif et APIs solides : comment nous livrons des produits rapides qui restent maintenables après le lancement.'
      ),
      content: localized(
        'A demo that impresses in a meeting is not the same as a product that holds up in production. We build web and mobile applications with a stack you can own: clear architecture, tested APIs, and performance baked in from the first sprint.\n\nWhether it is a SaaS dashboard, a customer app or both, we keep the codebase readable so your team can keep shipping after we leave.',
        'Une démo qui impressionne en réunion n’est pas un produit qui tient en production. Nous construisons des applications web et mobile avec une stack que vous pouvez maîtriser : architecture claire, APIs testées, performance dès le premier sprint.\n\nSaaS, app client ou les deux : le code reste lisible pour que votre équipe continue à livrer après notre départ.'
      ),
      authorName: 'Dynesis Tech',
      categories: ['Développement web & mobile'],
      tags: ['Web & Mobile Development', 'React', 'Mobile'],
      coverImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=80',
      published: true,
      publishedAt: daysAgo(12),
      seo: {
        metaTitle: localized('Web and mobile apps built for production', 'Des apps web et mobile pensées pour la prod'),
        metaDescription: localized(
          'How we ship production-ready web and mobile applications.',
          'Comment nous livrons des applications web et mobile prêtes pour la production.'
        )
      }
    },
    {
      slug: 'transformer-l-entreprise-sans-casser-l-existant',
      title: localized(
        'Digital transformation that does not break what already works',
        'Une transformation digitale qui ne casse pas ce qui marche déjà'
      ),
      excerpt: localized(
        'Modernise legacy systems, move to the cloud and automate the tedious work without freezing the business for six months.',
        'Moderniser l’existant, passer au cloud et automatiser le travail répétitif, sans geler l’activité pendant six mois.'
      ),
      content: localized(
        'Transformation fails when it tries to replace everything at once. We start with the systems people depend on every day, then introduce cloud, automation and better tooling in slices the organisation can absorb.\n\nThe goal is not a slide deck. It is teams who work faster, with fewer workarounds, and a technical foundation that can grow.',
        'La transformation échoue quand on veut tout remplacer d’un coup. Nous partons des systèmes dont les équipes dépendent chaque jour, puis nous introduisons cloud, automatisation et meilleurs outils par étapes absorbables.\n\nL’objectif n’est pas un PowerPoint. C’est des équipes plus rapides, moins de contournements, et une base technique qui peut grandir.'
      ),
      authorName: 'Dynesis Tech',
      categories: ['Transformation digitale'],
      tags: ['Digital Transformation', 'Cloud', 'Automation'],
      coverImageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1400&q=80',
      published: true,
      publishedAt: daysAgo(7),
      seo: {
        metaTitle: localized('Digital transformation that does not break what works', 'Une transformation digitale qui ne casse pas l’existant'),
        metaDescription: localized(
          'How we modernise systems without freezing the business.',
          'Comment nous modernisons les systèmes sans geler l’activité.'
        )
      }
    }
  ]);

  console.log('Blog: 3 articles seeded.');
}

async function main() {
  await connectMongo();

  const adminUser = await seedAdminUser();
  await seedPlatformSettings();
  await seedServices();
  const developers = await seedDevelopers();
  await seedHomepage(developers);
  const clientUser = await seedDemoClientAndProject(adminUser);
  await seedRequests(clientUser);
  await seedPricing();
  await seedBlog();

  console.log('Database seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
