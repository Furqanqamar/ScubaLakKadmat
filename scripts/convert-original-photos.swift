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
    let crop = entry["crop"] as? [String: Int]
    let properties = CGImageSourceCopyPropertiesAtIndex(imageSource, 0, nil)! as NSDictionary
    // Crop in native, orientation-corrected pixels before making delivery sizes.
    // This trims excess background without upscaling or changing the original.
    let nativeMaximum = max(properties[kCGImagePropertyPixelWidth] as! Int, properties[kCGImagePropertyPixelHeight] as! Int)
    var image = CGImageSourceCreateThumbnailAtIndex(imageSource, 0, [kCGImageSourceCreateThumbnailFromImageAlways: true, kCGImageSourceCreateThumbnailWithTransform: true, kCGImageSourceThumbnailMaxPixelSize: crop == nil ? 2560 : nativeMaximum] as CFDictionary)!
    if let crop = crop {
        let rectangle = CGRect(x: crop["x"]!, y: crop["y"]!, width: crop["width"]!, height: crop["height"]!)
        precondition(rectangle.minX >= 0 && rectangle.minY >= 0 && rectangle.maxX <= CGFloat(image.width) && rectangle.maxY <= CGFloat(image.height), "Portrait crop must stay inside the supplied image")
        image = image.cropping(to: rectangle)!
    }
    let context = CGContext(data: nil, width: image.width, height: image.height, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    context.draw(image, in: CGRect(x: 0, y: 0, width: image.width, height: image.height))
    let representation = NSBitmapImageRep(cgImage: context.makeImage()!)
    let output = temporaryRoot.appendingPathComponent((entry["id"] as! String) + ".png")
    try representation.representation(using: .png, properties: [:])!.write(to: output)
    print(output.path)
}
