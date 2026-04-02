import "dotenv/config"
import chalk from "chalk"

const requiredEnvVars = ["BOT_TOKEN", "DATABASE_URL"]

const missingVars: string[] = []

export const validateEnvironmentVariables = () => {
	for (const envVar of requiredEnvVars) {
		if (!process.env[envVar]) {
			missingVars.push(envVar)
		}
	}

	if (missingVars.length > 0) {
		console.log(
			chalk.red(`
				[ERROR] Required environment variables are missing: \n 
				${missingVars.map((variable, index) => `${index + 1}. ${variable}`).join("\n")}
			`)
		)
		process.exit(1)
	}

	console.log(chalk.green("[INFO] All environment variables are loaded!"))
}
