import React, { useEffect, useState, useCallback, useRef } from 'react';

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (window.matchMedia && window.matchMedia('(max-width: 768px)').matches)
    || ('ontouchstart' in window);
};

const getKeyCode = (code) => {
  const map = {
    'KeyW': 87, 'KeyA': 65, 'KeyS': 83, 'KeyD': 68,
    'ArrowUp': 38, 'ArrowDown': 40, 'ArrowLeft': 37, 'ArrowRight': 39,
    'Space': 32, 'Enter': 13,
  };
  return map[code] || 0;
};

const simulateKey = (iframe, key, code, type) => {
  const keyCode = getKeyCode(code);
  iframe.contentWindow?.postMessage({ type, key, code, keyCode }, '*');
};

const KEY_MAP = {
  w: { key: 'w', code: 'KeyW' },
  a: { key: 'a', code: 'KeyA' },
  s: { key: 's', code: 'KeyS' },
  d: { key: 'd', code: 'KeyD' },
  ArrowUp: { key: 'ArrowUp', code: 'ArrowUp' },
  ArrowDown: { key: 'ArrowDown', code: 'ArrowDown' },
  ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft' },
  ArrowRight: { key: 'ArrowRight', code: 'ArrowRight' },
  Space: { key: ' ', code: 'Space' },
  Enter: { key: 'Enter', code: 'Enter' },
};

const DpadButton = ({ label, keyId, onPress, onRelease, style }) => (
  <button
    onPointerDown={(e) => { e.preventDefault(); onPress(keyId); }}
    onPointerUp={(e) => { e.preventDefault(); onRelease(keyId); }}
    onPointerLeave={(e) => { e.preventDefault(); onRelease(keyId); }}
    onPointerCancel={(e) => { e.preventDefault(); onRelease(keyId); }}
    style={{
      width: 45, height: 45,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.18)',
      border: '1.5px solid rgba(255,255,255,0.35)',
      borderRadius: 10,
      color: '#ffffff', fontSize: 18, fontWeight: 700,
      cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none',
      touchAction: 'none',
      boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
      backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      transition: 'background-color 0.08s',
      ...style,
    }}
  >
    {label}
  </button>
);

const Dpad = ({ upKey, downKey, leftKey, rightKey, upLabel, downLabel, leftLabel, rightLabel, onPress, onRelease }) => (
  <div style={{ position: 'relative', width: 135, height: 135 }}>
    <div style={{ position: 'absolute', top: 0, left: 45 }}>
      <DpadButton label={upLabel} keyId={upKey} onPress={onPress} onRelease={onRelease} style={{ borderRadius: '10px 10px 4px 4px' }} />
    </div>
    <div style={{ position: 'absolute', top: 45, left: 0 }}>
      <DpadButton label={leftLabel} keyId={leftKey} onPress={onPress} onRelease={onRelease} style={{ borderRadius: '10px 4px 4px 10px' }} />
    </div>
    <div style={{
      position: 'absolute', top: 45, left: 45, width: 45, height: 45,
      backgroundColor: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)',
    }} />
    <div style={{ position: 'absolute', top: 45, left: 90 }}>
      <DpadButton label={rightLabel} keyId={rightKey} onPress={onPress} onRelease={onRelease} style={{ borderRadius: '4px 10px 10px 4px' }} />
    </div>
    <div style={{ position: 'absolute', top: 90, left: 45 }}>
      <DpadButton label={downLabel} keyId={downKey} onPress={onPress} onRelease={onRelease} style={{ borderRadius: '4px 4px 10px 10px' }} />
    </div>
  </div>
);

const UnityGame = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const iframeRef = useRef(null);
  const heldKeys = useRef(new Set());
  const holdIntervals = useRef({});

  useEffect(() => {
    setShowMobileControls(isMobileDevice());
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const fireKey = useCallback((keyId, type) => {
    const k = KEY_MAP[keyId];
    if (!k || !iframeRef.current) return;
    simulateKey(iframeRef.current, k.key, k.code, type);
  }, []);

  const handlePress = useCallback((keyId) => {
    if (heldKeys.current.has(keyId)) return;
    heldKeys.current.add(keyId);
    fireKey(keyId, 'keydown');
    holdIntervals.current[keyId] = setInterval(() => {
      fireKey(keyId, 'keydown');
    }, 80);
  }, [fireKey]);

  const handleRelease = useCallback((keyId) => {
    if (!heldKeys.current.has(keyId)) return;
    heldKeys.current.delete(keyId);
    clearInterval(holdIntervals.current[keyId]);
    delete holdIntervals.current[keyId];
    fireKey(keyId, 'keyup');
  }, [fireKey]);

  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      backgroundColor: '#333333', minHeight: '100vh',
      paddingTop: showMobileControls ? '16px' : '30px',
      position: 'relative', boxSizing: 'border-box',
    }}>
      <iframe
        ref={iframeRef}
        src="https://duncanfbagley22.github.io/duncanPersonalPageUnity/"
        scrolling="no"
        style={{
          width: showMobileControls ? '100vw' : '800px',
          height: showMobileControls ? '56vw' : '510px',
          border: 'none',
          borderRadius: showMobileControls ? '0' : '8px',
          overflow: 'hidden', padding: 0, margin: 0, display: 'block',
          transform: showMobileControls ? 'none' : 'translateY(-10px)',
          maxWidth: '100vw', flexShrink: 0,
        }}
        title="Unity Game"
      />

      <button
        onClick={togglePopup}
        style={{
          marginTop: showMobileControls ? '12px' : '0px',
          padding: '10px 20px', fontSize: '16px',
          backgroundColor: '#777777', color: '#ffffff',
          border: 'none', borderRadius: '8px', cursor: 'pointer',
          boxShadow: '0px 2px 5px rgba(0,0,0,0.3)',
          position: 'relative', zIndex: 10,
        }}
      >
        Show Controls
      </button>

      {showMobileControls && (
        <div style={{
          width: '100%', display: 'flex', flexDirection: 'row',
          alignItems: 'center', justifyContent: 'center',
          gap: '20px', padding: '16px 12px 24px 12px',
          boxSizing: 'border-box', backgroundColor: '#2a2a2a',
          marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div>
            <div style={{ marginBottom: 6, textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'monospace', letterSpacing: 1 }}>MOVE</div>
            <Dpad upKey="w" downKey="s" leftKey="a" rightKey="d"
              upLabel="W" downLabel="S" leftLabel="A" rightLabel="D"
              onPress={handlePress} onRelease={handleRelease} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <DpadButton label="SPACE" keyId="Space" onPress={handlePress} onRelease={handleRelease}
              style={{ width: 70, height: 38, fontSize: 11, letterSpacing: 1 }} />
            <DpadButton label="ENTER" keyId="Enter" onPress={handlePress} onRelease={handleRelease}
              style={{ width: 70, height: 38, fontSize: 11, letterSpacing: 1 }} />
          </div>
          <div>
            <div style={{ marginBottom: 6, textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'monospace', letterSpacing: 1 }}>NAVIGATE</div>
            <Dpad upKey="ArrowUp" downKey="ArrowDown" leftKey="ArrowLeft" rightKey="ArrowRight"
              upLabel="▲" downLabel="▼" leftLabel="◀" rightLabel="▶"
              onPress={handlePress} onRelease={handleRelease} />
          </div>
        </div>
      )}

      {isPopupVisible && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -60%)',
          backgroundColor: '#222222', color: '#ffffff',
          padding: '20px', borderRadius: '10px',
          boxShadow: '0px 0px 15px rgba(0,0,0,0.5)',
          zIndex: 1000, width: '90%', maxWidth: '400px', textAlign: 'center',
        }}>
          <h2>Controls</h2>
          <p><strong>W,A,S,D</strong> - Move Character</p>
          <p><strong>SPACEBAR</strong> - Interact With Other Characters, Signs, and Objects</p>
          <p><strong>ARROW KEYS</strong> - Navigate Popup Menus</p>
          <p><strong>ENTER</strong> - Make Selection Within Popup Menus</p>
          <button onClick={togglePopup} style={{
            marginTop: '20px', padding: '10px 20px', fontSize: '16px',
            backgroundColor: '#666666', color: '#ffffff',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
          }}>Close</button>
        </div>
      )}
      {isPopupVisible && (
        <div onClick={togglePopup} style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
        }} />
      )}
    </div>
  );
};

export default UnityGame;