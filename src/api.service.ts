import { prisma } from "./lib/prisma.client.js"

export const getTeaByName = (name: string) => {
	return prisma.tea.findUnique({ where: { name: name } })
}


export const getHieroglyphBySymbol = (symbol: string) => {
	return prisma.hieroglyph.findUnique({ where: {hieroglyph: symbol } })
}

export const getHieroglyphByTranscription = (transcription: string) => {
	return prisma.hieroglyph.findMany({ where: {transcription: transcription } })
}