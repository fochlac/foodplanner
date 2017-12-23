export const runtime = {
    register: Promise.resolve.bind(null, {
        pushManager: {getSubscription: () => true}
    })
};