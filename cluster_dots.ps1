
Add-Type -AssemblyName System.Drawing
$filePath = "C:/Users/Administrator.User-2026SSEEIF/.gemini/antigravity/brain/65db6ac3-305e-42c2-93e6-aa6a67d67715/.user_uploaded/media_1793846206245_37310e3a.png"
$bmp = [System.Drawing.Bitmap]::FromFile($filePath)

# Scan all dots across the entire image and print them
$dots = @()
for ($y = 10; $y -lt $bmp.Height; $y += 2) {
    for ($x = 0; $x -lt $bmp.Width; $x += 2) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.B -gt 195 -and $c.G -gt 185 -and $c.R -gt 115 -and $c.R -lt 190) {
            $dots += [PSCustomObject]@{ X = $x; Y = $y }
        }
    }
}
Write-Host "Total dot pixels found: $($dots.Count)"
# Cluster dots into connected dots
$clusters = @()
foreach ($d in $dots) {
    $found = $false
    foreach ($cl in $clusters) {
        if ([math]::Abs($cl.X - $d.X) -le 8 -and [math]::Abs($cl.Y - $d.Y) -le 8) {
            $cl.X = [math]::Round(($cl.X * $cl.Count + $d.X) / ($cl.Count + 1))
            $cl.Y = [math]::Round(($cl.Y * $cl.Count + $d.Y) / ($cl.Count + 1))
            $cl.Count++
            $found = $true
            break
        }
    }
    if (-not $found) {
        $clusters += [PSCustomObject]@{ X = $d.X; Y = $d.Y; Count = 1 }
    }
}
Write-Host "Unique dots count: $($clusters.Count)"
# Filter clusters with Count >= 2
$validDots = $clusters | Where-Object { $_.Count -ge 2 }
foreach ($vd in $validDots | Sort-Object Y) {
    Write-Host "Dot at X=$($vd.X), Y=$($vd.Y)"
}

$bmp.Dispose()
