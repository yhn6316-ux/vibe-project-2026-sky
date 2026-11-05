
Add-Type -AssemblyName System.Drawing

# Ranking 1: sanrio-dt_87.jpg
# Ranking 2: sanrio-dt_88.jpg
# Ranking 3: sanrio-dt_89.jpg
# Ranking 4: sanrio-dt_90.jpg
# Ranking 5: sanrio-dt_91.jpg

# Goods card 1: Elis Natura (pastels, pink banner at bottom: 11.1 ... )
# Goods card 2: Microfiber Don Quijote (cyan banner: マイクロファイバーシリーズ)
# Goods card 3: Hello Kitty watch (two watches: red/gold and black/silver, top red banner: HELLO KITTY)

# Let's inspect sanrio-dt_57, 58, 59, 80, 27, 29, 32, 33, 34
$testFiles = @("sanrio-dt_57.jpg", "sanrio-dt_58.jpg", "sanrio-dt_59.jpg", "sanrio-dt_80.jpg", "sanrio-dt_27.jpg", "sanrio-dt_29.jpg", "sanrio-dt_32.jpg", "sanrio-dt_33.jpg", "sanrio-dt_34.jpg", "sanrio-dt_61.jpg")

foreach ($name in $testFiles) {
    $path = "images/img-dt/$name"
    $bmp = [System.Drawing.Bitmap]::FromFile($path)
    # Check top-left, top-middle, bottom-middle pixels
    $topMid = $bmp.GetPixel(340, 20)
    $botMid = $bmp.GetPixel(340, 360)
    Write-Host "$name : topMid=($($topMid.R), $($topMid.G), $($topMid.B)) botMid=($($botMid.R), $($botMid.G), $($botMid.B))"
    $bmp.Dispose()
}
