'use client';

import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/api';

// Components
import Header from './Header';
import SettingsPanel from './SettingsPanel';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ConversationList from './ConversationList';
import MetaInformation from './MetaInformation';
import MetaInformationModal from './MetaInformationModal';
import OnaceSelector from './OnaceSelector';

// Hooks
import { useConversations } from '../hooks/useConversations';
import { useTheme } from '../hooks/useTheme';
import { useChatApi } from '../hooks/useChatApi';
import { useOnaceCategories } from '../hooks/useOnaceCategories';

// Utils
import { exportChatAsJson } from '../utils/exportUtils';

const MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'gpt-4.1', name: 'gpt-4.1-mini-2025-04-14' },
];

export default function Chat() {
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedModel, setSelectedModel] = useState(MODELS[2].id);
  const [temperature, setTemperature] = useState(0.2);
  const [topK, setTopK] = useState(5);
  const [selectedOnaceCode, setSelectedOnaceCode] = useState('0');

  // New state for meta information editing
  const [isEditingMetaInfo, setIsEditingMetaInfo] = useState(false);
  const [showMetaInfoModal, setShowMetaInfoModal] = useState(false);

  // Custom hooks
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { conversations, currentConversationId, currentConversation, setCurrentConversationId, createNewConversation, deleteConversation, addMessageToConversation, clearCurrentConversation, updateConversationMetaInformation, updateConversationTitle } = useConversations();
  const { sendMessage, isLoading } = useChatApi();
  const { categories: onaceCategories } = useOnaceCategories();

  // Ensure there's always a conversation selected (but not creating duplicates)
  useEffect(() => {
    if (conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [conversations, currentConversationId, setCurrentConversationId]);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Event handlers
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleExportChat = () => {
    if (currentConversation?.messages) {
      exportChatAsJson(currentConversation.messages);
    }
  };

  // Add this new function for handling meta information updates
  const handleUpdateMetaInfo = (metaInfo: string) => {
    if (currentConversationId) {
      updateConversationMetaInformation(currentConversationId, metaInfo);
    }
  };

  // Add handleUpdateTitle function
  const handleUpdateTitle = (newTitle: string) => {
    if (currentConversationId) {
      updateConversationTitle(currentConversationId, newTitle);
    }
  };

  const handleNewChat = () => {
    // Check if there's already an empty conversation we can use
    const emptyConversation = conversations.find(
      conv => conv.messages.length === 0 && conv.title === 'New Chat'
    );
    
    if (emptyConversation) {
      setCurrentConversationId(emptyConversation.id);
    } else {
      createNewConversation();
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // If no conversation exists, create one
    let activeConversationId = currentConversationId;
    if (!activeConversationId) {
      activeConversationId = createNewConversation();
    }

    // Create and add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    addMessageToConversation(activeConversationId, userMessage);

    // Send to API and handle response
    await sendMessage(
      content, 
      currentConversation?.messages, // Pass the current conversation messages as history
      {
        model: selectedModel,
        temperature,
        topK: topK,
        metaInformation: currentConversation?.metaInformation,
        userOnaceCode: selectedOnaceCode,
        onSuccess: (assistantMessage) => {
          addMessageToConversation(activeConversationId!, assistantMessage);
          scrollToBottom();
        },
        onError: (errorMessage) => {
          addMessageToConversation(activeConversationId!, errorMessage);
          scrollToBottom();
        }
      }
    );
  };

  // Handle file category update

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800`}>
        {/* Conversation List */}
        <ConversationList
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={setCurrentConversationId}
          onDeleteConversation={deleteConversation}
          onCreateNewConversation={handleNewChat}
        />

      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          onToggleSettings={() => setShowSettings(!showSettings)}
          onClearChat={clearCurrentConversation}
          onExportChat={handleExportChat}
          onEditMetaInfo={() => {
            // If no messages, edit inline, otherwise show modal
            if (currentConversation?.messages.length === 0) {
              setIsEditingMetaInfo(true);
            } else {
              setShowMetaInfoModal(true);
            }
          }}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          title={currentConversation?.title || 'New Chat'}
          onUpdateTitle={handleUpdateTitle}
        />

        {/* Industry Selector */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100">
                Select Your Industry (ÖNACE)
              </label>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
              Choose your industry to get relevant documents and regulations
            </p>
            <OnaceSelector
              selectedCode={selectedOnaceCode}
              onCodeChange={setSelectedOnaceCode}
            />
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            temperature={temperature}
            onTemperatureChange={setTemperature}
            models={MODELS}
            topK={topK}
            onTopKChange={setTopK}
          />
        )}

        {/* Meta Information Modal for existing chats */}
        <MetaInformationModal
          isOpen={showMetaInfoModal}
          onClose={() => setShowMetaInfoModal(false)}
          value={currentConversation?.metaInformation || ''}
          onSave={handleUpdateMetaInfo}
        />

        {/* Industry Status Indicator */}
        {selectedOnaceCode !== '0' && (
          <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-800 dark:text-green-200 font-medium">
                Industry-specific mode: {onaceCategories.find(cat => cat.code === selectedOnaceCode)?.name_english || selectedOnaceCode}
              </span>
              <span className="text-green-600 dark:text-green-400 text-xs">
                (Showing relevant documents only)
              </span>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 dark:bg-gray-900 scroll-smooth">
          {/* Welcome message for new conversations */}
          {currentConversation?.messages.length === 0 && !isEditingMetaInfo && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Welcome to AIKA - Your AI Compliance Assistant
                  </h3>
                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                    <p>
                      <strong>🏭 Industry Selection:</strong> Choose your industry above to get relevant documents and regulations specific to your sector.
                    </p>
                    <p>
                      <strong>📋 VSME Focus:</strong> This system prioritizes VSME (EU 2025/1710) requirements while providing comprehensive regulatory guidance.
                    </p>
                    <p>
                      <strong>💬 How to use:</strong> Ask questions about compliance, sustainability reporting, or specific regulations. I'll provide answers based on your industry selection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Meta Information (only show if there are no messages or if editing) */}
          {(currentConversation?.messages.length === 0 || isEditingMetaInfo) && currentConversationId && (
            <MetaInformation 
              value={currentConversation?.metaInformation || ''} 
              onSave={handleUpdateMetaInfo}
              isEditing={isEditingMetaInfo}
              onToggleEdit={() => setIsEditingMetaInfo(!isEditingMetaInfo)}
            />
          )}
          
          {currentConversation?.messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onCopy={handleCopyMessage}
            />
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 