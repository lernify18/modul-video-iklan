// Reads every line of text in a picture with Apple Vision and prints JSON: text, confidence and box in percent of the
// picture (top-left origin), so a click target can be taken from the button's real label instead of placed by eye.
// Usage: swift tools/mac/ocr.swift <picture.png>
import AppKit
import Foundation
import Vision

guard let path = CommandLine.arguments.dropFirst().first,
      let img = NSImage(contentsOfFile: path),
      let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
  FileHandle.standardError.write("usage: ocr.swift <picture>\n".data(using: .utf8)!)
  exit(2)
}

let req = VNRecognizeTextRequest()
req.recognitionLevel = .accurate
req.usesLanguageCorrection = false
req.recognitionLanguages = ["en-US", "ms-MY"]
try VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])

var out: [[String: Any]] = []
for obs in req.results ?? [] {
  guard let top = obs.topCandidates(1).first else { continue }
  let b = obs.boundingBox
  out.append([
    "text": top.string,
    "conf": (Double(top.confidence) * 100).rounded() / 100,
    "x": (b.minX * 10000).rounded() / 100,
    "y": ((1 - b.maxY) * 10000).rounded() / 100,
    "w": (b.width * 10000).rounded() / 100,
    "h": (b.height * 10000).rounded() / 100,
  ])
}
let data = try JSONSerialization.data(withJSONObject: ["width": cg.width, "height": cg.height, "lines": out], options: [.sortedKeys])
print(String(data: data, encoding: .utf8)!)
