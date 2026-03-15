# Deployment Checklist

## Pre-Deployment

- [ ] All files are pushed to GitHub
- [ ] `package.json` has correct version
- [ ] `.env.example` contains all necessary variables
- [ ] `.gitignore` includes `.env` and `node_modules/`
- [ ] CSS file is complete and linked in all HTML files
- [ ] JavaScript file is linked in all HTML files
- [ ] All image paths are relative (not absolute)

## Vercel Deployment

- [ ] Create Vercel account at https://vercel.com
- [ ] Connect GitHub repository
- [ ] Project name is set correctly
- [ ] Framework detection shows "Other"
- [ ] Build command is empty (static site)
- [ ] Output directory is root

## Environment Variables (Vercel Dashboard)

- [ ] Click "Environment Variables" in project settings
- [ ] Create new Vercel KV database
- [ ] Add `VERCEL_KV_URL`
- [ ] Add `VERCEL_KV_REST_API_URL`
- [ ] Add `VERCEL_KV_REST_API_TOKEN`
- [ ] Optional: Add for email notifications
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASSWORD`

## API Verification

- [ ] Test `/api/health` endpoint responds with 200
- [ ] Test `/api/checkout` with POST request
- [ ] Verify orders are saved in Vercel KV
- [ ] Check Function logs in Vercel dashboard

## Frontend Testing

- [ ] Homepage loads and displays correctly
- [ ] Products display in all pages
- [ ] Search functionality works
- [ ] Language selector works (EN/FR/AR)
- [ ] Dark mode toggle works
- [ ] Cart icon shows correct count

## Cart & Checkout Testing

- [ ] Add product to cart from product page
- [ ] Cart page displays items correctly
- [ ] Can update quantities
- [ ] Can remove items
- [ ] Cart total calculates correctly
- [ ] Can clear cart

## Checkout Form Testing

- [ ] Email field validates format
- [ ] Phone field validates (8 digits)
- [ ] Name field requires minimum 3 characters
- [ ] Country dropdown works
- [ ] Terms checkbox is required
- [ ] Form submits successfully
- [ ] Order ID is generated
- [ ] Redirects to confirmation page

## Order Confirmation

- [ ] Confirmation page shows all order details
- [ ] Customer email is displayed
- [ ] Phone number is formatted correctly
- [ ] Order items are listed
- [ ] Total amount is shown
- [ ] Next steps are clearly communicated

## Database Verification

- [ ] Orders are saved in Vercel KV
- [ ] Customer records are created
- [ ] Previous orders list is maintained
- [ ] Data expires after 90 days

## Security Checks

- [ ] No sensitive data in console logs
- [ ] No API keys exposed in frontend code
- [ ] CORS headers are correct
- [ ] Input validation works on both sides
- [ ] No SQL injection vulnerable (KV is NoSQL)
- [ ] HTTPS enforced (automatic on Vercel)

## Performance Checks

- [ ] Pages load in < 2 seconds
- [ ] API responds in < 500ms
- [ ] Lighthouse score > 90
- [ ] Mobile friendly
- [ ] Images are optimized

## Mobile Testing

- [ ] Test on iPhone
- [ ] Test on Android
- [ ] Test on tablet
- [ ] Navigation works on mobile
- [ ] Forms are accessible
- [ ] No horizontal scrolling

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

## Production URLs

- [ ] Homepage: https://your-domain.com
- [ ] Products: https://your-domain.com/browse.html
- [ ] Cart: https://your-domain.com/cart.html
- [ ] Checkout: https://your-domain.com/checkout.html
- [ ] Confirmation: https://your-domain.com/confirmation.html
- [ ] API: https://your-domain.com/api/checkout

## Post-Deployment

- [ ] Monitor Vercel analytics
- [ ] Check Function invocations
- [ ] Review error logs daily
- [ ] Test checkout weekly
- [ ] Backup database queries
- [ ] Update documentation

## Optional Enhancements

- [ ] Set up email notifications
- [ ] Configure payment gateway
- [ ] Add order admin dashboard
- [ ] Set up SMS notifications
- [ ] Add analytics tracking
- [ ] Configure CDN
- [ ] Set up error tracking (Sentry)
- [ ] Add monitoring alerts

## Rollback Plan

- [ ] Keep previous deployment link
- [ ] Document deployment timestamp
- [ ] Have backup of `.env` variables
- [ ] Can quickly redeploy to older version
- [ ] Document any database changes

---

**Deployment Status:** [ ] Ready | [ ] In Progress | [ ] Complete

**Date Deployed:** _______________

**Deployed By:** _______________

**Issues Found:** _______________
