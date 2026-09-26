import { useEffect, useState } from 'react'
import SourceLink from '../../../root-components/ViewChallengeComponent.jsx'

function App() {
  const [loading, setLoading] = useState(true)
  const [propertyListingData, setPropertyListingData] = useState([])
  const [filters, setFilters] = useState({ location: 'all', superhost: null, bedrooms: null })

  useEffect(() => {
    async function fetchPropertyListings() {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/property-listing-data.json',
        )

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        console.log(data)
        console.log(Object.keys(data[0]))

        setPropertyListingData(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPropertyListings()
  }, [])

  const filteredPropertyListingData = propertyListingData.filter((propertyListing) => {
    if (filters.location !== 'all' && propertyListing.location !== filters.location) {
      return false
    }
    if (filters.superhost !== null && propertyListing.superhost !== filters.superhost) {
      return false
    }
    if (filters.bedrooms !== null && propertyListing.capacity['bedroom'] !== filters.bedrooms) {
      return false
    }

    return true
  })

  // ['id', 'title', 'description', 'price', 'rating', 'superhost', 'location', 'capacity', 'image']

  const locationOptions = ['all', 'Norway', 'Finland', 'Sweden', 'Switzerland']

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <header className="mb-8 lg:mb-10">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Stays in the Nordics</h1>
          <p className="mt-1 text-sm text-zinc-400 sm:text-base">
            {filteredPropertyListingData.length} stays across Norway, Finland, Sweden and
            Switzerland
          </p>
        </header>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:mb-10">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {locationOptions.map((location) => (
              <button
                key={location}
                onClick={() =>
                  location === 'all'
                    ? setFilters({ location: 'all', superhost: null, bedrooms: null })
                    : setFilters({ ...filters, location })
                }
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  filters.location === location
                    ? 'bg-sky-600 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {location === 'all' ? 'All' : location}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              Superhost
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    superhost:
                      filters.superhost === null
                        ? true
                        : filters.superhost === true
                          ? false
                          : null,
                  })
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  filters.superhost ? 'bg-sky-600' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    filters.superhost ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>

            <select
              value={filters.bedrooms ?? ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  bedrooms: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
            >
              <option value="">Any bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="py-16 text-center text-zinc-400">Loading stays…</p>
        ) : filteredPropertyListingData.length === 0 ? (
          <p className="py-16 text-center text-zinc-400">
            No stays match these filters. Try clearing one.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPropertyListingData.map((propertyListing) => (
              <PropertyCard key={propertyListing.id} props={propertyListing} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center lg:mt-14">
          <SourceLink
            href="https://devchallenges.io/challenge/property-listing"
            label="View Project Source"
            className="flex items-center justify-center gap-3 rounded-md bg-zinc-800 p-3 text-zinc-300 transition hover:border-zinc-400 hover:bg-zinc-700 hover:text-white"
          />
        </div>
      </div>
    </div>
  )
}

function PropertyCard({ props }) {
  return (
    <div className="overflow-hidden rounded-xl bg-zinc-800 transition-transform hover:-translate-y-1">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-700">
        <img
          src={props.image}
          alt={props.title}
          className="h-full w-full object-cover"
        />
        {props.superhost && (
          <span className="absolute top-2 left-2 rounded-full bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-amber-400">
            Superhost ⭐
          </span>
        )}
        <span className="absolute right-2 bottom-2 rounded-full bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-200">
          {props.location}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <p className="font-semibold text-zinc-100">{props.title}</p>
        <p className="line-clamp-2 text-sm text-zinc-400">{props.description}</p>
        <div className="flex gap-4 text-sm text-zinc-300">
          <p>
            🏠 <span>{props.capacity['bedroom']}</span> bedroom
          </p>
          <p>
            👤 <span>{props.capacity['people']}</span> guests
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-zinc-700 pt-3">
          <p>
            <span className="font-semibold text-zinc-100">${props.price}</span>
            <span className="text-sm text-zinc-400"> /night</span>
          </p>
          <p className="text-sm text-zinc-300">⭐ {props.rating}</p>
        </div>
      </div>
    </div>
  )
}

export default App
