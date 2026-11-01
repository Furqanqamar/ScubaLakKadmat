import AppKit
import ImageIO

// Delivery-size assets only: preserve the supplied artwork and its source file.
// A white circular badge keeps the black lettering visible on dark browser UI.
let source = URL(fileURLWithPath: CommandLine.arguments[1])
let output = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
guard let imageSource = CGImageSourceCreateWithURL(source as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(imageSource, 0, nil) else {
    fatalError("Could not read the supplied logo")
}
for size in [16, 32, 48, 96, 180, 192, 512] {
    let context = CGContext(data: nil, width: size, height: size, bitsPerComponent: 8, bytesPerRow: 0,
                            space: CGColorSpace(name: CGColorSpace.sRGB)!,
                            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    let canvas = CGRect(x: 0, y: 0, width: size, height: size)
    context.setAllowsAntialiasing(true)
    context.setShouldAntialias(true)
    context.addEllipse(in: canvas)
    context.clip()
    context.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
    context.fill(canvas)
    context.interpolationQuality = .high
    // Only the blank paper corners fall outside the badge; leave the full mark intact.
    let inset = CGFloat(size) * 0.02
    let available = canvas.insetBy(dx: inset, dy: inset)
    let scale = min(available.width / CGFloat(image.width), available.height / CGFloat(image.height))
    let width = CGFloat(image.width) * scale
    let height = CGFloat(image.height) * scale
    context.draw(image, in: CGRect(x: (CGFloat(size) - width) / 2, y: (CGFloat(size) - height) / 2,
                                   width: width, height: height))
    let bitmap = NSBitmapImageRep(cgImage: context.makeImage()!)
    try bitmap.representation(using: .png, properties: [:])!
        .write(to: output.appendingPathComponent("logo-\(size).png"))
}
