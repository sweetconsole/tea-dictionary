import { prisma } from "./lib/prisma.client.js"

export const getTeaByName = async (name: string) => {
	return prisma.tea.findUnique({ where: { name: name } })
}


export const getHieroglyphBySymbol = async (symbol: string) => {
	return prisma.hieroglyph.findUnique({ where: { hieroglyph: symbol } })
}

export const getHieroglyphByTranscription = async (transcription: string) => {
	return prisma.hieroglyph.findMany({ where: { transcription: transcription } })
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