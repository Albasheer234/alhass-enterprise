/** Convert a Nigerian local number (0812...) to international format (234812...). */
export function toInternational(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) return `234${digits.slice(1)}`;
  if (digits.startsWith('234')) return digits;
  return digits;
}

export function productWhatsAppUrl(number: string, productName: string): string {
  const msg = `Hello ALHASS Integrated Enterprise, I am interested in ${productName}. Please provide the current price and availability.`;
  return `https://wa.me/${toInternational(number)}?text=${encodeURIComponent(msg)}`;
}

export function generalWhatsAppUrl(number: string): string {
  const msg =
    'Hello ALHASS Integrated Enterprise, I would like to make an enquiry about your products and services.';
  return `https://wa.me/${toInternational(number)}?text=${encodeURIComponent(msg)}`;
}
