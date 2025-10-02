import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-light text-black mb-4">Pagina niet gevonden</h1>
        <p className="text-gray-600 mb-8">De pagina die u zoekt bestaat niet.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Terug naar home
        </Link>
      </div>
    </div>
  )
}