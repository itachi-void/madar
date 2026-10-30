// scripts/test-api-connection.mjs
// Live integration test between React API Client layer and WordPress / madar-headless

const BASE_URL = process.env.API_URL || 'http://madar.local/wp-json';

async function testEndpoint(name, path) {
  const url = `${BASE_URL}${path}`;
  const start = Date.now();
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-Madar-Lang': 'eg',
      },
    });
    const duration = Date.now() - start;
    const contentType = res.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { raw: text.slice(0, 200) };
    }

    return {
      name,
      path,
      status: res.status,
      ok: res.ok,
      duration: `${duration}ms`,
      data,
    };
  } catch (err) {
    return {
      name,
      path,
      status: 'FETCH_ERROR',
      ok: false,
      error: err.message,
    };
  }
}

async function runTests() {
  console.log(`Connecting to WordPress REST API at: ${BASE_URL}\n`);

  const tests = [
    ['Settings', '/madar/v1/settings'],
    ['All Products', '/madar/v1/products?lang=eg'],
    ['Men Products', '/madar/v1/products?audience=men&lang=eg'],
    ['Kids Products', '/madar/v1/products?audience=kids&lang=eg'],
    ['Looks', '/madar/v1/looks?lang=eg'],
    ['Materials', '/madar/v1/materials?lang=eg'],
    ['Store API Cart', '/wc/store/v1/cart'],
  ];

  const results = [];
  for (const [name, path] of tests) {
    const result = await testEndpoint(name, path);
    results.push(result);
  }

  console.log('='.repeat(70));
  console.log(String('Feature / Endpoint').padEnd(25) + String('Status').padEnd(12) + String('Time').padEnd(10) + 'Details');
  console.log('='.repeat(70));

  for (const r of results) {
    let detail = '';
    if (r.ok && r.data) {
      if (Array.isArray(r.data)) {
        detail = `${r.data.length} items returned`;
      } else if (r.name === 'Settings') {
        detail = `Currency: ${r.data.currency}, Gateway: ${r.data.payment_methods?.[0]?.id}`;
      } else if (r.name === 'Store API Cart') {
        detail = `Items: ${r.data.items?.length || 0}, Total: ${r.data.totals?.total_price || '0'}`;
      }
    } else {
      detail = r.error || JSON.stringify(r.data);
    }
    const statusStr = r.ok ? `PASS (${r.status})` : `FAIL (${r.status})`;
    console.log(String(r.name).padEnd(25) + String(statusStr).padEnd(12) + String(r.duration || '-').padEnd(10) + detail);
  }
  console.log('='.repeat(70));

  // Also test single product by slug
  if (results[1]?.data?.[0]?.slug) {
    const firstSlug = results[1].data[0].slug;
    console.log(`\nTesting single product by slug: "${firstSlug}"...`);
    const single = await testEndpoint('Single Product By Slug', `/madar/v1/product-by-slug?slug=${encodeURIComponent(firstSlug)}&lang=eg`);
    console.log(`Result: ${single.ok ? 'PASS' : 'FAIL'} (HTTP ${single.status}) - Name: "${single.data?.name}", Price: ${single.data?.price?.min} ${single.data?.price?.currency}`);
  }
}

runTests();
