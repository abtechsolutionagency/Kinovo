export function calculateMatchScore(userA, userB) {
  let score = 0;
  const reasons = [];

  if (userA.interests?.length && userB.interests?.length) {
    const sharedInterests = userA.interests.filter((interest) =>
      userB.interests.includes(interest)
    );

    if (sharedInterests.length > 0) {
      score += sharedInterests.length * 10;
      reasons.push(
        `${sharedInterests.length} shared interests: ${sharedInterests.slice(0, 3).join(', ')}`
      );
    }
  }

  if (userA.location && userB.location && userA.location === userB.location) {
    score += 20;
    reasons.push(`Both in ${userA.location}`);
  }

  if (userA.languages?.length && userB.languages?.length) {
    const sharedLanguages = userA.languages.filter((lang) => userB.languages.includes(lang));

    if (sharedLanguages.length > 0) {
      score += sharedLanguages.length * 5;
      reasons.push(`Speak ${sharedLanguages.join(', ')}`);
    }
  }

  if (userA.verified && userB.verified) {
    score += 10;
    reasons.push('Both verified members');
  }

  if (userA.isPremium && userB.isPremium) {
    score += 5;
    reasons.push('Both premium members');
  }

  if (userA.trustScore && userB.trustScore) {
    const scoreDiff = Math.abs(userA.trustScore - userB.trustScore);
    if (scoreDiff < 1.0) {
      score += 5;
      reasons.push('Similar trust scores');
    }
  }

  const percentage = Math.min(Math.round(score), 100);

  return {
    score: percentage,
    reasons,
    sharedInterests:
      userA.interests?.filter((interest) => userB.interests?.includes(interest)) || [],
  };
}
