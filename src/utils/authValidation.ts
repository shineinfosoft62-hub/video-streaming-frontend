export const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
export const dateRegex = /^\d{4}-\d{2}-\d{2}$/
export const phoneRegex = /^\d{10,15}$/

export const nameMinLength = 2
export const nameMaxLength = 20

export const nameMessage = 'Only letters and single spaces are allowed.'
export const nameLengthMessage = `Name must be ${nameMinLength}-${nameMaxLength} characters.`
export const emailMessage = 'Enter a valid email address.'
export const confirmPasswordMessage = 'Passwords do not match.'
export const passwordMessage = 'Use 8+ characters with uppercase, lowercase, number, and symbol.'
export const dateMessage = 'Enter a valid date in YYYY-MM-DD format.'
export const phoneMessage = 'Enter a valid phone number.'

export const parseDate = (value: string) => {
  if (!dateRegex.test(value)) {
    return null
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export const isAtLeastAge = (value: string, age: number) => {
  const date = parseDate(value)

  if (!date) {
    return false
  }

  const today = new Date()
  const maxBirthDate = new Date(today.getFullYear() - age, today.getMonth(), today.getDate())

  return date <= maxBirthDate
}
