import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3003',
  },
  webServer: {
    command: process.env.CI ? 'yarn start -p 3003' : 'yarn dev -p 3003',
    url: 'http://localhost:3003',
    reuseExistingServer: !process.env.CI,
  },
});