declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"5-modi-per-usare-le-piante-in-casa-per-ridurre-lo-stress.mdx": {
	id: "5-modi-per-usare-le-piante-in-casa-per-ridurre-lo-stress.mdx";
  slug: "5-modi-per-usare-le-piante-in-casa-per-ridurre-lo-stress";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"5-ortaggi-perfetti-per-il-tuo-balcone.mdx": {
	id: "5-ortaggi-perfetti-per-il-tuo-balcone.mdx";
  slug: "5-ortaggi-perfetti-per-il-tuo-balcone";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"bonsai-e-spiritualità:-il-legame-con-il-buddismo.mdx": {
	id: "bonsai-e-spiritualità:-il-legame-con-il-buddismo.mdx";
  slug: "bonsai-e-spiritualità-il-legame-con-il-buddismo";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"bonsai-in-giappone:-arte-natura-e-imperatori.mdx": {
	id: "bonsai-in-giappone:-arte-natura-e-imperatori.mdx";
  slug: "bonsai-in-giappone-arte-natura-e-imperatori";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"bonsai-oggi:-tradizione-e-innovazione.mdx": {
	id: "bonsai-oggi:-tradizione-e-innovazione.mdx";
  slug: "bonsai-oggi-tradizione-e-innovazione";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"come-iniziare-un-orto-sul-balcone:-guida-passo-a-passo.mdx": {
	id: "come-iniziare-un-orto-sul-balcone:-guida-passo-a-passo.mdx";
  slug: "come-iniziare-un-orto-sul-balcone-guida-passo-a-passo";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"come-le-piante-purificano-la-mente-e-laria.mdx": {
	id: "come-le-piante-purificano-la-mente-e-laria.mdx";
  slug: "come-le-piante-purificano-la-mente-e-laria";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"giardinaggio-verticale:-massimo-rendimento-in-poco-spazio.mdx": {
	id: "giardinaggio-verticale:-massimo-rendimento-in-poco-spazio.mdx";
  slug: "giardinaggio-verticale-massimo-rendimento-in-poco-spazio";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"le-5-piante-domestiche-che-riducono-lo-stress.mdx": {
	id: "le-5-piante-domestiche-che-riducono-lo-stress.mdx";
  slug: "le-5-piante-domestiche-che-riducono-lo-stress";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"mini-terrario-in-vetro-progetto-ecologico-e-sostenibile.mdx": {
	id: "mini-terrario-in-vetro-progetto-ecologico-e-sostenibile.mdx";
  slug: "mini-terrario-in-vetro-progetto-ecologico-e-sostenibile";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"origini-del-bonsai:-dalla-cina-al-giappone.mdx": {
	id: "origini-del-bonsai:-dalla-cina-al-giappone.mdx";
  slug: "origini-del-bonsai-dalla-cina-al-giappone";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"orto-in-contenitori:-soluzioni-per-spazi-ridotti.mdx": {
	id: "orto-in-contenitori:-soluzioni-per-spazi-ridotti.mdx";
  slug: "orto-in-contenitori-soluzioni-per-spazi-ridotti";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"piante-domestiche-e-salute-mentale:-il-legame.mdx": {
	id: "piante-domestiche-e-salute-mentale:-il-legame.mdx";
  slug: "piante-domestiche-e-salute-mentale-il-legame";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"simboli-nascosti:-il-bonsai-nella-cultura-cinese.mdx": {
	id: "simboli-nascosti:-il-bonsai-nella-cultura-cinese.mdx";
  slug: "simboli-nascosti-il-bonsai-nella-cultura-cinese";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"stress-una-pianta-ti-salva-i-rimedi-naturali.mdx": {
	id: "stress-una-pianta-ti-salva-i-rimedi-naturali.mdx";
  slug: "stress-una-pianta-ti-salva-i-rimedi-naturali";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"terrario-come-arredo-riciclo-e-stile-in-casa.mdx": {
	id: "terrario-come-arredo-riciclo-e-stile-in-casa.mdx";
  slug: "terrario-come-arredo-riciclo-e-stile-in-casa";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"terrario-con-bottiglie-riutilizzate-step-by-step.mdx": {
	id: "terrario-con-bottiglie-riutilizzate-step-by-step.mdx";
  slug: "terrario-con-bottiglie-riutilizzate-step-by-step";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"terrario-ecologico-idee-per-spazi-piccoli.mdx": {
	id: "terrario-ecologico-idee-per-spazi-piccoli.mdx";
  slug: "terrario-ecologico-idee-per-spazi-piccoli";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
"trucchi-per-coltivare-in-giardini-piccoli.mdx": {
	id: "trucchi-per-coltivare-in-giardini-piccoli.mdx";
  slug: "trucchi-per-coltivare-in-giardini-piccoli";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = never;
}
