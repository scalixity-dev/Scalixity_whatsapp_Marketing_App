// utils/phoneUtils.js
/**
 * Normalizes a phone number to the E.164 international format
 * @param {string} phoneNumber - The phone number to normalize
 * @returns {string} - The normalized phone number
 */
const normalizePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Remove any non-digit characters
    let digits = phoneNumber.replace(/\D/g, '');
    
    // Check if the number already has a country code (starts with '+')
    if (phoneNumber.startsWith('+')) {
      return '+' + digits;
    }
    
    // Add default country code (+1 for US/Canada) if none is provided
    // You may want to adjust this based on your user base
    if (digits.length === 10) {
      return '+1' + digits;
    }
    
    // Otherwise assume it already includes a country code
    return '+' + digits;
  };
  
  module.exports = {
    normalizePhoneNumber
  };