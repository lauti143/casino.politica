import React, { useState } from 'react';
import { Zap, Target, Spade, TrendingUp, Crown, Dices, PlayCircle } from 'lucide-react';
import Header from './components/Header';
import GameCard from './components/GameCard';
import SlotMachine from './components/SlotMachine';
import Blackjack from './components/Blackjack';
import Roulette from './components/Roulette';
import Poker from './components/Poker';
import Baccarat from './components/Baccarat';
import Dice from './components/Dice';
import DiscordContact from './components/DiscordContact';
import { useCredits } from './hooks/useCredits';
import { GameStats } from './types/casino';
import { SoundManager } from './utils/sounds';

type GameView = 'lobby' | 'slots' | 'blackjack' | 'roulette' | 'poker' | 'baccarat' | 'dice';

function App() {
  const { credits, addCredits, subtractCredits, resetCredits } = useCredits(5000);
  const [currentView, setCurrentView] = useState<GameView>('lobby');
  const [gameStats, setGameStats] = useState<GameStats>({
    gamesPlayed: 0,
    totalWins: 0,
    totalLosses: 0,
    biggestWin: 0
  });
  const soundManager = SoundManager.getInstance();

  const handleWin = (amount: number) => {
    addCredits(amount);
    setGameStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      totalWins: prev.totalWins + 1,
      biggestWin: Math.max(prev.biggestWin, amount)
    }));
  };

  const handleLoss = (amount: number) => {
    subtractCredits(amount);
    setGameStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      totalLosses: prev.totalLosses + 1
    }));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'slots':
        return (
          <SlotMachine
            credits={credits}
            onWin={handleWin}
            onLoss={handleLoss}
            onBack={() => setCurrentView('lobby')}
          />
        );
      case 'blackjack':
        return (
          <Blackjack
            credits={credits}
            onWin={handleWin}
            onLoss={handleLoss}
            onBack={() => setCurrentView('lobby')}
          />
        );
      case 'roulette':
        return (
          <Roulette
            credits={credits}
            onWin={handleWin}
            onLoss={handleLoss}
            onBack={() => setCurrentView('lobby')}
          />
        );
      case 'poker':
        return (
          <Poker
            credits={credits}
            onWin={handleWin}
            onLoss={handleLoss}
            onBack={() => setCurrentView('lobby')}
          />
        );
      case 'baccarat':
        return (
          <Baccarat
            credits={credits}
            onWin={handleWin}
            onLoss={handleLoss}
            onBack={() => setCurrentView('lobby')}
          />
        );
      case 'dice':
        return (
          <Dice
            credits={credits}
            onWin={handleWin}
            onLoss={handleLoss}
            onBack={() => setCurrentView('lobby')}
          />
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <Header credits={credits} gamesPlayed={gameStats.gamesPlayed} totalWins={gameStats.totalWins} />
            
            {/* Floating particles effect */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-30 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-6">
              {/* Welcome Section */}
              <div className="text-center mb-12">
                <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-red-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  Bienvenido al Casino
                </h2>
                <p className="text-2xl text-gray-300 mb-4">
                  🎰 El Casino Online Más Épico del Mundo 🎰
                </p>
                <p className="text-lg text-gray-400 mb-8">
                  Experimenta la emoción del juego con gráficos increíbles, sonidos épicos y mecánicas auténticas
                </p>
                
                {credits < 100 && (
                  <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-lg p-4 mb-8 max-w-md mx-auto">
                    <p className="text-green-400 font-semibold">¡Créditos bajos!</p>
                    <button
                      onClick={() => addCredits(1000)}
                      className="mt-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-lg transition-all"
                      onClick={() => { addCredits(1000); soundManager.play('coin'); }}
                    >
                      Recarga Gratuita (+1000)
                    </button>
                  </div>
                )}
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <GameCard
                  title="Tragamonedas"
                  description="Gira los rodillos y busca combinaciones ganadoras. Múltiples líneas de pago y jackpots increíbles te esperan."
                  icon={Zap}
                  minBet={5}
                  maxBet={100}
                  onClick={() => setCurrentView('slots')}
                  onClick={() => { setCurrentView('slots'); soundManager.play('click'); }}
                />
                
                <GameCard
                  title="Blackjack"
                  description="El clásico juego de cartas. Llega a 21 sin pasarte y vence al dealer con estrategia y suerte."
                  icon={Spade}
                  minBet={25}
                  maxBet={500}
                  onClick={() => setCurrentView('blackjack')}
                  onClick={() => { setCurrentView('blackjack'); soundManager.play('click'); }}
                />
                
                <GameCard
                  title="Ruleta Europea"
                  description="Haz tus apuestas en la ruleta clásica. Números, colores, pares, impares - ¡las opciones son infinitas!"
                  icon={Target}
                  minBet={10}
                  maxBet={1000}
                  onClick={() => setCurrentView('roulette')}
                  onClick={() => { setCurrentView('roulette'); soundManager.play('click'); }}
                />
                
                <GameCard
                  title="Video Poker"
                  description="El poker clásico contra la máquina. Forma las mejores manos y gana grandes premios con escaleras reales."
                  icon={PlayCircle}
                  minBet={5}
                  maxBet={100}
                  onClick={() => { setCurrentView('poker'); soundManager.play('click'); }}
                />
                
                <GameCard
                  title="Baccarat"
                  description="El juego favorito de los high rollers. Apuesta al jugador, la banca o al empate en este elegante juego de cartas."
                  icon={Crown}
                  minBet={25}
                  maxBet={500}
                  onClick={() => { setCurrentView('baccarat'); soundManager.play('click'); }}
                />
                
                <GameCard
                  title="Dados"
                  description="Lanza los dados y predice el resultado. Apuesta por encima, por debajo o el número exacto para grandes premios."
                  icon={Dices}
                  minBet={10}
                  maxBet={250}
                  onClick={() => { setCurrentView('dice'); soundManager.play('click'); }}
                />
              </div>

              {/* Stats Section */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 text-green-400 mr-2" />
                  Estadísticas de Juego
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-400">{gameStats.gamesPlayed}</p>
                    <p className="text-gray-400">Partidas Jugadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">{gameStats.totalWins}</p>
                    <p className="text-gray-400">Victorias</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-400">{gameStats.totalLosses}</p>
                    <p className="text-gray-400">Derrotas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-400">{gameStats.biggestWin}</p>
                    <p className="text-gray-400">Mayor Victoria</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="text-center mt-12 py-8 border-t border-gray-700/50">
                <p className="text-gray-400 mb-2">🎰 Casino Royal - La Experiencia de Juego Más Épica 🎰</p>
                <p className="text-sm text-gray-500">
                  Desarrollado con ❤️ y mucha pasión por <span className="text-yellow-400 font-bold animate-pulse">Monte</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Tecnología: React + TypeScript + Tailwind CSS + Sonidos Épicos + Animaciones Premium
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    onClick={resetCredits}
                    onClick={() => { resetCredits(); soundManager.play('click'); }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all text-sm"
                  >
                    Reiniciar Créditos
                  </button>
                  <button
                    onClick={() => addCredits(500)}
                    onClick={() => { addCredits(500); soundManager.play('coin'); }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm"
                  >
                    Bono Diario (+500)
                  </button>
                </div>
              </footer>
            </div>
            
            <DiscordContact />
          </div>
        );
    }
  };

  return renderCurrentView();
}

export default App;