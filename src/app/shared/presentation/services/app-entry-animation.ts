const STORAGE_KEY = 'agrotrack-app-enter';

/** Marca que la próxima carga de la app debe reproducir la animación de entrada (llamar desde la landing antes del redirect). */
export function markAppEntryFromLanding(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* private mode / blocked storage */
  }
}

export function shouldPlayAppEntryAnimation(): boolean {
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === '1') {
      sessionStorage.removeItem(STORAGE_KEY);
      return true;
    }
  } catch {
    /* ignore */
  }

  const params = new URLSearchParams(window.location.search);
  return params.get('from') === 'landing' || params.get('entry') === '1';
}
