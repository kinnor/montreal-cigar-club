# Zone + registrar status for the club domains. Run via with-secrets.ps1.
$H = @{ Authorization = "Bearer $env:CLOUDFLARE_API_TOKEN" }
$API = 'https://api.cloudflare.com/client/v4'
$z = (Invoke-RestMethod -Headers $H -Uri "$API/zones?per_page=50").result | Where-Object { $_.name -like '*cigarclub*' }
foreach ($x in $z) {
  Write-Host "zone $($x.name): status=$($x.status) paused=$($x.paused) ns=$($x.name_servers -join ',') original_ns=$($x.original_name_servers -join ',') created=$($x.created_on) activated=$($x.activated_on)"
}
try {
  $d = (Invoke-RestMethod -Headers $H -Uri "$API/accounts/e4c48055274fc0fb73481be9032561fb/registrar/domains").result | Where-Object { $_.name -like '*cigarclub*' }
  foreach ($x in $d) { Write-Host "registrar $($x.name): status=$($x.status) expires=$($x.expires_at) locked=$($x.locked) auto_renew=$($x.auto_renew)" }
} catch { Write-Host "registrar API not readable with this token" }
