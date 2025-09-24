import React, { useState } from 'react';
import { ArrowLeft, Crown } from 'lucide-react';
import { SoundManager } from '../utils/sounds';

interface Card {
  suit: string;
  value: string;
  numValue: number;
}

interface BaccaratProps {
  credits: number;
  onWin: (amount: number) => void;
  onLoss: (amount: number) => void;
  onBack: () => void;
}

const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  suits.forEach(suit => {
    values.forEach(value => {
      const numValue = ['J', 'Q', 'K'].includes(value) ? 0 : value === 'A' ? 1 : parseInt(value);
      deck.push({ suit, value, numValue });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

const calculateScore = (cards: Card[]): number => {
  return cards.reduce((sum, card) => sum + card.numValue, 0) % 10;
};

type BetType = 'player' | 'banker' | 'tie';

const Baccarat: React.FC<BaccaratProps> = ({ credits, onWin, onLoss, onBack }) => {
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [bankerCards, setBankerCards] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'dealing' | 'result'>('betting');
  const [bet, setBet] = useState(50);
  const [betType, setBetType] = useState<BetType>('player');
  const [message, setMessage] = useState('Haz tu apuesta');
  const [result, setResult] = useState<string>('');
  const soundManager = SoundManager.getInstance();

  const deal = async () => {
    if (credits < bet) return;
    
    soundManager.play('card');
    onLoss(bet);
    setGameState('dealing');
    setMessage('Repartiendo cartas...');
    
    const deck = createDeck();
    
    // Deal initial cards
    const newPlayerCards = [deck.pop()!, deck.pop()!];
    const newBankerCards = [deck.pop()!, deck.pop()!];
    
    setPlayerCards(newPlayerCards);
    setBankerCards(newBankerCards);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let finalPlayerCards = [...newPlayerCards];
    let finalBankerCards = [...newBankerCards];
    
    const playerScore = calculateScore(finalPlayerCards);
    const bankerScore = calculateScore(finalBankerCards);
    
    // Third card rules
    if (playerScore <= 5 && bankerScore <= 5) {
      if (deck.length > 0) {
        finalPlayerCards.push(deck.pop()!);
        setPlayerCards([...finalPlayerCards]);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (deck.length > 0 && calculateScore(finalBankerCards) <= 5) {
        finalBankerCards.push(deck.pop()!);
        setBankerCards([...finalBankerCards]);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const finalPlayerScore = calculateScore(finalPlayerCards);
    const finalBankerScore = calculateScore(finalBankerCards);
    
    let winner: string;
    let winAmount = 0;
    
    if (finalPlayerScore > finalBankerScore) {
      winner = 'player';
      setResult('¡Jugador gana!');
    } else if (finalBankerScore > finalPlayerScore) {
      winner = 'banker';
      setResult('¡Banca gana!');
    } else {
      winner = 'tie';
      setResult('¡Empate!');
    }
    
    if (betType === winner) {
      if (winner === 'tie') {
        winAmount = bet * 8; // 8:1 payout for tie
        soundManager.play('jackpot');
      } else if (winner === 'banker') {
        winAmount = bet * 1.95; // 0.95:1 payout for banker (5% commission)
        soundManager.play('win');
      } else {
        winAmount = bet * 2; // 1:1 payout for player
        soundManager.play('win');
      }
      onWin(winAmount);
      setMessage(`¡Ganaste ${winAmount} créditos!`);
    } else {
      soundManager.play('lose');
      setMessage('¡Mejor suerte la próxima!');
    }
    
    setGameState('result');
  };

  const newGame = () => {
    setPlayerCards([]);
    setBankerCards([]);
    setGameState('betting');
    setMessage('Haz tu apuesta');
    setResult('');
  };

  const CardComponent = ({ card }: { card: Card }) => (
    <div className={`w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center font-bold text-lg ${
      card.suit === '♥' || card.suit === '♦'
        ? 'bg-white border-red-400 text-red-600'
        : 'bg-white border-gray-400 text-black'
    }`}>
      <div className="text-sm">{card.value}</div>
      <div className="text-lg">{card.suit}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>

        <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            👑 BACCARAT 👑
          </h2>
          
          {/* Game Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Player */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                Jugador ({calculateScore(playerCards)})
              </h3>
              <div className="flex justify-center space-x-2 min-h-[100px] items-center">
                {playerCards.map((card, index) => (
                  <CardComponent key={index} card={card} />
                ))}
              </div>
            </div>

            {/* Banker */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                Banca ({calculateScore(bankerCards)})
              </h3>
              <div className="flex justify-center space-x-2 min-h-[100px] items-center">
                {bankerCards.map((card, index) => (
                  <CardComponent key={index} card={card} />
                ))}
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-6">
            <p className="text-xl font-bold text-yellow-400">{message}</p>
            {result && (
              <p className="text-lg text-white mt-2">{result}</p>
            )}
          </div>

          {/* Betting Controls */}
          {gameState === 'betting' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setBetType('player')}
                  className={`py-3 px-4 rounded-lg font-bold transition-all ${
                    betType === 'player'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Jugador (1:1)
                </button>
                <button
                  onClick={() => setBetType('banker')}
                  className={`py-3 px-4 rounded-lg font-bold transition-all ${
                    betType === 'banker'
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Banca (0.95:1)
                </button>
                <button
                  onClick={() => setBetType('tie')}
                  className={`py-3 px-4 rounded-lg font-bold transition-all ${
                    betType === 'tie'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Empate (8:1)
                </button>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <label className="text-white font-semibold">Apuesta:</label>
                <select
                  value={bet}
                  onChange={(e) => setBet(Number(e.target.value))}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-yellow-400/30"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={250}>250</option>
                  <option value={500}>500</option>
                </select>
              </div>

              <button
                onClick={deal}
                disabled={credits < bet}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Crown className="h-5 w-5" />
                <span>Repartir Cartas</span>
              </button>
            </div>
          )}

          {gameState === 'result' && (
            <button
              onClick={newGame}
              className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all"
            >
              Nueva Partida
            </button>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-300">Créditos: <span className="font-bold text-yellow-400">{credits}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Baccarat;