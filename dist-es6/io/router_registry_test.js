import * as tf from '../index';
import { BrowserIndexedDB, browserIndexedDB } from './indexed_db';
import { BrowserLocalStorage, browserLocalStorage } from './local_storage';
import { IORouterRegistry } from './router_registry';
describe('IORouterRegistry', function () {
    var localStorageRouter = function (url) {
        var scheme = 'localstorage://';
        if (url.startsWith(scheme)) {
            return browserLocalStorage(url.slice(scheme.length));
        }
        else {
            return null;
        }
    };
    var indexedDBRouter = function (url) {
        var scheme = 'indexeddb://';
        if (url.startsWith(scheme)) {
            return browserIndexedDB(url.slice(scheme.length));
        }
        else {
            return null;
        }
    };
    var tempRegistryInstance = null;
    beforeEach(function () {
        tempRegistryInstance = IORouterRegistry.instance;
        IORouterRegistry.instance = null;
    });
    afterEach(function () {
        IORouterRegistry.instance = tempRegistryInstance;
    });
    it('getSaveHandler succeeds', function () {
        IORouterRegistry.registerSaveRouter(localStorageRouter);
        IORouterRegistry.registerSaveRouter(indexedDBRouter);
        var out1 = tf.io.getSaveHandlers('localstorage://foo-model');
        expect(out1.length).toEqual(1);
        expect(out1[0] instanceof BrowserLocalStorage).toEqual(true);
        var out2 = tf.io.getSaveHandlers('indexeddb://foo-model');
        expect(out2.length).toEqual(1);
        expect(out2[0] instanceof BrowserIndexedDB).toEqual(true);
    });
    it('getLoadHandler succeeds', function () {
        IORouterRegistry.registerLoadRouter(localStorageRouter);
        IORouterRegistry.registerLoadRouter(indexedDBRouter);
        var out1 = tf.io.getLoadHandlers('localstorage://foo-model');
        expect(out1.length).toEqual(1);
        expect(out1[0] instanceof BrowserLocalStorage).toEqual(true);
        var out2 = tf.io.getLoadHandlers('indexeddb://foo-model');
        expect(out2.length).toEqual(1);
        expect(out2[0] instanceof BrowserIndexedDB).toEqual(true);
    });
    it('getSaveHandler fails', function () {
        IORouterRegistry.registerSaveRouter(localStorageRouter);
        expect(tf.io.getSaveHandlers('invalidscheme://foo-model')).toEqual([]);
        expect(tf.io.getLoadHandlers('localstorage://foo-model')).toEqual([]);
    });
});
//# sourceMappingURL=router_registry_test.js.map