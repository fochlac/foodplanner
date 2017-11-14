let counter = 1;
export const Api = {
    createComment: () => Promise.resolve({json: () => Promise.resolve({id: counter++})})
}