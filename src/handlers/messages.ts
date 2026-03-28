import chalk from "chalk"
import { vk, hearManager } from "../index.js"

const handlerMessages = () => {
	vk.updates.on("message_new", hearManager.middleware)

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

		if (text) {
			await context.send({ message: "Пон" })
		}

		console.log(chalk.white(`[LOG] Message: "${text}"`))
	})
}

export default handlerMessages
