// // dictionary-api.ts
// import { LRUCache } from "lru-cache"
// import { getDb } from "./firebase.js"
// import chalk from "chalk"
//
// export interface Translation {
// 	id?: string
// 	word: string // "чай"
// 	chinese: string // "茶"
// 	pinyin: string // "chá"
// 	translation: string // "чай, напиток"
// 	category?: string // "чай", "ландшафт", "еда" и т.д.
// 	createdAt?: Date
// 	updatedAt?: Date
// }
//
// export class DictionaryAPI {
// 	private cache: LRUCache<string, Translation>
// 	private db: admin.firestore.Firestore
// 	private collectionName = "translations"
// 	private cacheHits: number = 0
// 	private cacheMisses: number = 0
//
// 	constructor() {
// 		this.db = getDb()
//
// 		this.cache = new LRUCache<string, Translation>({
// 			max: 500,
// 			ttl: 1000 * 60 * 60 * 24, // 24 часа
// 			ttlAutopurge: true,
// 			updateAgeOnGet: true
// 		})
// 	}
//
// 	// ========== ОСНОВНЫЕ МЕТОДЫ ==========
//
// 	/**
// 	 * Поиск перевода по слову
// 	 */
// 	async translate(word: string): Promise<Translation | null> {
// 		const normalized = word.toLowerCase().trim()
//
// 		// Проверяем кэш
// 		const cached = this.cache.get(normalized)
// 		if (cached) {
// 			this.cacheHits++
// 			return cached
// 		}
//
// 		this.cacheMisses++
//
// 		// Ищем в Firebase
// 		try {
// 			const docRef = this.db.collection(this.collectionName).doc(normalized)
// 			const doc = await docRef.get()
//
// 			if (doc.exists) {
// 				const data = doc.data()
// 				const translation: Translation = {
// 					id: doc.id,
// 					word: data.word,
// 					chinese: data.chinese,
// 					pinyin: data.pinyin,
// 					translation: data.translation,
// 					category: data.category,
// 					createdAt: data.createdAt?.toDate(),
// 					updatedAt: data.updatedAt?.toDate()
// 				}
//
// 				this.cache.set(normalized, translation)
// 				return translation
// 			}
//
// 			return null
// 		} catch (error) {
// 			console.error(`❌ Ошибка поиска "${word}":`, error)
// 			return null
// 		}
// 	}
//
// 	/**
// 	 * Добавление нового перевода
// 	 */
// 	async addTranslation(
// 		translation: Omit<Translation, "id" | "createdAt" | "updatedAt">
// 	): Promise<Translation> {
// 		const normalized = translation.word.toLowerCase().trim()
//
// 		// Проверяем, существует ли уже
// 		const existing = await this.translate(normalized)
// 		if (existing) {
// 			throw new Error(`Слово "${translation.word}" уже существует`)
// 		}
//
// 		const now = admin.firestore.Timestamp.now()
// 		const newTranslation: any = {
// 			...translation,
// 			word: normalized,
// 			createdAt: now,
// 			updatedAt: now
// 		}
//
// 		// Сохраняем в Firebase
// 		const docRef = this.db.collection(this.collectionName).doc(normalized)
// 		await docRef.set(newTranslation)
//
// 		const saved: Translation = {
// 			id: normalized,
// 			...newTranslation,
// 			createdAt: new Date(),
// 			updatedAt: new Date()
// 		}
//
// 		// Сохраняем в кэш
// 		this.cache.set(normalized, saved)
//
// 		console.log(
// 			chalk.green(
// 				`✨ Добавлен перевод: ${saved.word} → ${saved.chinese} (${saved.pinyin})`
// 			)
// 		)
//
// 		return saved
// 	}
//
// 	async updateTranslation(
// 		word: string,
// 		updates: Partial<Omit<Translation, "id" | "word">>
// 	): Promise<Translation | null> {
// 		const normalized = word.toLowerCase().trim()
//
// 		const existing = await this.translate(normalized)
// 		if (!existing) {
// 			return null
// 		}
//
// 		const updatedData = {
// 			...updates,
// 			updatedAt: admin.firestore.Timestamp.now()
// 		}
//
// 		// Обновляем в Firebase
// 		const docRef = this.db.collection(this.collectionName).doc(normalized)
// 		await docRef.update(updatedData)
//
// 		// Обновляем в кэше
// 		const updated: Translation = {
// 			...existing,
// 			...updates,
// 			updatedAt: new Date()
// 		}
// 		this.cache.set(normalized, updated)
//
// 		console.log(chalk.blue(`✏️ Обновлён перевод: ${word}`))
//
// 		return updated
// 	}
//
// 	// ========== МЕТОДЫ ДЛЯ РАБОТЫ С КАТЕГОРИЯМИ ==========
//
// 	/**
// 	 * Получение всех переводов по категории (без пагинации)
// 	 * Возвращает форматированный текст для отправки в Telegram/VK
// 	 */
// 	async getCategoryTranslations(
// 		category: string
// 	): Promise<CategoryWords | null> {
// 		try {
// 			const snapshot = await this.db
// 				.collection(this.collectionName)
// 				.where("category", "==", category)
// 				.orderBy("word")
// 				.get()
//
// 			if (snapshot.empty) {
// 				return null
// 			}
//
// 			const words: Array<{
// 				word: string
// 				chinese: string
// 				translation: string
// 			}> = []
//
// 			snapshot.forEach(doc => {
// 				const data = doc.data()
// 				words.push({
// 					word: data.word,
// 					chinese: data.chinese,
// 					translation: data.translation
// 				})
// 			})
//
// 			return {
// 				category,
// 				words
// 			}
// 		} catch (error) {
// 			console.error(`❌ Ошибка получения категории "${category}":`, error)
// 			return null
// 		}
// 	}
//
// 	/**
// 	 * Получение всех категорий и их слов (для удобной навигации)
// 	 */
// 	async getAllCategories(): Promise<string[]> {
// 		try {
// 			const snapshot = await this.db
// 				.collection(this.collectionName)
// 				.select("category")
// 				.get()
//
// 			const categories = new Set<string>()
// 			snapshot.forEach(doc => {
// 				const data = doc.data()
// 				if (data.category) {
// 					categories.add(data.category)
// 				}
// 			})
//
// 			return Array.from(categories).sort()
// 		} catch (error) {
// 			console.error("❌ Ошибка получения категорий:", error)
// 			return []
// 		}
// 	}
//
// 	// ========== СТАТИСТИКА ==========
//
// 	getCacheStats() {
// 		const total = this.cacheHits + this.cacheMisses
// 		const hitRate =
// 			total === 0 ? "0%" : `${((this.cacheHits / total) * 100).toFixed(1)}%`
//
// 		return {
// 			size: this.cache.size,
// 			max: this.cache.max,
// 			hits: this.cacheHits,
// 			misses: this.cacheMisses,
// 			hitRate
// 		}
// 	}
//
// 	async getTotalCount(): Promise<number> {
// 		try {
// 			const snapshot = await this.db
// 				.collection(this.collectionName)
// 				.count()
// 				.get()
// 			return snapshot.data().count
// 		} catch (error) {
// 			console.error("❌ Ошибка подсчёта:", error)
// 			return 0
// 		}
// 	}
//
// 	clearCache(): void {
// 		this.cache.clear()
// 		console.log(chalk.yellow("🗑️ Кэш очищен"))
// 	}
//
// 	/**
// 	 * Прогрев кэша популярными словами
// 	 */
// 	async warmupCache(popularWords: string[]): Promise<void> {
// 		console.log(chalk.blue("🔥 Прогрев кэша..."))
//
// 		for (const word of popularWords) {
// 			await this.translate(word)
// 		}
//
// 		console.log(chalk.green(`✅ Кэш прогрет: ${this.cache.size} слов`))
// 	}
// }
//
// export const dictionaryAPI = new DictionaryAPI()
