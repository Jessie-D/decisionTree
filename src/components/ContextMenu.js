import React from 'react';

export default function ContextMenu({ id }) {
  return (
    <nav
      role="menu"
      tabindex="-1"
      className="react-contextmenu flow-context-menu"
      style={{position: 'fixed', opacity: 0, pointerEvents: 'none'}}
    >
      <div className="react-contextmenu-item" role="menuitem" tabindex="-1" aria-disabled="false">
        <div className="flow-context-menu-item">复制</div>
        <div className="flow-context-menu-item">录音</div>
      </div>
    </nav>
  );
}
