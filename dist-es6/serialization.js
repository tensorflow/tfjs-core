var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.getClassName = function () {
        return this.constructor
            .className;
    };
    Serializable.fromConfig = function (cls, config) {
        return new cls(config);
    };
    return Serializable;
}());
export { Serializable };
var SerializationMap = (function () {
    function SerializationMap() {
        this.classNameMap = {};
    }
    SerializationMap.getMap = function () {
        if (SerializationMap.instance == null) {
            SerializationMap.instance = new SerializationMap();
        }
        return SerializationMap.instance;
    };
    SerializationMap.register = function (cls) {
        this.getMap().classNameMap[cls.className] = [cls, cls.fromConfig];
    };
    return SerializationMap;
}());
export { SerializationMap };
//# sourceMappingURL=serialization.js.map