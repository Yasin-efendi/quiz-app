// src/lib/sanitize.ts
export function sanitizeHTML(html: string): string {
  if (!html) return '';
  return html
    // Hapus tag script & isinya
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Hapus event handler inline (onclick, onerror, dll)
    .replace(/\s*on\w+="[^"]*"/gi, '')
    // Hapus protokol javascript:
    .replace(/javascript:/gi, '')
    // Hapus iframe, object, embed, form
    .replace(/<(iframe|object|embed|form|input|select|textarea|button|meta|link)[^>]*>.*?<\/\1>|<(iframe|object|embed|form|input|select|textarea|button|meta|link)[^>]*\/?>/gi, '');
}