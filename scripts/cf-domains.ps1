<#
.SYNOPSIS  Attach custom domains to the Pages project and prepare DNS for the redirect zone.
  Run through the secrets helper so CLOUDFLARE_API_TOKEN is set (never printed):
    powershell -ExecutionPolicy Bypass -File scripts/with-secrets.ps1 powershell -ExecutionPolicy Bypass -File scripts/cf-domains.ps1
#>
$ErrorActionPreference = 'Stop'
if (-not $env:CLOUDFLARE_API_TOKEN) { throw 'CLOUDFLARE_API_TOKEN not set' }
$H = @{ Authorization = "Bearer $env:CLOUDFLARE_API_TOKEN"; 'Content-Type' = 'application/json' }
$API = 'https://api.cloudflare.com/client/v4'
$ACCOUNT = 'e4c48055274fc0fb73481be9032561fb'
$PROJECT = 'montreal-cigar-club'
$PAGES_HOST = "$PROJECT.pages.dev"

function CF($method, $path, $body) {
  $args = @{ Method = $method; Uri = "$API$path"; Headers = $H }
  if ($body) { $args.Body = ($body | ConvertTo-Json -Depth 6) }
  try { $r = Invoke-RestMethod @args } catch {
    $msg = $_.ErrorDetails.Message; if (-not $msg) { $msg = $_.Exception.Message }
    return [pscustomobject]@{ success = $false; errors = @(@{ message = $msg }) }
  }
  return $r
}

function Ensure-Dns($zoneId, $type, $name, $content) {
  $existing = (CF GET "/zones/$zoneId/dns_records?type=$type&name=$name").result
  if ($existing) { Write-Host "  DNS exists: $type $name -> $($existing[0].content) (proxied=$($existing[0].proxied))"; return }
  $r = CF POST "/zones/$zoneId/dns_records" @{ type = $type; name = $name; content = $content; proxied = $true; ttl = 1 }
  if ($r.success) { Write-Host "  DNS created: $type $name -> $content (proxied)" } else { Write-Host "  DNS FAILED: $type $name :: $($r.errors | ConvertTo-Json -Compress)" }
}

# --- zones
$zones = (CF GET '/zones?per_page=50').result
if (-not $zones) { throw 'No zones visible to this token (needs Zone:Read).' }
$zones | ForEach-Object { Write-Host "zone: $($_.name)  id=$($_.id)  status=$($_.status)" }
$zMain = $zones | Where-Object name -eq 'montrealcigarclub.ca'
$zMtl  = $zones | Where-Object name -eq 'mtlcigarclub.ca'
$zMtlCom = $zones | Where-Object name -eq 'mtlcigarclub.com'

# --- Pages custom domains
Write-Host "`n== Pages custom domains on $PROJECT"
$have = (CF GET "/accounts/$ACCOUNT/pages/projects/$PROJECT/domains").result | ForEach-Object name
foreach ($d in 'montrealcigarclub.ca', 'www.montrealcigarclub.ca') {
  if ($have -contains $d) { Write-Host "  already attached: $d"; continue }
  $r = CF POST "/accounts/$ACCOUNT/pages/projects/$PROJECT/domains" @{ name = $d }
  if ($r.success) { Write-Host "  attached: $d (status=$($r.result.status))" } else { Write-Host "  ATTACH FAILED: $d :: $($r.errors | ConvertTo-Json -Compress)" }
}
if ($zMain) {
  Write-Host "`n== DNS on montrealcigarclub.ca"
  Ensure-Dns $zMain.id 'CNAME' 'montrealcigarclub.ca' $PAGES_HOST
  Ensure-Dns $zMain.id 'CNAME' 'www.montrealcigarclub.ca' $PAGES_HOST
} else { Write-Host 'zone montrealcigarclub.ca not visible' }

# --- redirect zone placeholders (so the Worker route receives traffic)
if ($zMtl) {
  Write-Host "`n== DNS on mtlcigarclub.ca (proxied placeholders for Worker route)"
  Ensure-Dns $zMtl.id 'AAAA' 'mtlcigarclub.ca' '100::'
  Ensure-Dns $zMtl.id 'AAAA' 'www.mtlcigarclub.ca' '100::'
} else { Write-Host 'zone mtlcigarclub.ca not visible' }
if ($zMtlCom) {
  Write-Host "`n== DNS on mtlcigarclub.com (proxied placeholders for Worker route)"
  Ensure-Dns $zMtlCom.id 'AAAA' 'mtlcigarclub.com' '100::'
  Ensure-Dns $zMtlCom.id 'AAAA' 'www.mtlcigarclub.com' '100::'
} else { Write-Host 'zone mtlcigarclub.com not visible (not yet added to this Cloudflare account?)' }

Write-Host "`n== Pages domain status"
(CF GET "/accounts/$ACCOUNT/pages/projects/$PROJECT/domains").result | ForEach-Object { Write-Host "  $($_.name): $($_.status) / cert=$($_.certificate_authority) / validation=$($_.validation_data.status)" }
