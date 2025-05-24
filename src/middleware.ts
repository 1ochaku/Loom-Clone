import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)',
  '/auth/callback(.*)',
  '/api/webhooks(.*)', // If you have webhook endpoints
]);

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/payment',
  '/payment(.*)',
]);

export default clerkMiddleware(async (auth, req) => { 
  // Allow public routes to pass through without authentication
  if (isPublicRoute(req)) {
    return;
  }

  // For protected routes, check authentication
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    
    // If user is not authenticated, redirect to sign-in
    if (!userId) {
      const signInUrl = new URL('/auth/sign-in', req.url);
      // Add the current URL as a redirect parameter so user returns here after sign-in
      signInUrl.searchParams.set('redirect_url', req.url);
      return Response.redirect(signInUrl);
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