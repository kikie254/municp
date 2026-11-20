#!/usr/bin/env python3
"""
Document Link Verification Script
Tests all 32 County Government document URLs
"""

import urllib.request
import urllib.error
import json
import time
from typing import Dict, List

# All 32 document URLs from lib/data/documents.ts
DOCUMENTS = [
    {"id": "charter", "title": "Iten Tambach Municipal Charter", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=2273", "verification": "content-confirmed", "size": "831 KB"},
    {"id": "idep", "title": "Iten-Tambach Municipality Integrated Development Plan (IDEP) 2025–2029", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6649", "verification": "content-confirmed", "size": "4.8 MB"},
    {"id": "idep-annex", "title": "Annex Review of the Integrated Development Plan", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4886", "verification": "file-only", "size": "2.1 MB"},
    {"id": "spatial-plan", "title": "Iten Integrated Spatial Plan (2015–2035)", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4847", "verification": "file-only", "size": "19.3 MB"},
    {"id": "spatial-plan-report", "title": "Iten Integrated Spatial Plan (2015–2035) Report", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6669", "verification": "file-only", "size": "27.8 MB"},
    {"id": "investment-plan-2025-2026", "title": "Iten Municipality Investment Plan 2025/2026", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6643", "verification": "file-only", "size": "2.2 MB"},
    {"id": "investment-plan-2024-2025", "title": "Iten Municipality Annual Investment Plan 2024–2025", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4888", "verification": "content-confirmed", "size": "601.7 KB"},
    {"id": "financial-statements-2024", "title": "Financial Statements — Iten Municipality 2024", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4837", "verification": "content-confirmed", "size": "1.2 MB"},
    {"id": "financial-statements-2023", "title": "Financial Statements — Iten Municipality 2023", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4843", "verification": "content-confirmed", "size": "2.3 MB"},
    {"id": "solid-waste-plan", "title": "Iten-Tambach Municipality Solid Waste Management Plan 2025", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6675", "verification": "content-confirmed", "size": "696.1 KB"},
    {"id": "climate-risk-profile", "title": "Iten-Tambach Municipality Urban Climate Risk Profile", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6641", "verification": "content-confirmed", "size": "1.6 MB"},
    {"id": "waste-policy", "title": "Municipal Policy on Waste Management", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6673", "verification": "content-confirmed", "size": "606.2 KB"},
    {"id": "gender-engagement-framework-2026", "title": "Gender Engagement Framework for Iten Municipality 2026", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6667", "verification": "content-confirmed", "size": "466.8 KB"},
    {"id": "gender-inclusion-framework", "title": "Gender Inclusion Framework — Iten Municipality", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4871", "verification": "file-only", "size": "6.8 MB"},
    {"id": "citizen-fora-calendar-2025-2026", "title": "Citizen Fora Calendar — Public Notice 2025/2026", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6651", "verification": "content-confirmed", "size": "450.7 KB"},
    {"id": "citizen-fora-q2-2025-2026", "title": "Second Quarter Citizen Fora Report 2025–2026", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6635", "verification": "file-only", "size": "627 KB"},
    {"id": "citizen-fora-q1-2025-2026", "title": "First Quarter Citizen Fora Report 2025–2026", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6633", "verification": "file-only", "size": "1.1 MB"},
    {"id": "citizen-fora-q4-2024-2025", "title": "Fourth Quarter Citizen Fora Report 2024–2025", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6629", "verification": "file-only", "size": "702.7 KB"},
    {"id": "citizen-fora-q3-2024-2025", "title": "Third Quarter Citizen Fora Report 2024–2025", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6627", "verification": "file-only", "size": "461.5 KB"},
    {"id": "citizen-fora-q2-2024-2025", "title": "Second Quarter Citizen Fora Report 2024–2025", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6625", "verification": "file-only", "size": "728.5 KB"},
    {"id": "citizen-fora-calendar-2024-2025", "title": "Citizen Fora Calendar — Public Notice 2024/2025", "url": "https://elgeyomarakwet.go.ke/iten-municipality-documents/", "verification": "source-page-only", "size": "280 KB"},
    {"id": "citizen-fora-q4-2023-2024", "title": "Fourth Quarter Citizen Fora Report 2023–2024", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4869", "verification": "file-only", "size": "895.6 KB"},
    {"id": "citizen-fora-q3-2023-2024", "title": "Third Quarter Citizen Fora Report 2023–2024", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4867", "verification": "file-only", "size": "597.4 KB"},
    {"id": "citizen-fora-q2-2023-2024", "title": "Second Quarter Citizen Fora Report 2023–2024", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4865", "verification": "file-only", "size": "522.8 KB"},
    {"id": "citizen-fora-q1-2024-2025", "title": "First Quarter Citizen Fora Report 2024–2025", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4863", "verification": "file-only", "size": "660.5 KB"},
    {"id": "citizen-fora-q1-2023-2024", "title": "First Quarter Citizen Fora Report 2023–2024", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4861", "verification": "file-only", "size": "549.5 KB"},
    {"id": "grm-log", "title": "Grievance Redress Mechanism Log (Updated)", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6681", "verification": "file-only", "size": "2.7 MB"},
    {"id": "grm-flow-chart", "title": "Flow Chart — Grievance Redress Mechanism Structure", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4884", "verification": "content-confirmed", "size": "143.3 KB"},
    {"id": "board-minutes-highlights", "title": "Highlights of Board Minutes 2024–2026", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=6639", "verification": "file-only", "size": "5 MB"},
    {"id": "minutes-2023-2024", "title": "Iten Municipality Minutes FY 2023–2024", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4890", "verification": "file-only", "size": "1.7 MB"},
    {"id": "public-notice-2024", "title": "Public Notice 2024", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4760", "verification": "file-only", "size": "252.3 KB"},
    {"id": "public-notice-2023", "title": "Public Notice 2023", "url": "https://elgeyomarakwet.go.ke/?mdocs-file=4758", "verification": "file-only", "size": "258 KB"},
]

def check_url(doc: Dict) -> Dict:
    """Make HEAD request to check document availability"""
    result = {
        "id": doc["id"],
        "title": doc["title"],
        "url": doc["url"],
        "verification_classification": doc["verification"],
        "declared_size": doc["size"],
        "status": "UNKNOWN",
        "http_code": None,
        "content_type": None,
        "content_length": None,
        "accessible": False,
        "file_type": None,
        "error": None
    }
    
    try:
        req = urllib.request.Request(doc["url"], method="HEAD")
        req.add_header('User-Agent', 'Iten-Tambach-Municipality/2.0 (Verification)')
        
        with urllib.request.urlopen(req, timeout=30) as response:
            result["http_code"] = response.status
            result["content_type"] = response.headers.get('Content-Type', 'unknown')
            result["content_length"] = response.headers.get('Content-Length', 'unknown')
            
            if response.status == 200:
                result["status"] = "OK"
                result["accessible"] = True
                
                # Determine file type
                if 'pdf' in result["content_type"].lower():
                    result["file_type"] = "PDF"
                elif 'html' in result["content_type"].lower():
                    result["file_type"] = "HTML"
                else:
                    result["file_type"] = result["content_type"]
            else:
                result["status"] = f"HTTP {response.status}"
                
    except urllib.error.HTTPError as e:
        result["status"] = "HTTP_ERROR"
        result["http_code"] = e.code
        result["error"] = str(e)
    except Exception as e:
        result["status"] = "FAILED"
        result["error"] = str(e)
    
    return result

def main():
    print("=" * 70)
    print("ITEN-TAMBACH MUNICIPALITY — DOCUMENT LINK VERIFICATION")
    print("=" * 70)
    print(f"\nTotal documents to verify: {len(DOCUMENTS)}\n")
    
    results = []
    
    for i, doc in enumerate(DOCUMENTS, 1):
        print(f"[{i}/{len(DOCUMENTS)}] {doc['title'][:60]}...")
        result = check_url(doc)
        results.append(result)
        
        status_symbol = "✓" if result["accessible"] else "✗"
        print(f"   {status_symbol} {result['status']} | HTTP {result['http_code']} | {result['file_type'] or 'N/A'}")
        
        # Rate limiting
        if i < len(DOCUMENTS):
            time.sleep(0.5)
    
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    
    accessible = [r for r in results if r["accessible"]]
    failed = [r for r in results if r["status"] == "FAILED"]
    http_errors = [r for r in results if r["status"] == "HTTP_ERROR"]
    
    print(f"\n✓ Accessible: {len(accessible)}/{len(DOCUMENTS)}")
    print(f"✗ Failed: {len(failed)}")
    print(f"⚠ HTTP errors: {len(http_errors)}")
    
    if failed:
        print("\n--- FAILED DOCUMENTS ---")
        for r in failed:
            print(f"\n  {r['title']}")
            print(f"  URL: {r['url']}")
            print(f"  Error: {r['error']}")
    
    if http_errors:
        print("\n--- HTTP ERRORS ---")
        for r in http_errors:
            print(f"\n  {r['title']}")
            print(f"  URL: {r['url']}")
            print(f"  HTTP Code: {r['http_code']}")
    
    # Save results to JSON
    output_file = "document-verification-results.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Full results saved to: {output_file}")

if __name__ == "__main__":
    main()
