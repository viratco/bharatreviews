/* One source for the brand name — header, footer and the welcome intro all
   read from here, so they can't drift apart. */
export const BRAND = { name: 'BharatReviews', lines: ['BHARAT', 'REVIEWS'] }

/* Public profile links, used by the hero's social icons.
   LinkedIn points at the public company page on purpose: the /admin/dashboard
   URL only opens for page admins, so it would be a dead end for visitors. */
export const SOCIAL = [
  { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/_bharatreviews_/' },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/company/109955309/' },
]
