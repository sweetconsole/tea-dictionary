import NodeCache from "node-cache"

const cache = new NodeCache({stdTTL: 3600})

export async function cachedQuery<T>(key: string, fetcher: () => Promise<T>) {
	const cached = cache.get<T>(key)

	if (cached) {
		return cached
	}
	
	const data = await fetcher()

	if (data) {
		cache.set<T>(key, data)
	}

	return data
}