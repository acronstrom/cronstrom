import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { getSeoForPathname } from '../../lib/seoRoutes'

/**
 * Updates document title and meta description from the current route.
 * Must render under BrowserRouter.
 */
export function DocumentHead() {
  const { pathname } = useLocation()
  const seo = getSeoForPathname(pathname)

  return (
    <Helmet prioritizeSeoTags>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.robots ? <meta name="robots" content={seo.robots} /> : null}
    </Helmet>
  )
}
