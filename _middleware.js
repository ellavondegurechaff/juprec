import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const session = await getSession({ req });

    // Normalize the pathname to lowercase
    const url = req.nextUrl.clone();
    url.pathname = url.pathname.toLowerCase();

    // Redirect if the pathname is changed
    if (url.pathname !== req.nextUrl.pathname) {
        return NextResponse.redirect(url);
    }

    if (!session || !session.user?.isAdmin) {
        // Redirect non-admin users to an unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Continue with the request for admin users
    return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Match all routes
}

export default middleware;
