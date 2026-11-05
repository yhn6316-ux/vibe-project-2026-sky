
Add-Type -AssemblyName System.Drawing
$filePath = "C:/Users/Administrator.User-2026SSEEIF/.gemini/antigravity/brain/65db6ac3-305e-42c2-93e6-aa6a67d67715/.user_uploaded/media_1793843241817_b31f66ed.png"
$bmp = [System.Drawing.Bitmap]::FromFile($filePath)

# Kuromi is at the bottom, near x=140.
# Badtz is at top left, Tuxedosam top middle.
# Where is Badtz? Badtz is black (R < 50, G < 50, B < 50)
for ($y = 140; $y -lt 250; $y += 5) {
    for ($x = 20; $x -lt 80; $x += 5) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 50 -and $c.G -lt 50 -and $c.B -lt 50) {
            Write-Host "Badtz pixel at x=$x, y=$y"
        }
    }
}
$bmp.Dispose()
