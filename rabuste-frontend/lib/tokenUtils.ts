/**
 * Token Display Utilities
 * Formats order tokens for display with date context
 */

/**
 * Format a token with its order date for display
 * @param token - The 3-digit token (e.g., "001")
 * @param orderDate - The order creation date
 * @returns Formatted token (e.g., "20260117-001")
 */
export function formatTokenForDisplay(token: string, orderDate: string | Date): string {
  const date = typeof orderDate === 'string' ? new Date(orderDate) : orderDate;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const datePrefix = `${year}${month}${day}`;
  
  return `${datePrefix}-${token}`;
}

/**
 * Get a short display version of the token (just the serial number)
 * @param token - The token
 * @returns Short token display (e.g., "#001")
 */
export function formatTokenShort(token: string): string {
  return `#${token}`;
}
