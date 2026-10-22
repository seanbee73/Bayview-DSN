/**
 * Bayview Mall Creative Hair Dsn - Salon Knowledge Base & FAQ
 * This serves as the single source of truth for location, hours, services,
 * craftsmen, policies, and frequently asked customer questions.
 */

export interface SalonHoursItem {
  day: string;
  hours: string;
  isClosed: boolean;
}

export interface SalonServiceItem {
  name: string;
  price: string;
  duration?: string;
  description: string;
  stylistNote?: string;
}

export interface SalonFaqEntry {
  category: 'Hours & Location' | 'Barber Craft' | 'Styling & Color' | 'Appointments & Policies';
  question: string;
  answer: string;
}

export const SALON_INFO = {
  name: "Bayview Mall Creative Hair Dsn",
  tagline: "Old-World Italian Barber Craft & Contemporary Hair Design",
  established: "Over 15 years in North York",
  address: {
    street: "3285 Bayview Ave, Floor 1",
    mall: "Bayview-Cummer Shopping Centre",
    crossStreets: "Corner of Bayview Ave & Cummer Ave",
    city: "North York",
    province: "Ontario",
    postalCode: "M2K 0E6",
    locationDetail: "Floor 1 Plaza Location, directly accessible from parking level."
  },
  contact: {
    phone: "(416) 221-2321",
    phoneTel: "tel:4162212321",
    email: "info@bayviewcreativehair.com",
    bookingUrl: "#contact"
  },
  hours: [
    { day: "Sunday", hours: "Closed", isClosed: true },
    { day: "Monday", hours: "Closed", isClosed: true },
    { day: "Tuesday", hours: "9:00 AM – 6:30 PM", isClosed: false },
    { day: "Wednesday", hours: "9:00 AM – 6:30 PM", isClosed: false },
    { day: "Thursday", hours: "9:00 AM – 6:30 PM", isClosed: false },
    { day: "Friday", hours: "9:00 AM – 6:30 PM", isClosed: false },
    { day: "Saturday", hours: "8:30 AM – 5:00 PM", isClosed: false }
  ] as SalonHoursItem[],
  parking: {
    cost: "100% Free",
    types: "Extensive surface parking and covered mall parking",
    proximity: "Directly outside the Floor 1 entrance (less than 30 seconds walk)."
  },
  policies: {
    punctualityPromise: "Guaranteed On-Time Chairs: Clients with appointments are seated right at their reserved time with zero waiting.",
    walkIns: "Walk-ins are warmly welcomed subject to chair availability; booking in advance is recommended to avoid waiting.",
    familyFriendly: "Welcoming chairs for all ages—from young children's first cuts to respected senior grooming."
  },
  craftsmen: [
    {
      name: "Joe",
      role: "Master Barber & Owner",
      experience: "40+ Years of Traditional Italian Barbering",
      signaturePhilosophy: "A proper haircut is sculpted to fit your skull contour, cowlicks, and bone structure so it looks balanced every single day as it grows out over 4–6 weeks.",
      specialties: [
        "Pre-Cut Skull & Head Contour Assessment",
        "Shear-over-comb micro-tapering and weight balancing",
        "Classic gentlemen's scissor cuts",
        "Hot lather straight-razor neck finish",
        "Precision beard sculpting & hot towel care"
      ]
    },
    {
      name: "Roya",
      role: "Senior Creative Stylist",
      experience: "18+ Years in High-End Women's Hair Design",
      signaturePhilosophy: "Personalized hair styling should enhance natural movement, flatter individual face shapes, and be effortlessly maintainable at home.",
      specialties: [
        "Custom face-framing layers and debulking",
        "Dimensional balayage, highlights, and root refreshes",
        "Volumizing & smoothing blowouts",
        "Deep conditioning and scalp revitalization",
        "Bridal and special occasion styling"
      ]
    }
  ],
  services: [
    {
      name: "Men's Scissor Cut",
      price: "$30",
      description: "Pre-cut skull assessment, tailored scissor shaping, soft natural hairline feathering, and warm straight-razor neck finish with soothing balm.",
      stylistNote: "Sculpted by Master Barber Joe"
    },
    {
      name: "Women's Styling & Cut",
      price: "Consultation / from $45",
      description: "Custom consultation, tailored texture balancing, face-framing layers, and professional volumizing blowout.",
      stylistNote: "Styled by Senior Stylist Roya"
    },
    {
      name: "Kids & Senior Haircuts",
      price: "From $18",
      description: "Patient, gentle cuts for young boys and girls, alongside respected classic gentlemen scissor grooming for seniors.",
      stylistNote: "Gentle patience and classic care"
    },
    {
      name: "Beard Trim & Lineup",
      price: "$15",
      description: "Straight-razor or precision trimmer contouring with warm conditioning oils, hot towel finish, and clean cheek/jawlines.",
      stylistNote: "Master Barber Joe"
    },
    {
      name: "Wash & Deep Conditioning",
      price: "$12",
      description: "Invigorating scalp wash, restorative moisture mask treatment, and relaxing head massage prior to cutting or styling."
    },
    {
      name: "Custom Color & Highlights",
      price: "Inquire / Consultation",
      description: "Single-process root touch-up, dimensional foil highlights, balayage, or gloss toner tailored to your skin undertone.",
      stylistNote: "By Senior Stylist Roya"
    }
  ] as SalonServiceItem[]
};

export const SALON_FAQ_ITEMS: SalonFaqEntry[] = [
  {
    category: "Hours & Location",
    question: "What days and hours are you open?",
    answer: "We are open Tuesday through Friday from 9:00 AM to 6:30 PM, and Saturday from 8:30 AM to 5:00 PM. Please note that our salon is strictly CLOSED on Sundays and Mondays."
  },
  {
    category: "Hours & Location",
    question: "Where are you located and where should I park?",
    answer: "We are on Floor 1 of Bayview-Cummer Shopping Centre (3285 Bayview Ave, North York, ON M2K 0E6), at the corner of Bayview and Cummer. There is plenty of free surface and covered plaza parking right outside our entrance."
  },
  {
    category: "Appointments & Policies",
    question: "Do I need to make an appointment or can I walk in?",
    answer: "We welcome both! However, we strongly recommend booking an appointment to guarantee zero waiting time with our Guaranteed On-Time Chairs policy. Walk-ins are accommodated whenever an open chair is available."
  },
  {
    category: "Appointments & Policies",
    question: "How do I book an appointment?",
    answer: "You can book directly using the online booking form on our website, or call us directly at (416) 221-2321 during business hours (Tuesday–Saturday)."
  },
  {
    category: "Barber Craft",
    question: "What is Master Barber Joe's Pre-Cut Skull Assessment?",
    answer: "Before shears touch hair, Master Barber Joe physically feels your cranial contour—including flat spots, ridges, cowlicks, and growth whorls. Instead of buzzers that expose uneven head shapes, he sculpts with scissors so your haircut naturally balances your face and holds its shape 4 to 6 weeks as it grows out."
  },
  {
    category: "Barber Craft",
    question: "What does the Men's Scissor Cut include?",
    answer: "Our signature Men's Scissor Cut ($30) includes the pre-cut head contour assessment, custom scissor-over-comb sculpting, a warm lather straight-razor neck shave, and a soothing hot towel finish."
  },
  {
    category: "Styling & Color",
    question: "What services does Senior Stylist Roya provide?",
    answer: "Roya provides precision women's haircuts, face-framing layers, volumizing blowouts, dimensional color, balayage, foil highlights, root touch-ups, and restorative conditioning treatments."
  },
  {
    category: "Styling & Color",
    question: "Can I get a color consultation before committing?",
    answer: "Yes, Roya provides in-depth color consultations to assess your skin undertone, natural hair texture, and maintenance preferences before formulating your custom shade."
  }
];

/**
 * Generates the unified Markdown system knowledge prompt for Gemini AI
 */
export function getSalonKnowledgePrompt(): string {
  const hoursFormatted = SALON_INFO.hours
    .map(h => `* ${h.day}: ${h.isClosed ? '**CLOSED**' : h.hours}`)
    .join('\n');

  const servicesFormatted = SALON_INFO.services
    .map(s => `* **${s.name}** (${s.price}): ${s.description}${s.stylistNote ? ` [${s.stylistNote}]` : ''}`)
    .join('\n');

  const craftsmenFormatted = SALON_INFO.craftsmen
    .map(c => `### ${c.name} — ${c.role} (${c.experience})\n* **Philosophy**: "${c.signaturePhilosophy}"\n* **Specialties**: ${c.specialties.join(', ')}`)
    .join('\n\n');

  const faqFormatted = SALON_FAQ_ITEMS
    .map(f => `**Q: ${f.question}**\n**A:** ${f.answer}`)
    .join('\n\n');

  return `
# Bayview Mall Creative Hair Dsn — Verified Knowledge Base & FAQ

## Core Store Identity
* **Name**: ${SALON_INFO.name}
* **Heritage**: ${SALON_INFO.established} (${SALON_INFO.tagline})
* **Address**: ${SALON_INFO.address.street}, ${SALON_INFO.address.mall}, ${SALON_INFO.address.city}, ${SALON_INFO.address.province} ${SALON_INFO.address.postalCode} (${SALON_INFO.address.crossStreets})
* **Floor & Location**: ${SALON_INFO.address.locationDetail}
* **Phone**: ${SALON_INFO.contact.phone}
* **Parking**: ${SALON_INFO.parking.cost} — ${SALON_INFO.parking.types}, located ${SALON_INFO.parking.proximity}

## Official Operating Hours (STRICT SOURCE OF TRUTH)
${hoursFormatted}
**CRITICAL RULE**: The shop is strictly **CLOSED on Sundays and Mondays**. Never tell a customer the shop is open on Sunday or Monday under any circumstances.

## Core Customer Policies
* **${SALON_INFO.policies.punctualityPromise}**
* **${SALON_INFO.policies.walkIns}**
* **${SALON_INFO.policies.familyFriendly}**

## Master Craftsmen
${craftsmenFormatted}

## Complete Services Menu & Pricing
${servicesFormatted}

## Frequently Asked Questions
${faqFormatted}
`.trim();
}
