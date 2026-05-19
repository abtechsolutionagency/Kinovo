// AI-powered match scoring algorithm

export function calculateMatchScore(userA, userB) {
  let score = 0;
  const reasons = [];

  // Shared interests (10 points each)
  if (userA.interests && userB.interests) {
    const sharedInterests = userA.interests.filter((interest) =>
      userB.interests.includes(interest)
    );
    
    if (sharedInterests.length > 0) {
      score += sharedInterests.length * 10;
      reasons.push(`${sharedInterests.length} shared interests: ${sharedInterests.slice(0, 3).join(', ')}`);
    }
  }

  // Same city (20 points)
  if (userA.location && userB.location && userA.location === userB.location) {
    score += 20;
    reasons.push(`Both in ${userA.location}`);
  }

  // Shared languages (15 points)
  if (userA.languages && userB.languages) {
    const sharedLanguages = userA.languages.filter((lang) =>
      userB.languages.includes(lang)
    );
    
    if (sharedLanguages.length > 0) {
      score += sharedLanguages.length * 5;
      reasons.push(`Speak ${sharedLanguages.join(', ')}`);
    }
  }

  // Both verified (10 points)
  if (userA.verified && userB.verified) {
    score += 10;
    reasons.push('Both verified members');
  }

  // Premium members (5 points)
  if (userA.isPremium && userB.isPremium) {
    score += 5;
    reasons.push('Both premium members');
  }

  // Similar trust score (5 points)
  if (userA.trustScore && userB.trustScore) {
    const scoreDiff = Math.abs(userA.trustScore - userB.trustScore);
    if (scoreDiff < 1.0) {
      score += 5;
      reasons.push('Similar trust scores');
    }
  }

  // Calculate percentage (max 100)
  const percentage = Math.min(Math.round(score), 100);

  return {
    score: percentage,
    reasons,
    sharedInterests: userA.interests?.filter((interest) =>
      userB.interests?.includes(interest)
    ) || []
  };
}

export function getMatchLevel(score) {
  if (score >= 80) return { level: 'Excellent Match', color: 'text-green-400' };
  if (score >= 60) return { level: 'Great Match', color: 'text-blue-400' };
  if (score >= 40) return { level: 'Good Match', color: 'text-purple-400' };
  if (score >= 20) return { level: 'Potential Match', color: 'text-yellow-400' };
  return { level: 'Low Match', color: 'text-gray-400' };
}
