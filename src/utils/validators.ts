export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateCRM(crm: string): boolean {
  return /^\d{5,7}$/.test(crm)
}

export function validatePassword(password: string): boolean {
  return password.length >= 6
}
