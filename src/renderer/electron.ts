export interface CustomWindow extends Window {
  customAttribute: any
}

const { ipc } = window.electron

export { ipc }
