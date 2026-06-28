import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const authFile = '.auth/user.json'

setup('login', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.gotoLoginPage()
  await loginPage.login(process.env.USERNAME, process.env.PASSWORD)
  await expect(page.locator('h6.oxd-text')).toHaveText('Dashboard')
  await page.context().storageState({ path: authFile }) //ini akan menyimpan state login jadi dapat digunakan di test lain
})
