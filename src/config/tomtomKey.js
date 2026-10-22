// TomTom API key for the live demos and API Explorers.
// Set VITE_TOMTOM_API_KEY in .env.local (gitignored via *.local). Never commit a key.
// Note: Vite inlines VITE_* values into the built bundle, so a key used for a public
// deploy is readable by anyone. Use a domain-restricted key, or a proxy, for that.
export const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY ?? '';
