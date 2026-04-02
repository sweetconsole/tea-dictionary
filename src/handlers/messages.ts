import chalk from "chalk"
import { HearManager } from "@vk-io/hear"
import { MessageContext, VK } from "vk-io"
import { getHieroglyphBySymbol, getHieroglyphByTranscription,
	getHieroglyphsBySymbol, getHieroglyphsByTranscription, getTeaByName } from "../services/api.service.js"
import { capitalizeFirstLetterArray } from "../utils/capitalizeFirstLetter.js"

const handlerMessages = (hearManager: HearManager<MessageContext>, vk: VK) => {
	vk.updates.on("message_new", async (context, next) => {
		await hearManager.middleware(context, next)

		if (context.isHear) return

		const text = context.text?.toLowerCase().replace(/\s+/g, " ").trim()
		const payload = context.messagePayload

		if (payload) {
			if (payload.command === "translate") {
				await context.send({ message: "Напишите название чая" })
			}
			if (payload.command === "dictionary") {
				await context.send({ message: "Лютый словарик" })
			}

			return
		}

		console.log(chalk.white(`[INFO] Message: "${text}"`))

		if (text) {
			const tea = await getTeaByName(text)
			const formattedName = capitalizeFirstLetterArray(text.split(" "))

			if (tea) {
				const hieroglyphResults = await getHieroglyphsBySymbol([
					...tea.hieroglyphs
				])

				const translateHieroglyphs = hieroglyphResults
					.map(
						({ symbol, translate, transcription }) =>
							`${symbol}${transcription} — ${translate}`
					)
					.join("\n")

				await context.send({
					message: [
						`🍃 ${formattedName} — ${tea.translate} (${tea.hieroglyphs}) \n`,
						"Разбор иероглифов:",
						translateHieroglyphs || "Нет данных для разбора"
					].join("\n")
				})

				return
			}

			const words = text.split(" ")
			const results = await getHieroglyphsByTranscription(words)

			const translations = words
				.map((word, index) => {
					const data = results[index]

					if (!data || data.length === 0) {
						return `${word} — не найдено`
					}

					return data
						.map(
							item =>
								`${item.hieroglyph}  (${item.transcription}) — ${item.translate}`
						)
						.join("\n")
				})
				.filter(Boolean)

			const message =
				translations.length > 0
					? `Возможный перевод ${formattedName}\n\n ${translations.join("\n\n")}`
					: `Не удалось найти перевод для ${formattedName}`

			await context.send({ message })
		}
	})
}

export default handlerMessages
