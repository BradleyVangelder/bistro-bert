import { faqItems } from '@/data/faqs'
import { businessLunch, businessLunchFaqs } from '@/data/businessLunch'

// Plain-text summary of the site for AI assistants (https://llmstxt.org).
// Built from the same data as the pages, so it stays in sync.
export const dynamic = 'force-static'

const baseUrl = 'https://www.bistro-bert.be'

function faqSection(items: { question: string; answer: string }[]) {
  return items.map((item) => `### ${item.question}\n${item.answer}`).join('\n\n')
}

export function GET() {
  const courses = businessLunch.courses
    .map((course) => `- ${course.name}: ${course.description}`)
    .join('\n')

  const body = `# Bistro Bert

> Restaurant in Laakdal (Antwerpse Kempen, België) met een seizoensgebonden Belgische keuken. Open van woensdag tot en met zondag: lunch van 12:00 tot 17:00, diner van 17:00 tot 23:00. Gesloten op maandag en dinsdag.

- Adres: Verboekt 121, 2430 Laakdal, België (vlak bij Geel en Westerlo)
- Telefoon: +32 13 48 01 39
- E-mail: info@bistro-bert.be
- Reserveren: online via ${baseUrl} of telefonisch
- Gratis parking voor de deur

## Pagina's

- [Home](${baseUrl}/): over het restaurant en reserveren
- [Menukaart](${baseUrl}/menu): lunch- en dinerkaart, wijnkaart en dessertenkaart
- [Business lunch](${baseUrl}/business-lunch): twee gangen met koffie of thee voor €${businessLunch.price} per persoon
- [Over ons](${baseUrl}/over-ons): het verhaal achter Bistro Bert
- [Veelgestelde vragen](${baseUrl}/faq): reserveren, parking, allergieën, openingsuren
- [Contact](${baseUrl}/contact): adres, route en contactgegevens

## Business lunch

€${businessLunch.price} per persoon, woensdag tot en met zondag van 12:00 tot 17:00. Het menu wisselt regelmatig. Nu:

${courses}

${faqSection(businessLunchFaqs)}

## Veelgestelde vragen

${faqSection(faqItems)}
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
