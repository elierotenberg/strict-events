function createEvents(EVENTS) {
  let REV_EVENTS;
  if(__DEV__) {
    EVENTS.should.be.an.Object;
    _.each(EVENTS, (event, key) => {
      event.should.be.a.String;
      key.should.be.a.String;
    });
    const numValues = _.size(_.values(EVENTS));
    const numUniqValues = _.size(_.uniq(_.values(EVENTS)));
    numValues.should.be.exactly(numUniqValues, 'All events must be unique.');
    REV_EVENTS = _.invert(EVENTS);
  }

  let _Listener, _Emitter;

  let _id = 0;

  class Events {
    constructor() {
      this._handlers = {};
      this._listener = new _Listener(this);
      this._emitter = new _Emitter(this);
      this.reset();
    }

    get listener() {
      return this._listener;
    }

    set listener() {
      throw new TypeError();
    }

    get emitter() {
      return this._emitter;
    }

    set emitter() {
      throw new TypeError();
    }

    reset() {
      _.each(EVENTS, (event) => this._handlers[event] = {});
    }

    on(event, handler) {
      if(__DEV__) {
        event.should.be.a.String;
        handler.should.be.a.Function;
        REV_EVENTS.should.have.property(event);
      }
      const i = `${event}${_id}`;
      _id = _id + 1;
      this._handlers[event][i] = handler;
      return [event, i];
    }

    off([event, i]) {
      if(__DEV__) {
        event.should.be.a.String;
        i.should.be.a.String;
        REV_EVENTS.should.have.property(event);
        this._handlers[event].should.have.property(i);
      }
      delete this._handlers[event][i];
    }

    trigger(event, params = {}) {
      if(__DEV__) {
        event.should.be.a.String;
        REV_EVENTS.should.have.property(event);
        params.should.be.an.Object;
      }
      _.each(this._handlers[event], (handler) => handler(params));
    }
  }

  Object.assign(Events.prototype, {
    _handlers: null,
    _listener: null,
    _emitter: null,
  });

  class EventsProxy {
    constructor(events) {
      if(__DEV__) {
        events.should.be.an.instanceOf(Events);
      }
      this._events = events;
    }
  }

  EventsProxy.prototype._events = null;

  class Listener extends EventsProxy {
    on() {
      return this._events.on.apply(this._events, arguments);
    }

    off() {
      return this._events.off.apply(this._events, arguments);
    }
  }

  class Emitter extends EventsProxy {
    trigger() {
      return this._events.trigger.apply(this._events, arguments);
    }
  }

  _Listener = Listener;
  _Emitter = Emitter;

  Object.assign(Events, { Listener, Emitter });

  return Events;
}

module.exports = createEvents;
