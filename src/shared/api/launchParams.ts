const initialParams = typeof window !== 'undefined' ? window.location.search.slice(1) : ''

export function getLaunchParams(): string {
  const params = window.location.search.slice(1) || initialParams
  if (params) return params

  return import.meta.env.DEV ? (import.meta.env.VITE_DEV_LAUNCH_PARAMS ?? '') : ''
}
