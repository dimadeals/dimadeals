# DIMA Deals - Digital Subscriptions Website

A modern, professional e-commerce website for selling digital subscriptions including Netflix, Spotify, Amazon Prime, Shahid, games, courses, and apps in Tunisia.

## 📁 File Structure

```
├── index.html                 # Main homepage
├── product.html               # Product detail page (dynamic)
├── subscriptions-netflix.html # Netflix subscriptions catalog
├── subscriptions-spotify.html # Spotify subscriptions catalog
├── subscriptions-prime.html   # Amazon Prime subscriptions catalog
├── subscriptions-shahid.html  # Shahid subscriptions catalog
├── style.css                  # Modern responsive styling
├── script.js                  # JavaScript with product management
└── README.md                  # This file
```

## 🎨 Features

- ✨ **Modern Design**: Gradient backgrounds, smooth animations, hover effects
- 📱 **Fully Responsive**: Works on desktop, tablet, and mobile devices
- 🎯 **Easy Product Management**: Centralized product database in JavaScript
- 🔍 **Product Galleries**: Interactive image galleries on product detail pages
- 🎭 **Dropdown Menus**: Smooth navigation with category dropdowns
- 💫 **Smooth Animations**: Subtle transitions and animations throughout
- 🌙 **Dark/Light Sections**: Professional section separation
- 📊 **Product Grid Layouts**: Responsive grid system that adapts to screen size

## 🛠 How to Edit/Add/Remove Products

### Product Database Location

All products are managed in `script.js` at the beginning of the file. Find the `PRODUCTS_DATABASE` object:

```javascript
const PRODUCTS_DATABASE = {
  netflix: [
    { id: 1, name: 'Netflix 1 Month', price: 30, image: '...', description: '...', availability: 'In Stock', rating: 4.8, popular: true, recommended: false },
    // More products...
  ],
  spotify: [...],
  prime: [...],
  shahid: [...]
};
```

### Adding a New Product

1. Open `script.js`
2. Find the `PRODUCTS_DATABASE` object
3. Choose the category (netflix, spotify, prime, or shahid)
4. Add a new product object to that array:

```javascript
{
  id: 17,  // Must be unique
  name: 'Product Name',
  price: 99,  // Price in TND
  image: 'https://via.placeholder.com/250x140/color/ffffff?text=ProductName',
  description: 'Short description of the product',
  availability: 'In Stock',  // or 'Out of Stock', etc.
  rating: 4.8,  // Out of 5
  popular: true,  // Will show in "Most Popular" section
  recommended: false  // Will show in "We Recommend" section
}
```

### Editing an Existing Product

1. Open `script.js`
2. Find the product by its `id` in the `PRODUCTS_DATABASE`
3. Edit the properties you want to change:
   - `name`: Product name
   - `price`: Price in TND
   - `image`: Image URL
   - `description`: Product description
   - `availability`: Stock status
   - `rating`: Rating out of 5
   - `popular`: true/false for "Most Popular" section
   - `recommended`: true/false for "We Recommend" section

### Removing a Product

1. Open `script.js`
2. Find the product in the `PRODUCTS_DATABASE`
3. Delete the entire object from the array

## 📸 Using Custom Images

Instead of placeholder images, you can use your own images:

1. **Option 1 - Local Files**: 
   - Place image files in your website folder
   - Use relative paths: `image: 'images/netflix-1month.jpg'`

2. **Option 2 - External URLs**:
   - Use direct URLs from image hosting services
   - Keep the current placeholder format or replace with real URLs

3. **Recommended Image Sizes**:
   - Product cards: 250px wide × 140px tall
   - Product detail page: 400px wide × 250px tall
   - Use PNG or JPG format

## 🎯 Main Sections Explained

### Homepage (index.html)

- **Hero Section**: Large welcome banner with CTA button
- **Popular Platforms**: Quick links to Netflix, Spotify, Amazon Prime, Shahid
- **Most Popular**: Displays products with `popular: true`
- **We Recommend**: Displays products with `recommended: true`
- **Features Section**: Highlights your business benefits

### Product Detail Page (product.html)

- Shows full product information
- Interactive image gallery with thumbnails
- Buy button (currently shows alert - integrate with payment later)
- Related products section

### Subscription Pages

- `subscriptions-netflix.html` - All Netflix products
- `subscriptions-spotify.html` - All Spotify products
- `subscriptions-prime.html` - All Amazon Prime products
- `subscriptions-shahid.html` - All Shahid products

All automatically populated from the `PRODUCTS_DATABASE`

## 🔗 Navigation Structure

```
Home
├── Subscriptions
│   ├── Netflix → subscriptions-netflix.html
│   ├── Spotify → subscriptions-spotify.html
│   ├── Amazon Prime → subscriptions-prime.html
│   └── Shahid → subscriptions-shahid.html
├── Games
│   ├── PC Games → games.html?type=pc
│   ├── Console Games → games.html?type=console
│   └── Mobile Games → games.html?type=mobile
├── Courses
│   ├── Programming → courses.html?type=programming
│   ├── Design → courses.html?type=design
│   ├── Marketing → courses.html?type=marketing
│   └── Business → courses.html?type=business
└── Apps
    ├── Mobile Apps → apps.html?type=mobile
    ├── Software → apps.html?type=software
    └── Productivity → apps.html?type=productivity
```

## 🎨 Customization Guide

### Colors

Edit the CSS variables at the top of `style.css`:

```css
:root {
  --primary: #ff006e;           /* Main color (pink)*/
  --primary-dark: #c71c5e;      /* Dark variant */
  --secondary: #08d9d6;         /* Secondary color (cyan) */
  --accent: #ffd60a;            /* Accent color (yellow) */
  --dark: #111111;              /* Dark text */
  --light: #f8f9fa;             /* Light background */
  --gray: #6c757d;              /* Gray text */
  --white: #ffffff;             /* White */
}
```

### Company Name

1. In all HTML files: Replace "DIMA Deals" with your business name
2. Update the logo text in the header
3. Update footer information

### Contact Information

In the footer sections of each HTML file, add:
- Phone number
- Email address
- Social media links
- Business address

## 📱 Mobile Responsive

The website is fully responsive with breakpoints at:
- Desktop: 1400px and up
- Tablet: 768px
- Mobile: 480px and below

Mobile menu toggle is available for small screens.

## 🔧 Future Enhancements (To Add Later)

1. **Payment Integration**: Connect Stripe, Fonoopay, or other payment gateway
2. **Database**: Replace JavaScript arrays with a backend database
3. **Admin Panel**: Create dashboard to manage products without coding
4. **User Accounts**: Add user registration and purchase history
5. **Email Delivery**: Automated email system for subscription codes
6. **Analytics**: Track sales and visitor data
7. **Reviews/Ratings**: Let customers leave reviews
8. **Search Functionality**: Add product search bar
9. **Wishlist**: Let users save favorites
10. **Multi-language**: Fully implement AR/FR languages

## 📄 Product Object Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| id | Number | Unique identifier | 1 |
| name | String | Product name | "Netflix 1 Month" |
| price | Number | Price in TND | 30 |
| image | String | Image URL | "https://..." |
| description | String | Short description | "One month of Netflix" |
| availability | String | Stock status | "In Stock" |
| rating | Number | Rating out of 5 | 4.8 |
| popular | Boolean | Show in popular section | true |
| recommended | Boolean | Show in recommendations | false |

## 💡 Tips & Best Practices

1. **Keep Product IDs Unique**: Never use the same ID for different products
2. **Update Images**: Replace placeholder images with real product images
3. **Consistent Pricing**: Keep prices in TND and round to reasonable amounts
4. **Descriptions**: Keep descriptions short (one line) on cards, detailed on product page
5. **Popular & Recommended**: Don't mark everything as popular - choose best sellers
6. **Test on Mobile**: Always test changes on mobile devices before going live

## 🐛 Troubleshooting

### Products not showing
- Check browser console for JavaScript errors
- Verify product IDs are unique
- Ensure images URLs are correct and accessible

### Navigation not working
- Check file names match exactly (case-sensitive on servers)
- Verify all HTML files are in the same folder

### Dropdown menus not appearing
- Make sure JavaScript is enabled
- Check for CSS conflicts

### Page looks broken on mobile
- Clear browser cache
- Check that style.css loaded correctly
- Test in incognito/private mode

## 📞 Support

For questions on how to modify products or customize the website:
1. Review this README carefully
2. Check the code comments in script.js and style.css
3. Look for the PRODUCTS_DATABASE section in script.js

## 📄 License

This website template is ready to use for your business. Feel free to modify and customize as needed.

---

**Happy selling! 🚀**
