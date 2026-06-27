#!/usr/bin/env python3
"""Generate download manifest for AVOID verdict tickers."""

import re
from pathlib import Path

INDEX_PATH = Path("/Users/mc/Library/Mobile Documents/com~apple~CloudDocs/MarcOS/Trading/Trading-research/HK Stocks/Finratios/INDEX.md")
PDF_CACHE = Path("/Users/mc/Library/Mobile Documents/com~apple~CloudDocs/MarcOS/Trading/Trading-research/HK Stocks/Finratios/HKEX pdfs")

# Parse AVOID tickers and company names from INDEX
text = INDEX_PATH.read_text(encoding="utf-8")
avoid_pattern = re.compile(r"^\|\s*`(\d{4,5})`\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([^\|]+?)\s*\|.*?🔴 AVOID", re.MULTILINE)

avoid_data = {}
for match in avoid_pattern.finditer(text):
    ticker, date, company = match.groups()
    company = company.strip()
    avoid_data[ticker] = company

print(f"Found {len(avoid_data)} AVOID tickers in INDEX.md")

# Check which files exist in cache
manifest = []
for ticker in sorted(avoid_data.keys()):
    company = avoid_data[ticker]

    # Look for AR and IR files
    ar_files = list(PDF_CACHE.glob(f"{ticker}_*_AR.pdf"))
    ir_files = list(PDF_CACHE.glob(f"{ticker}_*_IR.pdf"))

    ar_date = ar_files[0].stem.split('_')[1] if ar_files else None
    ar_size = f"{ar_files[0].stat().st_size / (1024*1024):.1f}MB" if ar_files else "—"

    ir_date = ir_files[0].stem.split('_')[1] if ir_files else None
    ir_size = f"{ir_files[0].stat().st_size / (1024*1024):.1f}MB" if ir_files else "—"

    status = "✓ Complete" if ar_files and ir_files else ("⚠ Partial (AR only)" if ar_files else ("⚠ Partial (IR only)" if ir_files else "✗ Missing"))

    manifest.append({
        "ticker": ticker,
        "company": company,
        "ar_date": ar_date or "—",
        "ar_size": ar_size,
        "ir_date": ir_date or "—",
        "ir_size": ir_size,
        "status": status,
    })

# Write manifest
output = [
    "# Download Manifest — AVOID Verdict",
    f"",
    f"Generated: 2026-05-04 | Tickers: {len(manifest)} | Complete: {sum(1 for m in manifest if '✓' in m['status'])} | Partial: {sum(1 for m in manifest if '⚠' in m['status'])} | Missing: {sum(1 for m in manifest if '✗' in m['status'])}",
    "",
    "| Ticker | Company | AR Date | AR Size | IR Date | IR Size | Status |",
    "|--------|---------|---------|---------|---------|---------|--------|",
]

for m in manifest:
    output.append(f"| `{m['ticker']}` | {m['company']} | {m['ar_date']} | {m['ar_size']} | {m['ir_date']} | {m['ir_size']} | {m['status']} |")

manifest_path = PDF_CACHE / "_MANIFEST_AVOID_2026-05-04.md"
manifest_path.write_text("\n".join(output) + "\n", encoding="utf-8")
print(f"Manifest written: {manifest_path}")
print(f"Summary: {sum(1 for m in manifest if '✓' in m['status'])} complete, {sum(1 for m in manifest if '⚠' in m['status'])} partial, {sum(1 for m in manifest if '✗' in m['status'])} missing")
