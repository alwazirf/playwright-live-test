class LoginPage {
    constructor(page) {
        this.page = page
    }

    async gotoLoginPage() {
        await this.page.goto(process.env.BASE_URL)
    }

    async login(username, password) {
        await this.page.getByPlaceholder('Username').fill(username)
        await this.page.getByPlaceholder('Password').fill(password)
        await this.page.locator('button[type="submit"]').click()
    }

}

module.exports = { LoginPage }