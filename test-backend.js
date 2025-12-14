#!/usr/bin/env node

// Quick Backend Connectivity Test
// Run: node test-backend.js

const API_BASE = process.env.API_URL || 'https://liable-vector-becoming-conflicts.trycloudflare.com';

const endpoints = [
  {
    name: '🌿 Emissions',
    url: `${API_BASE}/api/emissions`,
    method: 'GET'
  },
  {
    name: '🤖 Recommendations',
    url: `${API_BASE}/api/recommendations`,
    method: 'POST',
    body: { question_text: 'Do you have a security policy?' }
  },
  {
    name: '✅ Validate Single',
    url: `${API_BASE}/api/validate_single`,
    method: 'POST',
    body: {
      question: 'Test question',
      evidence_type: 'text',
      evidence_base64: Buffer.from('Test evidence').toString('base64')
    }
  },
  {
    name: '📦 Validate Batch',
    url: `${API_BASE}/api/validate_batch`,
    method: 'POST',
    body: {
      items: [
        {
          question: 'Test question 1',
          evidence_type: 'text',
          evidence_base64: Buffer.from('Test evidence 1').toString('base64')
        }
      ]
    }
  },
  {
    name: '💬 Chat',
    url: `${API_BASE}/api/chat`,
    method: 'POST',
    body: { message: 'Hello, are you online?' }
  }
];

async function testEndpoint(endpoint) {
  const startTime = Date.now();
  
  try {
    const res = await fetch(endpoint.url, {
      method: endpoint.method,
      headers: { 'Content-Type': 'application/json' },
      body: endpoint.body ? JSON.stringify(endpoint.body) : undefined
    });
    
    const elapsed = Date.now() - startTime;
    const data = await res.json().catch(() => null);
    
    if (res.ok) {
      console.log(`✅ ${endpoint.name}: ${res.status} OK (${elapsed}ms)`);
      
      // Validate response structure
      if (endpoint.name.includes('Validate')) {
        if (data && data.final_score !== undefined) {
          console.log(`   ✓ Has final_score: ${data.final_score}`);
        } else {
          console.log(`   ⚠️  Missing final_score field`);
        }
      }
      
      return { success: true, status: res.status, elapsed };
    } else {
      console.log(`❌ ${endpoint.name}: ${res.status} ${res.statusText}`);
      return { success: false, status: res.status, elapsed };
    }
  } catch (err) {
    const elapsed = Date.now() - startTime;
    console.log(`❌ ${endpoint.name}: ${err.message}`);
    return { success: false, error: err.message, elapsed };
  }
}

async function runTests() {
  console.log('\n🧪 Testing Backend Connectivity...\n');
  console.log(`Backend URL: ${API_BASE}\n`);
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push({ name: endpoint.name, ...result });
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const avgTime = results.reduce((sum, r) => sum + (r.elapsed || 0), 0) / results.length;
  
  console.log(`✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  console.log(`⏱️  Avg Response Time: ${avgTime.toFixed(0)}ms`);
  
  if (passed === results.length) {
    console.log('\n🎉 All tests passed! Backend is ready to use.');
  } else {
    console.log('\n⚠️  Some tests failed. Check backend configuration.');
  }
  
  console.log('\n');
}

// Run tests
runTests().catch(console.error);
