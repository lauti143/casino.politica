import React, { useState } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import { SoundManager } from '../utils/sounds';

interface RouletteProps {
  credits: number;
  onWin: (amount: number) => void;
  onLoss: (amount: number) => void;
  onBack: () => void;
}

const rouletteNumbers = [
  { number: 0, color: 'green' },
  { number: 32, color: 'red' }, { number: 15, color: 'black' }, { number: 19, color: 'red' },
  { number: 4, color: 'black' }, { number: 21, color: 'red' }, { number: 2, color: 'black' },
  { number: 25, color: 'red' }, { number: 17, color: 'black' }, { number: 34, color: 'red' },
  { number: 6, color: 'black' }, { number: 27, color: 'red' }, { number: 13, color: 'black' },
  { number: 36, color: 'red' }, { number: 11, color: 'black' }, { number: 30, color: 'red' },
  { number: 8, color: 'black' }, { number: 23, color: 'red' }, { number: 10, color: 'black' },
  { number: 5, color: 'red' }, { number: 24, color: 'black' }, { number: 16, color: 'red' },
  { number: 33, color: 'black' }, { number: 1, color: 'red' }, { number: 20, color: 'black' },
  { number: 14, color: 'red' }, { number: 31, color: 'black' }, { number: 9, color: 'red' },
  { number: 22, color: 'black' }, { number: 18, color: 'red' }, { number: 29, color: 'black' },
  { number: 7, color: 'red' }, { number: 28, color: 'black' }, { number: 12, color: 'red' },
  { number: 35, color: 'black' }, { number: 3, color: 'red' }, { number: 26, color: 'black' }
] as const;

type BetType = 'number' | 'red' | 'black' | 'odd' | 'even' | 'low' | 'high';

interface Bet {
  type: BetType;
  value: number | string;
  amount: number;
}

const Roulette: React.FC<RouletteProps> = ({ credits, onWin, onLoss, onBack }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<typeof rouletteNumbers[0] | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [betAmount, setBetAmount] = useState(10);
  const [message, setMessage] = useState('Haz tus apuestas');
  const [wheelRotation, setWheelRotation] = useState(0);
  const soundManager = SoundManager.getInstance();

  const addBet = (type: BetType, value: number | string) => {
    if (credits < getTotalBetAmount() + betAmount) return;
    
    setBets(prev => {
      const existingBetIndex = prev.findIndex(bet => bet.type === type && bet.value === value);
      if (existingBetIndex >= 0) {
        const newBets = [...prev];
        newBets[existingBetIndex].amount += betAmount;
        return newBets;
      }
      return [...prev, { type, value, amount: betAmount }];
    });
  };

  const clearBets = () => {
    setBets([]);
  };

  const getTotalBetAmount = () => {
    return bets.reduce((sum, bet) => sum + bet.amount, 0);
  };

  const spin = async () => {
    if (bets.length === 0 || spinning) return;
    
    const totalBet = getTotalBetAmount();
    if (credits < totalBet) return;
    
    setSpinning(true);
    setMessage('La ruleta está girando...');
    soundManager.play('roulette');
    onLoss(totalBet);
    
    // Animate wheel spinning
    const finalRotation = wheelRotation + 1440 + Math.random() * 360;
    setWheelRotation(finalRotation);
    
    setTimeout(() => {
      const winningNumber = rouletteNumbers[Math.floor(Math.random() * rouletteNumbers.length)];
      setResult(winningNumber);
      
      let totalWin = 0;
      
      bets.forEach(bet => {
        let won = false;
        let multiplier = 0;
        
        switch (bet.type) {
          case 'number':
            if (bet.value === winningNumber.number) {
              won = true;
              multiplier = 35;
            }
            break;
          case 'red':
            if (winningNumber.color === 'red') {
              won = true;
              multiplier = 1;
            }
            break;
          case 'black':
            if (winningNumber.color === 'black') {
              won = true;
              multiplier = 1;
            }
            break;
          case 'odd':
            if (winningNumber.number > 0 && winningNumber.number % 2 === 1) {
              won = true;
              multiplier = 1;
            }
            break;
          case 'even':
            if (winningNumber.number > 0 && winningNumber.number % 2 === 0) {
              won = true;
              multiplier = 1;
            }
            break;
          case 'low':
            if (winningNumber.number >= 1 && winningNumber.number <= 18) {
              won = true;
              multiplier = 1;
            }
            break;
          case 'high':
            if (winningNumber.number >= 19 && winningNumber.number <= 36) {
              won = true;
              multiplier = 1;
            }
            break;
        }
        
        if (won) {
          totalWin += bet.amount * (multiplier + 1);
        }
      });
      
      if (totalWin > 0) {
        onWin(totalWin);
        soundManager.play(totalWin > bet * 10 ? 'jackpot' : 'win');
        setMessage(`¡Ganaste ${totalWin} créditos! El número ganador es ${winningNumber.number} ${winningNumber.color}`);
      } else {
        soundManager.play('lose');
        setMessage(`El número ganador es ${winningNumber.number} ${winningNumber.color}. ¡Mejor suerte la próxima!`);
      }
      
      setSpinning(false);
      setTimeout(() => {
        setBets([]);
        setMessage('Haz tus apuestas');
      }, 3000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
            🎯 RULETA EUROPEA 🎯
          </h2>
          
          {/* Wheel */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div 
                className="w-64 h-64 rounded-full bg-gradient-to-br from-yellow-600 via-red-600 to-green-600 border-8 border-yellow-400 transition-transform duration-3000 ease-out"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-red-800 to-black border-4 border-yellow-300">
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-green-800 to-red-800 flex items-center justify-center">
                    {result && (
                      <div className={`text-2xl font-bold ${
                        result.color === 'red' ? 'text-red-400' : 
                        result.color === 'black' ? 'text-white' : 'text-green-400'
                      }`}>
                        {result.number}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400"></div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-6">
            <p className="text-xl font-bold text-yellow-400">{message}</p>
            {result && (
              <div className={`text-lg font-bold mt-2 ${
                result.color === 'red' ? 'text-red-400' : 
                result.color === 'black' ? 'text-white' : 'text-green-400'
              }`}>
                Último número: {result.number} ({result.color})
              </div>
            )}
          </div>

          {/* Betting Board */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            {/* Number Bets */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Números (35:1)</h3>
              <div className="grid grid-cols-6 gap-1">
                <div 
                  onClick={() => addBet('number', 0)}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold p-2 rounded cursor-pointer text-center transition-colors"
                >
                  0
                </div>
                {Array.from({ length: 36 }, (_, i) => i + 1).map(num => (
                  <div
                    key={num}
                    onClick={() => addBet('number', num)}
                    className={`${
                      [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(num)
                        ? 'bg-red-600 hover:bg-red-500' 
                        : 'bg-black hover:bg-gray-800 border border-gray-600'
                    } text-white font-bold p-2 rounded cursor-pointer text-center transition-colors text-sm`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            {/* Outside Bets */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Apuestas Exteriores (1:1)</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => addBet('red', 'red')}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded transition-colors"
                >
                  ROJO
                </button>
                <button
                  onClick={() => addBet('black', 'black')}
                  className="bg-black hover:bg-gray-800 text-white font-bold py-3 rounded border border-gray-600 transition-colors"
                >
                  NEGRO
                </button>
                <button
                  onClick={() => addBet('odd', 'odd')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition-colors"
                >
                  IMPAR
                </button>
                <button
                  onClick={() => addBet('even', 'even')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition-colors"
                >
                  PAR
                </button>
                <button
                  onClick={() => addBet('low', 'low')}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded transition-colors"
                >
                  1-18
                </button>
                <button
                  onClick={() => addBet('high', 'high')}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded transition-colors"
                >
                  19-36
                </button>
              </div>
            </div>
          </div>

          {/* Bet Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <label className="text-white font-semibold">Cantidad:</label>
              <select
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                disabled={spinning}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-yellow-400/30"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            <div className="text-white">
              <p>Total apostado: <span className="text-yellow-400 font-bold">{getTotalBetAmount()}</span></p>
              <p>Créditos: <span className="text-yellow-400 font-bold">{credits}</span></p>
            </div>
          </div>

          {/* Active Bets */}
          {bets.length > 0 && (
            <div className="mb-6 bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-white font-bold mb-2">Apuestas Activas:</h4>
              <div className="flex flex-wrap gap-2">
                {bets.map((bet, index) => (
                  <div key={index} className="bg-yellow-600 text-black px-3 py-1 rounded-full text-sm font-bold">
                    {bet.type === 'number' ? `#${bet.value}` : bet.type.toUpperCase()}: {bet.amount}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={spin}
              disabled={bets.length === 0 || spinning || credits < getTotalBetAmount()}
              className="flex-1 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Zap className="h-5 w-5" />
              <span>{spinning ? 'Girando...' : '¡GIRAR!'}</span>
            </button>
            
            <button
              onClick={clearBets}
              disabled={spinning || bets.length === 0}
              className="px-6 py-4 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white font-bold rounded-xl transition-all"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roulette;