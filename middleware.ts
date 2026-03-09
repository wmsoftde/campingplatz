import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Apply locale middleware to all public pages.
  // Exclude API, Next internals, admin/login routes and static assets.
  matcher: ['/((?!api|_next|admin|login|.*\\..*).*)']
};
