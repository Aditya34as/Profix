import { useState } from 'react';
import { X, Zap } from 'lucide-react';

const AnnouncementBar = ({ message, icon }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="announcement-bar">
      <div className="announcement-bar-inner">
        <div className="announcement-bar-content">
          <span className="announcement-bar-icon">
            {icon || <Zap size={14} />}
          </span>
          <span className="announcement-bar-pulse" />
          <p className="announcement-bar-text">{message}</p>
        </div>
        <button 
          className="announcement-bar-close"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
