interface StoreSchema {
  bounds: object
}

export default async function createAppStore() {
  const { default: Store } = await import('electron-store')
  return new Store<StoreSchema>({
    name: 'app',
    schema: {
      bounds: {
        default: {},
        type: 'object',
      },
    },
  })
}
