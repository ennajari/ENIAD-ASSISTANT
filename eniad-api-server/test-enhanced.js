// Test script for enhanced RAG + SMA integration
const axios = require('axios');

async function testEnhancedChat() {
  try {
    console.log('🧪 Testing Enhanced Chat with RAG + SMA...\n');

    // Test 1: Basic chat without enhancements
    console.log('1️⃣ Testing basic chat...');
    const basicResponse = await axios.post('http://localhost:3001/api/chat', {
      chatId: 'test_basic_' + Date.now(),
      prompt: 'Bonjour, pouvez-vous me parler de l\'ENIAD?',
      enableRAG: false,
      enableSMA: false,
      language: 'fr'
    });

    console.log('✅ Basic response:', {
      success: basicResponse.data.success,
      hasContent: !!basicResponse.data.data?.content,
      contentLength: basicResponse.data.data?.content?.length || 0
    });

    // Test 2: Chat with RAG enhancement
    console.log('\n2️⃣ Testing chat with RAG...');
    const ragResponse = await axios.post('http://localhost:3001/api/chat', {
      chatId: 'test_rag_' + Date.now(),
      prompt: 'Quelles sont les conditions d\'admission à l\'ENIAD?',
      enableRAG: true,
      enableSMA: false,
      language: 'fr'
    });

    console.log('✅ RAG response:', {
      success: ragResponse.data.success,
      hasContent: !!ragResponse.data.data?.content,
      ragDocuments: ragResponse.data.data?.metadata?.ragDocuments || 0,
      contentLength: ragResponse.data.data?.content?.length || 0
    });

    // Test 3: Chat with SMA enhancement
    console.log('\n3️⃣ Testing chat with SMA...');
    const smaResponse = await axios.post('http://localhost:3001/api/chat', {
      chatId: 'test_sma_' + Date.now(),
      prompt: 'Quelles sont les dernières actualités de l\'ENIAD?',
      enableRAG: false,
      enableSMA: true,
      language: 'fr'
    });

    console.log('✅ SMA response:', {
      success: smaResponse.data.success,
      hasContent: !!smaResponse.data.data?.content,
      smaResults: smaResponse.data.data?.metadata?.smaResults || 0,
      contentLength: smaResponse.data.data?.content?.length || 0
    });

    // Test 4: Chat with both RAG and SMA
    console.log('\n4️⃣ Testing chat with RAG + SMA...');
    const fullResponse = await axios.post('http://localhost:3001/api/chat', {
      chatId: 'test_full_' + Date.now(),
      prompt: 'Comment puis-je m\'inscrire à l\'ENIAD et quelles sont les dernières informations?',
      enableRAG: true,
      enableSMA: true,
      language: 'fr'
    });

    console.log('✅ Full enhanced response:', {
      success: fullResponse.data.success,
      hasContent: !!fullResponse.data.data?.content,
      ragDocuments: fullResponse.data.data?.metadata?.ragDocuments || 0,
      smaResults: fullResponse.data.data?.metadata?.smaResults || 0,
      contentLength: fullResponse.data.data?.content?.length || 0,
      sources: fullResponse.data.data?.metadata?.sources || {}
    });

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

// Run the test
testEnhancedChat();
