export const createInstance = ({ name, mail, hash, address, company, subdomain }) => ({
  type: 'CREATE_INSTANCE',
  status: 'initialized',
  api: {
    url: `/api/instance`,
    method: 'POST',
    body: {
      name,
      mail,
      hash,
      address,
      company,
      subdomain,
    },
  },
})

export const checkDomain = subdomain => ({
  type: 'CHECK_DOMAIN',
  status: 'hidden',
  busyType: 'domainCheck',
  api: {
    url: `/api/instance/domain?subdomain=${subdomain}`,
    method: 'get',
  },
})

export const setAdmin = ({ user, admin }) => ({
  type: 'SET_ADMIN',
  status: 'initialized',
  user,
  admin,
  api: {
    url: `/api/user/${user}/admin`,
    method: admin ? 'post' : 'delete',
  },
})

export const deleteUser = ({ user }) => ({
  type: 'DELETE_USER',
  status: 'initialized',
  user,
  api: {
    url: `/api/user/${user}`,
    method: 'delete',
  },
})

export const loadAllUsers = instance => ({
  type: 'LOAD_ALL_USERS',
  status: 'initialized',
  api: {
    url: `/${instance}/api/user`,
    method: 'get',
  },
})

export const loadAllTransactions = instance => ({
  type: 'LOAD_ALL_TRANSACTIONS',
  status: 'initialized',
  api: {
    url: `/${instance}/api/payment/transactions`,
    method: 'get',
  },
})

export const loadInstance = instance => ({
  type: 'LOAD_INSTANCE',
  status: 'initialized',
  api: {
    url: `/api/instance/${instance}`,
    method: 'get',
  },
})

export const validateGmail = instance => ({
  type: 'VALIDATE_MAIL',
  status: 'hidden',
  busyType: 'gmail',
  instance,
  api: {
    url: `/${instance}/api/mail/validate`,
    method: 'get',
  },
})

export const saveGmail = (instance, { gmail_user, gmail_pass }) => ({
  type: 'SAVE_MAIL',
  status: 'hidden',
  busyType: 'gmail',
  instance,
  api: {
    url: `/${instance}/api/mail/`,
    method: 'post',
    body: {
      gmail_user,
      gmail_pass,
    },
  },
})

export const saveInstanceData = (instance, { icon, title, company, address, lang, name }) => ({
  type: 'SAVE_INSTANCE',
  status: 'hidden',
  busyType: 'saveInstance',
  instance,
  api: {
    url: `/api/instance/${instance}`,
    method: 'put',
    body: {
      instance,
      icon,
      title,
      company,
      address,
      lang,
      name,
    },
  },
})
