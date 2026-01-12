import { readFileSync, writeFileSync } from 'node:fs'

interface Sponsor {
  name: string
  login: string
  avatar: string
  amount: number
  link: string
  org: boolean
  isOneTime: boolean
}

const filePath = 'sk/sponsors.json'
const sponsors: Sponsor[] = JSON.parse(readFileSync(filePath, 'utf-8'))

// Sort by login (case-insensitive)
sponsors.sort((a, b) =>
  a.login.toLowerCase().localeCompare(b.login.toLowerCase())
)

// Remove 'u' param from GitHub avatar URLs
for (const s of sponsors) {
  if (s.avatar.includes('avatars.githubusercontent.com')) {
    const url = new URL(s.avatar)
    url.searchParams.delete('u')
    s.avatar = url.toString()
  }
}

writeFileSync(filePath, JSON.stringify(sponsors, null, 2) + '\n')
