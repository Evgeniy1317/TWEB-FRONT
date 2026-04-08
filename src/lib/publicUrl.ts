/** Публичные файлы из `/public` (например `media/...`). Учитывает `base` Vite для GitHub Pages. */
export function publicUrl(path: string): string {
  const p = path.replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${p}`;
}
