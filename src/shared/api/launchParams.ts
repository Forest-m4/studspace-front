// The sign covers the params VK passed to the page, so they are sent untouched.
// Outside VK the page has no params, so dev builds fall back to VITE_DEV_LAUNCH_PARAMS.
export function getLaunchParams(): string {
  const params = window.location.search.slice(1)
  if (params) return params

  return import.meta.env.DEV ? (import.meta.env.VITE_DEV_LAUNCH_PARAMS ?? '') : ''
}
