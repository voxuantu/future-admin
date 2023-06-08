import { NextRequest, NextFetchEvent } from 'next/server'
import { NextResponse } from 'next/server'
import adminApi from '../api/admin-api'

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  console.log('req.nextUrl.basePath: ', req.nextUrl.pathname)
  if (req.nextUrl.pathname === '/login/') {
    return NextResponse.next()
  }

  try {
    await adminApi.validate()

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect('/login') // redirect
  }
}
