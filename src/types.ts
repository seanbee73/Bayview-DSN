export interface BrandInfo {
  name: string;
  shortName: string;
  tag: string;
  logoInitials: string;
  phone: string;
  phoneTel: string;
  address: string;
  plazaLocation: string;
  postalCity: string;
  plusCode: string;
  mapsUrl: string;
  appointmentNote: string;
}

export interface AnnouncementInfo {
  show: boolean;
  badge: string;
  text: string;
  subtext: string;
}

export interface HeroInfo {
  badge: string;
  headlinePrefix: string;
  headlineAccent: string;
  description: string;
  heroImage: string;
  ratingScore: string;
  reviewCountText: string;
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  stat3Number: string;
  stat3Label: string;
}

export interface HeritagePillar {
  id: string;
  title: string;
  description: string;
  iconName: 'scissors' | 'userCheck' | 'smile' | 'clock';
}

export interface HeritageInfo {
  tag: string;
  title: string;
  paragraph1: string;
  quote: string;
  quoteAuthor: string;
  pillars: HeritagePillar[];
}

export interface SignatureService {
  id: string;
  title: string;
  subtitle?: string;
  price: string;
  badge: string;
  image: string;
  description: string;
  features: string[];
}

export interface AdditionalService {
  id: string;
  title: string;
  name?: string;
  price: string;
  description: string;
}

export interface ServicesInfo {
  tag: string;
  title: string;
  subtitle?: string;
  priceSubtitle: string;
  signatureServices: SignatureService[];
  additionalServices: AdditionalService[];
}

export interface FeaturedQuote {
  quote: string;
  author: string;
  badge: string;
}

export interface Craftsman {
  id: string;
  name: string;
  role: string;
  subtitle: string;
  image: string;
  quote: string;
  bio: string;
  highlights: string[];
  experienceBadge?: string;
  specialties?: string[];
}

export type Stylist = Craftsman;

export interface CraftsmenInfo {
  tag: string;
  title: string;
  description: string;
  stylists: Craftsman[];
  craftsmen?: Craftsman[];
}

export interface LookbookItem {
  id: string;
  title: string;
  tag: string;
  src: string;
  alt: string;
  image?: string;
  category?: string;
  description?: string;
  technique?: string;
  maintenance?: string;
  suitability?: string;
}

export interface LookbookInfo {
  tag: string;
  title: string;
  subtitle: string;
  items: LookbookItem[];
}

export interface ReviewItem {
  id: string;
  author: string;
  badge: string;
  reviewerBadge?: string;
  rating: number;
  timeAgo: string;
  date?: string;
  category: string;
  text: string;
  content?: string;
  highlightTags?: string[];
}

export interface ReviewsInfo {
  tag: string;
  title: string;
  ratingScore: string;
  score?: string;
  reviewCountText: string;
  reviewCount?: string;
  badges: string[];
  categories?: string[];
  items: ReviewItem[];
  reviews?: ReviewItem[];
  featuredQuote?: string;
  featuredAuthor?: string;
  featuredBadge?: string;
}

export interface WeeklyHour {
  day: string;
  hours: string;
  closed: boolean;
  isClosed?: boolean;
}

export interface HoursAndLocationInfo {
  tag: string;
  title: string;
  subtitle?: string;
  address?: string;
  plusCode?: string;
  mapsLink?: string;
  parkingNote: string;
  bookingNote: string;
  appointmentPolicy?: string;
  weeklyHours: WeeklyHour[];
  schedule?: WeeklyHour[];
}

export interface FooterInfo {
  aboutText: string;
  description?: string;
  copyrightText: string;
  copyright?: string;
  subline: string;
  tagline?: string;
}

export interface ConsultationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  interest: string;
  notes?: string;
  preferredStylist?: string;
}

export interface BookingReservation {
  serviceId: string;
  serviceTitle: string;
  servicePrice: string;
  stylistId: string;
  stylistName: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
  createdAt?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface SalonPost {
  id: string;
  title: string;
  category: 'Announcement' | 'Style Showcase' | 'Shop News' | 'Barber Craft' | 'Holiday Hours';
  author: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  isPinned?: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface AdminSession {
  email: string;
  authenticated: boolean;
  loginTime: string;
  role: 'Master Admin' | 'Staff';
}
