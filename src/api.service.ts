import { prisma } from "./lib/prisma.client.js"

export const getTeaByName = (name: string) => {
	return prisma.tea.findUnique({ where: { name: name } })
}

export const getAllWords = async () => {
	return prisma.word.findMany()
}

export const getWordByName = (name: string) => {
	return prisma.word.findUnique({ where: { word: name } })
}

export const getAllCategories = async () => {
	return prisma.category.findMany()
}
