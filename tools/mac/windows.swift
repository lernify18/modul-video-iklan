// Lists on-screen windows of one app as JSON: id (for `screencapture -l`), title and bounds in screen points.
// Usage: swift tools/mac/windows.swift <OwnerName>
import CoreGraphics
import Foundation

// Windows on another Space or hidden behind others are listed too, with onScreen false.
let owner = CommandLine.arguments.dropFirst().first ?? "Claude"
let info = CGWindowListCopyWindowInfo([.optionAll, .excludeDesktopElements], kCGNullWindowID) as? [[String: Any]] ?? []
var out: [[String: Any]] = []
for w in info where (w[kCGWindowOwnerName as String] as? String) == owner && (w[kCGWindowLayer as String] as? Int) == 0 {
  let b = w[kCGWindowBounds as String] as? [String: Double] ?? [:]
  out.append([
    "id": w[kCGWindowNumber as String] as? Int ?? 0,
    "pid": w[kCGWindowOwnerPID as String] as? Int ?? 0,
    "title": w[kCGWindowName as String] as? String ?? "",
    "onScreen": w[kCGWindowIsOnscreen as String] as? Bool ?? false,
    "x": b["X"] ?? 0, "y": b["Y"] ?? 0, "w": b["Width"] ?? 0, "h": b["Height"] ?? 0,
  ])
}
let data = try JSONSerialization.data(withJSONObject: out, options: [.prettyPrinted, .sortedKeys])
print(String(data: data, encoding: .utf8)!)
