/**
 * Generates a pre-filled WhatsApp link for product inquiries and orders
 * @param {string} productName Name of the furniture product
 * @param {number} price Price in ETB
 * @param {string} productId ID of the product for linking
 * @returns {string} Fully encoded WhatsApp URL
 */
export const getWhatsAppLink = (productName, price, productId = '') => {
  const businessNumber = '251911000000'; // Default phone number for Addis Ababa company
  const formattedPrice = price ? `${price.toLocaleString()} ETB` : 'Contact for Price';
  const siteUrl = window.location.origin;
  const productUrl = productId ? `${siteUrl}/products/${productId}` : '';
  
  let text = `Hello, I want to order this furniture product:\n\n`;
  text += `*Product:* ${productName}\n`;
  text += `*Price:* ${formattedPrice}\n`;
  if (productUrl) {
    text += `*Link:* ${productUrl}\n`;
  }
  text += `\nPlease let me know if it's available and how we can proceed with delivery. Thank you!`;
  
  return `https://wa.me/${businessNumber}?text=${encodeURIComponent(text)}`;
};

/**
 * Generates a WhatsApp link for general contact/inquiry
 * @returns {string} WhatsApp URL
 */
export const getGeneralWhatsAppLink = () => {
  const businessNumber = '251911000000';
  const text = `Hello, I'm interested in custom furniture options from Novus Addis. I would like to consult with a designer.`;
  return `https://wa.me/${businessNumber}?text=${encodeURIComponent(text)}`;
};
