"""Sample Natural Earth land (world-atlas land-110m, public domain) onto an
even grid and write the land points the globe draws as dots.

Usage: python tools/globe_points.py path/to/land-110m.json
Writes src/data/globe.json as a flat [lat, lng, lat, lng, ...] array.
"""
import json
import math
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
topo = json.load(open(sys.argv[1]))
sx, sy = topo["transform"]["scale"]
tx, ty = topo["transform"]["translate"]

# Decode delta-encoded, quantised arcs into lng/lat
arcs = []
for arc in topo["arcs"]:
    x = y = 0
    pts = []
    for dx, dy in arc:
        x += dx
        y += dy
        pts.append((x * sx + tx, y * sy + ty))
    arcs.append(pts)


def ring(indexes):
    out = []
    for i in indexes:
        pts = arcs[i] if i >= 0 else list(reversed(arcs[~i]))
        out.extend(pts if not out else pts[1:])
    return out


polygons = []
for geom in topo["objects"]["land"]["geometries"]:
    if geom["type"] == "Polygon":
        polygons.append([ring(r) for r in geom["arcs"]])
    elif geom["type"] == "MultiPolygon":
        for poly in geom["arcs"]:
            polygons.append([ring(r) for r in poly])

# Bounding boxes speed up the point-in-polygon test
boxes = []
for poly in polygons:
    xs = [p[0] for p in poly[0]]
    ys = [p[1] for p in poly[0]]
    boxes.append((min(xs), min(ys), max(xs), max(ys)))


def inside(pt, r):
    x, y = pt
    hit = False
    j = len(r) - 1
    for i in range(len(r)):
        xi, yi = r[i]
        xj, yj = r[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi:
            hit = not hit
        j = i
    return hit


def on_land(lng, lat):
    for (x0, y0, x1, y1), poly in zip(boxes, polygons):
        if x0 <= lng <= x1 and y0 <= lat <= y1 and inside((lng, lat), poly[0]):
            if not any(inside((lng, lat), hole) for hole in poly[1:]):
                return True
    return False


# Rows spaced evenly by latitude; points per row shrink towards the poles so
# the dots stay evenly spaced on the sphere.
STEP = 2.2
points = []
lat = -84.0
while lat <= 84.0:
    count = max(1, int(round(360 / STEP * math.cos(math.radians(lat)))))
    for k in range(count):
        lng = -180 + (k + 0.5) * 360 / count
        if on_land(lng, lat):
            points.extend([round(lat, 2), round(lng, 2)])
    lat += STEP

out = os.path.join(ROOT, "src", "data", "globe.json")
json.dump(points, open(out, "w"), separators=(",", ":"))
print(len(points) // 2, "land points,", os.path.getsize(out), "bytes")
