# PRODUCT DATABASE REFERENCE

This file explains how the product database works and all the details you need to manage it.

## 📍 Location of Product Database

**File:** `script.js`
**Line:** Around line 3-60 (beginning of the file)
**Section:** `const PRODUCTS_DATABASE = { ... }`

## 📦 Database Structure

```javascript
const PRODUCTS_DATABASE = {
  netflix: [ /* Netflix products */ ],
  spotify: [ /* Spotify products */ ],
  prime: [ /* Amazon Prime products */ ],
  shahid: [ /* Shahid products */ ]
};
```

Each category contains an array of product objects.

## 🏷️ Product Object Template

```javascript
{
  id: 1,                              // Unique identifier (MUST be unique across ALL products)
  name: 'Netflix 1 Month',            // Product name shown to customers
  price: 30,                          // Price in TND (Tunisian Dinar)
  image: 'https://via.placeholder...', // Image URL
  description: 'One month Netflix subscription', // Short description
  availability: 'In Stock',           // Availability status
  rating: 4.8,                        // Rating out of 5 (0-5)
  popular: true,                      // Show in "Most Popular" section (true/false)
  recommended: false                  // Show in "We Recommend" section (true/false)
}
```

## 🔑 Field Details

### id (Required)
- **Type:** Number
- **Must be:** Unique (no duplicates)
- **Used for:** Identifying products internally
- **Example:** `id: 1`
- **Note:** Even if you delete a product, don't reuse its ID

### name (Required)
- **Type:** String
- **Length:** Keep it short (under 30 characters)
- **Used for:** Product title on cards and detail page
- **Example:** `name: 'Netflix 1 Month'`

### price (Required)
- **Type:** Number (no currency symbol)
- **Unit:** TND (Tunisian Dinar)
- **Used for:** Display price to customers
- **Example:** `price: 30` (means 30 TND)

### image (Required)
- **Type:** String (URL)
- **Options:**
  - Placeholder URL: `'https://via.placeholder.com/250x140/e50914/ffffff?text=Netflix'`
  - Local file: `'images/netflix1month.jpg'`
  - External URL: `'https://your-image-host.com/image.jpg'`
- **Size:** Recommend 250x140 pixels minimum
- **Format:** PNG, JPG, or WebP

### description (Required)
- **Type:** String
- **Length:** Keep short (under 50 characters)
- **Used for:** Product card description
- **Example:** `description: 'One month Netflix subscription'`
- **Note:** Longer description shown on product detail page

### availability (Required)
- **Type:** String
- **Options:**
  - `'In Stock'` - Product available
  - `'Out of Stock'` - Product sold out
  - `'Coming Soon'` - Product launching soon
  - `'Limited Stock'` - Limited quantity
- **Used for:** Show availability status
- **Example:** `availability: 'In Stock'`

### rating (Required)
- **Type:** Number (0-5, can be decimal)
- **Used for:** Show product rating (visual indicator)
- **Example:** `rating: 4.8`
- **Range:** 0 to 5
- **Typical values:** 4.5-5.0 for good products

### popular (Required)
- **Type:** Boolean (true or false)
- **When true:** Product shows in "Most Popular" section on homepage
- **When false:** Product doesn't show in popular section
- **Example:** `popular: true`
- **Tip:** Only mark best sellers as popular

### recommended (Required)
- **Type:** Boolean (true or false)
- **When true:** Product shows in "We Recommend" section on homepage
- **When false:** Product doesn't show in recommendations
- **Example:** `recommended: true`
- **Tip:** Mark products you want to promote

## ✨ Complete Product Example

```javascript
{
  id: 1,
  name: 'Netflix 1 Month',
  price: 30,
  image: 'https://via.placeholder.com/250x140/e50914/ffffff?text=Netflix+1M',
  description: 'One month Netflix subscription',
  availability: 'In Stock',
  rating: 4.8,
  popular: true,
  recommended: false
}
```

## 📝 How to Add a New Product

### Step-by-Step

1. Open `script.js` in your code editor

2. Find the category you want to add to (netflix, spotify, prime, or shahid)

3. Locate the last product in that category's array

4. Add a comma after the last product's closing bracket `},`

5. Add your new product:

```javascript
{
  id: 17,  // Find the highest ID and add 1
  name: 'Your Product Name',
  price: 99,
  image: 'your-image-url',
  description: 'Your product description',
  availability: 'In Stock',
  rating: 4.8,
  popular: true,
  recommended: false
}
```

6. Save the file (Ctrl+S)

7. Refresh your browser (F5)

## 🔄 How to Edit a Product

1. Open `script.js`

2. Find the product by its ID or name

3. Change any field you want:
   - Price: `price: 35`
   - Availability: `availability: 'Out of Stock'`
   - Rating: `rating: 4.7`
   - Popular: `popular: false`
   - Etc.

4. Save file and refresh browser

## ❌ How to Delete a Product

1. Open `script.js`

2. Find the entire product object (from `{` to `},`)

3. Delete the whole thing including the comma

4. Save file and refresh browser

## 🎯 Current Products

### Netflix (IDs: 1-4)
```javascript
ID  Name                Price   Popular Recommended
1   Netflix 1 Month     30      Yes     No
2   Netflix 3 Months    85      Yes     Yes
3   Netflix 6 Months    160     Yes     Yes
4   Netflix 12 Months   300     No      Yes
```

### Spotify (IDs: 5-8)
```javascript
ID  Name                Price   Popular Recommended
5   Spotify 1 Month     12      Yes     No
6   Spotify 3 Months    32      No      Yes
7   Spotify 6 Months    60      No      Yes
8   Spotify 12 Months   110     No      No
```

### Amazon Prime (IDs: 9-12)
```javascript
ID  Name                Price   Popular Recommended
9   Prime 1 Month       45      Yes     No
10  Prime 3 Months      120     No      Yes
11  Prime 6 Months      220     No      No
12  Prime 12 Months     399     No      Yes
```

### Shahid (IDs: 13-16)
```javascript
ID  Name                Price   Popular Recommended
13  Shahid 1 Month      10      No      No
14  Shahid 3 Months     25      Yes     Yes
15  Shahid 6 Months     45      No      No
16  Shahid 12 Months    80      No      Yes
```

## 🚨 Important Rules

1. **Unique IDs Only**
   - Never use the same ID twice
   - Make ID higher than existing IDs

2. **Correct Syntax**
   - Each field must be followed by comma except the last one
   - String values must be in quotes
   - Numbers have no quotes
   - true/false in lowercase

3. **Valid Categories**
   - Only use: netflix, spotify, prime, shahid
   - Creating new categories requires code changes

4. **Price Format**
   - Numbers only, no TND symbol
   - Can be whole numbers or decimals
   - Example: `price: 29.99`

5. **Image URLs**
   - Must be valid and accessible
   - Test URLs before adding
   - Use secure HTTPS URLs when possible

## 💡 Pro Tips

### Organizing Products
- Keep products in same category near each other
- Order by duration (1M, 3M, 6M, 12M)
- Or order by popularity

### Naming Products
- Include duration in name (1 Month, 3 Months)
- Include service name (Netflix, Spotify)
- Keep consistent naming across products

### Pricing Strategy
- 1 Month: Set base price
- 3 Months: 30-40% discount
- 6 Months: 50-60% discount
- 12 Months: 60-70% discount

### Popular vs Recommended
- Popular: Your best sellers
- Recommended: New products to promote
- A product can be both
- Don't mark everything as popular

### Ratings
- 4.5-5.0: Excellent
- 4.0-4.4: Very Good
- 3.5-3.9: Good
- 3.0-3.4: Acceptable
- Below 3.0: Consider removing

## 🐛 Debugging Issues

### Product not showing
1. Check product ID is unique
2. Check image URL is valid
3. Check syntax (commas, quotes)
4. Check browser console for errors (F12)

### Wrong product displaying
1. Check you're in right category
2. Verify product details are correct
3. Check availability status

### Price not updating
1. Make sure you edited right product
2. Check syntax (price: 99)
3. Clear browser cache

### Image not loading
1. Test URL in browser
2. Check image file exists
3. Check file permissions
4. Use different image format

## 📊 Product Statistics

**Total Products:** 16
**By Category:**
- Netflix: 4 products
- Spotify: 4 products
- Amazon Prime: 4 products
- Shahid: 4 products

**Popular Products:** 6 total
**Recommended Products:** 8 total

## 🔄 Adding New Categories

To add Games, Courses, or Apps:

1. In `PRODUCTS_DATABASE`, add:
```javascript
games: [
  { /* game products */ }
],
courses: [
  { /* course products */ }
],
apps: [
  { /* app products */ }
]
```

2. Create HTML pages for categories

3. Update navigation links

4. Update JavaScript to load new categories

*See README.md for full instructions*

## ✅ Product Checklist

When adding a product, verify:
- [ ] ID is unique
- [ ] Name is correct and concise
- [ ] Price is accurate in TND
- [ ] Image URL works
- [ ] Description is helpful
- [ ] Availability is correct
- [ ] Rating is between 0-5
- [ ] Popular flag is set
- [ ] Recommended flag is set
- [ ] Comma after object (if not last)
- [ ] No syntax errors

---

**Need help? Check QUICK_START.md for examples!**
