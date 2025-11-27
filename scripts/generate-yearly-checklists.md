# Generate Yearly Checklists

This script generates checklists for an entire year for all properties. Run this manually in December to create next year's checklists.

## Usage

### Option 1: Using curl

```bash
curl -X POST https://your-domain.com/api/checklists/generate-all-properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -d '{"year": 2027}'
```

### Option 2: Using the API route directly

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Create a function that calls the API (or use a simple HTTP client)

### Option 3: Create a simple Node.js script

```javascript
const fetch = require('node-fetch');

async function generateYearlyChecklists(year) {
  const response = await fetch('http://localhost:3000/api/checklists/generate-all-properties', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({ year })
  });

  const result = await response.json();
  console.log(result);
}

// Generate checklists for 2027
generateYearlyChecklists(2027);
```

## For Individual Properties

To generate checklists for a single property for a year:

```bash
curl -X POST https://your-domain.com/api/checklists/generate-year \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{"propertyId": "property-uuid", "year": 2027}'
```

## When to Run

- **December of each year**: Generate checklists for the next year
- **For new properties**: Generate checklists for the current year when a property is added
- **Manually**: Anytime you need to regenerate checklists

## Notes

- The script will skip months that already have checklists
- Each property gets 12 monthly checklists (one per month)
- Tasks are generated using AI based on property details
- The generation process may take a few minutes for many properties

