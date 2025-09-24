import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import { SoundManager } from '../utils/sounds';

interface Card {
  suit: string;
  value: string;
  numValue: number;
}

interface PokerProps {
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
      const numValue = value === 'A' ? 14 : ['J', 'Q', 'K'].includes(value) ? 
        (value === 'J' ? 11 : value === 'Q' ? 12 : 13) : parseInt(value);
      deck.push({ suit, value, numValue });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

const evaluateHand = (cards: Card[]): { rank: number; name: string; multiplier: number } => {
  const sortedCards = [...cards].sort((a, b) => a.numValue - b.numValue);
  const suits = cards.map(c => c.suit);
  const values = cards.map(c => c.numValue);
  
  const isFlush = new Set(suits).size === 1;
  const isStraight = sortedCards.every((card, i) => i === 0 || card.numValue === sortedCards[i-1].numValue + 1);
  
  const valueCounts = values.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const counts = Object.values(valueCounts).sort((a, b) => b - a);
  
  if (isStraight && isFlush) return { rank: 8, name: 'Escalera Real', multiplier: 250 };
  if (counts[0] === 4) return { rank: 7, name: 'Poker', multiplier: 125 };
  if (counts[0] === 3 && counts[1] === 2) return { rank: 6, name: 'Full House', multiplier: 45 };
  if (isFlush) return { rank: 5, name: 'Color', multiplier: 30 };
  if (isStraight) return { rank: 4, name: 'Escalera', multiplier: 20 };
  if (counts[0] === 3) return { rank: 3, name: 'Trío', multiplier: 15 };
  if (counts[0] === 2 && counts[1] === 2) return { rank: 2, name: 'Doble Par', multiplier: 10 };
  if (counts[0] === 2) return { rank: 1, name: 'Par', multiplier: 5 };
  
  return { rank: 0, name: 'Carta Alta', multiplier: 0 };
};

const Poker: React.FC<PokerProps> = ({ credits, onWin, onLoss, onBack }) => {
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [hand, setHand] = useState<Card[]>([]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [gameState, setGameState] = useState<'betting' | 'draw' | 'result'>('betting');
  const [bet, setBet] = useState(25);
  const [result, setResult] = useState<{ rank: number; name: string; multiplier: number } | null>(null);
  const [message, setMessage] = useState('Haz tu apuesta para comenzar');
  const soundManager = SoundManager.getInstance();

  const deal = () => {
    if (credits < bet) return;
    
    soundManager.play('card');
    onLoss(bet);
    
    const newDeck = createDeck();
    const newHand = newDeck.splice(0, 5);
    
    setDeck(newDeck);
    setHand(newHand);
    setHeld([false, false, false, false, false]);
    setGameState('draw');
    setMessage('Selecciona las cartas que quieres mantener');
    setResult(null);
  };

  const draw = () => {
    soundManager.play('card');
    const newHand = [...hand];
    let deckCopy = [...deck];
    
    held.forEach((isHeld, index) => {
      if (!isHeld && deckCopy.length > 0) {
        newHand[index] = deckCopy.pop()!;
      }
    });
    
    setHand(newHand);
    setDeck(deckCopy);
    
    const handResult = evaluateHand(newHand);
    setResult(handResult);
    setGameState('result');
    
    if (handResult.multiplier > 0) {
      const winAmount = bet * handResult.multiplier;
      onWin(winAmount);
      soundManager.play(handResult.multiplier > 50 ? 'jackpot' : 'win');
      setMessage(`¡${handResult.name}! Ganaste ${winAmount} créditos!`);
    } else {
      soundManager.play('lose');
      setMessage(`${handResult.name} - ¡Inténtalo de nuevo!`);
    }
  };

  const newGame = () => {
    setGameState('betting');
    setMessage('Haz tu apuesta para comenzar');
    setResult(null);
  };

  const toggleHold = (index: number) => {
    if (gameState !== 'draw') return;
    soundManager.play('click');
    const newHeld = [...held];
    newHeld[index] = !newHeld[index];
    setHeld(newHeld);
  };

  const CardComponent = ({ card, index, isHeld }: { card: Card; index: number; isHeld: boolean }) => (
    <div
      onClick={() => toggleHold(index)}
      className={`relative w-20 h-28 rounded-lg border-2 flex flex-col items-center justify-center font-bold text-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        card.suit === '♥' || card.suit === '♦'
          ? 'bg-white border-red-400 text-red-600'
          : 'bg-white border-gray-400 text-black'
      } ${isHeld ? 'ring-4 ring-yellow-400 scale-105' : ''}`}
    >
      <div className="text-sm">{card.value}</div>
      <div className="text-2xl">{card.suit}</div>
      {isHeld && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
          HOLD
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>

        <div className="bg-gradient-to-br from-blue-800 to-purple-900 rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">
            🃏 VIDEO POKER 🃏
          </h2>
          
          {/* Hand Display */}
          <div className="flex justify-center space-x-2 mb-6">
            {hand.map((card, index) => (
              <CardComponent 
                key={index} 
                card={card} 
                index={index}
                isHeld={held[index]}
              />
            ))}
          </div>

          {/* Message */}
          <div className="text-center mb-6">
            <p className="text-xl font-bold text-yellow-400">{message}</p>
            {result && (
              <p className="text-lg text-white mt-2">
                Mano: <span className="text-cyan-400 font-bold">{result.name}</span>
              </p>
            )}
          </div>

          {/* Controls */}
          {gameState === 'betting' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <label className="text-white font-semibold">Apuesta:</label>
                <select
                  value={bet}
                  onChange={(e) => setBet(Number(e.target.value))}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-yellow-400/30"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <button
                onClick={deal}
                disabled={credits < bet}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold rounded-xl transition-all"
              >
                Repartir Cartas
              </button>
            </div>
          )}

          {gameState === 'draw' && (
            <button
              onClick={draw}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all"
            >
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Cambiar Cartas</span>
              </div>
            </button>
          )}

          {gameState === 'result' && (
            <button
              onClick={newGame}
              className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all"
            >
              Nueva Mano
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

export default Poker;