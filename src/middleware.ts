import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// requires sign in for these routes to be accessed
const isProtectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  '/api/payment',
  'payment(.*)',
])

// TDL: check if correctly redirecting to sign in page
export default clerkMiddleware(async (auth, req) => { 
  if (isProtectedRoutes(req)) { 
    const authObj = await auth();
    if (!authObj.userId) {
      // Redirect to sign-in page or return 401
      return Response.redirect('/sign-in');
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};