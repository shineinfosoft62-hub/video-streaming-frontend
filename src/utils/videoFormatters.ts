export const formatFileSize = (size?: number) => {
  if (!size) {
    return ''
  }

  return `${(size / 1024 / 1024).toFixed(2)}MB`
}

export const formatDate = (value?: string) => {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
