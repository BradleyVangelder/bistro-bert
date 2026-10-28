import type { FaqItem } from './faqs';

export interface BusinessLunchCourse {
  name: string;
  description: string;
}

// Update the courses here when the business lunch changes.
export const businessLunch = {
  price: '39',
  courses: [
    { name: 'Vitello Bert', description: 'Kalfs, tonijn, zwarte look' },
    { name: 'Pasta truffel', description: 'Verse herfsttruffel, parmezaan' },
    { name: 'Koffie of thee', description: 'Met friandise' },
  ] satisfies BusinessLunchCourse[],
};

export const businessLunchFaqs: FaqItem[] = [
  {
    question: 'Wat kost de business lunch?',
    answer:
      '€39 per persoon. Daarvoor krijgt u twee gangen en koffie of thee met een friandise.'
  },
  {
    question: 'Op welke dagen kan ik komen?',
    answer:
      'Van woensdag tot en met zondag. We serveren lunch van 12u tot 17u.'
  },
  {
    question: 'Ik heb niet veel tijd. Lukt dat?',
    answer:
      'Zeker. Laat bij het reserveren weten hoe laat u weer weg moet, dan stemmen we het tempo daarop af.'
  },
  {
    question: 'Kan ik met een grotere groep komen?',
    answer:
      'Ja. Bel ons even op +32 13 48 01 39, dan zetten we een tafel voor u klaar.'
  },
  {
    question: 'Houden jullie rekening met allergieën?',
    answer:
      'Geef uw dieetwensen of allergieën door bij het reserveren of bel ons vooraf. We bekijken graag samen wat mogelijk is.'
  }
];
