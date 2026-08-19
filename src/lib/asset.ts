/** public/ 底下的靜態資源路徑。部署在子路徑時要補上 base。 */
export const asset = (p: string) =>
  p.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') + p : p
