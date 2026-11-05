
Add-Type -AssemblyName System.Drawing
$filePath = "C:/Users/Administrator.User-2026SSEEIF/.gemini/antigravity/brain/65db6ac3-305e-42c2-93e6-aa6a67d67715/.user_uploaded/media_1793846206245_37310e3a.png"
$bmp = [System.Drawing.Bitmap]::FromFile($filePath)

# Scan PomPomPurin (yellow: R > 230, G > 220, B in 100..180)
$purinX = @()
$purinY = @()
for ($y = 150; $y -lt 250; $y++) {
    for ($x = 180; $x -lt 280; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 240 -and $c.G -gt 230 -and $c.B -gt 130 -and $c.B -lt 190) {
            $purinX += $x
            $purinY += $y
        }
    }
}
$minPx = ($purinX | Measure-Object -Minimum).Minimum
$maxPx = ($purinX | Measure-Object -Maximum).Maximum
$minPy = ($purinY | Measure-Object -Minimum).Minimum
$maxPy = ($purinY | Measure-Object -Maximum).Maximum
Write-Host "PomPomPurin center: $([math]::Round(($minPx + $maxPx)/2)), $([math]::Round(($minPy + $maxPy)/2))"

# Scan Kitty (blue overalls: R < 80, G < 120, B > 130, around y = 350..420, x = 180..260)
$kittyX = @()
$kittyY = @()
for ($y = 350; $y -lt 430; $y++) {
    for ($x = 180; $x -lt 260; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 80 -and $c.B -gt 130) {
            $kittyX += $x
            $kittyY += $y
        }
    }
}
$minKx = ($kittyX | Measure-Object -Minimum).Minimum
$maxKx = ($kittyX | Measure-Object -Maximum).Maximum
$minKy = ($kittyY | Measure-Object -Minimum).Minimum
$maxKy = ($kittyY | Measure-Object -Maximum).Maximum
Write-Host "Hello Kitty center: $([math]::Round(($minKx + $maxKx)/2)), $([math]::Round(($minKy + $maxKy)/2))"

# Scan Pochacco (black ears/shirt around y = 80..160, x = 100..180)
$pochaccoX = @()
$pochaccoY = @()
for ($y = 80; $y -lt 160; $y++) {
    for ($x = 100; $x -lt 180; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 40 -and $c.G -lt 40 -and $c.B -lt 40) {
            $pochaccoX += $x
            $pochaccoY += $y
        }
    }
}
$minPox = ($pochaccoX | Measure-Object -Minimum).Minimum
$maxPox = ($pochaccoX | Measure-Object -Maximum).Maximum
$minPoy = ($pochaccoY | Measure-Object -Minimum).Minimum
$maxPoy = ($pochaccoY | Measure-Object -Maximum).Maximum
Write-Host "Pochacco center: $([math]::Round(($minPox + $maxPox)/2)), $([math]::Round(($minPoy + $maxPoy)/2))"

$bmp.Dispose()
