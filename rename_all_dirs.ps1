
# 全目录mixmlaal-前缀重命名脚本
# 注意：此操作不可逆，请确保有备份

Write-Host "========================================"
Write-Host "  全目录 mixmlaal- 前缀统一"
Write-Host "========================================"
Write-Host ""

# 统计总目录数
$totalDirs = (Get-ChildItem -Directory -Recurse -Path "f:\Mi Xiao Mi La A Li Inc" | Measure-Object).Count
Write-Host "准备处理 $totalDirs 个目录..."
Write-Host ""

# 获取所有目录（从最深层开始）
$allDirs = Get-ChildItem -Directory -Recurse -Path "f:\Mi Xiao Mi La A Li Inc" | 
    Sort-Object @{Expression={$_.FullName.Split('\').Count}; Ascending=$false}

$processed = 0
$skipped = 0

foreach ($dir in $allDirs) {
    # 跳过根目录和特殊目录
    if ($dir.FullName -eq "f:\Mi Xiao Mi La A Li Inc" -or 
        $dir.Name -match "^0[1-7]-" -or
        $dir.Name -match "^\\.github" -or
        $dir.Name -match "^\\.idea" -or
        $dir.Name -match "^\\.qoder" -or
        $dir.Name -match "^\\.trae" -or
        $dir.Name -like "mixmlaal-*") {
        $skipped++
        continue
    }
    
    # 构建新目录名
    $newName = "mixmlaal-$($dir.Name)"
    $newPath = Join-Path $dir.Parent.FullName $newName
    
    try {
        # 重命名
        Rename-Item -Path $dir.FullName -NewName $newName -ErrorAction Stop
        $processed++
        
        if ($processed % 100 -eq 0) {
            Write-Host "已处理: $processed / $totalDirs"
        }
    }
    catch {
        Write-Host "跳过 (被占用): $($dir.FullName)" -ForegroundColor Yellow
        $skipped++
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "完成！"
Write-Host "处理: $processed"
Write-Host "跳过: $skipped"
Write-Host "========================================"
