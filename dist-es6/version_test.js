import { version_core } from './index';
describe('version', function () {
    it('version is contained', function () {
        var expected = require('../package.json').version;
        expect(version_core).toBe(expected);
    });
});
//# sourceMappingURL=version_test.js.map