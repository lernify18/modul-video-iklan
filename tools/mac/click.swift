// Brings one app window to the front and clicks a point given in percent of that window.
// Usage: swift tools/mac/click.swift <pid> <windowId> <xPct> <yPct> [right]
import AppKit
import CoreGraphics
import Foundation

let a = Array(CommandLine.arguments.dropFirst())
guard a.count >= 4, let pid = Int32(a[0]), let wid = Int(a[1]), let xp = Double(a[2]), let yp = Double(a[3]) else {
  FileHandle.standardError.write("usage: click.swift <pid> <windowId> <xPct> <yPct>\n".data(using: .utf8)!)
  exit(2)
}
guard AXIsProcessTrusted() else {
  FileHandle.standardError.write("not trusted: allow this app in System Settings > Privacy & Security > Accessibility\n".data(using: .utf8)!)
  exit(3)
}
let info = CGWindowListCopyWindowInfo([.optionIncludingWindow], CGWindowID(wid)) as? [[String: Any]] ?? []
guard let b = info.first?[kCGWindowBounds as String] as? [String: Double] else {
  FileHandle.standardError.write("window \(wid) not found\n".data(using: .utf8)!)
  exit(4)
}
NSRunningApplication(processIdentifier: pid)?.activate()
usleep(350_000)
let p = CGPoint(x: (b["X"] ?? 0) + (b["Width"] ?? 0) * xp / 100, y: (b["Y"] ?? 0) + (b["Height"] ?? 0) * yp / 100)
// "right" opens the context menu (Finder's New Folder), for a window the tools opened themselves.
let right = a.count > 4 && a[4] == "right"
let (down, up, button): (CGEventType, CGEventType, CGMouseButton) = right ? (.rightMouseDown, .rightMouseUp, .right) : (.leftMouseDown, .leftMouseUp, .left)
for type in [CGEventType.mouseMoved, down, up] {
  CGEvent(mouseEventSource: nil, mouseType: type, mouseCursorPosition: p, mouseButton: button)?.post(tap: .cghidEventTap)
  usleep(type == down ? 60_000 : 120_000)
}
print("\(right ? "right-" : "")clicked \(Int(p.x)),\(Int(p.y))")
