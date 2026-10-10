import { expect } from '@playwright/test';
import { runAgent, openCode } from 'openqa';
import { aistep } from './fixtures';

const verbose = process.env.OPENQA_VERBOSE !== 'false';

// Build context header from env vars so the agent knows the app URL and credentials
function buildEnvContext(): string {
    const lines: string[] = [];
    if (process.env.BASE_URL)     lines.push(`Application base URL: ${process.env.BASE_URL}`);
    if (process.env.APP_USERNAME) lines.push(`App username: ${process.env.APP_USERNAME}`);
    if (process.env.APP_PASSWORD) lines.push(`App password: ${process.env.APP_PASSWORD}`);
    return lines.length > 0 ? `[Context]\n${lines.join('\n')}\n\n` : '';
}

aistep('I open the application and log in with the configured username and password', async ({ page }) => {
    const action = [
        'Open the application.',
        'Log in with the configured username and password.',
        'Finish both before stopping.',
    ].join('\n');
    await runAgent(openCode('google/gemini-3.8-flash'), `${buildEnvContext()}${action}`, page, { verbose });
});

aistep('the inventory page is displayed', async ({ page }) => {
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
});
