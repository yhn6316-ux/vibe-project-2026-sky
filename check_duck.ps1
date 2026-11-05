
Add-Type -AssemblyName System.Drawing

# Let's inspect where the strokes are in sanrio-dt_5..9 to identify the character
# Ahiru no Pekkle: head is oval/duck-like with bill in the middle, wings, webbed feet
foreach ($num in 5..9) {
    $f = "images/img-dt/sanrio-dt_$num.png"
    $bmp = [System.Drawing.Bitmap]::FromFile($f)
    $minX = 600; $maxX = 0; $minY = 600; $maxY = 0
    for ($y = 0; $y -lt $bmp.Height; $y += 5) {
        for ($x = 0; $x -lt $bmp.Width; $x += 5) {
            if ($bmp.GetPixel($x, $y).A -gt 30) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    Write-Host "$f bounds: X=$minX..$maxX, Y=$minY..$maxY"
    $bmp.Dispose()
}
