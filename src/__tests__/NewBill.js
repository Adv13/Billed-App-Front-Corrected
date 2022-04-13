/**
 * @jest-environment jsdom
 */

import { screen,
  fireEvent,
  getByTestId,} from "@testing-library/dom"
import '@testing-library/jest-dom'
import NewBillUI from "../views/NewBillUI.js"//added
import NewBill from "../containers/NewBill.js"
import store from "../__mocks__/store.js"//added
import {ROUTES} from '../constants/routes.js'
import {localStorageMock } from '../__mocks__/localStorage.js'
import userEvent from "@testing-library/user-event" 




/********************** TEST LA PRESENCE DES ELEMENTS SUR NEWBILL PAGE ************************/
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

    //Test pour savoir si, quand je suis sur newBill, le formulaire est bien présent dans le html grâce à l'id 'form-new-bill'
    it("Then I am on newBillPage and the form is present", () => {         
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(getByTestId(document.body,'form-new-bill')).toBeTruthy()
    })   
    //Test pour savoir si, quand je suis sur newBill, le texte "Transports" dans le champ de saisie est bien présent
    it("Then I am on newBillPAge the field type de dépense proposes Transport by default ",()=>{
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getAllByText('Transports')).toBeTruthy()
    })
    //Test pour savoir si, quand je suis sur newBill, le texte "Vol Paris Londres" dans le champ de saisie est bien présent
    it("Then I am on newBillPage the field type nom de la dépense proposes vol Paris Londres by default",()=>{
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getByPlaceholderText('Vol Paris Londres')).toBeTruthy()

    })
    //Test pour savoir si, quand je suis sur newBill et que je clique sur le bouton 'expense-type', toutes les propositions Transports/Restaurants et bars/Hôtel et logement/Services en ligne/IT et électronique/Equipement et matériel/Fournitures de bureau sont bien présentes
    it('Then I am on newBillPage and I click on select btn type de dépense, several choice are available',()=>{
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

    // NewBill tests pour vérifie si la class newBill est bien définie (et non undefined)
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

/*********************** TESTS SUR COMPORTEMENTS NEWBIL PAGE ************** */
/////////////////////// HANDLECHANGEFILE ////////////////////
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I add an image file", () => {
    test("Then this new file should have been changed in the input file", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["image.png"], "image.png", { type: "image/png" })],
        },
      });
      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].name).toBe("image.png");
    });
  });
});

//////////////////////// HANDLESUBMITFILE //////////////////////////
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I submit the form width an image (jpg, jpeg, png)", () => {
    test("Then it should create a new bill", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });//récupère le pathname de l'url comme étant '#employee/bill/new' dans la variable onNavigate
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,//récupère localStorageMock depuis le fichier localStorage.js
      });
      window.localStorage.setItem(// défini le user en tant qu'employé dans le local storage
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const firestore = null;//défini comme null
      const html = NewBillUI();//récupère le DOM de newBill dans html 
      document.body.innerHTML = html;//transèfere vers document.body.innerHTML

      const newBill = new NewBill({//variable créée à partir d'un neo newBill avec ses paramètres
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      const handleSubmit = jest.fn(newBill.handleSubmit);//The jest. fn method allows us to create a new mock function directly. If you are mocking an object method, you can use jest.
      const submitBtn = screen.getByTestId("form-new-bill");//form-new-bill dans variable submitBtn
      submitBtn.addEventListener("submit", handleSubmit);//si form submitted, lancer handleSubmit
      fireEvent.submit(submitBtn);//créer un évent click et dispatche cet évent sur le DOM node en paramètre
      expect(handleSubmit).toHaveBeenCalled();//Vérifie que handleSubmit a été appelée
    });
  });
});

// Test d'intégration POST
describe("When I navigate in Bills page", () => {
  test("fetches bills from mock API Post", async () => {
      const newBill = {//variable avec fake valeurs pour simuler une new bill submitted
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
   
        const getSpy = jest.spyOn(store, "post")// fonction simulée qui surveille l'appel de la méthode POST de l'objet store mocké
        const bills = await store.post(newBill) //envoie les données vers le store mocké
        const addBill = [...bills.data, newBill]//ajout de la new bill dans le tableau/html/DOM
        expect(getSpy).toHaveBeenCalledTimes(1)//vérifie que getSpy a bien été appelée 1 fois
        expect(addBill.length).toBe(5)//vérifie que la taille de la new bill ajoutée est bien de 5 (pour les 5 colonnes type, nom, date, montant, statut, actions)
        expect(addBill[4].name).toBe("test8")//vérifie que le nom de la new bill est bien "test8"
      
    })
  
}); 
