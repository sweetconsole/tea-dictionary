import { prisma } from "../lib/prisma.client.js"
import { cachedQuery } from "./cache.service.js"

export const getTeaByName = async (name: string) => {
	return await cachedQuery(`tea:${name}`, () => prisma.tea.findUnique({ where: { name: name } })
	)
}


export const getHieroglyphBySymbol = async (symbol: string) => {
	return await cachedQuery(`hieroglyph_symbol:${symbol}`, () => prisma.hieroglyph.findUnique({ where: { hieroglyph: symbol } })
	)
}

export const getHieroglyphByTranscription = async (transcription: string) => {
	return await cachedQuery(`hieroglyph_transcription:${transcription}`, () =>
		prisma.hieroglyph.findMany({ where: { transcription: transcription } })
	)
}

export const getHieroglyphsBySymbol = async (symbol: string[])  => {
	return await Promise.all(
		symbol.map(async hieroglyph => {
			const data = await getHieroglyphBySymbol(hieroglyph)

			return {
				symbol: hieroglyph,
				translate: data?.translate || "Не найдено",
				transcription: data ? `  (${data.transcription})` : ""
			}
		})
	)
}

export const getHieroglyphsByTranscription = async (transcriptions: string[]) => {
	return await Promise.all(
		transcriptions.map(transcription =>
			getHieroglyphByTranscription(transcription)
		)
	)
}