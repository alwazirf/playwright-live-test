import { defineConfig, devices } from '@playwright/test';
require('dotenv').config()
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  timeout: 60000, // 1 minute
  expect: {
    timeout: 60000
  },
  use: {
    trace: 'on',
    headless: false,
    screenshot: 'on',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/
    },

    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});

