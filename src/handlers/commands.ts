import { hearManager } from "../index.js"
import { menuKeyboard } from "../keyboards.js"

const handlerCommands = () => {
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
