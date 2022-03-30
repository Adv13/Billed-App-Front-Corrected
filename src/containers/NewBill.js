import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"
import {localStorageMock} from '../__mocks__/localStorage.js'

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }
  handleChangeFile = e => {
    e.preventDefault()
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    console.log('file', file);//afficher dans la console
    const filePath = e.target.value.split(/\\/g)
    console.log('file' , filePath);
    const fileName = filePath[filePath.length-1]
    console.log('filename' , fileName);
    const formData = new FormData()// créé un nouvel objet "form" vide
    console.log('formData', formData);
    const email = JSON.parse(localStorage.getItem("user")).email//récupère l'email
    console.log('email' , email);
    formData.append('file', file)//ajoute une clef valeur à formData
    formData.append('email', email)//ajoute une clef valeur à formData

    // test du format de l'image
    if(fileName.endsWith('jpg'|| 'jpeg' || 'png')){      
      this.store 
        .bills()
        .create({
          data: formData,
          headers: {
            noContentType: true
          }
        })
        .then(({fileUrl, key}) => {
          console.log(fileUrl)
          this.billId = key
          this.fileUrl = fileUrl
          this.fileName = fileName
        }).catch(error => console.error(error))
    }else{
      alert('Format non supporté. Veuillez sélectionner un média au format .jpg , .jpeg ou .png.' )
      return
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.updateBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  //istanbul ignore next
  updateBill = (bill) => {
    if (this.firestore) {
      this.firestore
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
  }
}