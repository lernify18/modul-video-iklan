// Blurs private regions of a picture in place (emails, names, chat titles). Regions are in percent: x,y,w,h.
// Usage: swift tools/mac/mask.swift <in.png> <out.png> <x,y,w,h> [x,y,w,h ...]
import AppKit
import CoreImage
import Foundation

let a = Array(CommandLine.arguments.dropFirst())
guard a.count >= 3, let src = CIImage(contentsOf: URL(fileURLWithPath: a[0])) else {
  FileHandle.standardError.write("usage: mask.swift <in> <out> <x,y,w,h>...\n".data(using: .utf8)!)
  exit(2)
}
let W = src.extent.width, H = src.extent.height
var img = src
for spec in a.dropFirst(2) {
  let n = spec.split(separator: ",").compactMap { Double($0) }
  guard n.count == 4 else { continue }
  // CoreImage puts the origin at the bottom-left.
  let r = CGRect(x: n[0] / 100 * W, y: H - (n[1] + n[3]) / 100 * H, width: n[2] / 100 * W, height: n[3] / 100 * H).integral
  let blurred = src.clampedToExtent().applyingGaussianBlur(sigma: max(8, r.height * 0.35)).cropped(to: r)
  img = blurred.composited(over: img)
}
let ctx = CIContext()
guard let cg = ctx.createCGImage(img, from: src.extent) else { exit(5) }
let rep = NSBitmapImageRep(cgImage: cg)
try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[1]))
print("masked \(a.count - 2) region(s)")
