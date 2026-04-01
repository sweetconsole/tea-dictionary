import type { HearManager } from "@vk-io/hear"
import type { MessageContext } from "vk-io"
import { menuKeyboard } from "../keyboards.js"

const handlerCommands = (hearManager: HearManager<MessageContext>) => {
	hearManager.hear(/^(hello|привет|start|начать)$/i, async context => {
		await context.send({
			message:
				"🍵 Добро пожаловать в чайный бот!\n" +
				"Просто напишите название чая, например:\n" +
				"• Те Гуань Инь\n" +
				"• Да Хун Пао\n" +
				"• Лун Цзин",
			keyboard: menuKeyboard
		})
	})
}

export default handlerCommands
