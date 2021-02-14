//open and close modal
const Modal = {
  
  open() {
    document.querySelector('.new-transaction').classList.add('invisible', 'opacity-0', 'hidden')
    document.querySelector('.modal-overlay').classList.remove('invisible', 'opacity-0', 'hidden')
  },
  close() {
    document.querySelector('.new-transaction').classList.remove('invisible', 'opacity-0', 'hidden')
    document.querySelector('.modal-overlay').classList.add('invisible', 'opacity-0', 'hidden')
  }
}

// save data on local storage
const Storage = {
  
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },

  set(transactions) {
    localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
  }
}

// sum incomes and expenses ~ show total
const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)
    App.reload()
  },
  remove(index) {
    Transaction.all.splice(index, 1)
    App.reload()

  },

  incomes() {
    let income = 0;
    Transaction.all.forEach((transaction)=>{
      if(transaction.amount > 0) {
        income = income + transaction.amount;
      }
    })
    return income;
  },

  expenses() {
    let expense = 0;
    Transaction.all.forEach((transaction)=>{
      if(transaction.amount < 0) {
        expense = expense + transaction.amount
      }
    })
    return expense;
  },

  total() {
    return Transaction.incomes() + Transaction.expenses()
  }
}

// transactions's table ~ balance (incomes, expenses and total)
const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'), 
  
  addTransaction(transaction, index) {
      const tr = document.createElement('tr')
      tr.classList.add('bg-gray-50', 'hover:bg-white', 'transition-colors', 'duration-300')
      tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
      tr.dataset.index = index
      
      DOM.transactionContainer.appendChild(tr)

  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "text-green-400" : "text-red-500"
    
    const amount = Utils.formatCurrency(transaction.amount)

    const html = ` 
      <td class="text-gray-700 p-4">${transaction.description}</td>
      <td class="${CSSclass} p-4">${amount}</td>
      <td class="text-gray-600 p-4">${transaction.date}</td>
      <td class="p-4 cursor-pointer"> <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remove"> </td>
    `
    return html
  },
  
  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
  },

  clearTransactions() {
    DOM.transactionContainer.innerHTML = ""
  }
}

// format currency
const Utils = {
  formatAmount(value) {
    value = Number(value) * 100
    return Math.round(value)
  },

  formatDate(date) {
    const splittedDate = date.split("-")
    return `${splittedDate[1]}/${splittedDate[2]}/${splittedDate[0]}`
  },

  formatCurrency(value) {
    const signs = Number(value) < 0 ? "-" : ""

    //transform in number without signs
    value = String(value).replace(/\D/g, "")
    
    //transform number to decimals
    value = Number(value) / 100
    
    //add currency
    value = value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    })
    return signs + value
  }
}

// form
const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validadeFields() {
    const { description, amount, date } = Form.getValues()
    if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
      throw new Error("Please fill in all fields to add your transaction")
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues()
    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)
    
    return { description, amount, date }
  },

  clearFields() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },

  submit(event) {
    event.preventDefault()

    try { 
      Form.validadeFields()
      const transaction = Form.formatValues()
      Transaction.add(transaction)
      Form.clearFields()
      Modal.close()

    } catch(error) {
      alert(error.message)
    }
  },  
}

//calls
const App = {
  init() {
   Transaction.all.forEach(DOM.addTransaction)

   DOM.updateBalance()

   Storage.set(Transaction.all)
  },

   reload() {
    DOM.clearTransactions()
    App.init()
   },
}

 App.init()

