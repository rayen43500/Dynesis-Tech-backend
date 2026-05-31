function pickLocalized(obj, lang) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  const v = obj[lang] ?? obj.en ?? obj.fr ?? '';
  return typeof v === 'string' ? v : '';
}

function formatExperienceYears(startYear, endYear) {
  const start = startYear ?? '';
  const end = endYear === 'Present' || endYear === null || endYear === undefined ? 'Present' : endYear;
  if (start === '' && end === 'Present') return '';
  if (start === '') return String(end);
  return `${start} – ${end}`;
}

export function mapAvailability(status, availabilityBool) {
  if (typeof availabilityBool === 'boolean') {
    return availabilityBool ? 'Available' : 'Unavailable';
  }
  if (!status) return 'Unknown';
  const s = String(status);
  if (s === 'available') return 'Available';
  if (s === 'limited') return 'Limited Availability';
  if (s === 'unavailable') return 'Unavailable';
  return 'Unknown';
}

export function getDeveloperPhoto(dev) {
  return dev.photo || dev.profileImage?.secureUrl || '';
}

export function mapDirectoryItem(dev, lang = 'en') {
  const bio = pickLocalized(dev.biography, lang);
  const previous = dev.previousCompanies?.[0];

  return {
    id: dev._id.toString(),
    fullName: dev.fullName,
    roleTitle: dev.roleTitle,
    verified: dev.verifiedBadge !== false,
    location: dev.location || '',
    yearsOfExperience: dev.yearsOfExperience ?? 0,
    availabilityStatus: mapAvailability(dev.availabilityStatus, dev.availability),
    expertiseSummary: dev.highlightedExpertise || bio,
    shortDescription: bio.slice(0, 140),
    biography: bio,
    expertiseTags: dev.expertiseTags || [],
    technologies: dev.technologies || [],
    profileImage: getDeveloperPhoto(dev),
    previouslyAt: previous?.name || '',
    companyLogo: previous?.logo || ''
  };
}

export function mapProfile(dev, lang = 'en') {
  const bio = pickLocalized(dev.biography, lang);
  const memberSince = dev.memberSince
    ? new Date(dev.memberSince).toLocaleString('en-US', { month: 'long', year: 'numeric' })
    : '';

  return {
    id: dev._id.toString(),
    fullName: dev.fullName,
    roleTitle: dev.roleTitle,
    verified: dev.verifiedBadge !== false,
    location: dev.location || '',
    memberSince,
    yearsOfExperience: dev.yearsOfExperience ?? 0,
    availabilityStatus: mapAvailability(dev.availabilityStatus, dev.availability),
    expertiseSummary: dev.highlightedExpertise || bio,
    shortDescription: bio.slice(0, 140),
    biography: bio,
    expertiseTags: dev.expertiseTags || [],
    technologies: dev.technologies || [],
    profileImage: getDeveloperPhoto(dev),
    previousCompanies: dev.previousCompanies || [],
    education: dev.education || [],
    skillYears: (dev.skills || []).map((s) => ({ skill: s.name, years: s.years })),
    experienceTimeline: (dev.experience || []).map((item) => ({
      company: item.company,
      role: item.role,
      years: formatExperienceYears(item.startYear, item.endYear),
      bullets: item.bullets || [],
      technologies: item.technologies || []
    })),
    portfolioProjects: (dev.portfolio || []).map((p) => ({
      id: p._id.toString(),
      title: p.title,
      categoryPills: p.category ? [p.category] : [],
      technologies: p.technologies || [],
      images: p.images || [],
      overview: p.overview || p.description || '',
      brief: p.brief || '',
      challenges: p.challenges || '',
      solutions: p.solutions || '',
      outcomes: p.outcomes || ''
    }))
  };
}

export function parseJsonField(value, fallback = {}) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
