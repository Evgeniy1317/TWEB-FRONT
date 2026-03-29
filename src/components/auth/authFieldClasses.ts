/** Общие стили полей для Login / Register */
const authInputBase =
  'w-full rounded-none bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1';

export const authInputClass =
  `${authInputBase} border border-white/18 focus:border-primary focus:ring-primary`;

/** После ухода с поля: нет «@» или есть кириллица */
export const authInputEmailInvalidClass =
  `${authInputBase} border border-red-500/85 focus:border-red-500 focus:ring-red-500/50`;

/** Любые символы кириллицы (русский и др.) */
export function hasCyrillicInString(value: string): boolean {
  return /\p{Script=Cyrillic}/u.test(value);
}

/** После blur: только красная при ошибке; при корректном email — обычная рамка (без зелёной) */
export function getAuthEmailInputClass(value: string, showValidation: boolean): string {
  if (!showValidation) return authInputClass;
  const t = value.trim();
  if (t.length === 0) return authInputClass;
  if (!t.includes('@') || hasCyrillicInString(t)) return authInputEmailInvalidClass;
  return authInputClass;
}

export function getAuthEmailAriaInvalid(value: string, showValidation: boolean): boolean | undefined {
  if (!showValidation) return undefined;
  const t = value.trim();
  if (t.length === 0) return undefined;
  return !t.includes('@') || hasCyrillicInString(t);
}
