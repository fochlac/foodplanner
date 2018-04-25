import React from 'react'

const regex = {
  linkGlobal: /\[[^\[\]]*\]\([^\(\)]*\)/g,
  link: /\[([^\[\]]*)\]\(([^\(\)]*)\)/,
}

const parseLink = string => {
  const [match, name, url] = regex.link.exec(string)
  return (
    <a key={Date.now()} href={encodeURI(url)} target="_blank" className="fakeLink">
      {name}
    </a>
  )
}

export const replaceLinks = string => {
  const parts = string.split(regex.linkGlobal)
  const rawLinks = string.match(regex.linkGlobal)
  const links = rawLinks ? rawLinks.map(link => parseLink(link)) : []

  return parts.map((part, index) => [part, links[index] || null])
}
