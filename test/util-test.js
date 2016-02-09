import expect from 'expect';
import {resolveKey} from '../src/util';
describe('util', function () {


    it('#resolveKey', function () {

        expect(resolveKey('stuff', '.other')).toBe('stuff.other');
        expect(resolveKey(null, 'me')).toBe('me');
        expect(resolveKey('stuff', '..other')).toBe('other');
    });
});