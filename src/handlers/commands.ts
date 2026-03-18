import { hearManager } from "../index.js"

const handlerCommands = () => {
	hearManager.hear(/^(hello|привет|start|начать)$/i, async context => {
		await context.send(
			"🍵 Добро пожаловать в чайный бот!\n" +
				"Просто напишите название чая, например:\n" +
				"• Те Гуань Инь\n" +
				"• Да Хун Пао\n" +
				"• Пуэр"
		)
	})
}

export default handlerCommands
