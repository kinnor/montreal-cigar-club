# Show DNS records on both club zones + Pages custom-domain status. Run via with-secrets.ps1.
$ErrorActionPreference = 'Stop'
$H = @{ Authorization = "Bearer $env:CLOUDFLARE_API_TOKEN" }
$API = 'https://api.cloudflare.com/client/v4'
$zones = @{ 'montrealcigarclub.ca' = 'ef3b323fd11f4755c00a283d229d15fd'; 'mtlcigarclub.ca' = 'c6be3b8d6efcf738317e466c71870435' }
foreach ($z in $zones.GetEnumerator()) {
  try {
    $r = Invoke-RestMethod -Headers $H -Uri "$API/zones/$($z.Value)/dns_records"
    Write-Host "== $($z.Key): $(@($r.result).Count) DNS records"
    foreach ($rec in $r.result) { Write-Host "   $($rec.type) $($rec.name) -> $($rec.content) proxied=$($rec.proxied)" }
  } catch { Write-Host "== $($z.Key): DNS not readable with this token (needs Zone > DNS > Read)" }
}
$d = Invoke-RestMethod -Headers $H -Uri "$API/accounts/e4c48055274fc0fb73481be9032561fb/pages/projects/montreal-cigar-club/domains"
Write-Host "== Pages custom domains"
foreach ($x in $d.result) { Write-Host "   $($x.name): status=$($x.status) validation=$($x.validation_data.status) method=$($x.validation_data.method) txt=$($x.validation_data.txt_name)" }
