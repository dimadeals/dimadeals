# QUICK START GUIDE - MANAGING YOUR PRODUCTS

## 🚀 5 MINUTE SETUP

### Step 1: View Your Website
1. Open `index.html` in your browser
2. You should see the homepage with all sections

### Step 2: Understand the Product System
All products are stored in `script.js` in one place called `PRODUCTS_DATABASE`. This makes it EASY to:
- ✅ Add new products
- ✅ Edit existing products  
- ✅ Remove old products
- ✅ Mark products as popular/recommended

## 📝 ADDING A NEW NETFLIX PRODUCT

**File to edit:** `script.js`

1. Open `script.js` in your editor
2. Find this line (around line 3):
```javascript
const PRODUCTS_DATABASE = {
  netflix: [
```

3. Find the Netflix section and add your product before the closing bracket `]`:
```javascript
    { 
      id: 5,
      name: 'Netflix 2 Months', 
      price: 60, 
      image: 'https://via.placeholder.com/250x140/e50914/ffffff?text=Netflix+2M', 
      description: 'Two months Netflix subscription', 
      availability: 'In Stock', 
      rating: 4.9, 
      popular: true, 
      recommended: true 
    },
```

4. **Save the file** (Ctrl+S)
5. **Refresh your browser** (F5)
6. Your new product appears!

## 🔄 EDITING A PRODUCT

**Example:** Change Netflix 1 Month price from 30 to 35 TND

1. Open `script.js`
2. Find this product:
```javascript
{ id: 1, name: 'Netflix 1 Month', price: 30, ...
```

3. Change `price: 30` to `price: 35`
4. Save and refresh browser

## ❌ REMOVING A PRODUCT

1. Open `script.js`
2. Find the product you want to delete
3. Delete the entire object (from `{` to `},`)
4. Save and refresh

## 🎯 MAKE PRODUCT POPULAR

To add a product to the "Most Popular" section on homepage:

Change this: `popular: false`
To this: `popular: true`

## 💫 MAKE PRODUCT RECOMMENDED

To add a product to the "We Recommend" section on homepage:

Change this: `recommended: false`
To this: `recommended: true`

## 📸 USING YOUR OWN IMAGES

Instead of placeholder images:

1. Create an `images` folder in your website folder
2. Add your image files there (e.g., `netflix1month.jpg`)
3. In the product, change image URL:
```javascript
// From:
image: 'https://via.placeholder.com/250x140/e50914/ffffff?text=Netflix'

// To:
image: 'images/netflix1month.jpg'
```

## 🎨 QUICK CUSTOMIZATIONS

### Change Your Business Name
Find "DIMA Deals" in these files and replace with your name:
- `index.html` - in header and footer
- `product.html` - in header and footer
- All `subscriptions-*.html` files

### Change Colors
In `style.css`, find `:root` section at the top and change:
- `--primary: #ff006e;` (main pink color)
- `--secondary: #08d9d6;` (cyan color)
- `--accent: #ffd60a;` (yellow color)

### Change Social Links
In footer sections, update social media links with your accounts

## 📋 PRODUCT FIELDS EXPLAINED

When adding a product, here's what each field means:

| Field | What it is | Example |
|-------|-----------|---------|
| id | Unique number for product | 1 |
| name | Product name | "Netflix 1 Month" |
| price | Price in TND | 30 |
| image | Picture URL | "https://via.placeholder.com/..." |
| description | One-line description | "One month of Netflix streaming" |
| availability | Stock status | "In Stock" |
| rating | Rating 0-5 | 4.8 |
| popular | Show in Popular section? | true or false |
| recommended | Show in Recommended? | true or false |

## ⚡ COMMON TASKS

### Add a New Spotify Product
1. Open `script.js`
2. Find `spotify: [` section
3. Add your product with unique ID
4. Save and refresh

### Add a Product to Multiple Sections
Use `popular: true` AND `recommended: true` to show in both sections

### Remove All Popular Marks
Change all `popular: true` to `popular: false` in Netflix section

### Update Product Price
Find the product, change the `price` number

## ✅ CHECKLIST BEFORE GOING LIVE

- [ ] Updated company name everywhere
- [ ] Changed colors to match brand
- [ ] Added real images (not placeholder)
- [ ] Set correct prices
- [ ] Removed dummy products
- [ ] Updated social media links
- [ ] Tested on mobile phone
- [ ] Tested all links work
- [ ] Set up payment gateway

## 🆘 QUICK TROUBLESHOOTING

**Products not showing?**
- Check browser console (F12) for errors
- Make sure product ID is unique
- Verify image URLs work

**Price not updating?**
- Make sure you changed the right product (check name)
- Refresh page after saving (F5)

**New product not appearing?**
- Check you added it to correct category (netflix/spotify/etc)
- Make sure you added comma after previous product
- Save file and refresh browser

## 📚 NEED MORE HELP?

Check `README.md` for detailed instructions on:
- File structure
- Navigation setup
- Advanced customization
- Future features to add

---

**That's it! You now know everything you need to manage your website.** 🎉
