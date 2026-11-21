# Donut transition

**Effect:** a donut chart with five rounded, padded slices and a slowly turning tick ring. Every two seconds the data changes: slices sweep to their new angles (not a straight-line morph) and the big centre percentage counts to its new value.

**Use it for:** dashboards, live KPIs, report pages. Any chart whose numbers change while people watch.

## Prompt

```
Animate a donut chart between datasets with D3 7.9.2.
- d3.pie().sort(null) (keep slice order stable) and d3.arc().innerRadius(60).outerRadius(84).cornerRadius(5).padAngle(0.035) in a viewBox "-100 -100 200 200".
- Store each path's current angles on the node (this._cur). On update: paths.data(pie(newData)).transition().duration(1100).ease(d3.easeExpOut).attrTween("d", function (d) { const i = d3.interpolate(this._cur, d); this._cur = i(1); return (t) => arc(i(t)); }).
- Centre label: .transition().textTween(() => { const i = d3.interpolateRound(old, pct); return (t) => i(t) + "%" }).
- Start from zero-angle arcs so the first draw sweeps in. Stop the interval off-screen. Reduced motion: draw the final arcs directly.
Start from templates/donut-transition/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `duration(1100)`, `easeExpOut` | Sweep speed and feel |
| `padAngle`, `cornerRadius` | Gap and roundness between slices |

## Pitfalls

- Transitioning `d` directly interpolates the path string and arcs fold through the centre. Interpolate the angles with attrTween.
- `pie().sort(null)`, or slices change order when values change and fly across the chart.
