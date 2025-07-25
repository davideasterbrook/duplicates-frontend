"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useState } from "react"

interface HeaderProps {
  activeTab: 'mint' | 'minted' | 'inspiration';
  onTabChange: (tab: 'mint' | 'minted' | 'inspiration') => void;
}

// Mobile Navigation Dropdown Component
function MobileNavDropdown({ activeTab, onTabChange }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'mint', label: 'Duplicator', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { id: 'minted', label: 'Collection', icon: 'M19 11H5m14-7l2 7-2 7M5 21l14-7' },
    { id: 'inspiration', label: 'Inspiration', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-900/50 rounded-xl p-2.5 border border-gray-800 text-white"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={currentTab?.icon} />
        </svg>
        <span className="text-sm font-medium">{currentTab?.label}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl z-50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id as 'mint' | 'minted' | 'inspiration');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left text-sm font-medium transition-colors first:rounded-t-xl last:rounded-b-xl ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Left side - Navigation */}
          <div className="flex items-center">
            
            {/* Desktop Navigation Tabs - Hidden on mobile */}
            <nav className="hidden md:flex space-x-2 bg-gray-900/50 rounded-xl p-1.5 border border-gray-800">
              <button
                onClick={() => onTabChange('mint')}
                className={`px-4 lg:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'mint'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Duplicator</span>
                </span>
              </button>
              <button
                onClick={() => onTabChange('minted')}
                className={`px-4 lg:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'minted'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 7-2 7M5 21l14-7" />
                  </svg>
                  <span>Collection</span>
                </span>
              </button>
              <button
                onClick={() => onTabChange('inspiration')}
                className={`px-4 lg:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'inspiration'
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg shadow-yellow-500/25 transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Inspiration</span>
                </span>
              </button>
            </nav>

            {/* Mobile Navigation Dropdown */}
            <MobileNavDropdown activeTab={activeTab} onTabChange={onTabChange} />
          </div>
          
          {/* Right side - Connect button */}
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20"></div>
              <div className="relative">
                <div className="block">
                  {/* Mobile wallet button */}
                  <div className="sm:hidden">
                    <ConnectButton 
                      accountStatus="avatar"
                      chainStatus="icon"
                      showBalance={false}
                    />
                  </div>
                  {/* Desktop wallet button */}
                  <div className="hidden sm:block">
                    <ConnectButton 
                      accountStatus="address"
                      chainStatus="icon"
                      showBalance={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 