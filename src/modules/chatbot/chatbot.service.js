/**
 * Chatbot service — rule-based FAQ engine.
 * RGPD compliant: no personal data stored, no sessions persisted.
 * Architecture ready to plug an AI API (OpenAI/Gemini) in `resolveWithAI()`.
 */

const RULES = [
  {
    patterns: ['bonjour', 'salut', 'hello', 'hi', 'bonsoir', 'bonne journée'],
    response: 'Bonjour ! 👋 Je suis l\'assistant Dynesis Tech. Comment puis-je vous aider ? Vous pouvez me poser des questions sur nos services, nos tarifs, ou comment nous contacter.'
  },
  {
    patterns: ['merci', 'thank', 'parfait', 'super', 'génial', 'excellent'],
    response: 'Avec plaisir ! 😊 N\'hésitez pas si vous avez d\'autres questions.'
  },
  {
    patterns: ['tarif', 'prix', 'coût', 'combien', 'pricing', 'abonnement', 'forfait', 'formule'],
    response: 'Nous proposons 3 formules principales :\n\n• **Site Vitrine** — à partir de 990€\n• **Blockchain & Web3** — à partir de 2 900€\n• **Application sur mesure** — sur devis selon votre projet\n\nConsultez notre page [Services](/services) pour plus de détails, ou [demandez un devis](/work-with-us).'
  },
  {
    patterns: ['vitrine', 'site web', 'site internet', 'présentation'],
    response: 'Notre formule **Site Vitrine** inclut : design moderne et responsive, intégration de contenu, formulaire de contact, référencement SEO de base et 3 mois de support. Prix à partir de 990€. Envie d\'en savoir plus ? [Demander un devis](/contact)'
  },
  {
    patterns: ['blockchain', 'web3', 'nft', 'smart contract', 'crypto'],
    response: 'Notre formule **Blockchain & Web3** couvre le développement de smart contracts, intégration Web3, tableaux de bord de suivi sur chaîne, et conseil en tokenomique. À partir de 2 900€. [Contactez-nous](/contact) pour discuter de votre projet.'
  },
  {
    patterns: ['application', 'app', 'mobile', 'saas', 'plateforme', 'api', 'backend', 'logiciel'],
    response: 'Nous développons des **applications sur mesure** : SaaS, applications mobiles, APIs, plateformes enterprise. Ces projets sont établis sur devis selon la complexité. [Décrivez votre projet](/work-with-us) et nous vous recontactons sous 24h.'
  },
  {
    patterns: ['contact', 'joindre', 'appeler', 'email', 'téléphone', 'rendez-vous', 'réunion'],
    response: 'Vous pouvez nous contacter via :\n\n📧 Email : [page contact](/contact)\n💬 Ce chatbot pour vos questions rapides\n📅 [Demander un appel de découverte](/contact)\n\nNous répondons sous 24h ouvrées.'
  },
  {
    patterns: ['délai', 'durée', 'temps', 'quand', 'livraison', 'deadline'],
    response: 'Les délais varient selon le projet :\n• Site vitrine : 2 à 4 semaines\n• Intégration blockchain : 4 à 8 semaines\n• Application sur mesure : 2 à 6 mois\n\nNous travaillons en méthode agile avec des jalons réguliers. [Discutons de votre projet](/contact) pour un planning précis.'
  },
  {
    patterns: ['technologie', 'stack', 'react', 'node', 'typescript', 'next'],
    response: 'Nos technologies principales :\n\n**Frontend** : React, Next.js, TypeScript, Vite\n**Backend** : Node.js, Express, Python, FastAPI\n**Bases de données** : MongoDB, PostgreSQL\n**Cloud** : AWS, GCP, Cloudinary\n**Blockchain** : Solidity, Ethers.js, Polygon\n**IA** : OpenAI, LangChain, HuggingFace'
  },
  {
    patterns: ['rgpd', 'confidentialité', 'données personnelles', 'privacy', 'gdpr'],
    response: '🔒 **Conformité RGPD** : Dynesis Tech prend la protection de vos données très au sérieux.\n\n• Ce chatbot ne stocke **aucune donnée personnelle**\n• Aucune session n\'est conservée\n• Vos messages sont traités uniquement pour générer une réponse\n• Notre politique de confidentialité complète est disponible sur demande'
  },
  {
    patterns: ['développeur', 'équipe', 'profil', 'qui', 'agence'],
    response: 'Dynesis Tech est une agence de développement logiciel spécialisée dans les solutions web modernes, blockchain et IA.\n\nNous avons une équipe de développeurs senior disponibles. Consultez [notre annuaire](/developers) pour voir les profils et disponibilités.'
  },
  {
    patterns: ['suivi', 'avancement', 'projet', 'progression', 'état'],
    response: 'Nos clients bénéficient d\'un **espace client sécurisé** avec :\n\n🔗 **Suivi blockchain** — chaque étape de votre projet est horodatée et hachée de manière cryptographique pour une traçabilité totale\n📊 Tableau de bord de progression\n📩 Messagerie directe avec l\'équipe\n\n[Créer un compte](/register) pour accéder à votre espace.'
  }
];

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

function matchRule(message) {
  const normalized = normalize(message);
  for (const rule of RULES) {
    if (rule.patterns.some((p) => normalized.includes(normalize(p)))) {
      return rule.response;
    }
  }
  return null;
}

const FALLBACK = 'Je n\'ai pas bien compris votre question. 🤔\n\nVoici ce que je peux vous aider :\n• Nos **tarifs et formules**\n• Les **délais** de réalisation\n• Nos **technologies**\n• Nous **contacter**\n\nOu [envoyez-nous un message](/contact) et un conseiller vous répondra rapidement.';

/**
 * Process a chatbot message and return a response.
 * @param {string} message - Raw user message (max 500 chars)
 * @returns {{ response: string, matched: boolean }}
 */
export function processChatbotMessage(message) {
  if (!message || typeof message !== 'string') {
    return { response: FALLBACK, matched: false };
  }

  const trimmed = message.slice(0, 500).trim();
  if (!trimmed) {
    return { response: FALLBACK, matched: false };
  }

  const response = matchRule(trimmed);
  if (response) {
    return { response, matched: true };
  }

  return { response: FALLBACK, matched: false };
}
