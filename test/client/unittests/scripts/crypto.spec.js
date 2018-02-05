import { generateHash, urlBase64ToUint8Array } from 'UTILS/crypto.js'

describe('urlBase64ToUint8Array', () => {
  test('should create a a uint8 array from provided string', () => {
    expect(JSON.stringify(urlBase64ToUint8Array('asdawdqe123eqwd'))).toEqual(
      '{"0":106,"1":199,"2":90,"3":193,"4":218,"5":158,"6":215,"7":109,"8":222,"9":171,"10":7}',
    )
    expect(JSON.stringify(urlBase64ToUint8Array('asdawQWEqwd'))).toEqual('{"0":106,"1":199,"2":90,"3":193,"4":5,"5":132,"6":171,"7":7}')
    expect(JSON.stringify(urlBase64ToUint8Array('asdawQWEqw123eqWEQd'))).toEqual(
      '{"0":106,"1":199,"2":90,"3":193,"4":5,"5":132,"6":171,"7":13,"8":118,"9":221,"10":234,"11":150,"12":17,"13":7}',
    )
  })
})

/*describe('generateHash', () => {
  test(
    'should create a Hash from provided string',
     async () => {
      expect(await generateHash('twqeeasdasdasdassa'))
      	.toEqual('PE6TRVITisI390HsWF4fvg');
      expect(await generateHash('asdawQWEqwd'))
      	.toEqual('ZySF8tUZOTHCExX3XA3GHQ');
      expect(await generateHash('test'))
      	.toEqual('rpwtCTuUbtZzY1pObChv0w');
    }
  );
});*/
