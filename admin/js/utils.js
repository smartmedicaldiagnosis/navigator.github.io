// utils.js — вспомогательные функции

/**
 * Генерация уникального ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Приведение строки к snake_case (для node ID)
 */
export function toSnakeCase(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
}
