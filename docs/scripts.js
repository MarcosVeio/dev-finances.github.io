const Modal = {
    open(){
        // Abrir modal
        // Adicionar a class active ao modal
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close(){
        // Fechar modal
        // Remover a class active no modal
        document.querySelector('.modal-overlay')
        .classList.remove('active')
    },
}

const StorageX = {
    get() {
      return localStorage.getItem('dev.finance:theme') || '';
    },
    set(value) {
      localStorage.setItem('dev.finance:theme', value);
    },
  };
  
  const ThemeSwitch = {
    page: document.querySelector('html'),
    widget: document.querySelector('.theme-switch-label'),
    input: document.querySelector('#theme-switch'),
    circle: document.querySelector('.theme-switch-circle'),
    link: document.querySelector('a'),
    th: document.querySelector('table thead tr th'),
    modal: document.querySelector('.modal'),
    qualquer: document.querySelector('.help'),
    marcos: document.querySelector('.marcos'),
    isThemeActive: localStorage.getItem('dev.finance:theme') || '',
  
    init() {
      if (ThemeSwitch.isThemeActive !== '') {
        ThemeSwitch.page.classList.toggle('night-mode');
        ThemeSwitch.link.classList.toggle('dark');
        ThemeSwitch.th.classList.toggle('dark');
        ThemeSwitch.modal.classList.toggle('black');
        ThemeSwitch.qualquer.classList.toggle('dark');
        ThemeSwitch.marcos.classList.toggle('dark');
      }
    },
    update() {
      ThemeSwitch.page.classList.toggle('night-mode');
      ThemeSwitch.link.classList.toggle('dark');
      ThemeSwitch.th.classList.toggle('dark');
      ThemeSwitch.modal.classList.toggle('black');
      ThemeSwitch.qualquer.classList.toggle('dark');
      ThemeSwitch.marcos.classList.toggle('dark');
      
  
      ThemeSwitch.page.classList.contains('night-mode')
        ? (ThemeSwitch.input.value = 'night-mode')
        : (ThemeSwitch.input.value = '');
  
      let x = ThemeSwitch.input.value;
      ThemeSwitch.save(x);
    },
    save(value) {
      localStorage.setItem('dev.finance:theme', value);
    },
  };
  
  const ThemeCheck = {};
  
  ThemeSwitch.init();
  ThemeSwitch.widget.addEventListener('click', ThemeSwitch.update);

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.fincances:transactions")) || []
    },

    set(transaction) {
        localStorage.setItem("dev.fincances:transactions", JSON.stringify
        (transaction))
    }
}

const Transaction = {
    all: Storage.get(),


    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        if (Transaction.incomes() === 0 && Transaction.expenses() === 0) {
        App.reload
    }

        App.reload()
    },

     incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income;
     },

     expenses(){
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense;
     },

     total(){
        
        Transaction.all.forEach(transaction => {
            if((Transaction.incomes()+Transaction.expenses()) < 0) {
                document.querySelector('.card.total').classList.add('red');
            } else {
                document.querySelector('.card.total')
                .classList.remove('red')
                
            }
        })
        return Transaction.incomes()+ Transaction.expenses()
        
     },

}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense" 

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `   
             <td class="description">${transaction.description}</td>
             <td class="${CSSclass}">${amount}</td>
             <td class="date">${transaction.date}</td>
             <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
             </td>        
        `
        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML= Utils.formatCurrency(Transaction.incomes(0))
        document
            .getElementById('expenseDisplay')
            .innerHTML= Utils.formatCurrency(Transaction.expenses(0))
        document
            .getElementById('totalDisplay')
            .innerHTML= Utils.formatCurrency(Transaction.total(0))
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value){
        value = value * 100
        
        return Math.round(value)
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency:"BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        const {description, amount, date} = Form.getValues()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues(){
        let {description, amount, date} = Form.getValues()

        amount= Utils.formatAmount(amount)

        date= Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    
    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
    }
}

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


