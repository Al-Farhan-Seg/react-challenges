import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [coffeeData, setCoffeeData] = useState([])

  useEffect(() => {
    async function fetchCoffeeData() {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/simple-coffee-listing-data.json'
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

  return (
    <>
      <h1>Our Collection</h1>

      <p>
        Introducing our Coffee Collection, a selection of unique coffees from
        different roast types and origins, expertly roasted in small batches
        and shipped fresh weekly
      </p>

      <div>
        <button>All Products</button>
        <button>Available Now</button>
      </div>

      <div className='flex-col justify-center items-center sm:grid-cols-2 md:grid-cols-3'> // available, id, name, image, price, rating, popular, votes
        {loading ? (
          <p>Loading...</p>
        ) : (
          coffeeData.map(coffee => (
            <div key={coffee.id}
              className='outline-2 outline-red-400 w-max'>
              <p>{coffee.name}</p>
              <p>{coffee.price}</p>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default App