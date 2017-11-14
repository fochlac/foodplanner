import { urlHandler } from 'STORE/middleware/urlHandler.js'

describe('urlHandler', () => {
  test('should set the history correctly', () => {
    let act = { content: 'test', option: 'test2', title: 'title', url: 'test3' }

    global.history.pushState = (data, title, url) => {
      expect(data.app.dialog.type).toBe(act.content)
      expect(data.app.dialog.option).toBe(act.option)
      expect(title).toBe(act.title)
      expect(url).toBe(act.url)
    }

    urlHandler({
      getState: () => ({
        instance: {
          root: '',
        },
      }),
    })(action => {
      expect(action).toEqual(act)
    })(act)

    global.history.pushState = undefined
  })

  test('should set the history correctly', () => {
    let act = { content: 'test', option: 'test2', title: 'title', url: 'test3' }

    global.history.pushState = (data, title, url) => {
      expect(data.app.dialog.type).toBe(act.content)
      expect(data.app.dialog.option).toBe(act.option)
      expect(title).toBe(act.title)
      expect(url).toBe('asdaw' + act.url)
    }

    urlHandler({
      getState: () => ({
        instance: {
          root: 'asdaw',
        },
      }),
    })(action => {
      expect(action).toEqual(act)
    })(act)

    global.history.pushState = undefined
  })
})
