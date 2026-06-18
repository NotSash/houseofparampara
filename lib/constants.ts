export const WHATSAPP_NUMBER = '918667665474' // country code 91 + number
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`
export const CURRENCY_SYMBOL = '₹'

export const INSTAGRAM_URL = '#'
export const FACEBOOK_URL = '#'

/** Build a WhatsApp link with a pre-filled, URL-encoded message. */
export function waLink(message: string) {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`
}

export const GENERIC_WA_MESSAGE =
  "Hi! I'd love to know more about House of Parampara."

/** Format a number as Indian Rupees, e.g. 1200 -> "₹1,200". */
export function formatPrice(amount: number) {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-IN')}`
}
