/**
 * Test script to verify SMA integration in the interface
 * Run this in browser console to test SMA functionality
 */

// Test SMA Service Connection
async function testSMAConnection() {
  console.log('🧪 Testing SMA Service Connection...');
  
  try {
    const response = await fetch('http://localhost:8001/health');
    const data = await response.json();
    
    if (data.status === 'healthy') {
      console.log('✅ SMA Service is running');
      console.log('📊 Service Details:', data);
      return true;
    } else {
      console.log('❌ SMA Service unhealthy:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to SMA Service:', error);
    console.log('💡 Make sure SMA service is running on port 8001');
    return false;
  }
}

// Test SMA Search Functionality
async function testSMASearch() {
  console.log('🔍 Testing SMA Search...');
  
  const testQuery = "formations intelligence artificielle ENIAD";
  
  try {
    const response = await fetch('http://localhost:8001/sma/intelligent-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: testQuery,
        language: 'fr',
        search_depth: 'medium',
        include_documents: true,
        include_images: true,
        include_news: true,
        max_results: 5
      })
    });
    
    const data = await response.json();
    
    if (data.final_answer) {
      console.log('✅ SMA Search successful');
      console.log('📝 Query:', data.query);
      console.log('🎯 Confidence:', (data.confidence * 100).toFixed(1) + '%');
      console.log('📚 Sources:', data.sources?.length || 0);
      console.log('💬 Answer Preview:', data.final_answer.substring(0, 100) + '...');
      return data;
    } else {
      console.log('❌ SMA Search failed:', data);
      return null;
    }
  } catch (error) {
    console.log('❌ SMA Search error:', error);
    return null;
  }
}

// Test Interface SMA Integration
function testInterfaceSMA() {
  console.log('🖥️ Testing Interface SMA Integration...');
  
  // Check if SMA button exists
  const smaButton = document.querySelector('[data-testid="sma-button"]') || 
                   document.querySelector('.sma-button') ||
                   document.querySelector('button[title*="SMA"]') ||
                   document.querySelector('button[aria-label*="search"]');
  
  if (smaButton) {
    console.log('✅ SMA Button found:', smaButton);
    console.log('🎯 Button text:', smaButton.textContent || smaButton.title || smaButton.ariaLabel);
    return smaButton;
  } else {
    console.log('❌ SMA Button not found');
    console.log('💡 Looking for search-related buttons...');
    
    // Look for any search buttons
    const searchButtons = document.querySelectorAll('button');
    const possibleSMAButtons = Array.from(searchButtons).filter(btn => 
      btn.textContent?.toLowerCase().includes('search') ||
      btn.textContent?.toLowerCase().includes('sma') ||
      btn.title?.toLowerCase().includes('search') ||
      btn.className?.toLowerCase().includes('search')
    );
    
    if (possibleSMAButtons.length > 0) {
      console.log('🔍 Possible SMA buttons found:', possibleSMAButtons);
      return possibleSMAButtons[0];
    }
    
    return null;
  }
}

// Simulate SMA Button Click
async function simulateSMAClick() {
  console.log('🖱️ Simulating SMA Button Click...');
  
  const smaButton = testInterfaceSMA();
  
  if (smaButton) {
    console.log('✅ Clicking SMA button...');
    smaButton.click();
    
    // Wait a moment for any UI changes
    setTimeout(() => {
      console.log('🔍 Checking for SMA UI changes...');
      
      // Look for loading indicators
      const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"], [class*="progress"]');
      if (loadingElements.length > 0) {
        console.log('✅ Loading indicators found:', loadingElements.length);
      }
      
      // Look for search input or modal
      const searchInputs = document.querySelectorAll('input[type="text"], textarea');
      const modals = document.querySelectorAll('[class*="modal"], [class*="dialog"], [class*="popup"]');
      
      if (searchInputs.length > 0) {
        console.log('✅ Search inputs available:', searchInputs.length);
      }
      
      if (modals.length > 0) {
        console.log('✅ Modal/dialog elements found:', modals.length);
      }
      
    }, 1000);
    
    return true;
  } else {
    console.log('❌ Cannot simulate click - SMA button not found');
    return false;
  }
}

// Complete Test Suite
async function runCompleteTest() {
  console.log('🚀 Running Complete SMA Test Suite...');
  console.log('=' * 50);
  
  // Test 1: SMA Service
  const serviceOK = await testSMAConnection();
  
  if (!serviceOK) {
    console.log('❌ Test failed: SMA Service not available');
    return false;
  }
  
  // Test 2: SMA Search
  const searchResult = await testSMASearch();
  
  if (!searchResult) {
    console.log('❌ Test failed: SMA Search not working');
    return false;
  }
  
  // Test 3: Interface Integration
  const buttonFound = testInterfaceSMA();
  
  if (!buttonFound) {
    console.log('❌ Test failed: SMA Button not found in interface');
    return false;
  }
  
  // Test 4: Simulate Click
  const clickWorked = await simulateSMAClick();
  
  console.log('=' * 50);
  console.log('🎉 TEST RESULTS:');
  console.log('✅ SMA Service: Working');
  console.log('✅ SMA Search: Working');
  console.log('✅ SMA Button: Found');
  console.log('✅ Button Click: ' + (clickWorked ? 'Working' : 'Needs manual test'));
  console.log('');
  console.log('🎓 Ready for professor demonstration!');
  console.log('💡 Try clicking the SMA button and asking:');
  console.log('   "Quelles formations en IA sont disponibles à ENIAD?"');
  
  return true;
}

// Auto-run test when script is loaded
console.log('🧪 SMA Interface Test Script Loaded');
console.log('💡 Run runCompleteTest() to test everything');
console.log('💡 Or run individual tests:');
console.log('   - testSMAConnection()');
console.log('   - testSMASearch()');
console.log('   - testInterfaceSMA()');
console.log('   - simulateSMAClick()');

// Export functions for manual use
window.smaTest = {
  testSMAConnection,
  testSMASearch,
  testInterfaceSMA,
  simulateSMAClick,
  runCompleteTest
};
