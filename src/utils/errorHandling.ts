/**
 * Error handling utilities for user-facing messages and logging
 */

export enum ErrorType {
  USER_ERROR = 'USER_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  userMessage: string;
}

/**
 * Create a user-facing error for contract/blockchain issues
 */
export function createUserError(message: string, originalError?: Error): AppError {
  return {
    type: ErrorType.USER_ERROR,
    message,
    originalError,
    userMessage: message
  };
}

/**
 * Create a server error that should be logged but show generic message to user
 */
export function createServerError(message: string, originalError?: Error): AppError {
  return {
    type: ErrorType.SERVER_ERROR,
    message,
    originalError,
    userMessage: 'An unexpected error occurred. Please try again.'
  };
}

/**
 * Parse contract call errors to user-friendly messages
 */
export function parseContractError(error: any): AppError {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  
  // Common contract error patterns
  if (errorMessage.includes('execution reverted')) {
    return createUserError('Contract call failed. The contract may not support this function or the token ID may not exist.');
  }
  
  if (errorMessage.includes('invalid address')) {
    return createUserError('Invalid contract address. Please check the address and try again.');
  }
  
  if (errorMessage.includes('network')) {
    return createServerError('Network connection issue', error);
  }
  
  if (errorMessage.includes('timeout')) {
    return createServerError('Request timed out', error);
  }
  
  // Default to user error for contract issues
  return createUserError(`Contract error: ${errorMessage}`);
}

/**
 * Parse IPFS fetch errors
 */
export function parseIpfsError(error: any): AppError {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  
  if (errorMessage.includes('timeout') || errorMessage.includes('AbortError')) {
    return createServerError('IPFS request timed out', error);
  }
  
  if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
    return createServerError('Failed to fetch from IPFS', error);
  }
  
  if (errorMessage.includes('JSON')) {
    return createServerError('Invalid metadata format', error);
  }
  
  return createServerError('IPFS fetch failed', error);
}

/**
 * Log error to console with proper categorization
 */
export function logError(error: AppError): void {
  const logData = {
    type: error.type,
    message: error.message,
    userMessage: error.userMessage,
    originalError: error.originalError?.message,
    timestamp: new Date().toISOString()
  };
  
  if (error.type === ErrorType.USER_ERROR) {
    console.warn('User Error:', logData);
  } else {
    console.error('System Error:', logData);
  }
}

/**
 * Validate Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  
  // Basic format check
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return false;
  
  return true;
}

/**
 * Validate token ID
 */
export function isValidTokenId(tokenId: string): boolean {
  if (!tokenId || typeof tokenId !== 'string') return false;
  
  // Must be a non-negative integer
  const num = parseInt(tokenId, 10);
  return !isNaN(num) && num >= 0 && num.toString() === tokenId;
} 