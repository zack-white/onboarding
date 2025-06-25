import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { userId, movieId } = await req.json()

  if (!userId || !movieId) {
    return NextResponse.json({ error: 'Missing userId or movieId' }, { status: 400 })
  }

  await query(
    'INSERT INTO user_movies (user_id, movie_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [userId, movieId]
  )
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { userId, movieId } = await req.json()

  if (!userId || !movieId) {
    return NextResponse.json({ error: 'Missing userId or movieId' }, { status: 400 })
  }

  await query(
    'DELETE FROM user_movies WHERE user_id = $1 AND movie_id = $2',
    [userId, movieId]
  )
  return NextResponse.json({ success: true })
}
