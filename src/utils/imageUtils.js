export const getCorrectImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  try {
    // Remove any double slashes (except after http/https)
    const cleanUrl = imageUrl.replace(/([^:]\/)\/+/g, "$1");

    // If it's already an absolute URL, return as is
    if (cleanUrl.startsWith('http')) return cleanUrl;

    // Construct the full URL
    const baseUrl = 'http://localhost:5000';
    return `${baseUrl}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
  } catch (error) {
    console.error('Error processing image URL:', error);
    return null;
  }
}; 