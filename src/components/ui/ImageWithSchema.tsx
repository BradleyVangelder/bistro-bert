import Image from 'next/image';

interface ImageWithSchemaProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  caption?: string;
  isMenuItem?: boolean;
  isEstablishmentImage?: boolean;
}

export default function ImageWithSchema({
  src,
  alt,
  width,
  height,
  className = '',
  caption,
  isMenuItem = false,
  isEstablishmentImage = false,
}: ImageWithSchemaProps) {
  const imageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: `https://bistrobert.be${src}`,
    name: alt,
    caption: caption || alt,
    width: width,
    height: height,
    ...(isMenuItem && {
      isPartOf: {
        '@type': 'Menu',
        name: 'Bistro Bert À La Carte Menu',
      },
    }),
    ...(isEstablishmentImage && {
      representsOf: {
        '@type': 'Restaurant',
        name: 'Bistro Bert',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Verboekt 121',
          addressLocality: 'Laakdal',
          postalCode: '2430',
          addressCountry: 'BE',
        },
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }}
      />
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {caption && (
        <figcaption className="text-sm text-gray-600 mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </>
  );
}