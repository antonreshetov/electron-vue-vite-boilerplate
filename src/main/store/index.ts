import createAppStore from './module/app'

export async function createStore() {
  return { app: await createAppStore() }
}
