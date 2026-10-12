import { useEffect } from 'react'

/* Per-page title and description, set without a library. Each page renders one
 * of these; the site name is added to the title. Social-card tags are static in
 * index.html -- a single-page app cannot serve per-route Open Graph images to a
 * crawler that does not run script, so those wait for a server-rendered
 * deployment. */
const SITE = 'Akronix'

function setMeta(name, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function Seo({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `${SITE} | Software, marketing and mentorship studio, Chennai`
    setMeta('description', description)
  }, [title, description])
  return null
}
