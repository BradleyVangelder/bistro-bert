'use client'

import { useState } from 'react'
import SmartText from '@/components/ui/SmartText'
import { SmartNavigationItem, SmartMenuItem } from '@/components/ui/SmartText'
import { useSmartTruncate } from '@/hooks/useSmartTruncate'

export default function SmartTruncateTest() {
  const [containerWidth, setContainerWidth] = useState('w-64')

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Smart Truncation Test Page</h1>

        {/* Container Width Controls */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Container Width: {containerWidth}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setContainerWidth('w-32')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Narrow (w-32)
            </button>
            <button
              onClick={() => setContainerWidth('w-48')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Medium (w-48)
            </button>
            <button
              onClick={() => setContainerWidth('w-64')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Wide (w-64)
            </button>
            <button
              onClick={() => setContainerWidth('w-96')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Very Wide (w-96)
            </button>
          </div>
        </div>

        {/* Navigation Examples */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Navigation Items</h2>
          <div className={`${containerWidth} border p-4 rounded`}>
            <div className="space-y-2">
              <SmartNavigationItem text="Menu" href="/menu" />
              <SmartNavigationItem text="Over ons" href="/about" />
              <SmartNavigationItem text="Reserveren" href="/contact" />
              <SmartNavigationItem text="Dit is een hele lange navigatie tekst" href="/long" />
              <SmartNavigationItem text="Nog een langere tekst voor de navigatie" href="/longer" />
            </div>
          </div>
        </div>

        {/* Menu Item Examples */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Menu Items</h2>
          <div className={`${containerWidth} border p-4 rounded`}>
            <div className="space-y-4">
              <SmartMenuItem
                title="Koffie"
                description="Verse koffie"
              />
              <SmartMenuItem
                title="Tomatensoep"
                description="Huisgemaakte tomatensoep met verse kruiden"
              />
              <SmartMenuItem
                title="This is a very long menu item title"
                description="This description has many words and should be truncated only when it overflows the container significantly"
              />
              <SmartMenuItem
                title="Zeebaars met citroen en kruiden"
                description="Verse zeebaars gebakken met citroen, knoflook en diverse mediterrane kruiden uit onze tuin"
              />
            </div>
          </div>
        </div>

        {/* SmartText Examples */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">SmartText Component Examples</h2>

          {/* Different word counts */}
          <div className={`${containerWidth} border p-4 rounded mb-4`}>
            <h3 className="font-semibold mb-2">Different Word Counts:</h3>
            <div className="space-y-1">
              <SmartText text="Een" maxWords={3} className="block" />
              <SmartText text="Twee woorden" maxWords={3} className="block" />
              <SmartText text="Drie korte woorden" maxWords={3} className="block" />
              <SmartText text="Dit zijn vier woorden in een rij" maxWords={3} className="block" />
              <SmartText text="Dit is een tekst met vijf woorden" maxWords={3} className="block" />
              <SmartText text="Dit is een hele lange tekst met veel woorden" maxWords={3} className="block" />
            </div>
          </div>

          {/* Different line clamps */}
          <div className={`${containerWidth} border p-4 rounded mb-4`}>
            <h3 className="font-semibold mb-2">Different Line Clamps:</h3>
            <div className="space-y-1">
              <SmartText
                text="Dit is een lange tekst die op één regel moet passen"
                maxWords={4}
                maxLines={1}
                className="block border-b pb-1"
              />
              <SmartText
                text="Dit is een lange tekst die op twee regels mag worden weergegeven met een mooie ellipsis aan het einde"
                maxWords={4}
                maxLines={2}
                className="block border-b pb-1"
              />
              <SmartText
                text="Dit is een hele lange tekst die op drie regels past en meer informatie kan tonen dan de kortere varianten"
                maxWords={4}
                maxLines={3}
                className="block"
              />
            </div>
          </div>
        </div>

        {/* Hook Example */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">useSmartTruncate Hook Example</h2>
          <HookExample containerWidth={containerWidth} />
        </div>

        {/* Real-world Examples */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Real-world Restaurant Examples</h2>
          <div className={`${containerWidth} border p-4 rounded`}>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Menu Categories:</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <SmartText text="Voorgerechten" maxWords={3} className="font-luxury" />
                  <SmartText text="Hoofdgerechten" maxWords={3} className="font-luxury" />
                  <SmartText text="Nagerechten" maxWords={3} className="font-luxury" />
                  <SmartText text="Dranken en wijnen" maxWords={3} className="font-luxury" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Dish Descriptions:</h3>
                <div className="space-y-2 mt-2">
                  <SmartText
                    text="Stokbrood met kruidenboter"
                    maxWords={5}
                    className="block font-medium"
                  />
                  <SmartText
                    text="Runderbiefstuk met frietjes en salade"
                    maxWords={5}
                    className="block font-medium"
                  />
                  <SmartText
                    text="Huisgemaakte tiramisu met verse koffie en cacaopoeder"
                    maxWords={5}
                    className="block font-medium"
                  />
                  <SmartText
                    text="Drie-gangen menu met seizoensgebonden ingrediënten uit de streek"
                    maxWords={5}
                    className="block font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HookExample({ containerWidth }: { containerWidth: string }) {
  const [showFull, setShowFull] = useState(false)
  const longText = "Dit is een hele lange beschrijving die normaal gesproken wordt afgekort maar waarvan je de volledige tekst kunt zien door op de knop te klikken."

  const { getTextProps, isTruncated, shouldConsiderTruncation, toggleTruncation, wordCount } = useSmartTruncate(
    longText,
    { maxWords: 6, maxLines: 2 }
  )

  return (
    <div className={`${containerWidth} border p-4 rounded`}>
      <h3 className="font-semibold mb-2">Hook Example ({wordCount} words):</h3>
      <p {...getTextProps()} className="text-gray-700">
        {longText}
      </p>
      {isTruncated && (
        <button
          onClick={toggleTruncation}
          className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
        >
          {showFull ? 'Show less' : 'Show more'}
        </button>
      )}
      <div className="mt-2 text-xs text-gray-500">
        Should consider truncation: {shouldConsiderTruncation ? 'Yes' : 'No'} |
        Is truncated: {isTruncated ? 'Yes' : 'No'}
      </div>
    </div>
  )
}