
Add-Type -AssemblyName System.Drawing

$files = @(
  "images/img-dt/sanrio-dt_5.png",
  "images/img-dt/sanrio-dt_6.png",
  "images/img-dt/sanrio-dt_7.png",
  "images/img-dt/sanrio-dt_8.png",
  "images/img-dt/sanrio-dt_9.png",
  "images/img-dt/sanrio-dt_18.png",
  "images/img-dt/sanrio-dt_20.png",
  "images/img-dt/sanrio-dt_28.png",
  "images/img-dt/sanrio-dt_63.png",
  "images/img-dt/sanrio-dt_65.png"
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $bmp = [System.Drawing.Bitmap]::FromFile($f)
        Write-Host "$f : $($bmp.Width) x $($bmp.Height)"
        $bmp.Dispose()
    }
}
