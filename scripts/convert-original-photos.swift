import AppKit
import ImageIO

// macOS ImageIO understands HEIC orientation and colour profiles natively.
let sourceRoot = URL(fileURLWithPath: CommandLine.arguments[1])
let temporaryRoot = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
try FileManager.default.createDirectory(at: temporaryRoot, withIntermediateDirectories: true)
let manifestPath = CommandLine.arguments.count > 3 ? CommandLine.arguments[3] : "scripts/original-media.json"
let manifest = try JSONSerialization.jsonObject(with: Data(contentsOf: URL(fileURLWithPath: manifestPath))) as! [[String: Any]]
for entry in manifest where entry["kind"] as? String == "image" {
    let source = sourceRoot.appendingPathComponent(entry["file"] as! String)
    let imageSource = CGImageSourceCreateWithURL(source as CFURL, nil)!
    let image = CGImageSourceCreateThumbnailAtIndex(imageSource, 0, [kCGImageSourceCreateThumbnailFromImageAlways: true, kCGImageSourceCreateThumbnailWithTransform: true, kCGImageSourceThumbnailMaxPixelSize: 2560] as CFDictionary)!
    let context = CGContext(data: nil, width: image.width, height: image.height, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    context.draw(image, in: CGRect(x: 0, y: 0, width: image.width, height: image.height))
    let representation = NSBitmapImageRep(cgImage: context.makeImage()!)
    let output = temporaryRoot.appendingPathComponent((entry["id"] as! String) + ".png")
    try representation.representation(using: .png, properties: [:])!.write(to: output)
    print(output.path)
}
