import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const movieId = searchParams.get('movieId')

  if (!userId || !movieId) {
    return NextResponse.json({ error: 'Missing userId or movieId' }, { status: 400 })
  }

  try {
    const result = await query(
      'SELECT 1 FROM user_movies WHERE user_id = $1 AND movie_id = $2',
      [userId, movieId]
    )

    return NextResponse.json({ added: result.rowCount > 0 })
  } catch (err) {
    console.error('DB error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
