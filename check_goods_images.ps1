
Add-Type -AssemblyName System.Drawing

function Check-File($path) {
    if (-not (Test-Path $path)) { return }
    $bmp = [System.Drawing.Bitmap]::FromFile($path)
    # Check width, height
    $w = $bmp.Width
    $h = $bmp.Height
    # Sample top-left, middle, etc.
    # Goods item 1: Elis Natura Sanrio characters collaboration (has pastel colors, pink/blue/purple napkins/packs)
    # Goods item 2: Microfiber series Don Quijote (pink/black/purple pijamas)
    # Goods item 3: Hello Kitty watch (red and black watches on white stand)
    # Ranking 1: ID photo holder (pastel holders)
    # Ranking 2: Fragaria Memories Cload badge (anime boy with purple/black hair)
    # Ranking 3: Hello Kitty secret mascot charm (pink ribbons, white kitties)
    # Ranking 4: Fragaria Memories Cload acrylic stand
    # Ranking 5: Fragaria Memories Hallrit badge (anime boy with red/white hair)
    Write-Host "$path : $w x $h"
    $bmp.Dispose()
}

Get-ChildItem "images/img-dt" -Filter "sanrio-dt_*.jpg" | ForEach-Object {
    Check-File $_.FullName
}
Get-ChildItem "images/img-dt" -Filter "sanrio-dt_*.png" | ForEach-Object {
    Check-File $_.FullName
}
