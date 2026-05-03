
# 批量重命名所有子目录为mixmlaal-前缀
$basePath = "f:\Mi Xiao Mi La A Li Inc"
$processedCount = 0
$errorCount = 0

Write-Host "开始批量处理所有目录..."
Write-Host ""

# 从最深层开始处理，获取所有目录并按深度排序
$allDirs = Get-ChildItem -Path $basePath -Directory -Recurse -ErrorAction SilentlyContinue |
    Sort-Object @{Expression={($_.FullName.Split('\') - 1).Count}; Descending=$true}

Write-Host "找到 $($allDirs.Count) 个目录需要检查..."
Write-Host ""

foreach ($dir in $allDirs) {
    # 跳过根目录和特殊目录
    if ($dir.FullName -eq $basePath -or 
        $dir.Name -match "^0[1-7]-" -or
        $dir.Name -match "^\\.github" -or
        $dir.Name -match "^\\.idea" -or
        $dir.Name -match "^\\.qoder" -or
        $dir.Name -match "^\\.trae" -or
        $dir.Name -like "mixmlaal-*") {
        continue
    }
    
    try {
        $newName = "mixmlaal-$($dir.Name)"
        $newPath = Join-Path $dir.Parent.FullName $newName
        
        Rename-Item -Path $dir.FullName -NewName $newName -ErrorAction Stop
        $processedCount++
        
        if ($processedCount % 50 -eq 0) {
            Write-Host "已处理: $processedCount"
        }
    }
    catch {
        $errorCount++
    }
}

Write-Host ""
Write-Host "=========================================="
Write-Host "处理完成！"
Write-Host "成功重命名: $processedCount"
Write-Host "错误/跳过: $errorCount"
Write-Host "=========================================="
