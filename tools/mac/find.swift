// Finds a button by its label in a screenshot and prints its box in percent of the picture (top-left origin).
// Vision reads the label; the box then grows from the label over the button's own background colour, so the
// click target is the real button, not the text inside it. Labels without a filled background get the text box
// plus a small pad.
// Usage: swift tools/mac/find.swift <picture.png> "<label>" [nth]
import AppKit
import Foundation
import Vision

let args = Array(CommandLine.arguments.dropFirst())
guard args.count >= 2, let img = NSImage(contentsOfFile: args[0]), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
  FileHandle.standardError.write("usage: find.swift <picture> <label> [nth]\n".data(using: .utf8)!)
  exit(2)
}
let label = args[1].lowercased()
let nth = args.count > 2 ? Int(args[2]) ?? 0 : 0

let req = VNRecognizeTextRequest()
req.recognitionLevel = .accurate
req.usesLanguageCorrection = false
try VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])

let W = cg.width, H = cg.height
var hits: [(CGRect, String)] = []
for obs in req.results ?? [] {
  guard let top = obs.topCandidates(1).first, top.string.lowercased().contains(label) else { continue }
  let range = top.string.lowercased().range(of: label)!
  let nsRange = NSRange(range, in: top.string)
  let box = (try? top.boundingBox(for: Range(nsRange, in: top.string)!))?.boundingBox ?? obs.boundingBox
  hits.append((CGRect(x: box.minX * Double(W), y: (1 - box.maxY) * Double(H), width: box.width * Double(W), height: box.height * Double(H)), top.string))
}
hits.sort { ($0.0.minY, $0.0.minX) < ($1.0.minY, $1.0.minX) }
guard nth < hits.count else {
  print("{\"found\":false,\"count\":\(hits.count)}")
  exit(1)
}
let (text, line) = hits[nth]

let rep = NSBitmapImageRep(cgImage: cg)
func px(_ x: Int, _ y: Int) -> (Double, Double, Double) {
  let c = rep.colorAt(x: max(0, min(W - 1, x)), y: max(0, min(H - 1, y)))?.usingColorSpace(.deviceRGB)
  return (Double(c?.redComponent ?? 0), Double(c?.greenComponent ?? 0), Double(c?.blueComponent ?? 0))
}
func near(_ a: (Double, Double, Double), _ b: (Double, Double, Double)) -> Bool { abs(a.0 - b.0) + abs(a.1 - b.1) + abs(a.2 - b.2) < 0.09 }

// Background just left of the label, at its vertical middle.
let midY = Int(text.midY)
let probe = Int(text.minX) - max(4, Int(text.height * 0.4))
let bg = px(probe, midY)
let page = px(2, 2)
var rect = text.insetBy(dx: -max(6, text.height * 0.4), dy: -max(6, text.height * 0.4))
var grown = false
if !near(bg, page) {
  var l = probe, r = Int(text.maxX) + (Int(text.minX) - probe), t = midY, b = midY
  while l > 0 && near(px(l - 1, midY), bg) { l -= 1 }
  while r < W - 1 && near(px(r + 1, midY), bg) { r += 1 }
  let probeX = probe
  while t > 0 && near(px(probeX, t - 1), bg) { t -= 1 }
  while b < H - 1 && near(px(probeX, b + 1), bg) { b += 1 }
  if r - l > Int(text.width) && b - t >= Int(text.height) { rect = CGRect(x: l, y: t, width: r - l + 1, height: b - t + 1); grown = true }
}
let pct = { (v: Double, of: Int) in (v / Double(of) * 10000).rounded() / 100 }
let out: [String: Any] = [
  "found": true, "line": line, "grown": grown,
  "text": [pct(text.minX, W), pct(text.minY, H), pct(text.width, W), pct(text.height, H)],
  "target": [pct(rect.minX, W), pct(rect.minY, H), pct(rect.width, W), pct(rect.height, H)],
]
print(String(data: try JSONSerialization.data(withJSONObject: out, options: [.sortedKeys]), encoding: .utf8)!)
