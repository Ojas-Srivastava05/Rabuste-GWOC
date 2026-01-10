/**
 * Simple Sentiment Analysis for Feedback
 * Analyzes text comments and ratings to determine sentiment
 */

export function analyzeSentiment(comments, overallRating, typeSpecificRatings = {}) {
  if (!comments || comments.trim() === '') {
    // If no comments, base sentiment purely on ratings
    if (overallRating >= 4) return { sentiment: 'positive', score: 0.7 };
    if (overallRating >= 3) return { sentiment: 'neutral', score: 0.1 };
    return { sentiment: 'negative', score: -0.6 };
  }

  const text = comments.toLowerCase();
  
  // Positive indicators
  const positiveWords = [
    'excellent', 'great', 'amazing', 'wonderful', 'fantastic', 'love', 'perfect',
    'good', 'nice', 'satisfied', 'happy', 'pleased', 'awesome', 'brilliant',
    'outstanding', 'superb', 'delicious', 'fresh', 'fast', 'quick', 'smooth',
    'easy', 'beautiful', 'clean', 'comfortable', 'welcoming', 'friendly'
  ];
  
  // Negative indicators
  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'disappointed', 'poor', 'slow',
    'dirty', 'unclean', 'rude', 'unfriendly', 'cold', 'stale', 'burnt',
    'wrong', 'missing', 'broken', 'damaged', 'late', 'delayed', 'confused',
    'difficult', 'complicated', 'ugly', 'uncomfortable', 'noisy', 'crowded'
  ];
  
  // Count positive and negative words
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (text.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (text.includes(word)) negativeCount++;
  });
  
  // Calculate sentiment score (-1 to 1)
  const wordScore = (positiveCount - negativeCount) / Math.max(positiveCount + negativeCount, 1);
  
  // Combine with rating score
  const ratingScore = (overallRating - 2.5) / 2.5; // Normalize 0-5 to -1 to 1
  
  // Weighted combination (60% text, 40% rating)
  const finalScore = (wordScore * 0.6) + (ratingScore * 0.4);
  
  // Determine sentiment
  let sentiment;
  if (finalScore > 0.3) {
    sentiment = 'positive';
  } else if (finalScore < -0.3) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  return {
    sentiment,
    score: Math.max(-1, Math.min(1, finalScore)), // Clamp between -1 and 1
  };
}

export function generateSummary(feedbackData) {
  const { type, rating, comments, orderId } = feedbackData;
  
  let summary = '';
  
  // Base summary on type and rating
  if (type === 'order') {
    const { foodQuality = 0, deliveryTime = 0, packaging = 0 } = feedbackData;
    const avgRating = (foodQuality + deliveryTime + packaging) / 3 || rating;
    
    summary = `Order Feedback: ${rating}/5 overall. `;
    if (foodQuality > 0) summary += `Food quality: ${foodQuality}/5. `;
    if (deliveryTime > 0) summary += `Delivery time: ${deliveryTime}/5. `;
    if (packaging > 0) summary += `Packaging: ${packaging}/5. `;
    if (orderId) summary += `Order ID: ${orderId.slice(-8)}. `;
  } else if (type === 'cafe') {
    const { ambience = 0, service = 0, cleanliness = 0, music = 0 } = feedbackData;
    summary = `Cafe Feedback: ${rating}/5 overall. `;
    if (ambience > 0) summary += `Ambience: ${ambience}/5. `;
    if (service > 0) summary += `Service: ${service}/5. `;
    if (cleanliness > 0) summary += `Cleanliness: ${cleanliness}/5. `;
    if (music > 0) summary += `Music: ${music}/5. `;
  } else if (type === 'website') {
    const { easeOfUse = 0, design = 0, speed = 0, features = 0 } = feedbackData;
    summary = `Website Feedback: ${rating}/5 overall. `;
    if (easeOfUse > 0) summary += `Ease of use: ${easeOfUse}/5. `;
    if (design > 0) summary += `Design: ${design}/5. `;
    if (speed > 0) summary += `Speed: ${speed}/5. `;
    if (features > 0) summary += `Features: ${features}/5. `;
  }
  
  // Add comment snippet if available
  if (comments && comments.trim()) {
    const commentSnippet = comments.length > 100 
      ? comments.substring(0, 100) + '...' 
      : comments;
    summary += `Comment: "${commentSnippet}"`;
  }
  
  return summary.trim();
}

export function extractCategories(feedbackData) {
  const categories = [];
  const { type, comments = '' } = feedbackData;
  const text = comments.toLowerCase();
  
  // Order categories
  if (type === 'order') {
    if (feedbackData.foodQuality > 0) categories.push('food_quality');
    if (feedbackData.deliveryTime > 0) categories.push('delivery');
    if (feedbackData.packaging > 0) categories.push('packaging');
    if (text.includes('late') || text.includes('delay') || text.includes('slow')) {
      categories.push('delivery_issue');
    }
    if (text.includes('wrong') || text.includes('missing') || text.includes('incorrect')) {
      categories.push('order_accuracy');
    }
  }
  
  // Cafe categories
  if (type === 'cafe') {
    if (feedbackData.ambience > 0) categories.push('ambience');
    if (feedbackData.service > 0) categories.push('service');
    if (feedbackData.cleanliness > 0) categories.push('cleanliness');
    if (feedbackData.music > 0) categories.push('atmosphere');
    if (text.includes('dirty') || text.includes('clean')) {
      categories.push('cleanliness');
    }
    if (text.includes('staff') || text.includes('service') || text.includes('friendly')) {
      categories.push('service');
    }
  }
  
  // Website categories
  if (type === 'website') {
    if (feedbackData.easeOfUse > 0) categories.push('usability');
    if (feedbackData.design > 0) categories.push('design');
    if (feedbackData.speed > 0) categories.push('performance');
    if (feedbackData.features > 0) categories.push('features');
    if (text.includes('slow') || text.includes('lag') || text.includes('loading')) {
      categories.push('performance');
    }
    if (text.includes('confusing') || text.includes('difficult') || text.includes('hard')) {
      categories.push('usability');
    }
  }
  
  return [...new Set(categories)]; // Remove duplicates
}

export function determinePriority(sentiment, rating, isFlagged) {
  if (isFlagged || sentiment === 'negative' && rating <= 2) {
    return 'urgent';
  }
  if (sentiment === 'negative' && rating <= 3) {
    return 'high';
  }
  if (sentiment === 'neutral' && rating <= 3) {
    return 'medium';
  }
  return 'low';
}
