
Add-Type -AssemblyName System.Drawing
$filePath = "C:/Users/Administrator.User-2026SSEEIF/.gemini/antigravity/brain/65db6ac3-305e-42c2-93e6-aa6a67d67715/.user_uploaded/media_1793846206245_37310e3a.png"
$bmp = [System.Drawing.Bitmap]::FromFile($filePath)

# Scan a grid of cyan dots between Purin and Kitty
Write-Host "--- Scanning dots between y=140 and y=360 ---"
for ($y = 140; $y -lt 360; $y += 5) {
    for ($x = 180; $x -lt $bmp.Width; $x += 2) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.B -gt 195 -and $c.G -gt 185 -and $c.R -gt 115 -and $c.R -lt 190) {
            Write-Host "Dot at X=$x, Y=$y (dist to (95, 250): $([math]::Round([math]::Sqrt(($x-95)*($x-95) + ($y-250)*($y-250)), 1)))"
            break
        }
    }
}
$bmp.Dispose()
