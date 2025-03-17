# Family Matching Application

A Node.js application that demonstrates different approaches for implementing family relationship matching logic. This application showcases a rule-based approach for identifying potential family relationships between individuals based on names, ages, and locations.

## Overview

This application implements a family matching system that can:

- Identify potential family relationships (siblings, parent-child) between individuals
- Calculate similarity scores and confidence ratings for potential matches
- Provide explanations for why matches are suggested
- Compare rule-based and ML-based approaches for family matching

## Features

- **Rule-based matching algorithm** that uses:
  - String similarity for name/surname matching
  - Age difference analysis for relationship type detection
  - Location matching
- **Interactive web interface** to:
  - Browse sample people
  - Find potential family matches for any individual
  - View detailed match explanations and confidence scores
- **Approach comparison** that outlines pros and cons of rule-based vs. ML-based matching

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone this repository or create a new project directory:

```bash
mkdir family-matching-app
cd family-matching-app
```

2. Initialize a new Node.js project:

```bash
npm init -y
```

3. Install the required dependencies:

```bash
npm install express ejs body-parser string-similarity
```

4. Create the project structure:

```bash
mkdir views
mkdir public
touch app.js
touch familyMatcher.js
touch public/styles.css
```

5. Copy the code files from this repository into your project directory:
   - `app.js` - Main application file
   - `familyMatcher.js` - Family matching logic implementation
   - `views/index.ejs` - Home page template
   - `views/match.ejs` - Match results page template
   - `views/compare.ejs` - Approach comparison page template
   - `public/styles.css` - CSS styles

## Running the Application

Start the server with:

```bash
node app.js
```

Then visit `http://localhost:3000` in your web browser.

## How It Works

### Rule-Based Matching

The application uses several rules to identify potential family relationships:

1. **Sibling detection**:
   - Similar surnames (with configurable threshold)
   - Age difference within typical sibling range
   - Same or similar location

2. **Parent-child detection**:
   - Age difference within typical parent-child range (15-50 years)
   - Similar surnames
   - Same or similar location

Each potential match is given a confidence score based on how well it matches these rules.

### Future ML-Based Approach

The application includes a comparison with a potential ML-based approach using TensorFlow.js, which could:

- Learn patterns from known family relationships
- Discover non-obvious connections
- Adapt to different cultural naming patterns
- Improve accuracy over time as more data is collected

## Project Structure

- `app.js` - Express application setup and routes
- `familyMatcher.js` - Core matching logic implementation
- `views/` - EJS templates for the web interface
- `public/` - Static assets (CSS, client-side JS)

## Customization

You can modify the matching thresholds in the `FamilyMatcher` constructor in `familyMatcher.js`:

```javascript
this.thresholds = {
  nameSimilarity: options.nameSimilarity || 0.7,
  surnameSimilarity: options.surnameSimilarity || 0.8,
  locationExact: options.locationExact || true,
  ageGap: options.ageGap || {
    siblings: 15,
    parent: { min: 15, max: 50 }
  }
};
```

## API Usage

The application also provides a REST API endpoint for programmatic access:

```
POST /api/match
```

Request body:
```json
{
  "targetPerson": {
    "firstName": "John",
    "lastName": "Smith",
    "age": 30,
    "location": "New York"
  },
  "peoplePool": [
    {
      "firstName": "Jane",
      "lastName": "Smith",
      "age": 28,
      "location": "New York"
    }
    // Additional people...
  ]
}
```

## Next Steps

To enhance this application:

1. Add user authentication for personalized family matching
2. Implement the ML-based approach using TensorFlow.js
3. Create a feedback system to improve matching accuracy
4. Add more complex relationship detection (cousins, aunts/uncles, etc.)
5. Implement a data import/export system

## License

[MIT](LICENSE)