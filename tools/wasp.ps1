# Wrapper para usar siempre el Wasp CLI correcto en Windows PowerShell
# Obtiene el commit más reciente de la rama main de Wasp de forma dinámica

$WaspMainUrl = "https://pkg.pr.new/@wasp.sh/wasp-cli@main"

# Realizar una solicitud HEAD para obtener las cabeceras HTTP
$request = [System.Net.HttpWebRequest]::Create($WaspMainUrl)
$request.Method = "HEAD"
$request.UserAgent = "Mozilla/5.0"

try {
    $response = $request.GetResponse()
    $commitKey = $response.Headers["x-commit-key"]
    if (-not $commitKey) {
        Write-Error "No se pudo encontrar la cabecera 'x-commit-key'."
        exit 1
    }
    # Extraer el hash del commit (último elemento separado por ':')
    $latestCommit = $commitKey.Split(":")[-1].Trim()
    $response.Close()
} catch {
    Write-Error "Error al conectar con pkg.pr.new para resolver el commit de Wasp: $_"
    exit 1
}

# Ejecutar el comando Wasp CLI correspondiente usando npx
$packageUrl = "https://pkg.pr.new/@wasp.sh/wasp-cli@$latestCommit"
npx -y $packageUrl $args
