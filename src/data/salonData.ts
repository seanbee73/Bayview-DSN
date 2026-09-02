import {
  BrandInfo,
  AnnouncementInfo,
  HeroInfo,
  HeritageInfo,
  ServicesInfo,
  FeaturedQuote,
  CraftsmenInfo,
  LookbookInfo,
  ReviewsInfo,
  HoursAndLocationInfo,
  FooterInfo,
  SalonPost,
} from '../types';

export const BRAND_DATA: BrandInfo = {
  name: "Bayview Mall Creative Hair Dsn",
  shortName: "Bayview Mall Creative Hair",
  tag: "Barber & Salon · North York",
  logoInitials: "BM",
  phone: "(416) 221-2321",
  phoneTel: "tel:4162212321",
  address: "3285 Bayview Ave",
  plazaLocation: "Floor 1 · Bayview-Cummer Shopping Centre (at Cummer Ave)",
  postalCity: "North York, ON M2K 0E6",
  plusCode: "QJR5+H5 North York, Ontario",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bayview+Mall+Creative+Hair+Dsn+3285+Bayview+Ave+North+York+ON+M2K+0E6",
  appointmentNote: "Appointments recommended. Walk-ins accommodated when available."
};

export const ANNOUNCEMENT_DATA: AnnouncementInfo = {
  show: true,
  badge: "Community Favorite",
  text: "“Old world Italian barber, great hair cut. A true craftsman.”",
  subtext: "Serving North York families for over 15 years at Bayview-Cummer Shopping Centre."
};

export const HERO_DATA: HeroInfo = {
  badge: "Floor 1 · Bayview-Cummer Shopping Centre",
  headlinePrefix: "Old-World Craft.",
  headlineAccent: "Timeless Style.",
  description: "Decades of traditional Italian barber precision meets personalized contemporary hair styling for men, women, and children. Led by Master Barber Joe in North York.",
  heroImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80",
  ratingScore: "4.7",
  reviewCountText: "(63 Google Reviews)",
  stat1Number: "15+",
  stat1Label: "Years in Plaza",
  stat2Number: "4.7 ★",
  stat2Label: "Google Rated",
  stat3Number: "100%",
  stat3Label: "Free Parking"
};

export const HERITAGE_DATA: HeritageInfo = {
  tag: "The Heritage",
  title: "Authentic Craft. Personal Care.",
  paragraph1: "Bayview Mall Creative Hair Dsn was founded on an enduring standard of Italian barbering: that every haircut should be sculpted with scissors, shaped to the unique contour of your skull, and delivered with genuine care.",
  quote: "“He actually took his time and analyzed my head before cutting it. Best haircut I’ve ever had.”",
  quoteAuthor: "Barat K., Verified Google Review",
  pillars: [
    {
      id: "p1",
      title: "Old-World Italian Barbering",
      description: "Decades of hands-on shear mastery. True scissor sculpting tailored to your growth patterns rather than rushed clipper cuts.",
      iconName: "scissors"
    },
    {
      id: "p2",
      title: "Head-Shape Analysis",
      description: "Joe studies your head shape, hair density, and lifestyle before cutting to guarantee your style grows out smoothly and naturally.",
      iconName: "userCheck"
    },
    {
      id: "p3",
      title: "Family & All Generations",
      description: "Extremely patient, warm, and gentle with young boys and children, while providing modern styling for students, adults, and seniors.",
      iconName: "smile"
    },
    {
      id: "p4",
      title: "Punctual & Stress-Free",
      description: "Always on time with zero unnecessary waiting. Convenient first-floor mall location with ample free plaza parking.",
      iconName: "clock"
    }
  ]
};

export const SERVICES_DATA: ServicesInfo = {
  tag: "Menu & Offerings",
  title: "Creative Hair & Barber Services",
  subtitle: "Reasonable & Honest Pricing",
  priceSubtitle: "Reasonable & Honest Pricing",
  signatureServices: [
    {
      id: "s1",
      title: "Men's Scissor Cut",
      subtitle: "Precision Italian scissor sculpting",
      price: "From $20",
      badge: "Signature Cut",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
      description: "Precision shear work, head contour analysis, neckline taper, and clean finish tailored to your lifestyle.",
      features: [
        "Head contour analysis",
        "Hot lather neck line cleanup",
        "Natural grow-out scissor shaping"
      ]
    },
    {
      id: "s2",
      title: "Women's Styling & Cut",
      subtitle: "Custom blowouts & face framing",
      price: "Consultation",
      badge: "Salon Styling",
      image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",
      description: "Tailored cuts, professional blowouts, texture balancing, and dimensional styling for women of all hair types.",
      features: [
        "Custom face-framing cuts",
        "Volumizing & smoothing blowout",
        "Layered dimensional structure"
      ]
    },
    {
      id: "s3",
      title: "Kids & Senior Haircuts",
      subtitle: "Gentle patience & classic grooming",
      price: "From $18",
      badge: "Family Care",
      image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=800&q=80",
      description: "Gentle, patient haircutting for boys and young children, alongside respected classic grooming for seniors.",
      features: [
        "Patient approach with children",
        "Classic gentlemen scissor trims",
        "Senior discount accommodations"
      ]
    }
  ],
  additionalServices: [
    {
      id: "as1",
      title: "Beard Trim & Lineup",
      name: "Beard Trim & Lineup",
      price: "$15",
      description: "Straight-razor or trimmer shaping with warm conditioning oil."
    },
    {
      id: "as2",
      title: "Wash & Deep Conditioning",
      name: "Wash & Deep Conditioning",
      price: "$12",
      description: "Invigorating scalp wash, revitalizing treatment, and styling prep."
    },
    {
      id: "as3",
      title: "Custom Color & Highlights",
      name: "Custom Color & Highlights",
      price: "Inquire",
      description: "Single process, root touch-up, or dimensional highlights with Roya."
    }
  ]
};

export const FEATURED_QUOTE: FeaturedQuote = {
  quote: "“Walking out of his shop, ladies who previously ignored me wanted to know me better... if you know what I mean. Joe skillfully turned an average guy into a movie star.”",
  author: "Sorin Finchelstein",
  badge: "Google Review · Bayview-Cummer Regular"
};

const CRAFTSMEN_LIST = [
  {
    id: "st1",
    name: "Joe",
    role: "Master Barber & Shop Owner",
    subtitle: "40+ Years of Craftsmanship",
    experienceBadge: "40+ Years Craft",
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=1000&q=80",
    quote: "Cutting hair isn't just cutting length; it's balancing the face and head so it looks natural every single day.",
    bio: "Trained in traditional Italian barbering, Joe is celebrated across North York for his patient manner, encyclopedic scissor skill, and uncanny ability to craft cuts that look even better weeks after leaving his chair.",
    highlights: [
      "Specialist in scissor-over-comb and head contouring",
      "Beloved by families for gentle patience with kids",
      "Zero rush philosophy: punctual, attentive, and honest"
    ],
    specialties: [
      "Italian Scissor-Over-Comb",
      "Head Contour Analysis",
      "Kids Haircuts",
      "Classic Tapers",
      "Beard Lineups"
    ]
  },
  {
    id: "st2",
    name: "Roya",
    role: "Senior Hair Stylist & Color Specialist",
    subtitle: "Precision Women's & Men's Styling",
    experienceBadge: "Senior Stylist",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1000&q=80",
    quote: "Hair should feel effortless and move with life, shaped specifically to your natural texture and daily routine.",
    bio: "Collaborating alongside Joe for years, Roya provides expert women’s cuts, blowouts, vibrant dimension, and delicate styling that makes regular clients feel pampered and radiant.",
    highlights: [
      "Expertise in women’s layering, blowouts & volumizing",
      "Custom color consultations and root touch-ups",
      "Warm, attentive care for teens, moms, and seniors"
    ],
    specialties: [
      "Women's Layered Cuts",
      "Signature Blowouts",
      "Root Touch-Ups",
      "Dimensional Color",
      "Texture Softening"
    ]
  }
];

export const CRAFTSMEN_DATA: CraftsmenInfo = {
  tag: "Master Craftsmen",
  title: "Crafted by Hand. Refined by Decades.",
  description: "Unlike franchise express shops that rush clients through in 10 minutes with clippers, Joe and Roya bring European salon discipline and genuine old-world hospitality to every client.",
  stylists: CRAFTSMEN_LIST,
  craftsmen: CRAFTSMEN_LIST
};

export const LOOKBOOK_DATA: LookbookInfo = {
  tag: "Style Archive",
  title: "Craftsmanship in Detail",
  subtitle: "Hover to pause · Click to inspect",
  items: [
    {
      id: "look-1",
      title: "Classic Scissor Taper",
      tag: "Old World Italian",
      category: "Old World Italian",
      src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",
      image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",
      alt: "Classic scissor cut and refined taper",
      description: "Clean scissor-over-comb graduation on the sides with soft natural flow on top, tailored to crown growth patterns.",
      technique: "Scissor-over-comb & edge razor cleanup",
      maintenance: "4–5 weeks",
      suitability: "All face shapes, ideal for professional & daily wear"
    },
    {
      id: "look-2",
      title: "Precision Styling & Blowout",
      tag: "Women's Styling",
      category: "Women's Styling",
      src: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80",
      image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80",
      alt: "Smooth blowout and layered styling",
      description: "Long fluid layers that eliminate heavy bulk while preserving length and creating effortless natural movement.",
      technique: "Point cutting & round-brush tension blowout",
      maintenance: "6–8 weeks",
      suitability: "Medium to long hair seeking bounce and shine"
    },
    {
      id: "look-3",
      title: "Head-Shape Tailored Cut",
      tag: "Craftsman Precision",
      category: "Craftsman Precision",
      src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
      alt: "Master barber haircutting and grooming",
      description: "Meticulously balanced to the client's bone structure, creating symmetry and effortless morning styling.",
      technique: "Pre-cut skull assessment & shear texture balancing",
      maintenance: "3–4 weeks",
      suitability: "Men wanting sharp definition without severe clipper scalp exposure"
    },
    {
      id: "look-4",
      title: "Gentlemen's Executive Cut",
      tag: "Barber Shop",
      category: "Barber Shop",
      src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80",
      image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80",
      alt: "Classic groomed hair and side part",
      description: "Refined gentlemen's silhouette with defined part line, graduated temples, and neat neckline.",
      technique: "Hand shears, comb graduation & hot towel neck finish",
      maintenance: "4 weeks",
      suitability: "Business, academic, and timeless classic styling"
    },
    {
      id: "look-5",
      title: "Dimensional Tone & Cut",
      tag: "Salon Styling",
      category: "Salon Styling",
      src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80",
      image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80",
      alt: "Salon styling and vibrant layered hair",
      description: "Subtle multi-tonal richness combined with texturizing for soft fullness and healthy radiance.",
      technique: "Custom formulation & precision framing",
      maintenance: "6–10 weeks",
      suitability: "Those wanting subtle enhancement and glossy texture"
    },
    {
      id: "look-6",
      title: "Traditional Neck Shave & Trim",
      tag: "Grooming",
      category: "Grooming",
      src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
      alt: "Barbershop tools and scissor craft",
      description: "The hallmark of Italian barbering: clean hairline finishing with blade precision and soothing care.",
      technique: "Straight razor finish with soothing balm",
      maintenance: "2–3 weeks",
      suitability: "Any haircut upgrade for a truly crisp edge"
    }
  ]
};

const REVIEWS_LIST = [
  {
    id: "rev-1",
    author: "Barat Kaeini",
    badge: "8 reviews · 1 photo",
    reviewerBadge: "8 reviews · 1 photo",
    rating: 5,
    timeAgo: "9 months ago",
    date: "9 months ago",
    category: "Expert Barber",
    text: "Joe is a very skilled barber. He’s a very caring and nice guy, he actually took his time and analyzed my head before cutting it. Best haircut I’ve ever had 👍🏻",
    content: "Joe is a very skilled barber. He’s a very caring and nice guy, he actually took his time and analyzed my head before cutting it. Best haircut I’ve ever had 👍🏻",
    highlightTags: ["Expert Barber", "Head-Shape Analysis", "Caring"]
  },
  {
    id: "rev-2",
    author: "Arian Ahmadi",
    badge: "Local Guide · 24 reviews · 40 photos",
    reviewerBadge: "Local Guide · 24 reviews",
    rating: 5,
    timeAgo: "9 months ago",
    date: "9 months ago",
    category: "Cleanliness",
    text: "I just recently went for a haircut, Joe is extremely friendly and professional, great experience. I would come back for sure. Great atmosphere and really clean.",
    content: "I just recently went for a haircut, Joe is extremely friendly and professional, great experience. I would come back for sure. Great atmosphere and really clean.",
    highlightTags: ["Cleanliness", "Friendly Staff", "Professional"]
  },
  {
    id: "rev-3",
    author: "Alain Beauregard",
    badge: "Local Guide · 100 reviews · 52 photos",
    reviewerBadge: "Local Guide · 100 reviews",
    rating: 5,
    timeAgo: "a year ago",
    date: "1 year ago",
    category: "Punctuality",
    text: "Haven't been going here for a long time but since I've been getting my hair cut here, I arrive 2 to 3 minutes before my appointment and not once did I have to wait. Joe is always on time and his prices are very reasonable and of course, not to mention, such a nice guy!! :-)",
    content: "Haven't been going here for a long time but since I've been getting my hair cut here, I arrive 2 to 3 minutes before my appointment and not once did I have to wait. Joe is always on time and his prices are very reasonable and of course, not to mention, such a nice guy!! :-)",
    highlightTags: ["Punctuality", "Reasonable Pricing", "Friendly Staff"]
  },
  {
    id: "rev-4",
    author: "Sorin Finchelstein",
    badge: "4 reviews",
    reviewerBadge: "Verified Client",
    rating: 5,
    timeAgo: "2 years ago",
    date: "2 years ago",
    category: "Styling",
    text: "Classy and yet cozy! Skillfully using his scissors, Joe turned a very average-looking guy into a movie star. Walking out of his shop, ladies who previously ignored me wanted to know me better... if you know what I mean.",
    content: "Classy and yet cozy! Skillfully using his scissors, Joe turned a very average-looking guy into a movie star. Walking out of his shop, ladies who previously ignored me wanted to know me better... if you know what I mean.",
    highlightTags: ["Styling", "Scissor Precision", "Transformation"]
  },
  {
    id: "rev-5",
    author: "Jason Russell",
    badge: "Local Guide · 25 reviews",
    reviewerBadge: "Local Guide · 25 reviews",
    rating: 5,
    timeAgo: "3 years ago",
    date: "3 years ago",
    category: "Haircut",
    text: "The shop is clean and the staff are friendly. Joe is a great barber. He listens to what the customer wants and makes sure they are happy with the results. Prices are also very reasonable and they can do pretty much whatever you request.",
    content: "The shop is clean and the staff are friendly. Joe is a great barber. He listens to what the customer wants and makes sure they are happy with the results. Prices are also very reasonable and they can do pretty much whatever you request.",
    highlightTags: ["Haircut", "Cleanliness", "Friendly Staff"]
  },
  {
    id: "rev-6",
    author: "Melissa-Dawn Bessey",
    badge: "Local Guide · 253 reviews · 693 photos",
    reviewerBadge: "Local Guide · 253 reviews",
    rating: 5,
    timeAgo: "9 years ago",
    date: "9 years ago",
    category: "Friendly Staff",
    text: "Love the owner Joe, he is just great with boys and men's cuts! Always friendly and always patient and kind with children as well.",
    content: "Love the owner Joe, he is just great with boys and men's cuts! Always friendly and always patient and kind with children as well.",
    highlightTags: ["Friendly Staff", "Kids Haircuts", "Patience"]
  },
  {
    id: "rev-7",
    author: "Eva M.",
    badge: "6 reviews · 5 photos",
    reviewerBadge: "6 reviews",
    rating: 5,
    timeAgo: "2 years ago",
    date: "2 years ago",
    category: "Styling",
    text: "I get blowouts and cuts there, professional Italian hair stylists, would very highly recommend to everyone.",
    content: "I get blowouts and cuts there, professional Italian hair stylists, would very highly recommend to everyone.",
    highlightTags: ["Styling", "Women's Styling", "Italian Stylists"]
  },
  {
    id: "rev-8",
    author: "A. Edwards & Co Toronto Pawnshop",
    badge: "Local Guide · 45 reviews",
    reviewerBadge: "Local Guide · 45 reviews",
    rating: 5,
    timeAgo: "4 years ago",
    date: "4 years ago",
    category: "Expert Barber",
    text: "Old world Italian barber, great hair cut. A true craftsman.",
    content: "Old world Italian barber, great hair cut. A true craftsman.",
    highlightTags: ["Expert Barber", "Italian Barbering", "Craftsman"]
  },
  {
    id: "rev-9",
    author: "Forouhar Ferdowsi",
    badge: "7 reviews",
    reviewerBadge: "7 reviews",
    rating: 5,
    timeAgo: "2 years ago",
    date: "2 years ago",
    category: "Friendly Staff",
    text: "Joe is super nice man, with significantly great job and friendly attitude, I found him last year and I regularly go there. I strongly suggest this store specially Joe and Roya.",
    content: "Joe is super nice man, with significantly great job and friendly attitude, I found him last year and I regularly go there. I strongly suggest this store specially Joe and Roya.",
    highlightTags: ["Friendly Staff", "Joe & Roya", "Atmosphere"]
  },
  {
    id: "rev-10",
    author: "Amir Ghorbani",
    badge: "11 reviews · 1 photo",
    reviewerBadge: "11 reviews",
    rating: 5,
    timeAgo: "3 years ago",
    date: "3 years ago",
    category: "Haircut",
    text: "Joe has been my barber for a couple of years now and I am quite happy with the result every time I go there. I asked him for a new hair style, he listened carefully and gave me what I exactly wanted.",
    content: "Joe has been my barber for a couple of years now and I am quite happy with the result every time I go there. I asked him for a new hair style, he listened carefully and gave me what I exactly wanted.",
    highlightTags: ["Haircut", "Attentive", "Regular Client"]
  },
  {
    id: "rev-11",
    author: "Helen Lu",
    badge: "8 reviews",
    reviewerBadge: "8 reviews",
    rating: 5,
    timeAgo: "2 years ago",
    date: "2 years ago",
    category: "Atmosphere",
    text: "Joe is the best, we bring the whole family here for haircuts once a month on schedule. Always perfect, always reliable. Very easy to park and very safe.",
    content: "Joe is the best, we bring the whole family here for haircuts once a month on schedule. Always perfect, always reliable. Very easy to park and very safe.",
    highlightTags: ["Atmosphere", "Family Haircuts", "Free Parking"]
  },
  {
    id: "rev-12",
    author: "Pzfski Sizstki",
    badge: "Local Guide · 430 reviews",
    reviewerBadge: "Local Guide · 430 reviews",
    rating: 5,
    timeAgo: "7 years ago",
    date: "7 years ago",
    category: "Atmosphere",
    text: "Been in business ever since I knew about this plaza 15 years ago, that should speak for their quality.",
    content: "Been in business ever since I knew about this plaza 15 years ago, that should speak for their quality.",
    highlightTags: ["Atmosphere", "15+ Years", "Community Fixture"]
  }
];

export const REVIEWS_DATA: ReviewsInfo = {
  tag: "Client Reviews & Reputation",
  title: "4.7 Stars Across 63 Google Reviews",
  ratingScore: "4.7",
  score: "4.7",
  reviewCountText: "63 Reviews",
  reviewCount: "63 Reviews",
  badges: [
    "Cleanliness & Sanitization",
    "Strict Punctuality",
    "Fair & Honest Pricing"
  ],
  categories: [
    "All",
    "Expert Barber",
    "Cleanliness",
    "Friendly Staff",
    "Styling",
    "Haircut",
    "Atmosphere"
  ],
  items: REVIEWS_LIST,
  reviews: REVIEWS_LIST,
  featuredQuote: "“Walking out of his shop, ladies who previously ignored me wanted to know me better... Joe skillfully turned an average guy into a movie star.”",
  featuredAuthor: "Sorin Finchelstein",
  featuredBadge: "Google Review · Bayview-Cummer Regular"
};

const SCHEDULE_LIST = [
  {
    day: "Sunday",
    hours: "Closed",
    closed: true,
    isClosed: true
  },
  {
    day: "Monday",
    hours: "Closed",
    closed: true,
    isClosed: true
  },
  {
    day: "Tuesday",
    hours: "9:00 AM – 6:30 PM",
    closed: false,
    isClosed: false
  },
  {
    day: "Wednesday",
    hours: "9:00 AM – 6:30 PM",
    closed: false,
    isClosed: false
  },
  {
    day: "Thursday",
    hours: "9:00 AM – 6:30 PM",
    closed: false,
    isClosed: false
  },
  {
    day: "Friday",
    hours: "9:00 AM – 6:30 PM",
    closed: false,
    isClosed: false
  },
  {
    day: "Saturday",
    hours: "8:30 AM – 5:00 PM",
    closed: false,
    isClosed: false
  }
];

export const HOURS_AND_LOCATION: HoursAndLocationInfo = {
  tag: "Find Us in North York",
  title: "Bayview-Cummer Shopping Centre",
  subtitle: "Floor 1 · Corner of Bayview & Cummer",
  address: "3285 Bayview Ave, Floor 1, North York, ON M2K 0E6",
  plusCode: "QJR5+H5 North York, Ontario",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Bayview+Mall+Creative+Hair+Dsn+3285+Bayview+Ave+North+York+ON+M2K+0E6",
  parkingNote: "Extensive surface and covered mall parking right outside the entrance on Floor 1.",
  bookingNote: "Appointments recommended. Walk-ins accommodated when available.",
  appointmentPolicy: "Appointments guaranteed on time. Walk-ins welcome based on chair availability.",
  weeklyHours: SCHEDULE_LIST,
  schedule: SCHEDULE_LIST
};

export const FOOTER_DATA: FooterInfo = {
  aboutText: "A North York fixture at Bayview-Cummer Shopping Centre for over 15 years. Dedicated to Italian barber craftsmanship, meticulous scissor cuts, and personalized hair design for the whole family.",
  description: "A North York fixture at Bayview-Cummer Shopping Centre for over 15 years. Dedicated to Italian barber craftsmanship, meticulous scissor cuts, and personalized hair design for the whole family.",
  copyrightText: "© Bayview Mall Creative Hair Dsn. All Rights Reserved.",
  copyright: "© Bayview Mall Creative Hair Dsn. All Rights Reserved.",
  subline: "North York, Ontario · Bayview-Cummer Shopping Centre",
  tagline: "Traditional Italian Barber Craft · Floor 1 Plaza Location"
};

export const ADMIN_CONFIG = {
  authorizedEmails: ["kevfun73@gmail.com", "admin@bayviewcreativehair.com"],
  defaultMasterPasscode: "bayview2026",
  demoPasscode: "admin123"
};

export const DEFAULT_POSTS: SalonPost[] = [
  {
    id: "post-1",
    title: "Master Barber Joe on the Art of Pre-Cut Skull Assessment",
    category: "Barber Craft",
    author: "Joe (Master Barber)",
    date: "August 28, 2026",
    excerpt: "Why true Italian barbering begins with assessing head contour and growth whorls before shears ever touch hair.",
    content: "When clients sit in our chair at Bayview-Cummer Shopping Centre, the first 60 seconds are the most important. Many express haircut places rush straight in with buzzers and high-guard clippers.\n\nIn classical Italian barber tradition, we first feel the crown, examine cowlicks, and assess the cranial proportions. Every head has natural flat spots, high ridges, and unique growth angles. By sculpting with scissors rather than bludgeoning with clippers, the hair maintains shape naturally as it grows out over 4 to 6 weeks.",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1000&q=80",
    tags: ["Scissor Craft", "Italian Barbering", "Haircare Tips"],
    isPinned: true,
    isPublished: true,
    createdAt: "2026-08-28T10:00:00.000Z"
  },
  {
    id: "post-2",
    title: "Fall & Winter Hair Transitions: Roya's Guide to Volume & Dimension",
    category: "Style Showcase",
    author: "Roya (Senior Stylist)",
    date: "August 20, 2026",
    excerpt: "Transitioning your haircut and tone into the cooler autumn months with weight redistribution and healthy shine.",
    content: "As humidity drops going into fall in Ontario, hair naturally behaves differently. We recommend slight internal point-cutting to remove summer bulk while preserving natural movement and face-framing softness.\n\nAdding subtle warm caramel or deep espresso lowlights helps bring rich dimension under indoor lighting. Stop by our Floor 1 salon or book a quick consultation to refresh your look.",
    imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=1000&q=80",
    tags: ["Women's Styling", "Blowouts", "Color Trends"],
    isPinned: false,
    isPublished: true,
    createdAt: "2026-08-20T14:30:00.000Z"
  },
  {
    id: "post-3",
    title: "Plaza Notice: Convenient Floor 1 Parking & Guaranteed On-Time Chairs",
    category: "Announcement",
    author: "Bayview Mall Creative Hair Dsn",
    date: "August 15, 2026",
    excerpt: "Enjoy hassle-free appointments with direct plaza parking outside our Floor 1 entrance at Bayview & Cummer.",
    content: "We know your time is valuable. Unlike crowded downtown shops, our location inside Bayview-Cummer Shopping Centre (3285 Bayview Ave) offers abundant free surface and covered parking right steps from our door.\n\nWhen you book an appointment with Joe or Roya, you can arrive 2 minutes prior and be seated immediately with zero waiting. We take immense pride in our punctuality and hospitality.",
    imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1000&q=80",
    tags: ["Plaza Info", "Punctuality", "Appointments"],
    isPinned: false,
    isPublished: true,
    createdAt: "2026-08-15T09:00:00.000Z"
  }
];
