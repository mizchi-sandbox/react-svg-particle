(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DOM, Renderer, addParticle;

DOM = React.DOM;

Object.defineProperty(window, 'r', {
  get: function() {
    return Math.random();
  }
});

addParticle = function(world) {
  var ball;
  ball = Physics.body('circle', {
    x: 640 * r,
    y: 240 * r,
    vx: 0.5 - r,
    vy: 0.5 - r,
    radius: 5
  });
  return world.add(ball);
};

Renderer = React.createClass({
  getInitialState: function() {
    return {
      bodies: []
    };
  },
  onClick: function() {
    return addParticle(this.props.world);
  },
  render: function() {
    return DOM.svg({
      className: 'content',
      width: 640,
      height: 480,
      style: {
        backgroundColor: 'white'
      },
      onClick: this.onClick
    }, this.state.bodies.map((function(_this) {
      return function(body) {
        return DOM.circle({
          key: body.uid,
          cx: body.state.pos.x,
          cy: body.state.pos.y,
          r: body.radius,
          style: {
            fill: 'none',
            stroke: 'red'
          }
        });
      };
    })(this)));
  }
});

$((function(_this) {
  return function() {
    var gravity, i, renderer, viewportBounds, world, _i;
    world = Physics({
      integrator: 'verlet',
      maxIPF: 16,
      timestep: 1000.0 / 300
    });
    gravity = Physics.behavior('constant-acceleration', {
      acc: {
        x: 0,
        y: 0.0004
      }
    });
    world.add(gravity);
    viewportBounds = Physics.aabb(0, 0, 640, 480);
    world.add(Physics.behavior('edge-collision-detection', {
      aabb: viewportBounds,
      restitution: 0.99,
      cof: 0.99
    }));
    world.add(Physics.behavior('body-impulse-response'));
    renderer = React.renderComponent(Renderer({
      world: world
    }), document.body);
    Physics.util.ticker.on(function(time) {
      var bodies;
      world.step(time);
      bodies = world.getBodies();
      bodies.forEach(function(body) {
        if ((body.state.pos.x < 0 && 640 < body.state.pos.x) || (body.state.pos.y < 0 && 480 < body.state.pos.y)) {
          return world.remove(body);
        }
      });
      return renderer.setState({
        bodies: world.getBodies()
      });
    });
    for (i = _i = 1; _i <= 100; i = ++_i) {
      addParticle(world);
    }
    return Physics.util.ticker.start();
  };
})(this));


},{}]},{},[1])