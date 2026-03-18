import "dotenv/config"
import chalk from "chalk"

const requiredEnvVars = [
	"BOT_TOKEN",
	"FIREBASE_API_KAY",
	"FIREBASE_AUTH_DOMAIN",
	"FIREBASE_PROJECT_ID",
	"FIREBASE_STORAGE_BUCKET",
	"FIREBASE_MESSAGING_SENDER_ID",
	"FIREBASE_APP_ID",
	"FIREBASE_MEASUREMENT_ID"
]

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
				[ERR] Required environment variables are missing: \n 
				${missingVars.map((variable, index) => `${index + 1}. ${variable}`).join("\n")}
			`)
		)
		process.exit(1)
	}

	console.log(chalk.green("[LOG] All environment variables are loaded!"))
}
