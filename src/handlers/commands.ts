import { hearManager } from "../index.js"
import { menuKeyboard } from "../keyboards.js"
import { getAllCategories, getAllWords } from "../api.service.js"

const handlerCommands = () => {
	hearManager.hear(/^(hello|привет|start|начать)$/i, async context => {
		console.log(`[LOG] ${await getAllCategories()}`)

		await context.send({
			message:
				"🍵 Добро пожаловать в чайный бот!\n" +
				"Просто напишите название чая, например:\n" +
				"• Те Гуань Инь\n" +
				"• Да Хун Пао\n" +
				"• Пуэр",
			keyboard: menuKeyboard
		})
	})
}

export default handlerCommands
