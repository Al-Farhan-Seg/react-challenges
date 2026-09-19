import { useEffect, useState } from 'react'
import SourceLink from '../../../root-components/ViewChallengeComponent.jsx'

function App() {
  const [loading, setLoading] = useState(true)
  const [propertyListingData, setPropertyListingData] = useState([])
  
  useEffect(() => {
    async function fetchPropertyListings() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/property-listing-data.json"
        )

        if(!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        console.log(data)
        console.log(Object.keys(data[0]))

        setPropertyListingData(data)
      }
      catch (error) {
        console.error(error)
      }
      finally {
        setLoading(false)
      }
    }

    fetchPropertyListings()
  }, [])


  // ['id', 'title', 'description', 'price', 'rating', 'superhost', 'location', 'capacity', 'image']

  return (
    <div className="min-h-screen bg-zinc-800 text-white">
      <div className="m-auto w-[90dvw] min-w-0 p-10 md:w-[65vw]">
        <h1 className="text-center text-2xl font-bold">Property Listing</h1>
          
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

function PropertyCard({props}) {

  return (
    <div>
      <div>
        <img src="" alt="" />
      </div>
      <div></div>
      <div></div>
    </div>
  )
}

export default App
