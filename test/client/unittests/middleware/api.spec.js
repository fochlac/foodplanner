import { apiMiddleware } from 'STORE/middleware/api.js'
const myfetch = global.fetch

describe('api', () => {
  test('should call the api correctly', async () => {
    let act = {
        type: 'test',
        status: 'initialized',
        api: {
          method: 'get',
          url: 'testurl',
          body: { test: 'test123' },
        },
        enqueue: () => 'test123',
      },
      act2 = {
        type: 'test2',
        status: 'hidden',
        api: {
          headers: 'formdata',
          method: 'get',
          url: 'testurl2',
          body: { test: 'test1232' },
        },
      },
      act4 = {
        type: 'test2',
        status: 'hidden',
        api: {
          headers: 'formdata',
          method: 'get',
          url: 'testurl2',
          body: { test: 'test1232' },
        },
      },
      act3 = {
        type: 'test2',
        status: 'hidden',
      }

    global.fetch = (url, options) => {
      expect(url).toBe('test/' + act.api.url)
      expect(options.method).toBe(act.api.method)
      expect(options.headers.Accept).toBe('application/json')
      expect(options.headers['Content-Type']).toBe('application/json')
      expect(options.body).toBe(JSON.stringify(act.api.body))

      return Promise.resolve({
        status: 200,
        headers: { get: () => Date.now() - 1500 },
        json: () => Promise.resolve('test1'),
      })
    }

    await new Promise(resolve => {
      apiMiddleware({
        dispatch: action => {
          if (action.type === act.type) {
            expect(action.status).toBe('complete')
            expect(action.data).toBe('test1')
          } else {
            expect(action).toBe('test123')
            resolve()
          }
        },
        getState: () => ({
          instance: {
            subdomain: true,
            root: 'test/',
          },
        }),
      })(action => {
        expect(action).toEqual(act)
      })(act)
    })

    global.fetch = (url, options) => {
      expect(url).toBe(act2.api.url)
      expect(options.method).toBe(act2.api.method)
      expect(options.body).toEqual(act2.api.body)
      expect(options.headers.Accept).toBe('application/json')
      expect(options.headers['Content-Type']).toBe(undefined)

      return Promise.resolve({
        status: 200,
        headers: { get: () => Date.now() - 1500 },
        json: () => Promise.resolve('test1'),
      })
    }

    await new Promise(resolve => {
      apiMiddleware({
        dispatch: action => {
          expect(action.status).toBe('complete')
          expect(action.data).toBe('test1')
          resolve()
        },
        getState: () => ({
          instance: {
            root: '',
          },
        }),
      })(action => {
        expect(action).toEqual(act2)
      })(act2)
    })

    act2.status = 'hidden'
    global.fetch = (url, options) => {
      return Promise.reject('error')
    }

    await new Promise(resolve => {
      apiMiddleware({
        dispatch: action => {
          expect(action.status).toBe('failure')
          expect(action.data).toBe('error')
          resolve()
        },
        getState: () => ({
          instance: {
            subdomain: true,
            root: '',
          },
        }),
      })(action => {
        expect(action).toEqual(act2)
      })(act2)
    })

    global.fetch = (url, options) => {
      return Promise.resolve({
        status: 500,
        headers: { get: () => Date.now() - 1500 },
        json: () => {
          return Promise.resolve('testerror')
        },
      })
    }

    await new Promise(resolve => {
      apiMiddleware({
        dispatch: action => {
          expect(action.status).toBe('failure')
          expect(action.data).toBe('testerror')
          resolve()
        },
        getState: () => ({
          instance: {
            subdomain: true,
            root: '',
          },
        }),
      })(action => {
        expect(action).toEqual(act4)
      })(act4)
    })

    await new Promise(resolve => {
      apiMiddleware({
        getState: () => ({
          instance: {
            subdomain: true,
            root: '',
          },
        }),
      })(action => {
        expect(action).toEqual(act3)
        resolve()
      })(act3)
    })
    global.fetch = myfetch
  })
})
