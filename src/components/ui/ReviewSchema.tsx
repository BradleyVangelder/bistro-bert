import { RESTAURANT_ID } from "./RestaurantJsonLd";

interface ReviewSchemaProps {
  reviews: Array<{
    author: string;
    rating: number;
    date: string;
    content: string;
  }>;
}

export default function ReviewSchema({ reviews }: ReviewSchemaProps) {
  if (!reviews.length) {
    return null;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: Number((totalRating / reviews.length).toFixed(1)),
    reviewCount: reviews.length
  } as const;

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": RESTAURANT_ID,
    name: "Bistro Bert",
    aggregateRating,
    review: reviews.map((review, index) => ({
      "@type": "Review",
      name: `Gastbeoordeling ${index + 1}`,
      author: {
        "@type": "Person",
        name: review.author
      },
      datePublished: review.date,
      reviewBody: review.content,
      itemReviewed: {
        "@id": RESTAURANT_ID
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      }
    }))
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
    />
  );
}
