$backendPath = ".\backend\EventosCba.API"
$frontendPath = ".\frontend"

Write-Host "Iniciando Backend (.NET)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "cd $backendPath; dotnet watch run" -WindowStyle Minimized

Write-Host "Iniciando Frontend (Angular)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "cd $frontendPath; npm start"

Write-Host "Proyectos iniciados en ventanas separadas." -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:4200"
