import { getSession } from "next-auth/react";

export async function requireAdmin(req, res, next) {
    const session = await getSession({ req });
    if (!session || !session.user?.isAdmin) {
        // User is not an admin or not logged in.
        // Since this is server-side, we don't have res.redirect(), we'll need to handle redirection in getServerSideProps.
        return { redirect: { destination: '/unauthorized', permanent: false } };
    }
    // Continue with next in middleware chain or resolve with session data
    return next ? next(session) : { props: { session } };
}