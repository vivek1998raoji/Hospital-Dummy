'use client';
import { useState, useEffect, useRef } from 'react';

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const editorRef = useRef(null);

  // Sync state to DOM only when it changes from the outside (prevent cursor jumping)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, arg = null) => {
    if (isHtmlMode) return;
    document.execCommand(command, false, arg);
    // Refocus and trigger input sync
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const handleHeading = (e) => {
    const value = e.target.value;
    if (value) {
      executeCommand('formatBlock', value);
      e.target.value = ''; // Reset select
    }
  };

  const handleFontFamily = (e) => {
    const value = e.target.value;
    if (value) {
      executeCommand('fontName', value);
      e.target.value = ''; // Reset select
    }
  };

  const handleFontSize = (e) => {
    const value = e.target.value;
    if (value) {
      executeCommand('fontSize', value);
      e.target.value = ''; // Reset select
    }
  };

  const handleColor = (e) => {
    const value = e.target.value;
    if (value) {
      executeCommand('foreColor', value);
      e.target.value = ''; // Reset select
    }
  };

  const handleAddLink = () => {
    if (isHtmlMode) return;
    const selection = window.getSelection().toString();
    const url = prompt('Enter link URL (e.g. https://google.com):', selection.startsWith('http') ? selection : 'https://');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  return (
    <div style={{
      border: '1px solid var(--gray-300)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Editor Toolbar */}
      <div style={{
        background: 'var(--gray-50)',
        borderBottom: '1px solid var(--gray-200)',
        padding: '8px 12px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        alignItems: 'center',
        userSelect: 'none',
      }}>
        {/* Headings */}
        <select onChange={handleHeading} disabled={isHtmlMode} style={{
          padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--gray-300)', fontSize: '12px', fontWeight: 500, background: 'white'
        }}>
          <option value="">Style</option>
          <option value="<p>">Paragraph</option>
          <option value="<h1>">Heading 1</option>
          <option value="<h2>">Heading 2</option>
          <option value="<h3>">Heading 3</option>
          <option value="<h4>">Heading 4</option>
        </select>

        {/* Font Family */}
        <select onChange={handleFontFamily} disabled={isHtmlMode} style={{
          padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--gray-300)', fontSize: '12px', fontWeight: 500, background: 'white'
        }}>
          <option value="">Font</option>
          <option value="Inter, sans-serif">Inter (Sans)</option>
          <option value="'Playfair Display', Georgia, serif">Playfair (Elegant)</option>
          <option value="'Outfit', sans-serif">Outfit</option>
          <option value="monospace">Monospace</option>
        </select>

        {/* Font Size */}
        <select onChange={handleFontSize} disabled={isHtmlMode} style={{
          padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--gray-300)', fontSize: '12px', fontWeight: 500, background: 'white'
        }}>
          <option value="">Size</option>
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="4">Large</option>
          <option value="5">XL</option>
          <option value="6">XXL</option>
        </select>

        {/* Colors */}
        <select onChange={handleColor} disabled={isHtmlMode} style={{
          padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--gray-300)', fontSize: '12px', fontWeight: 500, background: 'white'
        }}>
          <option value="">Color</option>
          <option value="#0a2540">Primary Dark</option>
          <option value="#0ea5e9">Accent Blue</option>
          <option value="#10b981">Success Green</option>
          <option value="#ef4444">Danger Red</option>
          <option value="#0f172a">Slate Black</option>
          <option value="#64748b">Slate Gray</option>
        </select>

        <div style={{ width: '1px', height: '20px', background: 'var(--gray-300)', margin: '0 4px' }} />

        {/* Inline Formatting */}
        {[
          { icon: 'B', title: 'Bold', cmd: 'bold' },
          { icon: 'I', title: 'Italic', cmd: 'italic' },
          { icon: 'U', title: 'Underline', cmd: 'underline' },
          { icon: 'S', title: 'Strikethrough', cmd: 'strikeThrough' },
        ].map(btn => (
          <button
            key={btn.cmd}
            type="button"
            onClick={() => executeCommand(btn.cmd)}
            disabled={isHtmlMode}
            title={btn.title}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              border: '1px solid var(--gray-200)',
              background: 'white',
              cursor: isHtmlMode ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {btn.icon}
          </button>
        ))}

        <div style={{ width: '1px', height: '20px', background: 'var(--gray-300)', margin: '0 4px' }} />

        {/* Lists & Alignment */}
        {[
          { icon: '•', title: 'Bullet List', cmd: 'insertUnorderedList' },
          { icon: '1.', title: 'Numbered List', cmd: 'insertOrderedList' },
          { icon: '←', title: 'Align Left', cmd: 'justifyLeft' },
          { icon: '↔', title: 'Align Center', cmd: 'justifyCenter' },
          { icon: '→', title: 'Align Right', cmd: 'justifyRight' },
        ].map(btn => (
          <button
            key={btn.cmd}
            type="button"
            onClick={() => executeCommand(btn.cmd)}
            disabled={isHtmlMode}
            title={btn.title}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              border: '1px solid var(--gray-200)',
              background: 'white',
              cursor: isHtmlMode ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {btn.icon}
          </button>
        ))}

        <div style={{ width: '1px', height: '20px', background: 'var(--gray-300)', margin: '0 4px' }} />

        {/* Links */}
        <button
          type="button"
          onClick={handleAddLink}
          disabled={isHtmlMode}
          title="Insert Link"
          style={{
            padding: '0 8px',
            height: '28px',
            borderRadius: '4px',
            border: '1px solid var(--gray-200)',
            background: 'white',
            cursor: isHtmlMode ? 'not-allowed' : 'pointer',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          🔗 Link
        </button>

        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          disabled={isHtmlMode}
          title="Clear Formatting"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            border: '1px solid var(--gray-200)',
            background: 'white',
            cursor: isHtmlMode ? 'not-allowed' : 'pointer',
            fontSize: '12px',
          }}
        >
          🧹
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }} />

        {/* Toggle HTML view */}
        <button
          type="button"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          style={{
            padding: '4px 10px',
            borderRadius: '4px',
            border: '1px solid var(--gray-300)',
            background: isHtmlMode ? 'var(--primary)' : 'white',
            color: isHtmlMode ? 'white' : 'var(--gray-700)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isHtmlMode ? '✍️ Visual Editor' : '💻 HTML View'}
        </button>
      </div>

      {/* Editable Area */}
      {isHtmlMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Edit raw HTML code..."
          rows="10"
          style={{
            border: 'none',
            outline: 'none',
            padding: '16px',
            fontSize: '13px',
            fontFamily: 'monospace',
            background: '#1e293b',
            color: '#f8fafc',
            width: '100%',
            resize: 'vertical',
            lineHeight: 1.5,
          }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable={true}
          onBlur={handleInput}
          onInput={handleInput}
          placeholder={placeholder}
          style={{
            padding: '16px',
            minHeight: '200px',
            maxHeight: '400px',
            overflowY: 'auto',
            outline: 'none',
            fontSize: '14px',
            lineHeight: 1.6,
            background: 'white',
            textAlign: 'left',
          }}
          className="rich-editor-content"
        />
      )}
    </div>
  );
}
