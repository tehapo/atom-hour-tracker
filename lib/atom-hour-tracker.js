'use babel';

import AtomHourTrackerView from './atom-hour-tracker-view';
import { CompositeDisposable } from 'atom';

export default {

  atomHourTrackerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomHourTrackerView = new AtomHourTrackerView(state.atomHourTrackerViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomHourTrackerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-hour-tracker:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomHourTrackerView.destroy();
  },

  serialize() {
    return {
      atomHourTrackerViewState: this.atomHourTrackerView.serialize()
    };
  },

  toggle() {
    console.log('AtomHourTracker was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
