// Family Matching Logic Prototype
const stringSimilarity = require('string-similarity');

/**
 * A rule-based family matching system
 */
class FamilyMatcher {
  constructor(options = {}) {
    // Default threshold values
    this.thresholds = {
      nameSimilarity: options.nameSimilarity || 0.7,
      surnameSimilarity: options.surnameSimilarity || 0.8,
      locationExact: options.locationExact || true,
      ageGap: options.ageGap || {
        siblings: 15,
        parent: { min: 15, max: 50 }
      }
    };
  }

  /**
   * Calculate name similarity between two people
   * @param {Object} person1 - First person
   * @param {Object} person2 - Second person
   * @returns {number} Similarity score (0-1)
   */
  calculateNameSimilarity(person1, person2) {
    // Calculate similarity between full names
    const fullName1 = `${person1.firstName} ${person1.lastName}`.toLowerCase();
    const fullName2 = `${person2.firstName} ${person2.lastName}`.toLowerCase();
    
    // Calculate similarity between surnames only (higher weight)
    const surname1 = person1.lastName.toLowerCase();
    const surname2 = person2.lastName.toLowerCase();
    
    const fullNameSim = stringSimilarity.compareTwoStrings(fullName1, fullName2);
    const surnameSim = stringSimilarity.compareTwoStrings(surname1, surname2);
    
    // Weight surname matches higher (70% surname, 30% full name)
    return (surnameSim * 0.7) + (fullNameSim * 0.3);
  }

  /**
   * Check if two people might be siblings
   * @param {Object} person1 - First person
   * @param {Object} person2 - Second person 
   * @returns {Object} Result with score and reason
   */
  checkSiblingPotential(person1, person2) {
    let score = 0;
    let reasons = [];
    
    // Check surname similarity
    const surnameSim = stringSimilarity.compareTwoStrings(
      person1.lastName.toLowerCase(), 
      person2.lastName.toLowerCase()
    );
    
    if (surnameSim >= this.thresholds.surnameSimilarity) {
      score += 0.5;
      reasons.push(`Same surname (${Math.round(surnameSim * 100)}% match)`);
    }
    
    // Check age difference for siblings
    const ageDiff = Math.abs(person1.age - person2.age);
    if (ageDiff <= this.thresholds.ageGap.siblings) {
      score += 0.3;
      reasons.push(`Age difference (${ageDiff} years) consistent with siblings`);
    }
    
    // Check location
    if (this.thresholds.locationExact) {
      if (person1.location === person2.location) {
        score += 0.2;
        reasons.push('Same location');
      }
    } else {
      // Could implement fuzzy location matching here
    }
    
    return {
      relationship: 'sibling',
      score,
      reasons,
      isLikely: score >= 0.7
    };
  }

  /**
   * Check if person1 might be a parent of person2
   * @param {Object} person1 - Potential parent
   * @param {Object} person2 - Potential child
   * @returns {Object} Result with score and reason
   */
  checkParentChildPotential(person1, person2) {
    let score = 0;
    let reasons = [];
    
    // Check surname similarity
    const surnameSim = stringSimilarity.compareTwoStrings(
      person1.lastName.toLowerCase(), 
      person2.lastName.toLowerCase()
    );
    
    if (surnameSim >= this.thresholds.surnameSimilarity) {
      score += 0.4;
      reasons.push(`Same surname (${Math.round(surnameSim * 100)}% match)`);
    }
    
    // Check age difference for parent-child
    const ageDiff = person1.age - person2.age;
    if (ageDiff >= this.thresholds.ageGap.parent.min && 
        ageDiff <= this.thresholds.ageGap.parent.max) {
      score += 0.4;
      reasons.push(`Age difference (${ageDiff} years) consistent with parent-child`);
    }
    
    // Check location
    if (this.thresholds.locationExact) {
      if (person1.location === person2.location) {
        score += 0.2;
        reasons.push('Same location');
      }
    }
    
    return {
      relationship: 'parent-child',
      score,
      reasons,
      isLikely: score >= 0.7
    };
  }

  /**
   * Find possible family relationships between two people
   * @param {Object} person1 - First person
   * @param {Object} person2 - Second person
   * @returns {Array} Array of possible relationships with scores
   */
  findPossibleRelationships(person1, person2) {
    const relationships = [];
    
    // Skip comparing the same person
    if (person1.id === person2.id) {
      return relationships;
    }
    
    // Check sibling relationship
    const siblingResult = this.checkSiblingPotential(person1, person2);
    if (siblingResult.score > 0) {
      relationships.push(siblingResult);
    }
    
    // Check parent-child (in both directions)
    const parentChildResult = this.checkParentChildPotential(person1, person2);
    if (parentChildResult.score > 0) {
      relationships.push(parentChildResult);
    }
    
    const childParentResult = this.checkParentChildPotential(person2, person1);
    if (childParentResult.score > 0) {
      // Swap the relationship description for clarity
      childParentResult.relationship = 'child-parent';
      relationships.push(childParentResult);
    }
    
    return relationships;
  }

  /**
   * Find potential family matches for a person from a set of other people
   * @param {Object} targetPerson - Person to find matches for
   * @param {Array} peoplePool - Array of people to compare against
   * @returns {Array} Sorted array of potential matches with relationship info
   */
  findFamilyMatches(targetPerson, peoplePool) {
    const potentialMatches = [];
    
    for (const person of peoplePool) {
      const relationships = this.findPossibleRelationships(targetPerson, person);
      
      if (relationships.length > 0) {
        // Get the highest scoring relationship
        const bestMatch = relationships.reduce((prev, current) => 
          (prev.score > current.score) ? prev : current
        );
        
        potentialMatches.push({
          person,
          ...bestMatch
        });
      }
    }
    
    // Sort by score (highest first)
    return potentialMatches.sort((a, b) => b.score - a.score);
  }
}

// Example usage
function demonstrateMatching() {
  const matcher = new FamilyMatcher();
  
  // Sample data
  const samplePeople = [
    { id: 1, firstName: 'John', lastName: 'Smith', age: 45, location: 'New York' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', age: 42, location: 'New York' },
    { id: 3, firstName: 'Michael', lastName: 'Smith', age: 15, location: 'New York' },
    { id: 4, firstName: 'Emily', lastName: 'Smith', age: 13, location: 'New York' },
    { id: 5, firstName: 'Robert', lastName: 'Johnson', age: 70, location: 'Chicago' },
    { id: 6, firstName: 'Susan', lastName: 'Johnson', age: 68, location: 'Chicago' },
    { id: 7, firstName: 'David', lastName: 'Smith', age: 72, location: 'Boston' },
    { id: 8, firstName: 'Maria', lastName: 'Garcia', age: 35, location: 'Miami' },
    { id: 9, firstName: 'James', lastName: 'Smithe', age: 40, location: 'New York' }, // Note the surname typo
    { id: 10, firstName: 'Michael', lastName: 'Johnson', age: 38, location: 'Chicago' }
  ];
  
  // Find matches for Emily Smith
  const targetPerson = samplePeople.find(p => p.id === 4);
  const peoplePool = samplePeople.filter(p => p.id !== 4);
  
  const matches = matcher.findFamilyMatches(targetPerson, peoplePool);
  
  console.log(`\nPotential family matches for ${targetPerson.firstName} ${targetPerson.lastName}:`);
  console.log('-'.repeat(70));
  
  matches.forEach((match, index) => {
    const person = match.person;
    console.log(`Match #${index + 1}: ${person.firstName} ${person.lastName} (${person.age}, ${person.location})`);
    console.log(`Relationship: ${match.relationship} (Score: ${match.score.toFixed(2)})`);
    console.log(`Reasons: ${match.reasons.join(', ')}`);
    console.log('-'.repeat(70));
  });
}

// Run the demonstration
demonstrateMatching();

// Export for use in other files
module.exports = { FamilyMatcher };