# This script sets JAVA_HOME and updates PATH for OpenJDK 17 (ojdkbuild)
# Run this script as Administrator in PowerShell

$jdkPath = "C:\Program Files\ojdkbuild\java-17-openjdk-17.0.3.0.6-1"

# Set JAVA_HOME system environment variable
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $jdkPath, [System.EnvironmentVariableTarget]::Machine)

# Add JDK bin to system PATH if not already present
$envPath = [System.Environment]::GetEnvironmentVariable('Path', [System.EnvironmentVariableTarget]::Machine)
$jdkBin = "$jdkPath\bin"
if ($envPath -notlike "*$jdkBin*") {
    $newPath = "$envPath;$jdkBin"
    [System.Environment]::SetEnvironmentVariable('Path', $newPath, [System.EnvironmentVariableTarget]::Machine)
    Write-Host "JDK bin added to system PATH."
} else {
    Write-Host "JDK bin already in system PATH."
}

Write-Host "JAVA_HOME set to $jdkPath. Please restart your terminal or computer for changes to take effect."
