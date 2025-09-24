import React, { useState } from 'react';
import { ArrowLeft, Dices } from 'lucide-react';
import { SoundManager } from '../utils/sounds';

interface DiceProps {
  credits: number;
  onWin: (amount: number) => void;
  onLoss: (amount: number) => void;
  onBack: () => void;
}

type BetType = 'under' | 'over' | 'exact';

const Dice: React.FC<DiceProps> = ({ credits, onWin, onLoss, onBack }) => {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [bet, setBet] = useState(25);
  const [betType, setBetType] = useState<BetType>('over');
  const [targetNumber, setTargetNumber] = useState(7);
  const [message, setMessage] = useState('Haz tu apuesta y lanza los dados');
  const soundManager = SoundManager.getInstance();

  const rollDice = async () => {
    if (credits < bet || rolling) return;
    
    setRolling(true);
    soundManager.play('spin');
    onLoss(bet);
    setMessage('Lanzando dados...');
    
    // Animate dice rolling
    for (let i = 0; i < 10; i++) {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const finalDice1 = Math.floor(Math.random() * 6) + 1;
    const finalDice2 = Math.floor(Math.random() * 6) + 1;
    const total = finalDice1 + finalDice2;
    
    setDice1(finalDice1);
    setDice2(finalDice2);
    
    let won = false;
    let multiplier = 0;
    
    switch (betType) {
      case 'under':
        if (total < targetNumber) {
          won = true;
          multiplier = targetNumber === 7 ? 1 : 2;
        }
        break;
      case 'over':
        if (total > targetNumber) {
          won = true;
          multiplier = targetNumber === 7 ? 1 : 2;
        }
        break;
      case 'exact':
        if (total === targetNumber) {
          won = true;
          multiplier = targetNumber === 7 ? 4 : 6;
        }
        break;
    }
    
    if (won) {
      const winAmount = bet * (multiplier + 1);
      onWin(winAmount);
      soundManager.play(multiplier > 3 ? 'jackpot' : 'win');
      setMessage(`¡Ganaste! Total: ${total} - Premio: ${winAmount} créditos`);
    } else {
      soundManager.play('lose');
      setMessage(`Total: ${total} - ¡Inténtalo de nuevo!`);
    }
    
    setRolling(false);
  };

  const DiceComponent = ({ value, rolling }: { value: number; rolling: boolean }) => (
    <div className={`w-20 h-20 bg-white rounded-lg border-4 border-gray-800 flex items-center justify-center text-4xl font-bold text-gray-800 shadow-lg ${
      rolling ? 'animate-bounce' : ''
    }`}>
      {value}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-yellow-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>

        <div className="bg-gradient-to-br from-orange-800 to-red-900 rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            🎲 DADOS 🎲
          </h2>
          
          {/* Dice Display */}
          <div className="flex justify-center space-x-6 mb-8">
            <DiceComponent value={dice1} rolling={rolling} />
            <DiceComponent value={dice2} rolling={rolling} />
          </div>

          <div className="text-center mb-8">
            <p className="text-2xl font-bold text-white mb-2">
              Total: {dice1 + dice2}
            </p>
            <p className="text-xl font-bold text-yellow-400">{message}</p>
          </div>

          {/* Betting Controls */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setBetType('under')}
                className={`py-3 px-4 rounded-lg font-bold transition-all ${
                  betType === 'under'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Menor que {targetNumber}
              </button>
              <button
                onClick={() => setBetType('exact')}
                className={`py-3 px-4 rounded-lg font-bold transition-all ${
                  betType === 'exact'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Exacto {targetNumber}
              </button>
              <button
                onClick={() => setBetType('over')}
                className={`py-3 px-4 rounded-lg font-bold transition-all ${
                  betType === 'over'
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Mayor que {targetNumber}
              </button>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <label className="text-white font-semibold">Número objetivo:</label>
              <select
                value={targetNumber}
                onChange={(e) => setTargetNumber(Number(e.target.value))}
                disabled={rolling}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-yellow-400/30"
              >
                {Array.from({ length: 11 }, (_, i) => i + 2).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <label className="text-white font-semibold">Apuesta:</label>
              <select
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                disabled={rolling}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-yellow-400/30"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
              </select>
            </div>

            <button
              onClick={rollDice}
              disabled={credits < bet || rolling}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Dices className="h-5 w-5" />
              <span>{rolling ? 'Lanzando...' : 'Lanzar Dados'}</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-300">Créditos: <span className="font-bold text-yellow-400">{credits}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dice;