
Add-Type -AssemblyName System.Drawing
$filePath = "C:/Users/Administrator.User-2026SSEEIF/.gemini/antigravity/brain/65db6ac3-305e-42c2-93e6-aa6a67d67715/.user_uploaded/media_1793846206245_37310e3a.png"
$bmp = [System.Drawing.Bitmap]::FromFile($filePath)

# Scan from x=260 to 380, across y=200..300 to see if dotted line continues inside or outside the card
for ($y = 200; $y -lt 300; $y += 5) {
    for ($x = 270; $x -lt $bmp.Width; $x += 2) {
        $c = $bmp.GetPixel($x, $y)
        # Check cyan dots
        if ($c.B -gt 195 -and $c.G -gt 185 -and $c.R -gt 115 -and $c.R -lt 190) {
            Write-Host "Dot at X=$x, Y=$y"
        }
    }
}
$bmp.Dispose()
