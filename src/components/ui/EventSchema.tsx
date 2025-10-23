import { RESTAURANT_ID } from "./RestaurantJsonLd";

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
  if (!events.length) {
    return null;
  }

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": RESTAURANT_ID,
    name: "Bistro Bert",
    event: events.map((event, index) => ({
      "@type": "FoodEvent",
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@id": RESTAURANT_ID
      },
      organizer: {
        "@type": "Organization",
        name: "Bistro Bert",
        url: "https://www.bistro-bert.be"
      },
      offers: event.price
        ? {
            "@type": "Offer",
            price: event.price.replace(/[^0-9,\.]/g, "").replace(",", "."),
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: "https://www.bistro-bert.be/contact"
          }
        : undefined,
      identifier: `event-${index}`
    }))
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
    />
  );
}
