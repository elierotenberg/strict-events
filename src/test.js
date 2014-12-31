const createEventsClass = require('../');

let test;

// define a finite events set.
// values don't matter, they must only be unique.
const EVENTS = {
  A: 'a',
  B: 'b',
  C: 'c',
};

// alternatively you could write
// const EVENTS = _.invert(['A', 'B', 'C']);

// create a new Events class for this events set
const Events = createEventsClass(EVENTS);

// instanciate a new Events object
const events = new Events();
// extract a listener and an emitter
const { listener, emitter } = events;

// listener and emitter cannot be (mistakenly) overwritten
test = false;
try { events.listener = null; }
catch(e) { test = true; }
test.should.be.true;

test = false;
try { events.emitter = null; }
catch(e) { test = true; }
test.should.be.true;

// typecheck using instanceof
events.should.be.an.instanceOf(Events);
listener.should.be.an.instanceOf(Events.Listener);
emitter.should.be.an.instanceOf(Events.Emitter);

test = false;
// bind a handler
listener.on(EVENTS.A, (params) => {
  params.should.have.property('foo', 'bar');
  test = true;
});
test.should.be.false;
// synchronously trigger events with a params object
emitter.trigger(EVENTS.A, { foo: 'bar' });
test.should.be.true;

let count = 0;
// listener.on returns a reference
let ref = listener.on(EVENTS.C, ({ incr }) => count = count + incr);
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
  emitter.trigger('d');
}
catch(e) {
  test = true;
}
test.should.be.true;

// clear all handlers references
events.reset();
test = false;
// this won't call the previously bind callback
events.trigger(EVENTS.A, {});
test.should.be.false;
