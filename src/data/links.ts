import TwitterIcon from '@/components/icons/TwitterIcon'
import GithubIcon from '@/components/icons/GithubIcon'
import FacebookIcon from '@/components/icons/FacebookIcon'
import BlueSkyIcon from '@/components/icons/BlueSkyIcon'
import { siteConfig } from './site.config'

// ADD YOUR SOCIAL NETWORKS HERE
export const SOCIALNETWORKS = [
	{
		name: 'Twitter',
		url: siteConfig.twitterUrl,
		icon: TwitterIcon
	},
	{
		name: 'BlueSky',
		url: siteConfig.blueskyUrl,
		icon: BlueSkyIcon
	},
	{
		name: 'Facebook',
		url: siteConfig.facebookUrl,
		icon: FacebookIcon
	},
	
] as const
