import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { SoundManager } from '../utils/sounds';

interface Card {
  suit: string;
  value: string;
  numValue: number;
}

interface BlackjackProps {
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
      const numValue = value === 'A' ? 11 : ['J', 'Q', 'K'].includes(value) ? 10 : parseInt(value);
      deck.push({ suit, value, numValue });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

const calculateScore = (cards: Card[]): number => {
  let score = cards.reduce((sum, card) => sum + card.numValue, 0);
  let aces = cards.filter(card => card.value === 'A').length;
  
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  
  return score;
};

const Blackjack: React.FC<BlackjackProps> = ({ credits, onWin, onLoss, onBack }) => {
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer' | 'finished'>('betting');
  const [bet, setBet] = useState(25);
  const [message, setMessage] = useState('Haz tu apuesta para comenzar');
  const [showDealerCard, setShowDealerCard] = useState(false);
  const soundManager = SoundManager.getInstance();

  const playerScore = calculateScore(playerCards);
  const dealerScore = calculateScore(dealerCards);

  const startGame = () => {
    if (credits < bet) return;
    
    soundManager.play('card');
    onLoss(bet);
    const newDeck = createDeck();
    
    const newPlayerCards = [newDeck.pop()!, newDeck.pop()!];
    const newDealerCards = [newDeck.pop()!, newDeck.pop()!];
    
    setDeck(newDeck);
    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    setGameState('playing');
    setShowDealerCard(false);
    setMessage('¿Pides carta o te plantas?');
  };

  const hit = () => {
    if (deck.length === 0 || gameState !== 'playing') return;
    
    const newCard = deck.pop()!;
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);
    setDeck(deck);
    
    const newScore = calculateScore(newPlayerCards);
    if (newScore > 21) {
      soundManager.play('lose');
      setMessage('¡Te pasaste! La casa gana');
      setGameState('finished');
      setShowDealerCard(true);
    }
  };

  const stand = () => {
    setGameState('dealer');
    setShowDealerCard(true);
    setMessage('El dealer está jugando...');
    
    setTimeout(dealerTurn, 1000);
  };

  const dealerTurn = () => {
    let currentDealerCards = [...dealerCards];
    let currentDeck = [...deck];
    
    while (calculateScore(currentDealerCards) < 17) {
      if (currentDeck.length > 0) {
        const newCard = currentDeck.pop()!;
        currentDealerCards.push(newCard);
      }
    }
    
    setDealerCards(currentDealerCards);
    setDeck(currentDeck);
    
    setTimeout(() => {
      const finalDealerScore = calculateScore(currentDealerCards);
      const finalPlayerScore = playerScore;
      
      if (finalDealerScore > 21) {
        soundManager.play('win');
        setMessage('¡El dealer se pasó! ¡Ganaste!');
        onWin(bet * 2);
      } else if (finalDealerScore > finalPlayerScore) {
        soundManager.play('lose');
        setMessage('La casa gana');
      } else if (finalPlayerScore > finalDealerScore) {
        soundManager.play('win');
        setMessage('¡Ganaste!');
        onWin(bet * 2);
      } else {
        soundManager.play('coin');
        setMessage('Empate - recuperas tu apuesta');
        onWin(bet);
      }
      
      setGameState('finished');
    }, 1500);
  };

  const newGame = () => {
    setPlayerCards([]);
    setDealerCards([]);
    setGameState('betting');
    setShowDealerCard(false);
    setMessage('Haz tu apuesta para comenzar');
  };

  const CardComponent = ({ card, hidden = false }: { card: Card; hidden?: boolean }) => (
    <div className={`w-16 h-24 rounded-lg border-2 flex items-center justify-center font-bold text-lg ${
      hidden 
        ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-400 text-white'
        : card.suit === '♥' || card.suit === '♦'
          ? 'bg-white border-red-400 text-red-600'
          : 'bg-white border-gray-400 text-black'
    }`}>
      {hidden ? '?' : (
        <div className="text-center">
          <div className="text-sm">{card.value}</div>
          <div className="text-lg">{card.suit}</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>

        <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
            ♠️ BLACKJACK ♥️
          </h2>
          
          {/* Dealer Area */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Dealer {showDealerCard && `(${dealerScore})`}
            </h3>
            <div className="flex space-x-2">
              {dealerCards.map((card, index) => (
                <CardComponent 
                  key={index} 
                  card={card} 
                  hidden={index === 1 && !showDealerCard} 
                />
              ))}
            </div>
          </div>

          {/* Player Area */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Tu mano ({playerScore})
            </h3>
            <div className="flex space-x-2">
              {playerCards.map((card, index) => (
                <CardComponent key={index} card={card} />
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-6">
            <p className="text-xl font-bold text-yellow-400">{message}</p>
          </div>

          {/* Controls */}
          {gameState === 'betting' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setBet(Math.max(5, bet - 5))}
                  className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-white font-bold text-xl">Apuesta: {bet}</span>
                <button
                  onClick={() => setBet(Math.min(credits, bet + 5))}
                  className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={startGame}
                disabled={credits < bet}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold rounded-xl transition-all"
              >
                Repartir Cartas
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="flex space-x-4">
              <button
                onClick={hit}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all"
              >
                Pedir Carta
              </button>
              <button
                onClick={stand}
                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold rounded-xl transition-all"
              >
                Plantarse
              </button>
            </div>
          )}

          {gameState === 'finished' && (
            <button
              onClick={newGame}
              className="w-full py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold rounded-xl transition-all"
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

export default Blackjack;