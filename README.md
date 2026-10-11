# Muthoy Bazar

সাধ্যের মধ্যে স্বস্তির বাজার — Affordable and comfortable shopping.

A grocery e-commerce site for Bangladesh built with the MERN stack
(MongoDB, Express, React + Vite + Tailwind, Node).

## What is included

**Storefront**
- Home page with banners, featured categories, top selling, offer zone, new arrivals, brands and "Load more"
- Shop page with category, brand, offer/new/best filters, search and sorting
- Product page, cart drawer with "You may also like", one-page checkout
  (delivery charge worked out automatically: 80 BDT when the city or address says Dhaka, 150 BDT elsewhere; Cash on delivery, bKash, Nagad, coupon codes)
- Order tracking by order ID, optional customer login and registration, forgot password
- Bangla / English toggle, chat widget (Messenger, WhatsApp, call), footer with map and policy pop-ups

**Admin** (`/admin`, login required)
- Dashboard: revenue, orders, pending, low stock, 7-day chart, recent orders
- Product: add, edit, delete, upload pictures, stock, discount prices, flags
- Sales: search and filter orders, order details, change status (stock is restored on cancel)
- Stock Management: quick stock adjustment, lowest stock first
- Customer: order history summary and CSV export of phone numbers
- Coupons: percentage or fixed, minimum cart, expiry
- Roles: super_admin, admin, inventory_manager, delivery_operator
- Expenses: income and expense entries with date, type and category filters, summary cards, edit and delete
- Landing Page: build pages for ad campaigns (banner URL, headline, sections, button, highlighted products). Published pages open at `/lp/<address>`
- Staff Management: add staff, choose a role (Admin, Manager, Staff), toggle which modules each person can open, enable or disable accounts
- Report: sales vs expenses, monthly trend and top products charts (Recharts)
- Fraud Checker and IP Block: look up a phone number or IP address, see its order history and risk level, and blacklist it. Blocked phones and IPs cannot place orders, register or send messages
- Menu Builder: drag to reorder, edit, hide and add header and footer links. The storefront uses them once the menu has items
- Notifications: alerts for new orders, low stock and customer messages with read and unread state, and unread badges in the sidebar
- Support Mailbox and Contact Form Queries: messages from the website contact form, with reply (sent by SMS when the customer left a phone number)
- Configurations: store name, currency, tax rate, phone, WhatsApp, email and address
- Server Stats: database connection, uptime, memory and record counts
- Still placeholders ("not built yet"): Website, Image rules, Activity Log, Pixel Stats, Meta Catalog
- Roles: super_admin, admin (shown as Admin), inventory_manager (shown as Manager), delivery_operator (shown as Staff)

**Server**
- REST API with JWT login, role checks, rate limiting on auth routes, helmet and CORS
- Atomic stock deduction, server-side price calculation, phone validation, repeat-cancel "Risky" flag on orders
- SMS helper (Greenweb). Without `SMS_TOKEN`, messages are printed in the server console

## Run it locally

You need Node.js 18 or newer and MongoDB (local or Atlas).

```bash
# 1. Server
cd server
cp .env.example .env        # then edit MONGO_URI, JWT_SECRET and the admin password
npm install
npm run seed                # adds 41 categories, 105 products and the admin account
npm run dev                 # http://localhost:5000

# 2. Client (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```

Admin login: the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `server/.env`
(default `admin@muthoybazar.com` / `ChangeMe123`). Change the password before going live.

`npm run seed -- --fresh` wipes categories and products and loads the catalog again.

## Product pictures

- Put your own photos in `client/public/products/` named after the product, for example
  `client/public/products/premium-miniket-rice.jpg` (lowercase, spaces become dashes).
- Or upload pictures in Admin > Product. Uploads are saved in `server/uploads/`.
- Until a picture exists, the product card shows an emoji for its category.

## Going live

- Set `VITE_API_URL` in `client/.env` to your API address (for example `https://api.example.com/api`) and run `npm run build`.
- Product pictures uploaded in admin use the path `/uploads/...`. Serve the API from the same domain (reverse proxy) or change the image paths to your API domain.
- If the API runs behind a reverse proxy, set `TRUST_PROXY=1` in `server/.env`, otherwise IP blocking sees the proxy address instead of the visitor.
- Set `CLIENT_URL` in `server/.env` to your site address, use a long random `JWT_SECRET`, and set `NODE_ENV=production`
  (this also hides the development reset code on the forgot-password page).
- Password reset codes for email accounts are printed in the server console. Connect an email service in
  `server/src/controllers/authController.js` to send them. Phone accounts receive the code by SMS.

## Not built yet

Courier integration (Steadfast, Pathao, RedX), Facebook Pixel and Conversion API, the landing page builder,
thermal invoice PDF and bulk import/export of products.
