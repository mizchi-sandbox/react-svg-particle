{DOM} = React

# dirty shotcut to Math.random()
Object.defineProperty window, 'r', get: -> Math.random()

addParticle = (world) ->
  ball = Physics.body 'circle',
    x: 640 * r
    y: 240 * r
    vx: 0.5 - r
    vy: 0.5 - r
    radius: 5

  world.add(ball)

Renderer = React.createClass
  getInitialState: ->
    bodies: []

  onClick: ->
    addParticle(@props.world)

  render: ->
    DOM.svg
      className: 'content'
      width: 640
      height: 480
      style:
        backgroundColor: 'white'
      onClick: @onClick
    , @state.bodies.map (body) =>
      if body.radius? # TODO: use shape type detection
        DOM.circle
          key: body.uid
          cx: body.state.pos.x
          cy: body.state.pos.y
          r: body.radius
          style:
            fill: 'none'
            stroke: 'red'

$ =>
  world = Physics
    integrator: 'verlet'
    maxIPF: 16
    timestep: 1000.0 / 300

  viewportBounds = Physics.aabb(0, 0, 640, 480)
  edgeBounce = Physics.behavior 'edge-collision-detection',
    aabb: viewportBounds
    restitution: 0.99
    cof: 0.99

  gravity = Physics.behavior 'constant-acceleration',
    acc:
      x : 0
      y: 0.0004

  renderer = React.renderComponent (Renderer {world}), document.body

  world.add [
    Physics.behavior('constant-acceleration')
    Physics.behavior('body-impulse-response')
    Physics.behavior('body-collision-detection')
    Physics.behavior('sweep-prune')
    edgeBounce
    gravity
  ]

  for i in [1..30]
    addParticle(world)

  Physics.util.ticker.on (time) ->
    world.step(time)
    bodies = world.getBodies()
    bodies.forEach (body) ->
      if (body.state.pos.x < 0 and  640 < body.state.pos.x) or \
         (body.state.pos.y < 0 and  480 < body.state.pos.y)
        world.remove body
    renderer.setState bodies: world.getBodies()
  Physics.util.ticker.start()
