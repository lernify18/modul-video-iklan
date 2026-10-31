// Prints whether this process may post clicks (macOS Accessibility). Pass --ask to show the system prompt once.
import ApplicationServices
import Foundation

let ask = CommandLine.arguments.contains("--ask")
let opts = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: ask] as CFDictionary
print(AXIsProcessTrustedWithOptions(opts) ? "trusted" : "not-trusted")
