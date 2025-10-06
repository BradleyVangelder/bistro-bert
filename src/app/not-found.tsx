import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-lg mx-auto px-6">
        <h1 className="typography-h1 text-black mb-6">Pagina niet gevonden</h1>
        <p className="typography-body text-gray-600 mb-12">
          De pagina die u zoekt bestaat niet. Maar u kunt altijd genieten van onze culinaire creaties.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/menu"
            className="btn-dh min-w-[160px]"
            aria-label="Bekijk onze menukaart"
          >
            Menukaart
          </Link>
          <Link
            href="/contact#reserveer"
            className="btn-dh-secondary min-w-[160px]"
            aria-label="Reserveer een tafel bij Bistro Bert"
          >
            Reserveer
          </Link>
        </div>
      </div>
    </div>
  )
}