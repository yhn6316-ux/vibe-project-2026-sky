
Add-Type -AssemblyName System.Drawing

$files = @(
  "images/img-dt/sanrio-dt_5.png",
  "images/img-dt/sanrio-dt_6.png",
  "images/img-dt/sanrio-dt_7.png",
  "images/img-dt/sanrio-dt_8.png",
  "images/img-dt/sanrio-dt_9.png"
)

foreach ($f in $files) {
    $bmp = [System.Drawing.Bitmap]::FromFile($f)
    # Check if lines are gray/white (transparent background)
    $nonTrans = 0
    $avgR = 0; $avgG = 0; $avgB = 0
    for ($y = 0; $y -lt $bmp.Height; $y += 10) {
        for ($x = 0; $x -lt $bmp.Width; $x += 10) {
            $c = $bmp.GetPixel($x, $y)
            if ($c.A -gt 30) {
                $nonTrans++
                $avgR += $c.R; $avgG += $c.G; $avgB += $c.B
            }
        }
    }
    if ($nonTrans -gt 0) {
        $avgR = [math]::Round($avgR / $nonTrans)
        $avgG = [math]::Round($avgG / $nonTrans)
        $avgB = [math]::Round($avgB / $nonTrans)
    }
    Write-Host "$f : nonTrans=$nonTrans, avgColor=($avgR, $avgG, $avgB)"
    $bmp.Dispose()
}
