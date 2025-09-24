import React, { useState, useEffect } from 'react';
import { Zap, ArrowLeft, RotateCcw } from 'lucide-react';
import { SoundManager } from '../utils/sounds';

interface SlotMachineProps {
  credits: number;
  onWin: (amount: number) => void;
  onLoss: (amount: number) => void;
  onBack: () => void;
}

const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '🎰', '🔔'];
const payouts = {
  '🍒': 2,
  '🍋': 3,
  '🍊': 4,
  '🍇': 5,
  '⭐': 10,
  '💎': 20,
  '🎰': 50,
  '🔔': 100
};

const SlotMachine: React.FC<SlotMachineProps> = ({ credits, onWin, onLoss, onBack }) => {
  const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(10);
  const [lastWin, setLastWin] = useState(0);
  const [message, setMessage] = useState('¡Gira para ganar!');
  const soundManager = SoundManager.getInstance();

  const spin = async () => {
    if (credits < bet || spinning) return;
    
    setSpinning(true);
    setMessage('¡Girando...');
    soundManager.play('spin');
    onLoss(bet);
    
    // Simulate spinning animation
    for (let i = 0; i < 20; i++) {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Final result
    const newReels = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];
    
    setReels(newReels);
    
    // Check for wins
    const uniqueSymbols = new Set(newReels);
    if (uniqueSymbols.size === 1) {
      // Three of a kind - jackpot!
      const symbol = newReels[0];
      const winAmount = bet * payouts[symbol as keyof typeof payouts];
      setLastWin(winAmount);
      onWin(winAmount);
      soundManager.play(payouts[symbol as keyof typeof payouts] > 20 ? 'jackpot' : 'win');
      setMessage(`¡JACKPOT! Ganaste ${winAmount} créditos!`);
    } else if (uniqueSymbols.size === 2) {
      // Two of a kind - smaller win
      const winAmount = bet * 2;
      setLastWin(winAmount);
      onWin(winAmount);
      soundManager.play('win');
      setMessage(`¡Ganaste ${winAmount} créditos!`);
    } else {
      setLastWin(0);
      soundManager.play('lose');
      setMessage('¡Inténtalo de nuevo!');
    }
    
    setSpinning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
            🎰 MÁQUINA TRAGAMONEDAS 🎰
          </h2>
          
          {/* Slot Display */}
          <div className="bg-black rounded-2xl p-8 mb-8 border-4 border-yellow-400/50">
            <div className="flex justify-center space-x-4 mb-6">
              {reels.map((symbol, index) => (
                <div
                  key={index}
                  className={`w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl flex items-center justify-center text-4xl border-2 border-yellow-400/30 ${
                    spinning ? 'animate-bounce' : ''
                  }`}
                >
                  {symbol}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-xl font-bold text-yellow-400 mb-2">{message}</p>
              {lastWin > 0 && (
                <p className="text-green-400 font-bold animate-pulse">
                  💰 +{lastWin} créditos
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <label className="text-white font-semibold">Apuesta:</label>
              <select
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                disabled={spinning}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-yellow-400/30 focus:border-yellow-400"
              >
                <option value={5}>5 créditos</option>
                <option value={10}>10 créditos</option>
                <option value={25}>25 créditos</option>
                <option value={50}>50 créditos</option>
                <option value={100}>100 créditos</option>
              </select>
            </div>
            
            <div className="text-right">
              <p className="text-gray-400 text-sm">Créditos disponibles</p>
              <p className="text-2xl font-bold text-yellow-400">{credits.toLocaleString()}</p>
            </div>
          </div>

          <button
            onClick={spin}
            disabled={credits < bet || spinning}
            className={`w-full py-4 rounded-xl font-bold text-xl transition-all duration-300 ${
              credits < bet || spinning
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 hover:from-red-500 hover:via-red-400 hover:to-yellow-400 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {spinning ? (
              <div className="flex items-center justify-center space-x-2">
                <RotateCcw className="h-6 w-6 animate-spin" />
                <span>Girando...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-6 w-6" />
                <span>¡GIRAR! ({bet} créditos)</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;