export const capitalizeFirstLetter = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1)
}

export const capitalizeFirstLetterArray = (array: string[]) => {
	let result = ""

	for (let word of array) {
		result += `${word.charAt(0).toUpperCase() + word.slice(1)} `
	}

	return result
}
