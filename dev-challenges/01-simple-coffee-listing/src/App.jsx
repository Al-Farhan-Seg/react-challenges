import { useEffect, useState } from 'react'
import './App.css'
import SourceLink from '../../../root-components/ViewChallengeComponent.jsx'

//npm run dev --workspace @react-challenges/01-simple-coffee-listing -- --host

function App() {
  const [loading, setLoading] = useState(true)
  const [coffeeData, setCoffeeData] = useState([])
  const [filter, setFilter] = useState('all') // 'all' & 'available'

  useEffect(() => {
    async function fetchCoffeeData() {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/simple-coffee-listing-data.json',
        )

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        console.log(data)

        setCoffeeData(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoffeeData()
  }, [])

  const displayedCoffee =
    filter === 'available' ? coffeeData.filter((coffee) => coffee.available) : coffeeData

  return (
    <div className="min-h-screen bg-zinc-800">
      <div className="m-auto w-[90dvw] min-w-0 p-10 text-white md:w-[65vw]">
        <h1 className="text-center text-2xl font-bold">Our Collection</h1>

        <p className="mx-auto my-3 text-center text-zinc-400 md:w-6/10">
          Introducing our Coffee Collection, a selection of unique coffees from different roast
          types and origins, expertly roasted in small batches and shipped fresh weekly
        </p>

        <div className="my-4 flex justify-evenly lg:justify-center lg:gap-5">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3 py-2 ${
              filter === 'all' ? 'bg-zinc-600' : 'bg-transparent'
            }`}
          >
            All Products
          </button>

          <button
            onClick={() => setFilter('available')}
            className={`rounded-lg px-3 py-2 ${
              filter === 'available' ? 'bg-zinc-600' : 'bg-transparent'
            }`}
          >
            Available Now
          </button>
        </div>

        <div className="grid grid-cols-1 justify-items-center gap-8 py-2 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? ( // available, id, name, image, price, rating, popular, votes
            <p>Loading...</p>
          ) : (
            displayedCoffee.map((coffee) => (
              <div key={coffee.id} className="bg-zinc-850 w-full max-w-70 min-w-0 rounded-lg">
                <div className="relative">
                  <img className="w-full rounded-lg" src={coffee.image} alt="" />
                  {coffee.popular ? (
                    <p className="absolute top-1 left-1.5 rounded-2xl bg-amber-400 px-3 py-0.5 text-black">
                      Popular
                    </p>
                  ) : (
                    ''
                  )}
                </div>
                <div className="my-2 flex justify-between">
                  <p>{coffee.name}</p>
                  <p className="rounded-md bg-green-300 px-1 text-black">{coffee.price}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="gap my-2 flex items-center justify-start">
                    <span className="mr-1 inline-block text-amber-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-star-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                      </svg>
                    </span>
                    {coffee.rating}
                    <span className="text-gray-400">({coffee.votes} votes)</span>
                  </p>
                  {!coffee.available ? <p className="text-red-600">Sold Out</p> : <p></p>}
                </div>
              </div>
            ))
          )}
        </div>
        <div className='flex justify-center'>
          <SourceLink
            href="https://devchallenges.io/challenge/simple-coffee-listing"
            label="View Project Source"
            className='hover:bg-zinc-500 p-3 rounded-md text-zinc-300 transition hover:border-zinc-400 bg-zinc-700 hover:text-white'
          />
        </div>
        
      </div>
    </div>
  )
}

export default App
