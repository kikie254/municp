/**
 * Document Link Verification Script
 * Tests all 32 County Government document URLs for accessibility and response codes
 */

// Document data imported inline since we can't import .ts from .mjs
const documents = [
  // Will be populated inline
];

async function verifyDocumentLink(doc) {
  const result = {
    id: doc.id,
    title: doc.title,
    url: doc.fileUrl,
    verification: doc.verification,
    note: doc.note || '',
    status: 'PENDING',
    httpStatus: null,
    contentType: null,
    contentLength: null,
    declaredSize: doc.fileSize,
    error: null
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(doc.fileUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Iten-Tambach-Municipality-Verification/2.0'
      }
    });
    
    clearTimeout(timeout);
    
    result.httpStatus = response.status;
    result.contentType = response.headers.get('content-type') || 'unknown';
    result.contentLength = response.headers.get('content-length');
    
    if (response.ok) {
      result.status = 'ACCESSIBLE';
      
      // Check if it's actually a PDF
      if (result.contentType.includes('pdf')) {
        result.fileType = 'PDF';
      } else if (result.contentType.includes('html')) {
        result.fileType = 'HTML (may be landing page)';
      } else {
        result.fileType = result.contentType;
      }
    } else {
      result.status = 'HTTP_ERROR';
      result.error = `HTTP ${response.status}`;
    }
    
  } catch (err) {
    result.status = 'FAILED';
    result.error = err.message;
  }
  
  return result;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('ITEN-TAMBACH MUNICIPALITY — DOCUMENT LINK VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`Total documents to verify: ${documents.length}\n`);
  
  const results = [];
  
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    console.log(`[${i + 1}/${documents.length}] Testing: ${doc.title}...`);
    
    const result = await verifyDocumentLink(doc);
    results.push(result);
    
    console.log(`   Status: ${result.status} | HTTP: ${result.httpStatus || 'N/A'} | Type: ${result.fileType || 'N/A'}`);
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('VERIFICATION SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const accessible = results.filter(r => r.status === 'ACCESSIBLE');
  const failed = results.filter(r => r.status === 'FAILED');
  const httpErrors = results.filter(r => r.status === 'HTTP_ERROR');
  
  console.log(`✓ Accessible: ${accessible.length}`);
  console.log(`✗ Failed: ${failed.length}`);
  console.log(`⚠ HTTP errors: ${httpErrors.length}`);
  
  if (failed.length > 0) {
    console.log('\n--- Failed Documents ---');
    failed.forEach(r => {
      console.log(`  ${r.title}`);
      console.log(`    URL: ${r.url}`);
      console.log(`    Error: ${r.error}\n`);
    });
  }
  
  if (httpErrors.length > 0) {
    console.log('\n--- HTTP Errors ---');
    httpErrors.forEach(r => {
      console.log(`  ${r.title}`);
      console.log(`    URL: ${r.url}`);
      console.log(`    Status: ${r.httpStatus}\n`);
    });
  }
  
  // Output JSON for further processing
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('FULL RESULTS (JSON)');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
