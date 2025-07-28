"use client"

import { useMintedNFTs, type MintedNFT } from "@/hooks/useMintedNFTs";
import { useAccount, useConfig } from "wagmi";
import { useNftMinterContract } from "@/hooks/useContract";
import { ImageWithFallback } from "@/components/UI/ImageWithFallback";
import ErrorPopup from "@/components/UI/ErrorPopup";
import NFTPlaceholder from "@/components/UI/NFTPlaceholder";
import { useState, useEffect, useMemo, useRef, forwardRef, useCallback } from "react";
import { readContract } from "@wagmi/core";
import { duplicatesAbi } from "@/app/duplicatesAbi";

// Separate expanded view component
function ExpandedNFTView({ nft, onClose }: { nft: MintedNFT; onClose: () => void }) {
  return (
    <div className="col-span-full bg-gray-900 rounded-xl border border-purple-500/50 overflow-hidden shadow-2xl mb-6 relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-800/80 hover:bg-red-600/80 rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm border border-gray-700 hover:border-red-500"
        title="Close expanded view"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-1/2 aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0 overflow-hidden">
          {nft.imageUrl ? (
            <ImageWithFallback
              src={nft.imageUrl}
              alt={nft.metadata?.name || `Token #${nft.tokenId}`}
              className="w-full h-full object-contain"
              preserveAspectRatio={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl"></div>
                <svg className="relative w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          <h3 className="font-bold text-white mb-4 text-2xl">
            {nft.metadata?.name || `Dupe #${nft.tokenId}`}
          </h3>
          
          {/* Description */}
          {nft.metadata?.description && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Description</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                {nft.metadata.description}
              </p>
            </div>
          )}
          
          {/* Attributes */}
          {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Attributes</h4>
              <div className="grid grid-cols-2 gap-2">
                {nft.metadata.attributes.map((attr, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">{attr.trait_type}</div>
                    <div className="text-sm text-white font-medium">{attr.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Details */}
          <div className="pt-4 border-t border-gray-700 mt-auto">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Token ID:</span>
                <span className="text-gray-300 font-mono">#{nft.tokenId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Owner:</span>
                <span className="text-gray-300 font-mono">
                  {nft.owner.slice(0, 8)}...{nft.owner.slice(-6)}
                </span>
              </div>
              
              {nft.metadata?.external_url && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">External URL:</span>
                  <a 
                    href={nft.metadata.external_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    Visit
                  </a>
                </div>
              )}
              
              {nft.metadata?.animation_url && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Animation:</span>
                  <a 
                    href={nft.metadata.animation_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    View
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const NFTCard = forwardRef<HTMLDivElement, { 
  nft: MintedNFT; 
  onClick?: () => void;
  showDuplicateOnHover?: boolean;
  allowExpand?: boolean;
  isSelected?: boolean;
  onExpand?: (tokenId: string) => void;
}>(({ 
  nft, 
  onClick, 
  showDuplicateOnHover = false,
  allowExpand = false,
  isSelected = false,
  onExpand
}, ref) => {
  const handleCardClick = () => {
    if (allowExpand && onExpand) {
      onExpand(nft.tokenId);
    } else if (onClick) {
      onClick();
    }
  };
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      ref={ref}
      className={`group bg-gray-900 rounded-xl border overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col ${
        isSelected 
          ? 'border-purple-500 shadow-purple-500/20' 
          : 'border-gray-800 hover:border-purple-500/50'
      } ${
        (onClick || allowExpand) ? 'cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* NFT Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0 overflow-hidden">
        {nft.imageUrl ? (
          <ImageWithFallback
            src={nft.imageUrl}
            alt={nft.metadata?.name || `Token #${nft.tokenId}`}
            className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu"
            preserveAspectRatio={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl"></div>
              <svg className="relative w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Dark Overlay for Hover Effect */}
        {showDuplicateOnHover && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"></div>
        )}
        
        {/* Duplicate Button Overlay */}
        {showDuplicateOnHover && !allowExpand && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
              Duplicate
            </div>
          </div>
        )}
        
        {/* Expand/Click Button Overlay */}
        {(allowExpand || showDuplicateOnHover) && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            {allowExpand ? (
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                View Details
              </div>
            ) : (
              <div 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg"
                onClick={handleButtonClick}
              >
                Duplicate
              </div>
            )}
          </div>
        )}
        
        {/* Token ID Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
          <span className="text-xs font-medium text-white">#{nft.tokenId}</span>
        </div>
      </div>
      
      {/* NFT Info */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-white mb-2 text-lg group-hover:text-purple-400 transition-colors">
          {nft.metadata?.name || `Dupe #${nft.tokenId}`}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Owned by</span>
          </div>
          <span className="text-sm font-mono text-purple-400">
            {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
          </span>
        </div>
        
        {/* Attributes */}
        {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {nft.metadata.attributes.slice(0, 3).map((attr, index) => (
                <span 
                  key={index}
                  className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 px-2.5 py-1 rounded-md text-xs font-medium border border-purple-500/30"
                >
                  {attr.trait_type}: {attr.value}
                </span>
              ))}
              {nft.metadata.attributes.length > 3 && (
                <span className="bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-md border border-gray-700">
                  +{nft.metadata.attributes.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

NFTCard.displayName = 'NFTCard';

function UserNFTsSection() {
  const { userNFTs, userLoading, userError, userLoadingProgress, loadUserNFTs } = useMintedNFTs();
  const { address } = useAccount();
  const [userCurrentPage, setUserCurrentPage] = useState(0);
  const [showExpanded, setShowExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [expandedNFTId, setExpandedNFTId] = useState<string | null>(null);
  const expandedNFTRef = useRef<HTMLDivElement>(null);
  
  // Track window width for responsive pagination
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const oldPageSize = getSingleRowPageSize();
      setWindowWidth(newWidth);
      
      // Reset to first page if page size would change significantly
      if (!showExpanded) {
        const newPageSize = newWidth >= 1536 ? 5 : newWidth >= 1280 ? 4 : newWidth >= 1024 ? 3 : newWidth >= 640 ? 2 : 1;
        if (newPageSize !== oldPageSize) {
          setUserCurrentPage(0);
        }
      }
    };
    
    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [showExpanded]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Dynamic page size based on expanded state and screen width
  // Match the same breakpoints as the CSS grid: sm:2, lg:3, xl:4, 2xl:5
  const getSingleRowPageSize = useCallback(() => {
    if (windowWidth >= 1536) return 5; // 2xl: 5 columns  
    if (windowWidth >= 1280) return 4; // xl: 4 columns
    if (windowWidth >= 1024) return 3; // lg: 3 columns
    if (windowWidth >= 640) return 2;  // sm: 2 columns
    return 1; // base: 1 column
  }, [windowWidth]);
  
  const userPageSize = showExpanded ? 20 : getSingleRowPageSize();
  
  // Calculate columns per row for expanded view positioning
  const getColumnsPerRow = useCallback(() => {
    if (windowWidth >= 1536) return 5; // 2xl: 5 columns  
    if (windowWidth >= 1280) return 4; // xl: 4 columns
    if (windowWidth >= 1024) return 3; // lg: 3 columns
    if (windowWidth >= 640) return 2;  // sm: 2 columns
    return 1; // base: 1 column
  }, [windowWidth]);

  // Calculate pagination for user NFTs
  const totalUserNFTs = userNFTs.length;
  const userStartIndex = userCurrentPage * userPageSize;
  const userEndIndex = Math.min(userStartIndex + userPageSize, totalUserNFTs);
  const paginatedUserNFTs = userNFTs.slice(userStartIndex, userEndIndex);
  const userHasNextPage = userEndIndex < totalUserNFTs;
  const userHasPrevPage = userCurrentPage > 0;
  
  // Get the expanded NFT data for the separate expanded view
  const expandedNFT = useMemo(() => {
    if (!expandedNFTId) return null;
    return paginatedUserNFTs.find(nft => nft.tokenId === expandedNFTId) || null;
  }, [paginatedUserNFTs, expandedNFTId]);
  
  // Calculate the position to insert the expanded view
  const expandedViewPosition = useMemo(() => {
    if (!expandedNFTId || !expandedNFT) return -1;
    
    const columnsPerRow = getColumnsPerRow();
    const expandedNFTIndex = paginatedUserNFTs.findIndex(nft => nft.tokenId === expandedNFTId);
    
    if (expandedNFTIndex === -1) return -1;
    
    // Calculate which row the expanded NFT is in
    const expandedNFTRow = Math.floor(expandedNFTIndex / columnsPerRow);
    const rowStartIndex = expandedNFTRow * columnsPerRow;
    
    return rowStartIndex; // Insert at the beginning of the row
  }, [paginatedUserNFTs, expandedNFTId, expandedNFT, getColumnsPerRow]);

  if (!address) return null;

  const userNextPage = () => {
    if (userHasNextPage) {
      // If there's an expanded view, we need to handle the layout shift
      if (expandedNFTId && expandedNFTRef.current) {
        // Get the height of the expanded view before closing it
        const expandedHeight = expandedNFTRef.current.getBoundingClientRect().height;
        const currentScrollY = window.scrollY;
        
        // Close expanded view
        setExpandedNFTId(null);
        
        // Change page
        setUserCurrentPage(prev => prev + 1);
        
        // Adjust scroll position to account for the removed expanded view height
        setTimeout(() => {
          const adjustedScrollY = Math.max(0, currentScrollY - expandedHeight);
          window.scrollTo({
            top: adjustedScrollY,
            behavior: 'instant' // Use instant to avoid competing with smooth scrolling
          });
        }, 50);
      } else {
        // No expanded view, just change page normally
        setUserCurrentPage(prev => prev + 1);
      }
    }
  };

  const userPreviousPage = () => {
    if (userHasPrevPage) {
      // If there's an expanded view, we need to handle the layout shift
      if (expandedNFTId && expandedNFTRef.current) {
        // Get the height of the expanded view before closing it
        const expandedHeight = expandedNFTRef.current.getBoundingClientRect().height;
        const currentScrollY = window.scrollY;
        
        // Close expanded view
        setExpandedNFTId(null);
        
        // Change page
        setUserCurrentPage(prev => prev - 1);
        
        // Adjust scroll position to account for the removed expanded view height
        setTimeout(() => {
          const adjustedScrollY = Math.max(0, currentScrollY - expandedHeight);
          window.scrollTo({
            top: adjustedScrollY,
            behavior: 'instant' // Use instant to avoid competing with smooth scrolling
          });
        }, 50);
      } else {
        // No expanded view, just change page normally
        setUserCurrentPage(prev => prev - 1);
      }
    }
  };

  // Reset to first page when NFTs are reloaded or view mode changes
  const handleRefresh = () => {
    setUserCurrentPage(0);
    loadUserNFTs();
  };

  const toggleExpanded = () => {
    setShowExpanded(prev => !prev);
    setUserCurrentPage(0); // Reset to first page when toggling
  };

  const handleNFTExpand = (tokenId: string) => {
    if (expandedNFTId === tokenId) {
      // Collapse if already expanded
      setExpandedNFTId(null);
    } else {
      // Expand the new NFT (keeping current page)
      setExpandedNFTId(tokenId);
      
      // Different scroll approaches for mobile vs desktop
      setTimeout(() => {
        if (expandedNFTRef.current) {
          const isMobile = window.innerWidth < 768;
          
          if (isMobile) {
            // Mobile: Use scrollIntoView with offset adjustment (what worked before)
            expandedNFTRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
            
            // Small adjustment for mobile header
            setTimeout(() => {
              const headerOffset = 60;
              const currentScroll = window.scrollY;
              window.scrollTo({
                top: Math.max(0, currentScroll - headerOffset),
                behavior: 'smooth'
              });
            }, 100);
          } else {
            // Desktop: Use precise calculation (what works for desktop)
            const rect = expandedNFTRef.current.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const headerOffset = 80;
            const targetPosition = Math.max(0, elementTop - headerOffset);
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      }, 200);
    }
  };

  const handleCloseExpanded = () => {
    setExpandedNFTId(null);
  };

  return (
    <div className="mb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Duplicate NFTs
          </h2>
          <p className="text-gray-400 mt-2 text-base sm:text-lg break-words">
            {totalUserNFTs > 0 ? (
              <>
                {showExpanded ? (
                  <>
                    Showing {userStartIndex + 1}-{userEndIndex} of{" "}
                    <span className="text-purple-400 font-semibold">{totalUserNFTs}</span> owned NFTs
                  </>
                ) : (
                  <>
                    Showing {Math.min(userPageSize, totalUserNFTs)} of{" "}
                    <span className="text-purple-400 font-semibold">{totalUserNFTs}</span> owned NFTs
                  </>
                )}
              </>
            ) : (
              "NFTs you own from this collection"
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center sm:justify-end">
          {totalUserNFTs > userPageSize && !showExpanded && (
            <button
              onClick={toggleExpanded}
              className="group px-3 sm:px-4 py-2 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-200 text-xs sm:text-sm font-medium flex items-center"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="hidden sm:inline">Show More</span>
              <span className="sm:hidden">More</span>
            </button>
          )}
          {showExpanded && (
            <button
              onClick={toggleExpanded}
              className="group px-3 sm:px-4 py-2 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-200 text-xs sm:text-sm font-medium flex items-center"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span className="hidden sm:inline">Show Less</span>
              <span className="sm:hidden">Less</span>
            </button>
          )}
          {!userLoading && (
            <button
              onClick={handleRefresh}
              className="group px-3 sm:px-4 py-2 bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-200 text-xs sm:text-sm font-medium flex items-center"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          )}
        </div>
      </div>

      {userLoading && userNFTs.length === 0 ? (
        /* Initial skeleton loading grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          <NFTPlaceholder count={showExpanded ? 20 : getSingleRowPageSize()} />
        </div>
      ) : userLoading && userNFTs.length > 0 ? (
        /* Progressive loading: show loaded NFTs + skeleton placeholders */
        <div className="relative">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {/* Show loaded NFTs */}
              {paginatedUserNFTs.map((nft) => (
                <NFTCard 
                  key={`user-${nft.tokenId}`} 
                  nft={nft} 
                  allowExpand={false} // Disable expansion during loading
                  isSelected={false}
                  onExpand={() => {}}
                />
              ))}
              
              {/* Show skeleton placeholders for remaining slots */}
              {userLoadingProgress.loaded < userLoadingProgress.total && (
                <NFTPlaceholder 
                  count={Math.min(
                    userLoadingProgress.total - userLoadingProgress.loaded,
                    (showExpanded ? 20 : getSingleRowPageSize()) - paginatedUserNFTs.length
                  )} 
                />
              )}
            </div>
          </div>
          
          {/* Loading progress indicator */}
          {userLoadingProgress.total > 0 && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2 bg-gray-900/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-800">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                <span className="text-sm text-gray-400">
                  Loading {userLoadingProgress.loaded} of {userLoadingProgress.total} NFTs...
                </span>
              </div>
            </div>
          )}
        </div>
      ) : userError ? (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-300">{userError.userMessage}</p>
          </div>
        </div>
      ) : totalUserNFTs === 0 && !userLoading ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-800 backdrop-blur-sm">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl"></div>
            <svg className="relative w-20 h-20 mx-auto mb-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No NFTs Found</h3>
          <p className="text-gray-400 text-lg">You don&apos;t own any Duplicate NFTs yet.</p>
          <p className="text-gray-500 text-sm mt-2">Try minting your first Duplicate NFT!</p>
        </div>
      ) : (
        <div className="relative">
          <div className="space-y-6">
            {/* Expanded View */}
            {expandedNFT && expandedViewPosition >= 0 && (
              <>
                {/* NFTs before the expanded row */}
                {expandedViewPosition > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {paginatedUserNFTs.slice(0, expandedViewPosition).map((nft) => (
                      <NFTCard 
                        key={`user-${nft.tokenId}`} 
                        nft={nft} 
                        allowExpand={true}
                        isSelected={expandedNFTId === nft.tokenId}
                        onExpand={handleNFTExpand}
                      />
                    ))}
                  </div>
                )}
                
                {/* Expanded View */}
                <div ref={expandedNFTRef}>
                  <ExpandedNFTView nft={expandedNFT} onClose={handleCloseExpanded} />
                </div>
                
                {/* NFTs from the expanded row onwards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {paginatedUserNFTs.slice(expandedViewPosition).map((nft) => (
                    <NFTCard 
                      key={`user-${nft.tokenId}`} 
                      nft={nft} 
                      allowExpand={true}
                      isSelected={expandedNFTId === nft.tokenId}
                      onExpand={handleNFTExpand}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Normal grid when nothing is expanded */}
            {!expandedNFT && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {paginatedUserNFTs.map((nft) => (
                  <NFTCard 
                    key={`user-${nft.tokenId}`} 
                    nft={nft} 
                    allowExpand={true}
                    isSelected={false}
                    onExpand={handleNFTExpand}
                  />
                ))}
              </div>
            )}
          </div>

          {/* User NFTs Pagination - Only show when expanded and multiple pages exist */}
          {showExpanded && Math.ceil(totalUserNFTs / userPageSize) > 1 && (
            <div className="flex items-center justify-between bg-gray-900/50 rounded-xl p-6 border border-gray-800 backdrop-blur-sm">
              <button
                onClick={userPreviousPage}
                disabled={!userHasPrevPage || userLoading}
                className="group px-6 py-3 bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:hover:border-gray-700"
              >
                <svg className="w-5 h-5 inline mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                  <span className="text-gray-400">Page</span>
                  <span className="text-white font-semibold">
                    {userCurrentPage + 1}
                  </span>
                  <span className="text-gray-400">of</span>
                  <span className="text-purple-400 font-semibold">
                    {Math.ceil(totalUserNFTs / userPageSize)}
                  </span>
                </div>
              </div>

              <button
                onClick={userNextPage}
                disabled={!userHasNextPage || userLoading}
                className="group px-6 py-3 bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:hover:border-gray-700"
              >
                Next
                <svg className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Single row navigation - Only show when NOT expanded and more items exist */}
          {!showExpanded && totalUserNFTs > userPageSize && (
            <div className="flex items-center justify-center space-x-4 mt-6">
              <button
                onClick={userPreviousPage}
                disabled={!userHasPrevPage || userLoading}
                className="group p-2 bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous NFTs"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <span className="text-gray-400 text-sm">
                {userStartIndex + 1}-{userEndIndex} of {totalUserNFTs}
              </span>

              <button
                onClick={userNextPage}
                disabled={!userHasNextPage || userLoading}
                className="group p-2 bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next NFTs"
              >
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AllNFTsSection({ 
  onNavigateToMint 
}: { 
  onNavigateToMint?: (contractAddress: string, tokenId: string) => void;
}) {
  const { 
    allNFTs, 
    allLoading, 
    allError, 
    totalSupply, 
    currentPage, 
    pageSize, 
    hasNextPage, 
    nextPage, 
    previousPage, 
    loadAllNFTs 
  } = useMintedNFTs();
  
  const config = useConfig();
  const { contractAddress: duplicatesContractAddress } = useNftMinterContract();
  const [windowWidth, setWindowWidth] = useState(0);
  
  // Track window width for responsive pagination (same as UserNFTsSection)
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // Calculate NFTs per page based on 10 rows
  const getColumnsPerRow = () => {
    if (windowWidth >= 1536) return 5; // 2xl: 5 columns  
    if (windowWidth >= 1280) return 4; // xl: 4 columns
    if (windowWidth >= 1024) return 3; // lg: 3 columns
    if (windowWidth >= 640) return 2;  // sm: 2 columns
    return 1; // base: 1 column
  };
  
  const targetNFTsPerPage = getColumnsPerRow() * 10; // 10 rows

  // Use our dynamic page size for display, but work with hook's data
  const displayPageSize = targetNFTsPerPage;
  const displayedNFTs = allNFTs.slice(0, Math.min(displayPageSize, allNFTs.length));
  
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize + displayedNFTs.length, totalSupply);
  const placeholderCount = allLoading ? Math.min(displayPageSize - displayedNFTs.length, Math.max(0, totalSupply - allNFTs.length)) : 0;

  // Handle NFT click to get original contract details and navigate to mint tab
  const handleNFTClick = async (nft: MintedNFT) => {
    if (!onNavigateToMint || !duplicatesContractAddress || !config) return;
    
    try {
      // Fetch original contract address and token ID from the duplicates contract
      const originalMetadata = await readContract(config, {
        abi: duplicatesAbi,
        address: duplicatesContractAddress,
        functionName: "token_id_to_metadata",
        args: [BigInt(nft.tokenId)],
      });

      if (originalMetadata && originalMetadata.contract_address && originalMetadata.external_id !== undefined) {
        // Navigate to mint tab with pre-filled original contract details
        onNavigateToMint(originalMetadata.contract_address, originalMetadata.external_id.toString());
      }
    } catch {
      // Failed to fetch original NFT metadata
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            All Duplicate NFTs
          </h2>
          <p className="text-gray-400 mt-2 text-base sm:text-lg break-words">
            {totalSupply > 0 ? (
              <>
                Showing {startIndex}-{endIndex} of{" "}
                <span className="text-purple-400 font-semibold">{totalSupply}</span> total NFTs
              </>
            ) : (
              "All NFTs minted from this contract"
            )}
          </p>
        </div>
        {!allLoading && (
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={() => loadAllNFTs(currentPage)}
              className="group px-3 sm:px-4 py-2 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-200 text-xs sm:text-sm font-medium flex items-center"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        )}
      </div>

      {allError ? (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-300">{allError.userMessage}</p>
          </div>
        </div>
      ) : totalSupply === 0 && !allLoading ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-800 backdrop-blur-sm">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl"></div>
            <svg className="relative w-20 h-20 mx-auto mb-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No NFTs Minted Yet</h3>
          <p className="text-gray-400 text-lg">No tokens have been minted from this contract yet.</p>
          <p className="text-gray-500 text-sm mt-2">Be the first to create a Duplicate NFT!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-10">
            {displayedNFTs.map((nft) => (
              <NFTCard 
                key={`all-${nft.tokenId}`} 
                nft={nft} 
                showDuplicateOnHover={true}
                onClick={() => handleNFTClick(nft)}
              />
            ))}
            {placeholderCount > 0 && (
              <NFTPlaceholder count={placeholderCount} />
            )}
          </div>

          {/* Pagination */}
          {totalSupply > displayPageSize && (
            <div className="flex items-center justify-between bg-gray-900/50 rounded-xl p-6 border border-gray-800 backdrop-blur-sm">
              <button
                onClick={previousPage}
                disabled={currentPage === 0 || allLoading}
                className="group px-6 py-3 bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:hover:border-gray-700"
              >
                <svg className="w-5 h-5 inline mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                  <span className="text-gray-400">Page</span>
                  <span className="text-white font-semibold">
                    {currentPage + 1}
                  </span>
                  <span className="text-gray-400">of</span>
                  <span className="text-purple-400 font-semibold">
                    {Math.ceil(totalSupply / displayPageSize)}
                  </span>
                </div>
                {allLoading && (
                  <div className="relative">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-6 w-6 border border-purple-500/30"></div>
                  </div>
                )}
              </div>

              <button
                onClick={nextPage}
                disabled={!hasNextPage || allLoading}
                className="group px-6 py-3 bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:hover:border-gray-700"
              >
                Next
                <svg className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface MintedTokensProps {
  onNavigateToMint?: (contractAddress: string, tokenId: string) => void;
}

export default function MintedTokens({ onNavigateToMint }: MintedTokensProps = {}) {
  const { isConnected } = useAccount();
  const { 
    contractAddress, 
    chainConfig, 
    error: contractError 
  } = useNftMinterContract();
  const { userError, allError } = useMintedNFTs();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="text-center py-24">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl"></div>
              <svg className="relative w-24 h-24 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 text-xl">Please connect your wallet to view minted NFTs.</p>
          </div>
        </div>
      </div>
    );
  }

  if (contractError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm mt-24">
            <div className="flex items-start">
              <svg className="w-8 h-8 text-red-400 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-2xl font-bold text-red-300 mb-2">Contract Error</h3>
                <p className="text-red-200 text-lg mb-3">{contractError.userMessage}</p>
                {chainConfig && (
                  <div className="bg-red-800/30 px-4 py-2 rounded-lg border border-red-600/30">
                    <p className="text-red-300 text-sm">Current network: <span className="font-semibold">{chainConfig.name}</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-8 sm:mb-12 pt-4 sm:pt-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
              Duplicate Collection
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl px-4">Discover and explore the Duplicate NFT universe</p>
          </div>
          
          {chainConfig && contractAddress && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-800 max-w-2xl mx-auto mx-4">
              <div className="flex items-center justify-center space-x-4 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300 font-medium text-sm sm:text-base">{chainConfig.name}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-2 sm:p-3 border border-gray-700">
                <span className="text-gray-400 font-mono text-xs sm:text-sm break-all flex-1 min-w-0">
                  <span className="block sm:hidden">
                    {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                  </span>
                  <span className="hidden sm:block">
                    {contractAddress}
                  </span>
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(contractAddress)}
                  className="p-1.5 sm:p-2 hover:bg-gray-700 rounded-lg transition-colors group flex-shrink-0"
                  title="Copy contract address"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User's NFTs Section */}
        <UserNFTsSection />

        {/* All NFTs Section */}
        <AllNFTsSection onNavigateToMint={onNavigateToMint} />

        {/* Error Popups */}
        <ErrorPopup
          isOpen={!!userError}
          message={userError?.userMessage || ""}
          onClose={() => {}}
          title="Error Loading Your NFTs"
        />
        <ErrorPopup
          isOpen={!!allError}
          message={allError?.userMessage || ""}
          onClose={() => {}}
          title="Error Loading All NFTs"
        />
      </div>
    </div>
  );
}