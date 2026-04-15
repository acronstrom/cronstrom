const SITE = 'Lena Cronström'

/** Normalize pathname for lookup (no query, trailing slash except root). */
export function normalizePathname(pathname: string): string {
  const base = pathname.split('?')[0] || '/'
  if (base === '/') return '/'
  return base.replace(/\/+$/, '') || '/'
}

export type RouteSeo = {
  title: string
  description: string
  /** When set (e.g. admin), emit meta robots */
  robots?: string
}

const PUBLIC_SEO: Record<string, Omit<RouteSeo, 'robots'>> = {
  '/': {
    title: `Lena Cronström | Konstnär`,
    description:
      'Lena Cronström – samtida konstnär känd för känslofylld abstrakt expressionism. Se galleri, utställningar och kontakt.',
  },
  '/galleri': {
    title: `Galleri | ${SITE}`,
    description:
      'Verk av Lena Cronström: måleri och konst i galleriet. Bläddra bland utvalda verk med titlar, teknik och mått.',
  },
  '/utstallningar': {
    title: `Utställningar | ${SITE}`,
    description:
      'Nuvarande och kommande utställningar, separatutställningar, samlingsutställningar och jurybedömda visningar.',
  },
  '/nobel': {
    title: `Nobel | ${SITE}`,
    description:
      'Nobel-relaterade verk och presentationer av Lena Cronström – konst i samband med Nobelpriset och ceremonin.',
  },
  '/glasfusing': {
    title: `Glasfusing | ${SITE}`,
    description:
      'Glasfusing och glaskonst av Lena Cronström – färger, form och ljus i glas.',
  },
  '/textilmaleri': {
    title: `Textilmåleri | ${SITE}`,
    description:
      'Textilmåleri och textilbaserad konst av Lena Cronström – material, mönster och uttryck.',
  },
  '/utbildning': {
    title: `Utbildning | ${SITE}`,
    description:
      'Utbildning, kurser och bakgrund – Lena Cronströms konstnärliga och pedagogiska erfarenhet.',
  },
  '/kontakt': {
    title: `Kontakt | ${SITE}`,
    description:
      'Kontakta Lena Cronström – formulär, e-post och uppgifter för förfrågningar om verk och utställningar.',
  },
}

const ADMIN_SEO: Record<string, Omit<RouteSeo, 'robots'>> = {
  '/admin/login': {
    title: `Logga in | Admin ${SITE}`,
    description: 'Inloggning till webbplatsens administration.',
  },
  '/admin': {
    title: `Översikt | Admin ${SITE}`,
    description: 'Administration: översikt och snabblänkar till innehåll.',
  },
  '/admin/gallery': {
    title: `Galleri | Admin ${SITE}`,
    description: 'Hantera verk i galleriet.',
  },
  '/admin/exhibitions': {
    title: `Utställningar | Admin ${SITE}`,
    description: 'Hantera utställningar och datum.',
  },
  '/admin/education': {
    title: `Utbildning | Admin ${SITE}`,
    description: 'Hantera utbildningsinnehåll.',
  },
  '/admin/pages': {
    title: `Sidor | Admin ${SITE}`,
    description: 'Hantera sidor och texter.',
  },
  '/admin/settings': {
    title: `Inställningar | Admin ${SITE}`,
    description: 'Webbplatsinställningar och popup.',
  },
}

const NOINDEX: RouteSeo['robots'] = 'noindex, nofollow'

export function getSeoForPathname(pathname: string): RouteSeo {
  const path = normalizePathname(pathname)

  const pub = PUBLIC_SEO[path]
  if (pub) return { ...pub }

  const admin = ADMIN_SEO[path]
  if (admin) return { ...admin, robots: NOINDEX }

  if (path.startsWith('/admin')) {
    return {
      title: `Admin | ${SITE}`,
      description: 'Webbplatsadministration.',
      robots: NOINDEX,
    }
  }

  return { ...PUBLIC_SEO['/'] }
}
