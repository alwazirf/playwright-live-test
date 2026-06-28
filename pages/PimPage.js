class PimPage {
    constructor(page) {
        this.page = page
        this.BASE_URL = process.env.BASE_URL + '/web/index.php/pim/viewEmployeeList'
        this.firstName = this.page.getByPlaceholder('First Name')
        this.middleName = this.page.getByPlaceholder('Middle Name')
        this.lastName = this.page.getByPlaceholder('Last Name')
        this.addEmployeeButton = this.page.locator('[type*="button"]:has-text("Add")')
        this.random10 = Math.floor((Date.now() - Math.random() * 1000000)).toString().slice(-10)
        this.searchButton = this.page.getByRole("button", { name: "Search" })
        this.searchEmployeeHint = this.page.getByPlaceholder("Type for hints...").first()
        this.itemsFirst = this.page.locator(".oxd-table-row").first()
        this.items = this.page.locator('.oxd-table-card')

        this.employeeId = this.page.locator('input.oxd-input').last()
        this.saveButton = this.page.locator('[type*="submit"]:has-text("Save")')
    }

    async gotoPimPage() {
        await this.page.goto(this.BASE_URL)
    }

    async clickAddEmployee() {
        await this.addEmployeeButton.click()
    }

    async addEmployee(firstName, middleName = "", lastName = firstName) { //jika nama hanya suku kata jadi last name bisa pakai nama depan
        await this.firstName.fill(firstName)
        if (middleName) {
            await this.middleName.fill(middleName)
        }
        await this.lastName.fill(lastName)
        await this.employeeId.fill(this.random10)
        await this.saveButton.click()
    }

    async searchEmployeeByName(employeeName) {
        await this.searchEmployeeHint.fill(employeeName)
        await this.searchButton.click()
        await this.itemsFirst.waitFor({ state: "visible" })
    }

    async countEmployee() {
        const rows = this.items
        await rows.first().waitFor({ state: 'attached', timeout: 5000 });
        return await rows.count()
    }

    async deleteEmployeeByIndex(index) { //harusnya delete index 1 tiap perulangan jadi index 0 (data pertama) akan tetap ada
        const row = this.items.nth(index)
        await row.locator('button:has(i.bi-trash)').click()
        await this.page.getByRole('button', { name: 'Yes, Delete' }).click()
    }

    async deleteDuplicateEmployeeName() {
        while (await this.countEmployee() > 1) {
            await this.deleteEmployeeByIndex(1)
        }
    }

}

module.exports = { PimPage }