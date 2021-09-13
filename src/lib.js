export const toBinary = value => (value).toString(2)

export const toHex = value => (value).toString(16)

export const power = (base, exp) => base ** exp

export const sum = (...numbers) => numbers.reduce((sum, n) => sum + n, 0)
