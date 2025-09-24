import { useState, useCallback } from 'react';

export const useCredits = (initialCredits = 1000) => {
  const [credits, setCredits] = useState(initialCredits);
  
  const addCredits = useCallback((amount: number) => {
    setCredits(prev => prev + amount);
  }, []);
  
  const subtractCredits = useCallback((amount: number) => {
    setCredits(prev => Math.max(0, prev - amount));
    return credits >= amount;
  }, [credits]);
  
  const resetCredits = useCallback(() => {
    setCredits(initialCredits);
  }, [initialCredits]);
  
  return { credits, addCredits, subtractCredits, resetCredits };
};