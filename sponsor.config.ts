import { type BadgePreset, defineConfig, tierPresets } from 'sponsorkit'
import fs from 'node:fs'

const presetPast = {
  avatar: {
    size: 20,
  },
  boxWidth: 22,
  boxHeight: 22,
  container: {
    sidePadding: 35,
  },
} satisfies BadgePreset

export default defineConfig({
  // includePrivate: true,
  tiers: [
    {
      title: 'Past Sponsors',
      monthlyDollars: -1,
      preset: presetPast,
    },
    {
      title: 'Backers',
      preset: tierPresets.small,
    },
    {
      title: 'Sponsors',
      preset: tierPresets.base,
      monthlyDollars: 10,
    },
    {
      title: 'Bronze Sponsors',
      monthlyDollars: 100,
      preset: tierPresets.medium,
    },
    {
      title: 'Silver Sponsors',
      monthlyDollars: 250,
      preset: tierPresets.medium,
    },
    {
      title: 'Gold Sponsors',
      monthlyDollars: 500,
      preset: tierPresets.large,
    },
    {
      title: 'Platinum',
      monthlyDollars: 1000,
      preset: tierPresets.xl,
    },
  ],

  onSponsorsFetched(sponsors) {
    const VueMastery = sponsors.find(
      (s) => s.sponsor.login.toLowerCase() === 'gregg',
    )
    if (VueMastery) {
      VueMastery.sponsor.name = 'Vue\u{00a0}Mastery'
      VueMastery.sponsor.avatarUrl =
        'https://avatars.githubusercontent.com/u/22382188?s=200&v=4'
      VueMastery.sponsor.websiteUrl = VueMastery.sponsor.linkUrl =
        'https://www.vuemastery.com'
    }

    const prefect = sponsors.find(
      (s) => s.sponsor.login.toLowerCase() === 'marvin-robot',
    )
    if (prefect) {
      // prefect.sponsor.avatarUrl = 'https://posva-sponsors.pages.dev/logos/prefect.svg'
      prefect.sponsor.linkUrl = 'https://www.prefect.io'
    }
  },

  onSponsorsReady(sponsors) {
    fs.writeFileSync(
      'sponsors.json',
      JSON.stringify(
        sponsors
          .filter((s) => s.privacyLevel !== 'PRIVATE')
          .map((s) => ({
            name: s.sponsor.name,
            login: s.sponsor.login,
            avatar: s.sponsor.avatarUrl,
            amount: s.monthlyDollars,
            link: s.sponsor.linkUrl || s.sponsor.websiteUrl,
            org: s.sponsor.type === 'Organization',
            isOneTime: s.isOneTime,
          }))
          .sort((a, b) => b.amount - a.amount),
        null,
        2,
      ),
    )
  },

  // Automatically Merge sponsors from different platforms
  sponsorsAutoMerge: true,

  outputDir: 'sk',
  formats: ['svg', 'png'],

  // Manually merge sponsors from different platforms
  // mergeSponsors: [
  //   [
  //     { login: 'patak-dev', provider: 'github' },
  //     { login: 'patak', provider: 'opencollective' },
  //   ],
  // ],

  // Run multiple renders with different configurations
  renders: [
    {
      name: 'narrow',
      width: 600,
    },
    {
      name: 'normal',
      width: 800,
    },
    {
      name: 'wide',
      width: 1000,
    },
    {
      renderer: 'circles',
      name: 'circles',
      width: 1000,
      includePastSponsors: true,
      circles: {
        radiusPast: 3,
      },
    },
  ],
})
