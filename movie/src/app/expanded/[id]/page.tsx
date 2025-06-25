'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

type Movie = {
  id: number
  title: string
  year: string
  description: string
  poster: string
}

export default function MovieDetailPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [added, setAdded] = useState(false)
  const { user, isLoaded } = useUser()

  // Fetch movie data
  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch(`/api/movie?id=${id}`)
      if (res.ok) {
        const data: Movie = await res.json()
        setMovie(data)
      }
    }

    fetchMovie()
  }, [id])

  useEffect(() => {
    async function checkIfAdded() {
      if (!user) return
      const res = await fetch(`/api/check?userId=${user.id}&movieId=${id}`)
      if (res.ok) {
        const data = await res.json()
        console.log('Check if added:', data)
        setAdded(data.added)
      }
    }

    if (isLoaded && user) {
      checkIfAdded()
    }
  }, [user, isLoaded, id])

  const toggleList = async () => {
    if (!user) return

    const res = await fetch('/api/user-movies', {
      method: added ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, movieId: Number(id) }),
    })

    if (res.ok) setAdded(!added)
  }

  if (!movie) {
    return (
      <main className="p-6">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto p-6 flex flex-col sm:flex-row gap-8">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full sm:w-1/3 rounded shadow-lg object-cover"
      />
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">
          {movie.title} <span className="text-gray-500">({movie.year})</span>
        </h1>
        <p className="mb-6 text-gray-700">{movie.description}</p>

        <button
          onClick={toggleList}
          className={`px-5 py-2 rounded-full font-medium transition ${
            added
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {added ? 'Remove from My List' : 'Add to My List'}
        </button>
      </div>
    </main>
  )
}
