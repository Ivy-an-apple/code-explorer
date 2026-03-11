import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Trophy, User, Zap } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { state } = useLearning();
  const { user } = state;

  const navLinks = [
    { name: '首页', path: '/', icon: BookOpen },
    { name: '挑战', path: '/learn/challenge/1', icon: Trophy },
    { name: '个人中心', path: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Code Explorer</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-secondary-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1.5 rounded-full">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-sm">Lv.{user.level}</span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-500/20 px-3 py-1.5 rounded-full">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-semibold text-sm">{user.totalXp} XP</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-secondary-300 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
            {/* Mobile User Stats */}
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1.5 rounded-full">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold text-sm">Lv.{user.level}</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-500/20 px-3 py-1.5 rounded-full">
                <Trophy className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-semibold text-sm">{user.totalXp} XP</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
