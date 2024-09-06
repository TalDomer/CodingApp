import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import useCodeBlock from '../hooks/useCodeBlock';

function CodeBlock() {
  const { codeName } = useParams();
  const { codeBlock, handleCodeChange, isLoading, error } = useCodeBlock(codeName);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!codeBlock) return <div>No code block found</div>;

  return (
    <div className="code-block">
      <CodeEditor 
        codeName={codeName} 
        initCode={codeBlock.initCode}
        currCode={codeBlock.currentCode}
        solutionCode={codeBlock.solutionCode} 
        onChange={handleCodeChange}
      />
    </div>
  );
}

export default CodeBlock;
