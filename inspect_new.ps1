
Add-Type -AssemblyName System.Drawing
$filePath = "C:/Users/Administrator.User-2026SSEEIF/.gemini/antigravity/brain/65db6ac3-305e-42c2-93e6-aa6a67d67715/.user_uploaded/media_1793846206245_37310e3a.png"
$bmp = [System.Drawing.Bitmap]::FromFile($filePath)
Write-Host "Image size: $($bmp.Width) x $($bmp.Height)"

# 1. Find Cinnamoroll card blue ring border (around y = 250, x from 150 to 388)
# The ring is light blue: e.g. R ~ 90-140, G ~ 180-210, B ~ 210-240 (#5ebcd6 or similar)
$ringLeft = 0
$ringRight = 0
for ($x = 100; $x -lt $bmp.Width; $x++) {
    $c = $bmp.GetPixel($x, 250)
    # Check blue border: B > 180, G > 160, R < 140
    if ($c.B -gt 180 -and $c.G -gt 150 -and $c.R -lt 140) {
        if ($ringLeft -eq 0) { $ringLeft = $x }
        $ringRight = $x
    }
}
Write-Host "Feature ring horizontal bounds at y=250: $ringLeft to $ringRight"

$centerX = [math]::Round(($ringLeft + $ringRight) / 2)
Write-Host "Feature Center X: $centerX"

$ringTop = 0
$ringBottom = 0
for ($y = 100; $y -lt $bmp.Height; $y++) {
    $c = $bmp.GetPixel($centerX, $y)
    if ($c.B -gt 180 -and $c.G -gt 150 -and $c.R -lt 140) {
        if ($ringTop -eq 0) { $ringTop = $y }
        $ringBottom = $y
    }
}
Write-Host "Feature ring vertical bounds at center X: $ringTop to $ringBottom"
$centerY = [math]::Round(($ringTop + $ringBottom) / 2)
Write-Host "Feature Center Y: $centerY"
Write-Host "Feature Diameter X: $($ringRight - $ringLeft), Diameter Y: $($ringBottom - $ringTop)"

# 2. Check the right edge of the ring: is it cut off by the image boundary?
Write-Host "Right edge of ring: $ringRight vs Image Width: $($bmp.Width)"

# 3. Find pastel badge center (the light blue circle on the left)
# Pastel color: R ~ 215-240, G ~ 235-250, B ~ 245-255
$badgeLeft = 0
$badgeRight = 0
for ($x = 0; $x -lt 250; $x++) {
    $c = $bmp.GetPixel($x, $centerY)
    if ($c.R -gt 210 -and $c.R -lt 240 -and $c.G -gt 230 -and $c.B -gt 240) {
        if ($badgeLeft -eq 0) { $badgeLeft = $x }
        $badgeRight = $x
    }
}
Write-Host "Badge horizontal bounds at centerY: $badgeLeft to $badgeRight"
$badgeCenterX = [math]::Round(($badgeLeft + $badgeRight) / 2)
Write-Host "Badge Center X: $badgeCenterX"

# 4. Find dotted circle points!
Write-Host "--- Scanning Dotted Circle Points ---"
for ($y = 40; $y -lt 470; $y += 10) {
    for ($x = 0; $x -lt $bmp.Width; $x += 2) {
        $c = $bmp.GetPixel($x, $y)
        # Dotted line is cyan/light-blue dots: B > 190, G > 180, R in 120..190
        if ($c.B -gt 195 -and $c.G -gt 185 -and $c.R -gt 115 -and $c.R -lt 190) {
            # exclude inside cinnamoroll or text
            Write-Host "Dot at X=$x, Y=$y (R=$($c.R), G=$($c.G), B=$($c.B))"
            break
        }
    }
}

$bmp.Dispose()
