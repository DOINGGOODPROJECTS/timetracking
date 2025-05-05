import bcrypt from "bcryptjs"

// Nombre recommandé de tours de hachage (10 à 12 en production)
const SALT_ROUNDS = 10

/**
 * Hache un mot de passe en clair à l’aide de bcrypt
 * @param plainPassword - Le mot de passe non haché
 * @returns Le mot de passe haché
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  if (!plainPassword) throw new Error("Le mot de passe ne peut pas être vide")
  return await bcrypt.hash(plainPassword, SALT_ROUNDS)
}

/**
 * Vérifie si un mot de passe en clair correspond au mot de passe haché
 * @param plainPassword - Le mot de passe saisi par l'utilisateur
 * @param hashedPassword - Le mot de passe haché stocké en base
 * @returns true si les mots de passe correspondent, sinon false
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  if (!plainPassword || !hashedPassword) return false
  console.log(plainPassword, hashedPassword, await bcrypt.compare(plainPassword, hashedPassword));
  return await bcrypt.compare(plainPassword, hashedPassword)
}

