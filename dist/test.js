"use strict";

require("6to5/polyfill");var _ = require("lodash");var should = require("should");var Promise = (global || window).Promise = require("bluebird");var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;__DEV__ ? Promise.longStackTraces() : void 0;var createEventsClass = require("../");

var test = undefined;

// define a finite events set.
// values don't matter, they must only be unique.
var EVENTS = {
  A: "a",
  B: "b",
  C: "c" };

// alternatively you could write
// const EVENTS = _.invert(['A', 'B', 'C']);

// create a new Events class for this events set
var Events = createEventsClass(EVENTS);

// instanciate a new Events object
var events = new Events();
// extract a listener and an emitter
var listener = events.listener;
var emitter = events.emitter;


// listener and emitter cannot be (mistakenly) overwritten
test = false;
try {
  events.listener = null;
} catch (e) {
  test = true;
}
test.should.be.true;

test = false;
try {
  events.emitter = null;
} catch (e) {
  test = true;
}
test.should.be.true;

// typecheck using instanceof
events.should.be.an.instanceOf(Events);
listener.should.be.an.instanceOf(Events.Listener);
emitter.should.be.an.instanceOf(Events.Emitter);

test = false;
// bind a handler
listener.on(EVENTS.A, function (params) {
  params.should.have.property("foo", "bar");
  test = true;
});
test.should.be.false;
// synchronously trigger events with a params object
emitter.trigger(EVENTS.A, { foo: "bar" });
test.should.be.true;

var count = 0;
// listener.on returns a reference
var ref = listener.on(EVENTS.C, function (_ref) {
  var incr = _ref.incr;
  return count = count + incr;
});
emitter.trigger(EVENTS.C, { incr: 5 });
count.should.be.exactly(5);
// this reference can be used with .off to remove a previously
// attached handler
listener.off(ref);
emitter.trigger(EVENTS.C, { incr: 42 });
count.should.be.exactly(5);
test = false;
try {
  // this event is not in the predefined set: it will throw
  emitter.trigger("d");
} catch (e) {
  test = true;
}
test.should.be.true;

// clear all handlers references
events.reset();
test = false;
// this won't call the previously bind callback
events.trigger(EVENTS.A, {});
test.should.be.false;