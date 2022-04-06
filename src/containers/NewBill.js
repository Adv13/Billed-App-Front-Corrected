import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage}) {
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
    console.log('ok from containers NewBill.js');
    e.preventDefault()
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    console.log('file', file);//afficher dans la console
    const filePath = e.target.value.split(/\\/g)
    console.log('file' , filePath);//afficher le chemin dans la console
    const fileName = filePath[filePath.length-1]
    console.log('filename' , fileName);
    const formData = new FormData()// créé un nouvel objet "form" vide
    console.log('formData', formData);
    const email = JSON.parse(localStorage.getItem("user")).email//récupère l'email
    console.log('email' , email);
    formData.append('file', file)//ajoute une clef valeur à formData
    formData.append('email', email)//ajoute une clef valeur à formData

    //this.validFormat = true   // défini que le format est valide. A enlever pour simuler format refusé et afficher l'alerte

      // test du format de l'image
      if ( /\.(jpe?g|png)$/i.test(fileName) ){  
        //this.validFormat= true  // vérifie l'extension du fichier. A enlever pour simuler format refusé et afficher l'alerte        
          this.firestore 
            .bills()
            .create({
              data: formData,
              headers: {
                noContentType: true
              }
            })
            .then(({fileUrl, key}) => {
              this.billId = key
              this.fileUrl = fileUrl
              this.fileName = fileName
            }).catch(error => console.error(error))
    }else{
      alert('Format non supporté. Veuillez sélectionner un média au format .jpg , .jpeg ou .png uniquement.' ) // format non valide alert un mesg
      //this.validFormat = false // défini que le format est invalide. A enlever pour simuler format refusé et afficher l'alerte
      return 
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const email = JSON.parse(localStorage.getItem("user")).email
    if(this.validFormat === true){ //si le format du justificatif est valide on crée un nouveau bill
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
    else{ //sinon on empêche la soumission  du formulaire
      alert('Format du Justificatif non supporté. Veuillez le modifier.') //on demande à l'utilisateur de le modifier le format fichier si invalide
      return
    }
    
  }

  // not need to cover this function by tests
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