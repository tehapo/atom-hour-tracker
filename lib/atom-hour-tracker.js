'use babel'

import './hour-balance-element'
import { CompositeDisposable } from 'atom'

export default {

  statusBarTile: null,
  subscriptions: null,
  saveSubscription: null,
  days: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],

  activate() {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(
      atom.commands.add('atom-text-editor[data-grammar="source hours txt"]', {
        'atom-hour-tracker:start-a-day': () => this.insertDayStart()
      })
    )
    this.subscriptions.add(
      atom.workspace.onDidChangeActivePaneItem(this.onActivePaneChange.bind(this))
    )
  },

  deactivate() {
    this.subscriptions.dispose()
    this.disposeSaveSubscription()
    if (this.statusBarTile) {
      this.statusBarTile.destroy()
      this.statusBarTile = null
    }
  },

  disposeSaveSubscription() {
    if (this.saveSubscription) {
      this.saveSubscription.dispose()
      this.saveSubscription = null
    }
  },

  onActivePaneChange(paneItem) {
    const isVisible = this.updateStatusVisibility(paneItem)

    this.disposeSaveSubscription()
    if (isVisible) {
      this.saveSubscription = paneItem.onDidSave(this.updateBalance.bind(this))
      this.updateBalance()
    }
  },

  zeroPad(number) {
    return number < 10 ? '0' + number : number
  },

  insertDayStart() {
    const editor = atom.workspace.getActiveTextEditor()
    const now = new Date()
    const dateString = `${this.days[now.getDay()]} ${now.getDate()}.${now.getMonth() + 1}`
    const hoursString = `${this.zeroPad(now.getHours())}.${this.zeroPad(now.getMinutes())} - xx.xx`
    editor.insertText(`${dateString}\n${hoursString}`)
  },

  consumeStatusBar(statusBar) {
    const hourBalance = document.createElement('hour-balance')
    this.statusBarTile = statusBar.addRightTile({
      item: hourBalance,
      priority: 0
    })

    // Initial update.
    this.onActivePaneChange(atom.workspace.getActivePaneItem())
  },

  updateStatusVisibility(paneItem) {
    const isVisible = paneItem && paneItem.getGrammar && paneItem.getGrammar().scopeName === 'source.hours.txt'
    this.statusBarTile.item.style.display = isVisible ? '' : 'none'
    return isVisible
  },

  round(hours) {
    return hours.toFixed(2)
  },

  updateBalance() {
    // Non-comment, non-empty lines.
    const lines = atom.workspace.getActiveTextEditor()
                                .getText()
                                .split('\n')
                                .filter(line => !line.startsWith('#') && !(line.trim().length === 0))

    // Each weekday is counted as 7.5 hours target.
    const target = lines
      .reduce((target, line) => target + /^(Ma|Ti|Ke|To|Pe)/.test(line) ? 7.5 : 0, 0)

    // Parse all modifiers.
    const modifierRegex = /(-?[0-9]+\.[0-9]+)h/
    const modifiers = lines
      .filter(line => modifierRegex.test(line))
      .map(line => parseFloat(line.match(modifierRegex)[1]))

    // Parse all timespan markings.
    const timespanRegex = /^([0-9]{2}).([0-9]{2}) - ([0-9]{2}).([0-9]{2})/
    const hourMarkings = lines
      .filter(line => line.match(timespanRegex))
      .map(line => {
        const timeMatches = line.match(timespanRegex)
        const hours = parseInt(timeMatches[3], 10) - parseInt(timeMatches[1], 10)
        const mins = parseInt(timeMatches[4], 10) - parseInt(timeMatches[2], 10)
        return hours + mins / 60
      })

    const total = [...modifiers, ...hourMarkings].reduce((total, hours) => total + hours)
    this.statusBarTile.item.total = this.round(total)
    this.statusBarTile.item.balance = this.round(total - target)
  }

}
