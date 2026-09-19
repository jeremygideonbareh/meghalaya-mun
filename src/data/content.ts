/**
 * All site content. Sources, checked 19 Sep 2026:
 *  - Instagram @meghalaya_mun: bio, highlights and the latest 12 posts
 *  - The official MMUN_26 brochure linked from their Linktree (24 pages)
 *  - Linktree: WhatsApp community, itinerary and brochure links
 *
 * The brochure was printed for dates of 21–23 Aug 2026; the Instagram bio
 * (newer) gives 4–6 Sept 2026, and posts from 13 Sept onwards thank partners
 * for the "successful conduct" of the conference. So the 7th edition has
 * happened, and the site speaks about it in that light.
 *
 * Anything not confirmed is marked DEMO PLACEHOLDER.
 */

export const org = {
  name: 'Meghalaya Model United Nations',
  short: 'MMUN',
  handle: 'meghalaya_mun',
  instagram: 'https://www.instagram.com/meghalaya_mun/',
  facebook: 'https://www.facebook.com/meghalayamun',
  whatsappCommunity: 'https://chat.whatsapp.com/BnEe4Rcp6pPDEQOIl6sJ8G',
  brochure: 'https://pdf.ac/3dMQcK1cv',
  itinerary: 'https://bit.ly/4cty2Ys',
  email: 'meghalayamun@gmail.com',
  registered: 'A registered entity under MCA, Government of India',
  lines: 'Youth Events · Projects · Consultancy',
  followers: 4779,
}

export const edition = {
  number: 7,
  title: '7th International Shillong Edition',
  dates: '4–6 September 2026',
  venue: 'Shillong College',
  city: 'Shillong, Meghalaya',
  status: 'Concluded',
  next: 'The 8th edition',
}

export const theme = {
  words: [
    {
      word: 'Renovar',
      meaning: 'Renewal',
      body: 'Updating institutions and policies so they can meet the crises of today.',
      image: 'dignitaries',
    },
    {
      word: 'Renasci',
      meaning: 'Rebirth',
      body: 'Personal and collective transformation: the delegate who walks out is not the one who walked in.',
      image: 'award-stole',
    },
    {
      word: 'Renascentia',
      meaning: 'A whole new era',
      body: 'The processes that create lasting revival, built through dialogue, diplomacy and consensus.',
      image: 'delegate-placard',
    },
  ],
  motto: 'Think globally. Debate strategically. Act responsibly.',
}

export const manifesto =
  'Meghalaya Model United Nations is a youth organisation educating the young people of Meghalaya, and of Northeast India, about the issues shaping the world, through dialogue and discussion built on the processes and ideals of the United Nations.'

export const stats = [
  { value: 950, suffix: '+', label: 'Delegates at the 2025 edition, national and international' },
  { value: 7, suffix: 'th', label: 'International edition, held in Shillong' },
  { value: 8, suffix: '', label: 'Committees in session over three days' },
  { value: 12, suffix: '', label: 'Districts of Meghalaya, all backing MMUN' },
  { value: 2, suffix: 'nd', label: 'MUN in the Northeast with UNIC collaboration status' },
  { value: 50, suffix: '+', label: 'Media mentions across Meghalaya' },
]

export type Committee = {
  code: string
  name: string
  kind: 'un' | 'india' | 'press'
  body: string
  /** card and placard colours; every committee has its own */
  tint: string
}

export const committees: Committee[] = [
  {
    code: 'UNHRC',
    name: 'United Nations Human Rights Council',
    kind: 'un',
    tint: 'bg-card text-ink',
    body: 'Established in 2006 to replace the UN Commission on Human Rights, its 47 member states address violations, conduct investigations and review every country through the Universal Periodic Review.',
  },
  {
    code: 'UNODC',
    name: 'United Nations Office on Drugs and Crime',
    kind: 'un',
    tint: 'bg-sky text-ink',
    body: 'Founded in 1997, it leads the world on illicit drugs, organised crime, corruption and terrorism, from trafficking and cybercrime to violence against vulnerable groups.',
  },
  {
    code: 'DISEC',
    name: 'Disarmament and International Security Committee',
    kind: 'un',
    tint: 'bg-orange text-ink',
    body: 'The UN General Assembly’s First Committee, facing nuclear disarmament, arms control, cyber security and peacekeeping, and the threats that cross every border.',
  },
  {
    code: 'UNSC',
    name: 'United Nations Security Council',
    kind: 'un',
    tint: 'bg-pine text-white',
    body: 'Fifteen members, five with the veto, holding primary responsibility for international peace and security: to investigate, to impose sanctions and to authorise force.',
  },
  {
    code: 'AIPPM',
    name: 'All India Political Parties Meet',
    kind: 'india',
    tint: 'bg-ink text-white',
    body: 'Where India’s political parties meet on issues of national importance. Famous for its slogans and satire, and open to debate in both English and Hindi.',
  },
  {
    code: 'JPC',
    name: 'Joint Parliamentary Committee',
    kind: 'india',
    tint: 'bg-orange-deep text-white',
    body: 'An ad hoc committee of the Lok Sabha and Rajya Sabha that investigates a matter of national importance, from financial irregularities to corporate misconduct.',
  },
  {
    code: 'UNCSW',
    name: 'UN Commission on the Status of Women',
    kind: 'un',
    tint: 'bg-peach text-ink',
    body: 'The principal global body for gender equality and the empowerment of women, documenting realities and shaping standards worldwide.',
  },
  {
    code: 'IPC',
    name: 'International Press Corps',
    kind: 'press',
    tint: 'bg-mint text-ink',
    body: 'Journalists, photographers and reporters who cover every committee, conducting interviews and publishing the story of the conference as it unfolds.',
  },
]

export const speaker = {
  name: 'Shri F. G. Kharshiing',
  honorific: 'Retd. IPS',
  role: 'Expert Guest Speaker, UNODC',
  image: 'speaker-kharshiing',
  lines: [
    'Mission Director of DREAM, the Drug Reduction, Elimination and Action Mission of the Government of Meghalaya.',
    'Thirty-five years in law enforcement: Superintendent of Police, DIG and Inspector General of Police, CID.',
    'The first officer from Meghalaya to serve with the United Nations in peacekeeping: Mozambique, 1994, and Kosovo, 2005.',
  ],
}

// Every photo appears once on the page: the hero and theme chapter have
// their own, and the gallery gets the rest.
export const heroSlides = [
  { image: 'refugee-challenge', alt: 'A delegate honoured on stage in front of the MUN Refugee Challenge backdrop' },
  { image: 'podium-address', alt: 'A speaker addresses the conference from the podium' },
  { image: 'award-certificate', alt: 'A delegate receives a certificate on stage' },
  { image: 'stage-group', alt: 'Delegates and guests gathered on the conference stage' },
]

export const gallery: { image: string; caption: string }[] = [
  { image: 'hands-up', caption: 'A motion carries' },
  { image: 'placard-thailand', caption: 'Kingdom of Thailand, UNHRC' },
  { image: 'committee-room', caption: 'In committee' },
  { image: 'keynote', caption: 'From the podium' },
  { image: 'rapporteur', caption: 'The rapporteur' },
  { image: 'arrival', caption: 'Guests arrive' },
  { image: 'celebration', caption: 'Closing ceremony' },
  { image: 'drafting', caption: 'Drafting clauses' },
  { image: 'bureau', caption: 'The bureau' },
  { image: 'placard-jpc', caption: 'JPC, in character' },
  { image: 'anthem', caption: 'Rising for the anthem' },
  { image: 'resolution', caption: 'Working papers' },
  { image: 'speaker-blue', caption: 'Moderated caucus' },
  { image: 'chair-guest', caption: 'Guest of the bureau' },
  { image: 'chairs-debate', caption: 'Chairs in debate' },
  { image: 'committee-floor', caption: 'The committee floor' },
  { image: 'voting', caption: 'Placards up' },
  { image: 'session', caption: 'A session in progress' },
]

export const recognitions = [
  {
    title: 'UNHCR MUN Refugee Challenge',
    body: 'The conference is part of the UNHCR MUN Refugee Challenge, adding a refugee lens to every delegate’s work.',
  },
  {
    title: 'UN Information Centre for India and Bhutan',
    body: 'The first MUN in the state, and the second in the Northeast, to be granted collaboration status with UNIC, with UN permission to use its logos at past conferences.',
  },
  {
    title: 'Meghalaya Legislative Assembly',
    body: 'Collaboration with the Assembly, and constant support from its Speaker and Secretariat.',
  },
  {
    title: 'Office of the Chief Minister',
    body: 'Supported by the Office of the Chief Minister of Meghalaya and other ministers of the state government.',
  },
  {
    title: 'North Eastern Hill University',
    body: 'The 2025 edition of MMUN was recognised and supported by NEHU, and by the Department and Directorate of Sports and Youth Affairs.',
  },
  {
    title: 'Election Commission programmes',
    body: 'Partnered with the Chief Electoral Officer of Meghalaya on SVEEP and voter awareness, and part of the talks on the Meghalaya Youth Policy and YESS Meghalaya.',
  },
]

// Partners of the 7th International Shillong Edition, from their Instagram posts
export const partners: { group: string; names: string[] }[] = [
  { group: 'Official partners', names: ['Government of Meghalaya', 'Meghalaya Legislative Assembly', 'Directorate of Sports & Youth Affairs'] },
  { group: 'Associate partners', names: ['DREAM Meghalaya', 'Meghalaya AIDS Control Society'] },
  { group: 'Collaboration & venue', names: ['Shillong College'] },
  { group: 'Accommodation', names: ['Meghalaya Administrative Training Institute', 'Institute of Hotel Management Shillong', 'Hotel Yalana'] },
  { group: 'Food & catering', names: ['Le Dolce Patisserie & Co.'] },
  { group: 'Media', names: ['4Front Media', 'NE Media Hub'] },
  { group: 'Printing', names: ['Megha Print Xpress', 'The Roots (Ki Thied Tynrai)'] },
]

// From the brochure's registration page (7th edition). Next edition's terms
// are DEMO PLACEHOLDER until announced.
export const registration = {
  fee: 1899,
  note: 'Per delegate, for institution-based delegations. Accommodation extra.',
  covers: [
    'Personalised delegate kit and conference material',
    'Lunch and high tea on every day',
    'Travel between venue and accommodation',
    'Entry to the social and cultural nights',
    'Committee passes for faculty advisors and family',
  ],
  extras: [
    'Outstation delegates: round trip from Khanapara to the venue',
    'Institutions sending 40+ delegates get free transport',
    'Twin sharing or dormitory rooms available',
  ],
  nextEdition: 'The 8th edition will be announced on our WhatsApp community first.',
}

export const awards = [
  { group: 'Delegation', names: ['Best Delegation', 'Best Institution'] },
  { group: 'Committee', names: ['Best Delegate', 'High Commendation', 'Special Mention'] },
  { group: 'Ambassadors', names: ['Best Campus Ambassador', 'Most Promising Ambassador'] },
]

// Meet the team. Names and roles come from the brochure's contact page; the
// Campus Ambassador programme and its perks from the "CA PERKS" highlight.
// Add more members (and photos) here as the secretariat shares them.
export const team = [
  {
    name: 'Palki Kashyap',
    role: 'Secretary General',
    group: 'Secretariat',
    initials: 'PK',
    tint: 'bg-un text-white',
    about: 'The Secretary General heads the secretariat and speaks for the conference, from committees and partners to every delegate’s experience.',
  },
  {
    name: 'Md. Rezaul Islam',
    role: 'Chef de Cabinet',
    group: 'Secretariat',
    initials: 'RI',
    tint: 'bg-orange text-ink',
    about: 'The Chef de Cabinet runs the secretariat day to day, coordinating the committees, the logistics and the team behind them.',
  },
  {
    name: 'Campus Ambassadors',
    role: 'Across Meghalaya and beyond',
    group: 'Programme',
    initials: 'CA',
    tint: 'bg-pine text-white',
    about: 'Ambassadors bring MMUN to their schools and colleges, with weekly incentives, monthly awards, custom certificates and reduced delegate fees.',
  },
]

export const contacts = [
  { name: 'Palki Kashyap', role: 'Secretary General', phone: '+91 93659 22781', tel: '+919365922781' },
  { name: 'Md. Rezaul Islam', role: 'Chef de Cabinet', phone: '+91 75780 95386', tel: '+917578095386' },
]

export const chapters = [
  { id: 'top', label: 'Prologue' },
  { id: 'manifesto', label: 'Who we are' },
  { id: 'world', label: 'One world' },
  { id: 'theme', label: 'The theme' },
  { id: 'numbers', label: 'In numbers' },
  { id: 'committees', label: 'Committees' },
  { id: 'speaker', label: 'Guest speaker' },
  { id: 'team', label: 'The team' },
  { id: 'frames', label: 'In frames' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'partners', label: 'Partners' },
  { id: 'placard', label: 'Your placard' },
  { id: 'join', label: 'Join' },
]
