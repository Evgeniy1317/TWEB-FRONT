/** Безопасный путь возврата после входа/регистрации (только внутренние URL). */
export function getPostAuthRedirect(state: unknown): string {
  const from = (state as { from?: unknown })?.from;
  if (typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')) return from;
  return '/profile';
}
