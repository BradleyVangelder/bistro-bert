export interface GuestReview {
  author: string;
  rating: number;
  date: string;
  content: string;
}

export const spotlightReviews: GuestReview[] = [
  {
    author: "Jan Janssens",
    rating: 5,
    date: "2024-03-15",
    content:
      "Uitzonderlijke culinaire ervaring bij Bistro Bert. De aandacht voor detail en de kwaliteit van de ingrediënten is ongeëvenaard."
  },
  {
    author: "Marie Pieters",
    rating: 5,
    date: "2024-02-28",
    content:
      "Het menu van Bistro Bert is een feest voor de smaakpapillen. Seizoensgebonden en perfect bereid."
  }
];

