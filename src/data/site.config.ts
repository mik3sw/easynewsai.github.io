interface SiteConfig {
	site: string
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
	twitterUrl: string
	facebookUrl: string
	blueskyUrl: string
}

export const siteConfig: SiteConfig = {
	site: 'https://easynews.github.io/', // Write here your website url
	author: 'GreenMind', // Site author
	title: 'GreenMind', // Site title.
	description: 'Uno spazio dedicato alle piante e alla cura del tuo giardino', // Description to display in the meta tags
	lang: 'it-IT',
	ogLocale: 'it_IT',
	shareMessage: 'Condividi', // Message to share a post on social media
	paginationSize: 6, // Number of posts per page
	twitterUrl: '',
	facebookUrl: '',
	blueskyUrl: ''

}
