export const firebase = {
  firestore: {
    FieldValue: {
      serverTimestamp: () => new Date()
    }
  }
};

export const db = {
  collection: () => ({
    add: async () => ({}),
    doc: () => ({ update: async () => {} })
  })
};
