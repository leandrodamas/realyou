
import { MAX_RETRIES } from "./types";

/**
 * Helper function to implement retry logic with exponential backoff
 * @param operation Function to retry
 * @param retries Maximum number of retries
 * @returns Result of the operation
 */
export const withRetry = async (operation: () => Promise<any>, retries = MAX_RETRIES): Promise<any> => {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) throw error;
    
    // Calculate backoff time - starts at 300ms and increases exponentially
    const backoff = Math.min(300 * Math.pow(2, MAX_RETRIES - retries), 5000);
    console.log(`Operation failed, retrying in ${backoff}ms (${retries} retries left)`);
    
    // Wait for the backoff period
    await new Promise(resolve => setTimeout(resolve, backoff));
    
    // Retry the operation with one less retry
    return withRetry(operation, retries - 1);
  }
};
