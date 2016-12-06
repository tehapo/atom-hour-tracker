'use babel'

class HourBalanceElement extends HTMLElement {

  createdCallback() {
    this.classList.add('inline-block')
    this.innerHTML = '[<span id="total">0</span> | <span id="balance">0</span>]'
  }

  set total(total) {
    this.querySelector('#total').textContent = total
  }

  set balance(balance) {
    const balanceElem = this.querySelector('#balance')
    balanceElem.textContent = balance
    balanceElem.className = `text-${balance < 0 ? 'error' : 'success'}`
  }

}

document.registerElement('hour-balance', HourBalanceElement)
