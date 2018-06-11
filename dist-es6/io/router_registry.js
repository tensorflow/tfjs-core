var IORouterRegistry = (function () {
    function IORouterRegistry() {
        this.saveRouters = [];
        this.loadRouters = [];
    }
    IORouterRegistry.getInstance = function () {
        if (IORouterRegistry.instance == null) {
            IORouterRegistry.instance = new IORouterRegistry();
        }
        return IORouterRegistry.instance;
    };
    IORouterRegistry.registerSaveRouter = function (saveRouter) {
        IORouterRegistry.getInstance().saveRouters.push(saveRouter);
    };
    IORouterRegistry.registerLoadRouter = function (loadRouter) {
        IORouterRegistry.getInstance().loadRouters.push(loadRouter);
    };
    IORouterRegistry.getSaveHandlers = function (url) {
        return IORouterRegistry.getHandlers(url, 'save');
    };
    IORouterRegistry.getLoadHandlers = function (url) {
        return IORouterRegistry.getHandlers(url, 'load');
    };
    IORouterRegistry.getHandlers = function (url, handlerType) {
        var validHandlers = [];
        var routers = handlerType === 'load' ? this.getInstance().loadRouters :
            this.getInstance().saveRouters;
        routers.forEach(function (router) {
            var handler = router(url);
            if (handler !== null) {
                validHandlers.push(handler);
            }
        });
        return validHandlers;
    };
    return IORouterRegistry;
}());
export { IORouterRegistry };
//# sourceMappingURL=router_registry.js.map