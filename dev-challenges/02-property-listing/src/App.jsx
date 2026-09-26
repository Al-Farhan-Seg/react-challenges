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
    if(filters.location !== 'all' && propertyListing.location !== filters.location) {
      return false
    }
    if(filters.superhost !== null && propertyListing.superhost !== filters.superhost) {
      return false
    }
    if(filters.bedrooms !== null && propertyListing.capacity['bedroom'] !== filters.bedrooms) {
      return false
    }

    return true
  })

  // ['id', 'title', 'description', 'price', 'rating', 'superhost', 'location', 'capacity', 'image']

  return (
    <div className="min-h-screen bg-zinc-800 text-white">
      <div className="m-auto w-[98dvw] min-w-0 p-10 md:w-[65vw]">
        <h1 className="text-center text-2xl font-bold">Property Listing</h1>
        <div>
          <div>
            <button
             onClick={() => setFilters({ location: 'all', superhost: null, bedrooms: null })}
              className={`rounded-lg px-3 py-2 ${
                filters.location === 'all' ? 'bg-zinc-600' : 'bg-transparent'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilters({ ...filters, location: 'Norway' })}
              className={`rounded-lg px-3 py-2 ${
                filters.location === 'Norway' ? 'bg-zinc-600' : 'bg-transparent'
              }`}
            >
              Norway
            </button>
            <button
              onClick={() => setFilters({ ...filters, location: 'Finland' })}
              className={`rounded-lg px-3 py-2 ${
                filters.location === 'Finland' ? 'bg-zinc-600' : 'bg-transparent'
              }`}
            >
              Finland
            </button>
            <button
              onClick={() => setFilters({ ...filters, location: 'Sweden' })}
              className={`rounded-lg px-3 py-2 ${
                filters.location === 'Sweden' ? 'bg-zinc-600' : 'bg-transparent'
              }`}
            >
              Sweden
            </button>
            <button
              onClick={() => setFilters({ ...filters, location: 'Switzerland' })}
              className={`rounded-lg px-3 py-2 ${
                filters.location === 'Switzerland' ? 'bg-zinc-600' : 'bg-transparent'
              }`}
            >
              Switzerland
            </button>
          </div>
          <div>
            <button
              onClick={() => setFilters({ ...filters, superhost: !filters.superhost })}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                filters.superhost ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform ${
                  filters.superhost ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>

            <select
              value={filters.bedrooms ?? ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  bedrooms: e.target.value ? Number(e.target.value) : null,
                })
              }
            >
              <option value="">Any bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
            </select>
          </div>
        </div>
        {loading ? (
          <p>Loading</p>
        ) : (
          <div>
            <p>Over 200 stays</p>
            {filteredPropertyListingData.map((propertyListing) => {
              return (
                <>
                  <PropertyCard key={propertyListing.id} props={propertyListing} />
                </>
              )
            })}
          </div>
        )}

        <div className="flex justify-center">
          <SourceLink
            href="https://devchallenges.io/challenge/property-listing"
            label="View Project Source"
            className="flex items-center justify-center gap-3 rounded-md bg-zinc-700 p-3 text-zinc-300 transition hover:border-zinc-400 hover:bg-zinc-500 hover:text-white"
          />
        </div>
      </div>
    </div>
  )
}

function PropertyCard({ props }) {
  return (
    <div>
      <div>
        <img src={props.image} alt={`${props.title}`} />
        {props.superhost ? <span>Superhost ⭐</span> : <></>}
        {props.location}
      </div>

      <div>
        <p>{props.title}</p>
        <p>{props.description}</p>
        <div>
          <p>
            🏠
            <span>{props.capacity['bedroom']} </span>
            bedroom
          </p>
          <p>
            👤
            <span>{props.capacity['people']} </span>
            guests
          </p>
        </div>
      </div>

      <div>
        <p>
          <span>${props.price}</span>
          /night
        </p>
        <p>
          ⭐<span>{props.rating}</span>
        </p>
      </div>
    </div>
  )
}

export default App
