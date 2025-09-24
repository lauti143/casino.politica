import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { SoundManager } from '../utils/sounds';

const SoundToggle: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundManager = SoundManager.getInstance();

  const toggleSound = () => {
    const enabled = soundManager.toggle();
    setSoundEnabled(enabled);
    soundManager.play('click');
  };

  return (
    <button
      onClick={toggleSound}
      className="p-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-lg transition-all transform hover:scale-110"
      title={soundEnabled ? 'Desactivar sonido' : 'Activar sonido'}
    >
      {soundEnabled ? (
        <Volume2 className="h-5 w-5 text-white" />
      ) : (
        <VolumeX className="h-5 w-5 text-white" />
      )}
    </button>
  );
};

export default SoundToggle;