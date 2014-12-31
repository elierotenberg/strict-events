"use strict";

var _slicedToArray = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else {
    var _arr = [];
    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }
};

var _inherits = function (child, parent) {
  child.prototype = Object.create(parent && parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (parent) child.__proto__ = parent;
};

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");var _ = require("lodash");var should = require("should");var Promise = (global || window).Promise = require("bluebird");var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;__DEV__ ? Promise.longStackTraces() : void 0;function createEvents(EVENTS, __DEV__) {
  var REV_EVENTS = undefined;
  if (__DEV__) {
    EVENTS.should.be.an.Object;
    _.each(EVENTS, function (event, key) {
      event.should.be.a.String;
      key.should.be.a.String;
    });
    var numValues = _.size(_.values(EVENTS));
    var numUniqValues = _.size(_.uniq(_.values(EVENTS)));
    numValues.should.be.exactly(numUniqValues, "All events must be unique.");
    REV_EVENTS = _.invert(EVENTS);
  }

  var _Listener = undefined, _Emitter = undefined;

  var _id = 0;

  var Events = function Events() {
    this._handlers = {};
    this._listener = new _Listener(this);
    this._emitter = new _Emitter(this);
    this.reset();
  };

  Events.prototype.reset = function () {
    var _this = this;
    _.each(EVENTS, function (event) {
      return _this._handlers[event] = {};
    });
  };

  Events.prototype.on = function (event, handler) {
    if (__DEV__) {
      event.should.be.a.String;
      handler.should.be.a.Function;
      REV_EVENTS.should.have.property(event);
    }
    var i = "" + event + "" + _id;
    _id = _id + 1;
    this._handlers[event][i] = handler;
    return [event, i];
  };

  Events.prototype.off = function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var event = _ref2[0];
    var i = _ref2[1];
    if (__DEV__) {
      event.should.be.a.String;
      i.should.be.a.String;
      REV_EVENTS.should.have.property(event);
      this._handlers[event].should.have.property(i);
    }
    delete this._handlers[event][i];
  };

  Events.prototype.trigger = function (event, params) {
    if (params === undefined) params = {};
    if (__DEV__) {
      event.should.be.a.String;
      REV_EVENTS.should.have.property(event);
      params.should.be.an.Object;
    }
    _.each(this._handlers[event], function (handler) {
      return handler(params);
    });
  };

  _prototypeProperties(Events, null, {
    listener: {
      get: function () {
        return this._listener;
      },
      set: function () {
        throw new TypeError();
      },
      enumerable: true
    },
    emitter: {
      get: function () {
        return this._emitter;
      },
      set: function () {
        throw new TypeError();
      },
      enumerable: true
    }
  });

  Object.assign(Events.prototype, {
    _handlers: null,
    _listener: null,
    _emitter: null });

  var EventsProxy = function EventsProxy(events) {
    if (__DEV__) {
      events.should.be.an.instanceOf(Events);
    }
    this._events = events;
  };

  EventsProxy.prototype._events = null;

  var Listener = function Listener() {
    if (EventsProxy) {
      EventsProxy.apply(this, arguments);
    }
  };

  _inherits(Listener, EventsProxy);

  Listener.prototype.on = function () {
    return this._events.on.apply(this._events, arguments);
  };

  Listener.prototype.off = function () {
    return this._events.off.apply(this._events, arguments);
  };

  var Emitter = function Emitter() {
    if (EventsProxy) {
      EventsProxy.apply(this, arguments);
    }
  };

  _inherits(Emitter, EventsProxy);

  Emitter.prototype.trigger = function () {
    return this._events.trigger.apply(this._events, arguments);
  };

  _Listener = Listener;
  _Emitter = Emitter;

  Object.assign(Events, { Listener: Listener, Emitter: Emitter });

  return Events;
}

module.exports = createEvents;