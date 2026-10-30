// Phase 2 Verification Script: Catalog & Product Details Integration
const BASE_URL = "http://madar.local/wp-json"

async function runTests() {
  console.log("=== Phase 2 Verification Tests ===")
  let passed = 0
  let failed = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`)
      passed++
    } else {
      console.error(`  ✗ FAIL: ${message}`)
      failed++
    }
  }

  try {
    // 1. Men Catalog Test (audience=men)
    console.log("\n[Test 1] Men's Catalog (audience=men)")
    const menRes = await fetch(`${BASE_URL}/madar/v1/products?audience=men`, {
      headers: { "X-Madar-Lang": "ar" },
    })
    const menData = await menRes.json()
    assert(menRes.status === 200, "Men catalog returns HTTP 200")
    assert(Array.isArray(menData), "Men catalog returns array directly")
    assert(menData.length === 8, `Men catalog contains exactly 8 items (got ${menData.length})`)
    const allMen = menData.every((p) => p.audience === "men")
    assert(allMen, "All items in men catalog have audience === 'men'")

    // 2. Kids Catalog Test (audience=kids)
    console.log("\n[Test 2] Kids' Catalog (audience=kids)")
    const kidsRes = await fetch(`${BASE_URL}/madar/v1/products?audience=kids`, {
      headers: { "X-Madar-Lang": "ar" },
    })
    const kidsData = await kidsRes.json()
    assert(kidsRes.status === 200, "Kids catalog returns HTTP 200")
    assert(Array.isArray(kidsData), "Kids catalog returns array directly")
    assert(kidsData.length === 5, `Kids catalog contains exactly 5 items (got ${kidsData.length})`)
    const allKids = kidsData.every((p) => p.audience === "kids")
    assert(allKids, "All items in kids catalog have audience === 'kids'")

    // 3. Total Commercial Items Test
    console.log("\n[Test 3] Full Catalog (Total commercial items)")
    const allRes = await fetch(`${BASE_URL}/madar/v1/products`, {
      headers: { "X-Madar-Lang": "ar" },
    })
    const allData = await allRes.json()
    assert(allRes.status === 200, "Full catalog returns HTTP 200")
    assert(allData.length === 13, `Full catalog contains 13 items (got ${allData.length})`)

    // 4. Product Details by Real Slug Test (/madar/v1/product-by-slug)
    console.log("\n[Test 4] Product Details by Slug (/madar/v1/product-by-slug)")
    const testSlug = menData[0].slug
    const productRes = await fetch(`${BASE_URL}/madar/v1/product-by-slug?slug=${encodeURIComponent(testSlug)}`, {
      headers: { "X-Madar-Lang": "ar" },
    })
    const productData = await productRes.json()
    assert(productRes.status === 200, `Product detail for '${testSlug}' returns HTTP 200`)
    assert(productData.name === menData[0].name, `Product name matches: ${productData.name}`)
    assert(productData.price && productData.price.min > 0, `Product has valid price: ${productData.price?.min} ${productData.price?.currency}`)
    assert(Array.isArray(productData.images), `Product has images array (${productData.images?.length} images)`)
    assert(Array.isArray(productData.variations), `Product has variations array (${productData.variations?.length} variations)`)
    assert(productData.madar !== undefined, "Product includes madar custom metadata (fit, care, styling)")

    // 5. Kids Product Details by Slug
    console.log("\n[Test 5] Kids Product Details by Slug")
    const kidsSlug = kidsData[0].slug
    const kidsProdRes = await fetch(`${BASE_URL}/madar/v1/product-by-slug?slug=${encodeURIComponent(kidsSlug)}`, {
      headers: { "X-Madar-Lang": "ar" },
    })
    const kidsProdData = await kidsProdRes.json()
    assert(kidsProdRes.status === 200, `Kids product detail for '${kidsSlug}' returns HTTP 200`)
    assert(kidsProdData.audience === "kids", "Product audience is 'kids'")

    // 6. Language Header Test
    console.log("\n[Test 6] Multi-language header responsiveness")
    const enRes = await fetch(`${BASE_URL}/madar/v1/products?lang=en`, {
      headers: { "X-Madar-Lang": "en" },
    })
    const enData = await enRes.json()
    assert(enRes.status === 200, "English request returns HTTP 200")
    assert(Array.isArray(enData) && enData.length === 13, `English catalog returns 13 items`)

    console.log(`\n=== Verification Summary: ${passed} Passed, ${failed} Failed ===`)
    if (failed > 0) process.exit(1)
  } catch (e) {
    console.error("Test execution failed:", e)
    process.exit(1)
  }
}

runTests()
