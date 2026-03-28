import chalk from "chalk"
import { vk, hearManager } from "../index.js"
import { getTeaByName, getWordByName } from "../api.service.js"
import {
	capitalizeFirstLetter,
	capitalizeFirstLetterArray
} from "../utils/capitalizeFirstLetter.js"

const handlerMessages = () => {
	vk.updates.on("message_new", async (context, next) => {
		await hearManager.middleware(context, next)

		if (context.isHear) return

		const text = context.text?.toLowerCase().trim()
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

		console.log(chalk.white(`[LOG] Message: "${text}"`))

		if (text) {
			const tea = await getTeaByName(text)

			if (tea) {
				await context.send({
					message: `${capitalizeFirstLetterArray(text.split(" "))}переводится как:\n${tea.translate} (${tea.hieroglyphs})`
				})

				return
			}

			const teaWords = text.split(" ")
			let translate = ""
			let hieroglyphs = ""

			for (const word of teaWords) {
				const data = await getWordByName(word)

				if (!data) return

				translate += `${capitalizeFirstLetter(data.translate)} `
				hieroglyphs += data.hieroglyph
			}

			await context.send({
				message: `${capitalizeFirstLetterArray(teaWords)}переводится как:\n${translate} (${hieroglyphs})`
			})
		}
	})
}

export default handlerMessages
