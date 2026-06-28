import { test, expect } from '@playwright/test'
import { PimPage } from '../pages/PimPage'

test.describe("orangehrm automation live test", () => {
    let pimPage
    let firstName = "Mardi"
    let middleName = ""
    let lastName = ""

    // state login dari file auth.setup.js
    test.use({ storageState: '.auth/user.json' })

    test.beforeEach(async ({ page }) => {
        pimPage = new PimPage(page)
    })

    for (let i = 0; i < 5; i++) {
        test('Add Employee' + i, async ({ page }) => {
            await pimPage.gotoPimPage()
            await expect(page.locator('[type*="button"]:has-text("Add")')).toBeVisible()
            await pimPage.clickAddEmployee()
            await pimPage.addEmployee(firstName, middleName, (lastName ? lastName : firstName)) //kalo nama belakang tidak ada maka pakai nama depan
            await expect(page.getByText('Successfully Saved')).toBeVisible()
            await pimPage.gotoPimPage()
        })
    }

    test("Delete Duplicate Employee", async ({ page }) => {
        const employeeName = firstName + (middleName ? " " + middleName : "") + " " + (lastName ? lastName : firstName) //output 'namaDepan namatengah kalo ada' + 'nama belakang kalo gak ada jadi nama depan' = 'Mardi  Mardi' 
        await pimPage.gotoPimPage()
        await pimPage.searchEmployeeByName(employeeName)
        const employeeCount = await pimPage.countEmployee()
        console.log("Jumlah data ", employeeCount)
        await pimPage.deleteDuplicateEmployeeName()
    })
})