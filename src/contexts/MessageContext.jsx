import React, { createContext, useContext } from 'react';
import { useMessages } from '../hooks/useMessages';

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const messageManager = useMessages();

  return (
    <MessageContext.Provider value={messageManager}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return context;
};
