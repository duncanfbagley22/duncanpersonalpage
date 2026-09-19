import React, { useEffect, useState, useCallback, useRef } from 'react';
import '../styles/Overworld.css';


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

// Each on-screen button can drive more than one underlying key. The D-pad
// directions fire both the WASD key (overworld movement) and the matching
// arrow key (menu navigation) at once, mirroring how a single physical D-pad
// serves both purposes on real hardware.
const BUTTON_KEYS = {
  up: [{ key: 'w', code: 'KeyW' }, { key: 'ArrowUp', code: 'ArrowUp' }],
  down: [{ key: 's', code: 'KeyS' }, { key: 'ArrowDown', code: 'ArrowDown' }],
  left: [{ key: 'a', code: 'KeyA' }, { key: 'ArrowLeft', code: 'ArrowLeft' }],
  right: [{ key: 'd', code: 'KeyD' }, { key: 'ArrowRight', code: 'ArrowRight' }],
  a: [{ key: ' ', code: 'Space' }],
  b: [{ key: 'Enter', code: 'Enter' }],
};

// Reverse lookup so a physical keyboard press can light up the matching
// on-screen button.
const CODE_TO_BUTTON = {
  KeyW: 'up', ArrowUp: 'up',
  KeyS: 'down', ArrowDown: 'down',
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right',
  Space: 'a',
  Enter: 'b',
};

const WATCHED_CODES = new Set(Object.keys(CODE_TO_BUTTON));

// A single retro button: shows a pressed state either from a direct
// tap/click or from the `active` prop (driven by a real keyboard press).
const ConsoleButton = ({ label, shape, active = false, onPress, onRelease, className = '' }) => {
  const [isTouching, setIsTouching] = useState(false);
  const pressed = active || isTouching;

  const down = (e) => { e.preventDefault(); setIsTouching(true); onPress && onPress(); };
  const up = (e) => { e.preventDefault(); setIsTouching(false); onRelease && onRelease(); };

  return (
    <button
      type="button"
      className={`console-btn console-btn--${shape}${pressed ? ' is-pressed' : ''}${className ? ` ${className}` : ''}`}
      onPointerDown={down}
      onPointerUp={up}
      onPointerLeave={up}
      onPointerCancel={up}
    >
      {label}
    </button>
  );
};

const DirectionalGlyph = ({ direction }) => {
  const paths = {
    up: 'M12 3 L21 18 H3 Z',
    down: 'M12 21 L21 6 H3 Z',
    left: 'M21 3 L6 12 L21 21 Z',
    right: 'M3 3 L18 12 L3 21 Z',
  };

  const offsets = {
    up: { x: 0, y: 0 },
    down: { x: 0, y: 0 },
    left: { x: -2, y: 0 },
    right: { x: 2, y: 0 },
  };

  const offset = offsets[direction] || { x: 0, y: 0 };

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{
        width: '18px',
        height: '18px',
        display: 'block',
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
    >
      <path d={paths[direction]} fill="currentColor" />
    </svg>
  );
};

const DirectionalPad = ({ activeButtons, onPress, onRelease }) => (
  <div className="overworld-dpad">
    <ConsoleButton label={<DirectionalGlyph direction="up" />} shape="dpad-up" active={activeButtons.has('up')} onPress={() => onPress('up')} onRelease={() => onRelease('up')} />
    <ConsoleButton label={<DirectionalGlyph direction="left" />} shape="dpad-left" active={activeButtons.has('left')} onPress={() => onPress('left')} onRelease={() => onRelease('left')} />
    <div className="overworld-dpad-hub" />
    <ConsoleButton label={<DirectionalGlyph direction="right" />} shape="dpad-right" active={activeButtons.has('right')} onPress={() => onPress('right')} onRelease={() => onRelease('right')} />
    <ConsoleButton label={<DirectionalGlyph direction="down" />} shape="dpad-down" active={activeButtons.has('down')} onPress={() => onPress('down')} onRelease={() => onRelease('down')} />
  </div>
);

const Overworld = ({ controlsOpen = false, onCloseControls = () => {} }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [pressedButtons, setPressedButtons] = useState(() => new Set());
  const iframeRef = useRef(null);
  const heldButtons = useRef(new Set());
  const holdIntervals = useRef({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const fireButton = useCallback((buttonId, type) => {
    const keys = BUTTON_KEYS[buttonId];
    if (!keys || !iframeRef.current) return;
    keys.forEach(({ key, code }) => simulateKey(iframeRef.current, key, code, type));
  }, []);

  const handlePress = useCallback((buttonId) => {
    if (heldButtons.current.has(buttonId)) return;
    heldButtons.current.add(buttonId);
    setPressedButtons((prev) => new Set(prev).add(buttonId));
    fireButton(buttonId, 'keydown');
    holdIntervals.current[buttonId] = setInterval(() => fireButton(buttonId, 'keydown'), 80);
  }, [fireButton]);

  const handleRelease = useCallback((buttonId) => {
    if (!heldButtons.current.has(buttonId)) return;
    heldButtons.current.delete(buttonId);
    setPressedButtons((prev) => {
      const next = new Set(prev);
      next.delete(buttonId);
      return next;
    });
    clearInterval(holdIntervals.current[buttonId]);
    delete holdIntervals.current[buttonId];
    fireButton(buttonId, 'keyup');
  }, [fireButton]);

  useEffect(() => {
    if (!hasStarted) return undefined;

    const handleKeyDown = (e) => {
      if (!WATCHED_CODES.has(e.code) || e.repeat) return;
      const buttonId = CODE_TO_BUTTON[e.code];
      if (buttonId) fireButton(buttonId, 'keydown');
    };
    const handleKeyUp = (e) => {
      if (!WATCHED_CODES.has(e.code)) return;
      const buttonId = CODE_TO_BUTTON[e.code];
      if (buttonId) fireButton(buttonId, 'keyup');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [hasStarted, fireButton]);

  const activeButtons = new Set(pressedButtons);

  const handleStart = () => {
    setHasStarted(true);
    setShowInstructions(false);
  };

  const handleOverlayClick = () => {
    // Before the game has started, the instructions must be dismissed via
    // "Start" below rather than by clicking outside the popup. Once started,
    // the info button in the header owns this popup, so clicking out closes it.
    if (hasStarted) onCloseControls();
  };

  const isPopupVisible = hasStarted ? controlsOpen : showInstructions;

  return (
    <div className="overworld-page" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      backgroundColor: 'var(--color-primary-dark)', minHeight: '100%',
      paddingTop: '16px',
      position: 'relative', boxSizing: 'border-box',
    }}>
      {hasStarted && (
        <div className="overworld-console">
          <div className="overworld-console-left">
            <DirectionalPad activeButtons={activeButtons} onPress={handlePress} onRelease={handleRelease} />
            <div className="overworld-pill-row">
              <ConsoleButton label="SELECT" shape="pill" />
              <ConsoleButton label="START" shape="pill" />
            </div>
          </div>

          <div className="overworld-console-screen">
            <iframe
              ref={iframeRef}
              src="https://duncanfbagley22.github.io/duncanPersonalPageUnity/"
              scrolling="no"
              className="overworld-screen"
              title="Overworld"
            />
          </div>

          <div className="overworld-console-right">
            <div className="overworld-face-cluster">
              <ConsoleButton label="A" shape="face-a" active={activeButtons.has('a')} onPress={() => handlePress('a')} onRelease={() => handleRelease('a')} />
              <ConsoleButton label="B" shape="face-b" active={activeButtons.has('b')} onPress={() => handlePress('b')} onRelease={() => handleRelease('b')} />
            </div>
          </div>
        </div>
      )}

      {isPopupVisible && (
        <div className="overworld-popup-content">
          {hasStarted ? (
            <>
              <h2>Controls</h2>
              <p><strong>W,A,S,D or Arrow Buttons</strong> - Move Character</p>
              <p><strong>SPACEBAR or A Button</strong> - Interact With Other Characters, Signs, and Objects</p>
              <p><strong>B Button, Start, Select</strong> - No Function</p>
              <button onClick={onCloseControls} className="overworld-popup-button">Close</button>
            </>
          ) : (
            <>
              <h2>Instructions</h2>
              <h3>Click "Start" to bring up the navigation world</h3>
              <p>
                Use either the on-screen controls or your physical keyboard to move around and interact with the world. If you need a reminder of the controls, click the "i" button in the top right corner to bring up a quick reference guide.
              </p>
              <button onClick={handleStart} className="overworld-popup-button">Start</button>
            </>
          )}
        </div>
      )}
      {isPopupVisible && (
        <div className="overworld-popup-overlay" onClick={handleOverlayClick} />
      )}
    </div>
  );
};

export default Overworld;
