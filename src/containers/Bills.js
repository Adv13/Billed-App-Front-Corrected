import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document //le body
    this.onNavigate = onNavigate//méthode onNavigate du router
    this.firestore = firestore
    //sélection du bouton nouvelle note de frais et déclenchement de la méthode handleClickNewBill au click
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    //sélection des icones oeils et déclenchement de la méthode handleClickIconEye au click
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })
  }
  // envoi sur la page newBill au click sur buttonNewBill
  handleClickNewBill = e => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }
  //ouvre la modale d'affichage de la photo justificative de la note de frais au click sur l'icone oeil
  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url")
    //filtre sur les extensions des images
    if(billUrl.includes('jpg'||'jpeg'||'png')){
      const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
      $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} /></div>`)
      $('#modaleFile').modal('show')
    }
  
  }

  // not need to cover this function by tests
  //va récupérer les notes de frais stocker dans firestore 
  getBills = () => {
    //récupère l'email de l'utilisateur connecté
    const userEmail = localStorage.getItem('user') ?
      JSON.parse(localStorage.getItem('user')).email : ""
    if (this.firestore) {
      return this.firestore
      .bills()
      .get()
      .then(snapshot => {
        let test = snapshot.docs.map(doc=>  doc.data())      
        console.log('tests' , test); 
        const bills = snapshot.docs
          .map(doc => {
            try {
              return {
                ...doc.data(),
                // date: formatDate(doc.data().date), // ???? pourquoi quand on le leve ça trie les dates correctement
                status: formatStatus(doc.data().status)
              }
            } catch(e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              console.log(e,'for',doc.data())
              return {
                ...doc.data(),
                date: doc.data().date,
                status: formatStatus(doc.data().status)
              }
            }
          })
          //les filtre en fonction de l'utilisateur connecté
          .filter(bill => bill.email === userEmail)
          console.log('length', bills.length)
        return bills // retourne les notes de frais filtrées
      })
      .catch(error => error)
    }
  }
}