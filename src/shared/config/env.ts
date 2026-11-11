export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  devLaunchParams: import.meta.env.VITE_DEV_LAUNCH_PARAMS ?? '',
  isDev: import.meta.env.DEV,
} as const
