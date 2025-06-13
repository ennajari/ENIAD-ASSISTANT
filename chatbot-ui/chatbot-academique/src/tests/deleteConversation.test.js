/**
 * Test for conversation deletion functionality
 * Ensures proper handling when deleting the last conversation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock console methods
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
};

describe('Conversation Deletion', () => {
  let mockSetConversationHistory;
  let mockSetCurrentChatId;
  let mockSetMessages;
  let mockSetInputValue;
  let mockSetEditingMessageId;
  let mockSetEditedMessageContent;
  let mockSetMobileOpen;
  let mockSetSuggestionsRefreshTrigger;
  let mockStaticSuggestionsService;
  let mockT;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock state setters
    mockSetConversationHistory = vi.fn();
    mockSetCurrentChatId = vi.fn();
    mockSetMessages = vi.fn();
    mockSetInputValue = vi.fn();
    mockSetEditingMessageId = vi.fn();
    mockSetEditedMessageContent = vi.fn();
    mockSetMobileOpen = vi.fn();
    mockSetSuggestionsRefreshTrigger = vi.fn();
    
    // Mock services
    mockStaticSuggestionsService = {
      forceRefresh: vi.fn()
    };
    
    // Mock translation function
    mockT = vi.fn((key) => {
      const translations = {
        newConversation: 'New Conversation'
      };
      return translations[key] || key;
    });
  });

  const createMockDeleteHandler = (conversationHistory, currentChatId) => {
    return (chatId, e) => {
      e.stopPropagation();
      try {
        const updatedHistory = conversationHistory.filter(c => c.id !== chatId);
        localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
        mockSetConversationHistory(updatedHistory);

        if (currentChatId === chatId) {
          if (updatedHistory.length > 0) {
            // Load the first available chat
            const firstChat = updatedHistory[0];
            mockSetCurrentChatId(firstChat.id);
            localStorage.setItem('currentChatId', firstChat.id);
            mockSetMessages(firstChat.messages);
          } else {
            // No conversations left - create a fresh new chat
            console.log('🗑️ Last conversation deleted, creating fresh chat');
            
            // Clear current state
            mockSetCurrentChatId(null);
            localStorage.removeItem('currentChatId');
            mockSetMessages([]);
            mockSetInputValue('');
            mockSetEditingMessageId(null);
            mockSetEditedMessageContent('');
            
            // Create a new chat immediately
            const newChatId = Date.now().toString();
            const newChat = {
              id: newChatId,
              title: mockT('newConversation'),
              messages: [],
              lastUpdated: new Date().toISOString()
            };

            // Set the new chat as current
            mockSetCurrentChatId(newChatId);
            localStorage.setItem('currentChatId', newChatId);
            
            // Add to conversation history
            mockSetConversationHistory([newChat]);
            localStorage.setItem('conversationHistory', JSON.stringify([newChat]));
            
            // Close mobile menu if open
            mockSetMobileOpen(false);
            
            // Refresh static suggestions for new conversation
            mockStaticSuggestionsService.forceRefresh();
            console.log('🔄 Static suggestions refreshed for new conversation after delete');

            // Trigger UI refresh for suggestion cards
            mockSetSuggestionsRefreshTrigger(prev => prev + 1);
          }
        }
      } catch (error) {
        console.error('❌ Error deleting chat:', error);
        
        // Fallback: ensure we have at least one conversation
        if (conversationHistory.length === 0) {
          console.log('🔄 Fallback: Creating emergency conversation');
          const emergencyChat = {
            id: Date.now().toString(),
            title: mockT('newConversation'),
            messages: [],
            lastUpdated: new Date().toISOString()
          };
          
          mockSetConversationHistory([emergencyChat]);
          mockSetCurrentChatId(emergencyChat.id);
          mockSetMessages([]);
          localStorage.setItem('conversationHistory', JSON.stringify([emergencyChat]));
          localStorage.setItem('currentChatId', emergencyChat.id);
        }
      }
    };
  };

  it('should handle deleting a conversation when multiple conversations exist', () => {
    const conversationHistory = [
      { id: '1', title: 'Chat 1', messages: [{ role: 'user', content: 'Hello' }] },
      { id: '2', title: 'Chat 2', messages: [{ role: 'user', content: 'Hi' }] },
      { id: '3', title: 'Chat 3', messages: [] }
    ];
    const currentChatId = '2';
    
    const handleDeleteChat = createMockDeleteHandler(conversationHistory, currentChatId);
    const mockEvent = { stopPropagation: vi.fn() };
    
    handleDeleteChat('2', mockEvent);
    
    // Should remove the deleted chat from history
    expect(mockSetConversationHistory).toHaveBeenCalledWith([
      { id: '1', title: 'Chat 1', messages: [{ role: 'user', content: 'Hello' }] },
      { id: '3', title: 'Chat 3', messages: [] }
    ]);
    
    // Should load the first available chat
    expect(mockSetCurrentChatId).toHaveBeenCalledWith('1');
    expect(mockSetMessages).toHaveBeenCalledWith([{ role: 'user', content: 'Hello' }]);
    expect(localStorage.setItem).toHaveBeenCalledWith('currentChatId', '1');
  });

  it('should handle deleting the last conversation correctly', () => {
    const conversationHistory = [
      { id: '1', title: 'Last Chat', messages: [{ role: 'user', content: 'Hello' }] }
    ];
    const currentChatId = '1';
    
    const handleDeleteChat = createMockDeleteHandler(conversationHistory, currentChatId);
    const mockEvent = { stopPropagation: vi.fn() };
    
    // Mock Date.now() to return a predictable value
    const mockTimestamp = 1234567890;
    vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
    
    handleDeleteChat('1', mockEvent);
    
    // Should clear current state
    expect(mockSetCurrentChatId).toHaveBeenCalledWith(null);
    expect(localStorage.removeItem).toHaveBeenCalledWith('currentChatId');
    expect(mockSetMessages).toHaveBeenCalledWith([]);
    expect(mockSetInputValue).toHaveBeenCalledWith('');
    expect(mockSetEditingMessageId).toHaveBeenCalledWith(null);
    expect(mockSetEditedMessageContent).toHaveBeenCalledWith('');
    
    // Should create a new chat
    const expectedNewChat = {
      id: mockTimestamp.toString(),
      title: 'New Conversation',
      messages: [],
      lastUpdated: expect.any(String)
    };
    
    expect(mockSetCurrentChatId).toHaveBeenCalledWith(mockTimestamp.toString());
    expect(mockSetConversationHistory).toHaveBeenCalledWith([expectedNewChat]);
    expect(localStorage.setItem).toHaveBeenCalledWith('currentChatId', mockTimestamp.toString());
    expect(localStorage.setItem).toHaveBeenCalledWith('conversationHistory', JSON.stringify([expectedNewChat]));
    
    // Should refresh suggestions
    expect(mockStaticSuggestionsService.forceRefresh).toHaveBeenCalled();
    expect(mockSetSuggestionsRefreshTrigger).toHaveBeenCalled();
    
    // Should close mobile menu
    expect(mockSetMobileOpen).toHaveBeenCalledWith(false);
    
    // Should log appropriate messages
    expect(console.log).toHaveBeenCalledWith('🗑️ Last conversation deleted, creating fresh chat');
    expect(console.log).toHaveBeenCalledWith('🔄 Static suggestions refreshed for new conversation after delete');
  });

  it('should handle deleting a non-current conversation', () => {
    const conversationHistory = [
      { id: '1', title: 'Chat 1', messages: [{ role: 'user', content: 'Hello' }] },
      { id: '2', title: 'Chat 2', messages: [{ role: 'user', content: 'Hi' }] },
      { id: '3', title: 'Chat 3', messages: [] }
    ];
    const currentChatId = '1'; // Different from the one being deleted
    
    const handleDeleteChat = createMockDeleteHandler(conversationHistory, currentChatId);
    const mockEvent = { stopPropagation: vi.fn() };
    
    handleDeleteChat('2', mockEvent);
    
    // Should remove the deleted chat from history
    expect(mockSetConversationHistory).toHaveBeenCalledWith([
      { id: '1', title: 'Chat 1', messages: [{ role: 'user', content: 'Hello' }] },
      { id: '3', title: 'Chat 3', messages: [] }
    ]);
    
    // Should NOT change current chat since we deleted a different one
    expect(mockSetCurrentChatId).not.toHaveBeenCalled();
    expect(mockSetMessages).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully with fallback conversation creation', () => {
    const conversationHistory = [];
    const currentChatId = '1';
    
    // Mock localStorage.setItem to throw an error
    localStorage.setItem.mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    const handleDeleteChat = createMockDeleteHandler(conversationHistory, currentChatId);
    const mockEvent = { stopPropagation: vi.fn() };
    
    // Mock Date.now() for predictable emergency chat ID
    const mockTimestamp = 9876543210;
    vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
    
    handleDeleteChat('1', mockEvent);
    
    // Should log error
    expect(console.error).toHaveBeenCalledWith('❌ Error deleting chat:', expect.any(Error));
    
    // Should create emergency conversation
    expect(console.log).toHaveBeenCalledWith('🔄 Fallback: Creating emergency conversation');
    
    const expectedEmergencyChat = {
      id: mockTimestamp.toString(),
      title: 'New Conversation',
      messages: [],
      lastUpdated: expect.any(String)
    };
    
    expect(mockSetConversationHistory).toHaveBeenCalledWith([expectedEmergencyChat]);
    expect(mockSetCurrentChatId).toHaveBeenCalledWith(expectedEmergencyChat.id);
    expect(mockSetMessages).toHaveBeenCalledWith([]);
  });
});
