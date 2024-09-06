import React, { useEffect, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Editor from '@monaco-editor/react';
import { isCodeCorrect } from './utils';
import SmileyFace from './SmileyFace';
import '../styles/CodeEditor.css';

function CodeEditor({ codeName, initCode, currCode, solutionCode, onChange, language = 'javascript', readOnly = false }) {
  const [userRole, setUserRole] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [client, setClient] = useState(null);
  const [currentCode, setCurrentCode] = useState(currCode);
  const [showSmiley, setShowSmiley] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(13);
  const [userId] = useState(`user_${Date.now()}_${Math.floor(Math.random() * 1000)}`); //create unique userId
  const [userRoles, setUserRoles] = useState({});

  useEffect(() => { //settings for fonr and theme
    const savedTheme = localStorage.getItem('editorTheme');
    const savedFontSize = localStorage.getItem('editorFontSize');
    if (savedTheme) setEditorTheme(savedTheme);
    if (savedFontSize) setFontSize(Number(savedFontSize));
  }, []);

  useEffect(() => {
    localStorage.setItem('editorTheme', editorTheme);
    localStorage.setItem('editorFontSize', fontSize);
  }, [editorTheme, fontSize]);

  useEffect(() => {   // WebSocket connection and disconection handling
    if (!codeName) {
      console.error('codeName is missing or undefined');
      return;
    }

    const socketFactory = () => new SockJS('http://localhost:8081/ws');
    const stompClient = Stomp.over(socketFactory);

    const handleRoleUpdate = (data) => {
      if (data.role) {
        setUserRoles(prevRoles => ({ ...prevRoles, [userId]: data.role }));
        if (data.role === 'mentor') {
          setUserRole('mentor');
        }
      }
      if (data.userCount !== undefined) setUserCount(data.userCount);
      if (data.currentCode !== undefined) {
        setCurrentCode(data.currentCode); //update the editor with new code
      }
      if (data.mentorDisconnected) {
        alert('The mentor has disconnected. Returning to the lobby.');
        window.location.href = '/'; //lobby page route
      }
    };

    stompClient.connect({}, (frame) => {
      console.log('Connected: ', frame);
      stompClient.subscribe(`/topic/codeblock/${codeName}`, (message) => {
        try {
          const data = JSON.parse(message.body);
          if (typeof data === 'object') {
            handleRoleUpdate(data);
          } else {
            console.error('Parsed data is not an object:', data);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      stompClient.send(
        `/app/connect/${codeName}`,
        {},
        JSON.stringify({ userId })
      );
    });

    stompClient.onWebSocketError = (event) => {
      console.error('WebSocket error: ', event);
    };

    stompClient.activate();
    setClient(stompClient);

    const handleBeforeUnload = () => {
      if (stompClient && stompClient.connected) {
        stompClient.send(`/app/disconnect/${codeName}`, {}, JSON.stringify({ userId }));
        stompClient.deactivate();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (stompClient && stompClient.connected) {
        stompClient.send(`/app/disconnect/${codeName}`, {}, JSON.stringify({ userId }));
        stompClient.deactivate();
      }
    };
  }, [codeName, userId]);

  useEffect(() => {
    setCurrentCode(initCode);
  }, [initCode]);

  const handleEditorChange = (value) => {
    setCurrentCode(value);
    if (onChange) onChange(value);

    if (client && client.connected && userRole !== 'mentor') {
      client.publish({
        destination: `/app/codeblock/${codeName}`,
        body: JSON.stringify({ type: 'CODE_UPDATE', currentCode: value }),
      });
    }
  };

  const handleSubmit = () => {
    if (isCodeCorrect(currentCode, solutionCode)) {
      setShowSmiley(true);
    } else {
      alert('Incorrect solution. Please try again.');
    }
  };

  const handleThemeChange = () => {
    setEditorTheme((prevTheme) => (prevTheme === 'vs-dark' ? 'vs-light' : 'vs-dark'));
  };

  const handleFontSizeChange = (event) => {
    setFontSize(Number(event.target.value));
  };

  return (
    <div className="code-editor">
      <h1 className="code-name">{codeName}</h1>
      <div className="sidebar">
        <p className="sidebar-item">Users in this page: {userCount}</p>
        <p className="sidebar-item">Role: {userRole === 'mentor' ? 'Mentor' : 'Student'}</p>
      </div>
      <div className="controls">
        <button onClick={handleThemeChange} className="theme-button">
          Toggle Theme
        </button>
        <label className="font-size-label">
          Font Size:
          <input
            type="number"
            value={fontSize}
            onChange={handleFontSizeChange}
            min="10"
            max="30"
            className="font-size-input"
          />
        </label>
      </div>
      <Editor
        height="60vh"
        language={language}
        value={currentCode} //reflect the updated code
        theme={editorTheme}
        options={{
          readOnly: readOnly || userRole === 'mentor',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: fontSize,
        }}
        onChange={handleEditorChange}
      />
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
      {showSmiley && <SmileyFace />}
    </div>
  );
}

export default CodeEditor;
