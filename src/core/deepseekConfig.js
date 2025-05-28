export const DEEPSEEK_CONFIG = {
  BASE_URL: 'https://api.deepseek.com/v1',
  ENDPOINTS: {
    CHAT: '/chat/completions'
  },
  API_KEY: import.meta.env.VITE_DEEPSEEK_API_KEY
};

export function validateConfig() {
  if (!DEEPSEEK_CONFIG.API_KEY) {
    throw new Error('Deepseek API key not configured. Please set DEEPSEEK_API_KEY environment variable.');
  }
}

// Example environment file
export const ENV_EXAMPLE = `# Deepseek API Configuration
VITE_DEEPSEEK_API_KEY=your_api_key_here
`;