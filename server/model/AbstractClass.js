const _ = require('underscore');
var AbstractClass = function (){
    var self = this;
    if(self.initialize && typeof self.initialize == "function") self.initialize.apply(this, arguments);
};

_.extend(AbstractClass.prototype, {
    get: function(attr) {
      return this[attr];
    },
    set: function(key, val) {
        if (key == null) return this;
        this[key] = val;
    },
    getClassName: function(){
        return this.className;
    },
    initialize: function(){
        //console.log("Entro al initialize del AbstractClass");
    }
});

AbstractClass.extend = function(protoProps, staticProps) {
    var parent = this;
    var child;
    if (protoProps && _.has(protoProps, 'initialize')) {
      child = function(){ this.isClass=true; return protoProps.initialize.apply(this, arguments)};
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }
    child = _.extend(child, parent, staticProps);
    child.prototype = _.create(parent.prototype, protoProps);
    child.prototype.constructor = child;
    child.prototype.__super = parent.prototype;
    return child;
}
module.exports = AbstractClass;
