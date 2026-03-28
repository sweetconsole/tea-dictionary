import { Keyboard } from "vk-io"

export const menuKeyboard = Keyboard.builder()
	.textButton({
		label: "Перевод чая",
		payload: { command: "translate" },
		color: Keyboard.PRIMARY_COLOR
	})
	.row()
	.textButton({
		label: "Словарик",
		payload: { command: "dictionary" }
	})

export const adminKeyboard = Keyboard.builder()
	.textButton({
		label: "Добавить чай",
		payload: { command: "adminAddTea" },
		color: Keyboard.POSITIVE_COLOR
	})
	.textButton({
		label: "Выйти из админ панели",
		payload: { command: "adminExit" },
		color: Keyboard.NEGATIVE_COLOR
	})
