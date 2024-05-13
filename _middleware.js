import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const session = await getSession({ req });
    if (!session || !session.user?.isAdmin) {
        // Redirect non-admin users to an unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    // Continue with the request for admin users
    return NextResponse.next();
}

export default middleware;
