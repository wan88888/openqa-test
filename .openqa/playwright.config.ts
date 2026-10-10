import 'varlock/auto-load';
import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  featuresRoot: 'features',
  features: 'features/**/*.feature',
  steps: 'steps/*.ts',
});

export default defineConfig({
  testDir,
  timeout: 240000, // 4 minutes for AI agent processing
  // Each test starts its own `opencode serve`, and they share one SQLite database.
  workers: 1,
  reporter: [['html', { open: 'never' }]],
  use: {
    headless: process.env.HEADLESS !== 'false',
    baseURL: process.env.BASE_URL,
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'],
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {},
    },
  ],
});
