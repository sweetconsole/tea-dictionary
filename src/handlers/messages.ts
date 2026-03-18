import chalk from "chalk"
import { vk, hearManager } from "../index.js"

const handlerMessages = () => {
	vk.updates.on("message_new", hearManager.middleware)

	vk.updates.on("message_new", async (context, next) => {
		await hearManager.middleware(context, next)

		if (context.isHear) return

		console.log(chalk.white(`[LOG] Message: "${context.text}"`))
	})
}

export default handlerMessages
