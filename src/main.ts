import { VK, MessageContext } from "vk-io"
import { HearManager } from "@vk-io/hear"
import chalk from "chalk"
import "dotenv/config"
import { handlerCommands, handlerMessages } from "./handlers/index.js"
import { validateEnvironmentVariables } from "./utils/validateEnvironmentVariables.js"

validateEnvironmentVariables()

export const vk = new VK({
	token: process.env.BOT_TOKEN!
})

export const hearManager = new HearManager<MessageContext>()

handlerCommands(hearManager)
vk.updates.on("message_new", hearManager.middleware)
handlerMessages(hearManager, vk)

vk.updates
	.start()
	.then(() => {
		console.log(chalk.green("[LOG] Bot is started!"))
	})
	.catch(error => {
		console.error(chalk.red(`[ERR] Launch error: ${error}`))
	})

process.once("SIGINT", () => {
	console.log(chalk.yellow("\n[LOG] Bot is stopped!"))
	process.exit(0)
})
