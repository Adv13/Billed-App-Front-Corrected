/**
 * @jest-environment jsdom
 */
import'@testing-library/jest-dom'
import {screen, fireEvent} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import store from "../__mocks__/store.js"
import Router from "../app/Router.js";
import Bills from '../containers/Bills.js';

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    // Test pour vérifier que l'icone de l'onglet Bills à gauche est bien en focus - TEST DE BASE
    test("Then bill icon in vertical layout should be highlighted", () => {
      //to-do write expect expression done
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))// défini le user en tant qu'employé dans le local storage
      Object.defineProperty(window, "location", { value: { hash: ROUTES_PATH['Bills'] } });// défini l'url comme étant '#employee/bills'
      document.body.innerHTML = `<div id="root"></div>` // créé le noeud pour que le router injecte l'objet correspondant à l'url
      Router();// lance le router

      // CODE RAJOUTE CI-DESSOUS :
      const checkClass = screen.getByTestId("icon-window").classList.contains("active-icon");//met l'id "icon-window" contenant la class "active-icon" dans la variable "checkClass"
      expect(checkClass).toBeTruthy(); // vérifie si la class "active-icon" est la

    })
    // Test pour vérifier que les bills sont bien affichées en ordre décroissant (plus récente à plus ancienne) - TEST DE BASE
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

// test pour vérifier que la page loading affiche bien "Loading..." avec le paramètre "loading" de la class/page BillsUI - TEST DE BASE
describe('Given i am on the loading page',()=>{
  test('Should show Loading...',()=>{
    const html = BillsUI({loading : true})
    document.body.innerHTML = html
    expect(screen.getAllByText('Loading...')).toBeTruthy()
  })
})

// test pour vérifier que la page error affiche bien "error message" avec le paramètre "error" de la class/page BillsUI - TEST DE BASE
describe('Given i am on error page', () => {
  test('should show the error message',()=>{
    const html = BillsUI({error : 'error message'})
    document.body.innerHTML = html
    expect(screen.getAllByText('error message')).toBeTruthy()
  })
})

//BILL TESTS AJOUTES

describe('Given I am on bills page',()=>{
    // Test si la methode handleClickNewBill est bien appelée quand on clique sur btn-new-bill
    test('Should called the handleClickNewBill method when I click on newBill button',()=>{  
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))// défini le user en tant qu'employé dans le local storage
      const html = BillsUI({ data: bills })// sélectionne le paramètre data => bills
      document.body.innerHTML = html // place le contenu du html dans document.body.innerHTML pour le DOM
      const onNavigate = ((pathname) => document.body.innerHTML = ROUTES({ pathname }))//récupère le pathname de l'url comme étant '#employee/bills' dans la variable onNavigate
      const bill= new Bills({//récupère les paramètres document et onNavigate de la new bill dans la variable bill
        document,
        onNavigate       
      })    
      const handleClickNewBill = jest.fn(bill.handleClickNewBill)//The jest. fn method allows us to create a new mock function directly. If you are mocking an object method, you can use jest.
      const buttonNewBill = screen.getByTestId('btn-new-bill') //btn-new-bill dans variable buttonNewBill
      expect(buttonNewBill).toBeTruthy()//// vérifie si l'id "btn-new-bill" est la
      buttonNewBill.addEventListener('click', handleClickNewBill)//si click sur le bouton, lancer handleClickNewBill
      fireEvent.click(buttonNewBill)//créer un évent click et dispatche cet évent sur le DOM node en paramètre
      expect(handleClickNewBill).toHaveBeenCalled()//Vérifie que handleClickNewBill a été appelée
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()// vérifie si "Envoyer une note de frais" est la
    })

    //Test si la methode handleClickIconEye est bien appelée quand on clique sur un oeil
    //Test pour savoir si la modale s'ouvre quand on clique sur un oeil 
    test('Should called the handleClickIconEye when I click on iconEye',()=>{    
      const html = BillsUI({ data: bills })// sélectionne le paramètre data => bills
      document.body.innerHTML = html// place le contenu du html dans document.body.innerHTML pour le DOM
      const bill= new Bills({//récupère les paramètres document et onNavigate de la new bill dans la variable bill
        document,
        onNavigate: (pathname) => document.body.innerHTML = ROUTES({ pathname })//récupère le pathname de l'url comme étant '#employee/bills' dans la variable onNavigate
      })  
      const allIconEye = screen.getAllByTestId('icon-eye')//icon-eye dans variable allIconEye
      expect(allIconEye).toBeTruthy()// vérifie si l'id "allIconEye" est la
      const iconEye1 = allIconEye[0]//attribue la valeur en position 0 dans l'array dans la variable iconEye1
      const handleClickIconEye = jest.fn(bill.handleClickIconEye(iconEye1))
      iconEye1.addEventListener('click', handleClickIconEye)//si click sur iconEye1, lancer handleClickIconEye
      expect(iconEye1).toBeTruthy() //vérifie si "iconEye1" est la    
      fireEvent.click(iconEye1)//créer un évent click et dispatche cet évent sur le DOM node en paramètre
      expect(handleClickIconEye).toHaveBeenCalled()//Vérifie que handleClickIconEye a été appelée
      const modale = document.getElementById('modaleFile')//place modalFile dans variable modale
      expect(modale).toBeTruthy()//vérifie si "modale" est la  
      expect(modale).toHaveTextContent('Justificatif')//vérifie si "modale" contient le texte "Justificatif"
       
    })
})

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to BillUI", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(store, "get") // fonction simulée qui surveille l'appel de la méthode GET de l'objet store mocké
       const bills = await store.get() //récupère les données du store mocké
       expect(getSpy).toHaveBeenCalledTimes(1) //store.get a été appelé 1 fois
       expect(bills.data.length).toBe(4) // les données contiennent 4 objets
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      store.get.mockImplementationOnce(() => // simule un rejet de la promesse
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
