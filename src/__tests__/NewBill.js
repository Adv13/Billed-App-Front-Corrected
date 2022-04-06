/**
 * @jest-environment jsdom
 */

import { screen,
  fireEvent,
  getByTestId,
  getByLabelText,
  getAllByText,
  getAllByPlaceholderText,
  getByRole } from "@testing-library/dom"
import '@testing-library/jest-dom'
import NewBillUI from "../views/NewBillUI.js"//added
import NewBill from "../containers/NewBill.js"
import Router from "../app/Router.js"//added
import store from "../__mocks__/store.js"//added
import {ROUTES , ROUTES_PATH} from '../constants/routes.js'
import {localStorageMock } from '../__mocks__/localStorage.js'
import userEvent from "@testing-library/user-event" 
import Bills from "../containers/Bills.js"
import { event } from "jquery"
import BillsUI from '../views/BillsUI.js'


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

    it("Then I am on newBillPage and the form is present", () => {         
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(getByTestId(document.body,'form-new-bill')).toBeTruthy()
    })   

    it("Then i amm on newBillPAge the field type de dépense proposes Transport by default ",()=>{
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getAllByText('Transports')).toBeTruthy()
    })

    it("Then i am on newBillPage the field type nom de la dépense proposes vol Paris Londres by default",()=>{
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getByPlaceholderText('Vol Paris Londres')).toBeTruthy()

    })
    
    it('Then i am on newBillPage and i click on select btn type de dépense, several choice are available',()=>{
      const html = NewBillUI()
      document.body.innerHTML = html
      userEvent.click(getByTestId(document.body,'expense-type'))
      expect(screen.getAllByText('Transports')).toBeTruthy()
      expect(screen.getAllByText('Restaurants et bars')).toBeTruthy()
      expect(screen.getAllByText('Hôtel et logement')).toBeTruthy()
      expect(screen.getAllByText('Services en ligne')).toBeTruthy()
      expect(screen.getAllByText('IT et électronique')).toBeTruthy()
      expect(screen.getAllByText('Equipement et matériel')).toBeTruthy()
      expect(screen.getAllByText('Fournitures de bureau')).toBeTruthy()
    })

    // NewBill tests
    it('Then  NewBill Class is defined',()=>{
      
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document,
        onNavigate : (pathname) => ROUTES({ pathname }),
        store
      })
      expect(newBill).toBeDefined()    
    })

  })
})

//for all
describe("When I select a file", () => {
  test("Then it should be changed in the input", () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })// Set localStorage
    window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))// Set user as Employee in localStorage
    const html = NewBillUI()
    document.body.innerHTML = html
    let pathname =  ROUTES_PATH['NewBill']   

    const newBill = new NewBill({
      document,
      onNavigate: (pathname) => document.body.innerHTML = ROUTES({ pathname }),
      firestore: null,
      localStorage: window.localStorage,
      validFormat : true,
    })     


    const handleChangeFile = jest.fn(newBill.handleChangeFile)
    const inputFile = screen.getByTestId("file")
    inputFile.addEventListener('change', handleChangeFile)
    fireEvent.change(inputFile, {
      target: {
        files: [new File(["test.jpeg"], "test.jpeg", { type: "image/jpeg" })]
      }
    })
    expect(handleChangeFile).toHaveBeenCalled();
    expect(inputFile.files[0].name).toBe("test.jpeg");
  })
  
})

// test d'intégration POST
describe("When I navigate in Bills page", () => {
  test("fetches bills from mock API Post", async () => {
    

      const newBill = {
        "id": "qcCK3SzECmaZAGRrHjaC",
        "status": "refused",
        "pct": 20,
        "amount": 200,
        "email": "a@a",
        "name": "test8",
        "vat": "40",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2002-02-02",
        "commentAdmin": "pas la bonne facture",
        "commentary": "test8",
        "type": "Restaurants et bars",
        "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
      }
   
            
             const getSpy = jest.spyOn(store, "post")
             const bills = await store.post(newBill) 
             const addBill = [...bills.data, newBill]
             expect(getSpy).toHaveBeenCalledTimes(1)
             expect(addBill.length).toBe(5)
             expect(addBill[4].name).toBe("test8")
            
          })
  
}); 
