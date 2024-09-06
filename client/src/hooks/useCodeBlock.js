import { useState, useEffect, useCallback } from 'react';
import { getCodeBlockByName } from '../services/api';

function useCodeBlock(codeName) {
  
  const [codeBlock, setCodeBlock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getCodeBlock() {
      setIsLoading(true);
      setError(null);
      try {
        const block = await getCodeBlockByName(codeName);
        setCodeBlock(block);
      } catch (err) {
        console.error('error getting code block:', err);
        setError('Failed to get code block.');
      } finally {
        setIsLoading(false); //done loading
      }
    }
    getCodeBlock();
  }, [codeName]);

  const handleCodeChange = useCallback((newCode) => {
    if (codeBlock) {
      setCodeBlock(prev => ({ ...prev, currentCode: newCode }));
    }
  }, [codeBlock]);
  
  return { codeBlock, handleCodeChange, isLoading, error };
}

export default useCodeBlock;