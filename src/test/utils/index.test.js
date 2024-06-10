import {expect} from 'chai';
import {createHash} from '../../../src/utils.js'

describe('Test de la libreria de encriptacion de Utils', () =>{
    it('La funcuin de encriptacion debe generar un password encriptado', async function () {
        //Given
        const passwordMock = "123Abc"

        //Then
        const result = await createHash(passwordMock)
        

        //Asset
        expect(result).not.to.be.NaN
        expect(result).not.to.be.undefined
        expect(result).not.to.be.null
        expect(result).not.to.be.empty
        expect(result).not.equal(passwordMock)
    })
})
