$exclude = @('node_modules', '.next', '.git', '.vscode', 'dist', 'build')
$depth = 4

function Show-Tree {
    param(
        [string]$path = ".",
        [string]$prefix = ""
    )
    
    $items = Get-ChildItem $path | Where-Object { 
        $exclude -notcontains $_.Name 
    } | Sort-Object Name
    
    $count = $items.Count
    $i = 0
    
    foreach ($item in $items) {
        $i++
        $isLast = $i -eq $count
        
        if ($isLast) {
            Write-Output "${prefix}└── $($item.Name)"
            $newPrefix = "${prefix}    "
        } else {
            Write-Output "${prefix}├── $($item.Name)"
            $newPrefix = "${prefix}│   "
        }
        
        if ($item.PSIsContainer -and $prefix.Length -lt $depth * 4) {
            Show-Tree -path $item.FullName -prefix $newPrefix
        }
    }
}

Show-Tree | Out-File -FilePath "project-structure.txt"
Write-Host "Структура сохранена в project-structure.txt"