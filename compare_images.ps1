
Add-Type -AssemblyName System.Drawing

$goods1_user = "C:/Users/Administrator.User-2026SSEEIF/.gemini/antigravity/brain/65db6ac3-305e-42c2-93e6-aa6a67d67715/.user_uploaded/media_1793848130742_057501e4.jpg"
$bmpUser = [System.Drawing.Bitmap]::FromFile($goods1_user)
# In mobile goods image 057501e4.jpg:
# Goods card 1 is around y=120..270, x=20..360
# Goods card 2 is around y=380..540, x=20..360
# Goods card 3 is around y=650..820, x=20..360

Write-Host "Comparing candidate files in images/img-dt..."

$list = Get-ChildItem "images/img-dt" -Include "sanrio-dt_*.jpg","sanrio-dt_*.png" -Recurse
foreach ($file in $list) {
    $bmp = [System.Drawing.Bitmap]::FromFile($file.FullName)
    # Sample a 5x5 grid average color
    $r = 0; $g = 0; $b = 0; $count = 0
    for ($y = 20; $y -lt $bmp.Height; $y += [math]::Max(1, [math]::Floor($bmp.Height/10))) {
        for ($x = 20; $x -lt $bmp.Width; $x += [math]::Max(1, [math]::Floor($bmp.Width/10))) {
            $c = $bmp.GetPixel($x, $y)
            $r += $c.R; $g += $c.G; $b += $c.B; $count++
        }
    }
    $avgR = [math]::Round($r / $count)
    $avgG = [math]::Round($g / $count)
    $avgB = [math]::Round($b / $count)
    Write-Host "$($file.Name): $($bmp.Width)x$($bmp.Height) Avg: ($avgR, $avgG, $avgB)"
    $bmp.Dispose()
}
$bmpUser.Dispose()
