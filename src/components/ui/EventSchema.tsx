interface EventSchemaProps {
  events: Array<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    price?: string;
  }>;
}

export default function EventSchema({ events }: EventSchemaProps) {
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Bistro Bert',
    location: {
      '@type': 'PostalAddress',
      streetAddress: 'Verboekt 121',
      addressLocality: 'Laakdal',
      postalCode: '2430',
      addressCountry: 'BE',
    },
    event: events.map(event => ({
      '@type': 'FoodEvent',
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: {
        '@type': 'Place',
        name: 'Bistro Bert',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Verboekt 121',
          addressLocality: 'Laakdal',
          postalCode: '2430',
          addressCountry: 'BE',
        },
      },
      offers: event.price ? {
        '@type': 'Offer',
        price: event.price,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      } : undefined,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
    />
  );
}