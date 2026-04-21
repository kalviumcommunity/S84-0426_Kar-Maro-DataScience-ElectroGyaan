import { useEffect } from 'react';

const MemeAlertModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      try {
        const audio = new Audio('/alert.mp3');
        audio.play().catch(err => {
          console.log('Audio autoplay blocked:', err);
        });
      } catch (err) {
        console.log('Audio playback error:', err);
      }

      const timer = setTimeout(() => {
        onClose();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-level-2 border-2 border-red-500 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-3">
              <svg className="w-8 h-8 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">⚡ Anomaly Detected!</h2>
            <p className="text-gray-300 mb-4">Unusual energy consumption spike detected in the system</p>
          </div>

          <div className="bg-level-3 rounded-lg p-4 mb-4">
            <img 
              src="/meme.jpg" 
              alt="Anomaly Alert Meme" 
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="text-sm text-gray-400">
            This alert will auto-close in a few seconds...
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeAlertModal;
