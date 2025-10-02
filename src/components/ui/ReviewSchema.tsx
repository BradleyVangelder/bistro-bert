interface ReviewSchemaProps {
  reviews: Array<{
    author: string;
    rating: number;
    date: string;
    content: string;
  }>;
}

export default function ReviewSchema({ reviews }: ReviewSchemaProps) {
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Bistro Bert',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
      reviewCount: reviews.length,
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.date,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
      },
      reviewBody: review.content,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
    />
  );
}