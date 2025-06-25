import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'

type Movie = {
  id: number
  title: string
  poster: string
}

async function fetchMovie(id: number): Promise<Movie | null> {
  const res = await fetch(
    `https://jumboboxd.soylemez.net/api/movie?id=${id}`,
    { cache: 'no-store' }
  )
  if (!res.ok) return null
  return res.json()
}

export default async function MoviesPage() {
  const user = await currentUser()

  // Fetch movies 1‑25
  const moviePromises = Array.from({ length: 250 }, (_, i) =>
    fetchMovie(i + 1)
  )
  const movies = (await Promise.all(moviePromises)).filter(
    (m): m is Movie => m !== null
  )

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to JumboBoxd!</h1>
      <p className="text-lg mb-6">Hello, {user?.firstName ?? 'guest'} </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/expanded/${movie.id}`}
            className="block rounded-lg bg-white shadow hover:shadow-md transition"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-64 object-cover rounded-t"
            />
            <div className="p-2 text-center">
              <p className="text-sm font-medium">{movie.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
