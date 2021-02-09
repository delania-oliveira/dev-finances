const addTransaction = document.querySelector('.add-transaction');
const modalOverlay = document.querySelector('.modal-overlay');
const cancel = document.querySelector('.cancel');

addTransaction.addEventListener("click", ()=>{
    addTransaction.classList.add('invisible', 'opacity-0', 'hidden')
    modalOverlay.classList.remove('invisible', 'opacity-0', 'hidden')
})

cancel.addEventListener("click", ()=>{
    modalOverlay.classList.add('invisible', 'opacity-0', 'hidden')
    addTransaction.classList.remove('invisible', 'opacity-0', 'hidden')
})

