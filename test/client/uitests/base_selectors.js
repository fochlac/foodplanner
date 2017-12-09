import { By } from 'selenium-webdriver';

export const S = {
    busy: By.className('busyBackground'),
    topbar: By.className('topbar'),
    userframe: By.className('userFrame'),
    uf: {
        registerLink: By.className('registerLink'),
        submit: By.css('.userFrame button'),
        loginMail: By.css('.userFrame > .mailFrame input'),
        registerMail: By.css('.userFrame > .register .mail'),
        registerName: By.css('.userFrame > .register .name'),

        username: By.className('userName')
    },
    dashboard: By.className('dashboard'),
    quicklinks: By.className('quicklinks'),
    ql: {
        settings: By.css('.quicklinks .fa-cog'),
        logout: By.css('.quicklinks .fa-sign-out'),
        createmeal: By.css('.quicklinks .fa-plus')
    }
}