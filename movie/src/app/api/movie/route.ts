// app/api/movie/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing movie ID' }, { status: 400 })
  }

  const externalUrl = `https://jumboboxd.soylemez.net/api/movie?id=${id}`

  try {
    const res = await fetch(externalUrl)
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch movie' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
