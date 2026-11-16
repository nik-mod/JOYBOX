# JOYBOX — MASTER DEVELOPMENT BRIEF
**Version:** 2.0 — Final Development Specification  
**Project:** JOYBOX — Kids Mystery Box E-Commerce Platform  
**Market:** Georgia  
**Primary Language:** Georgian  
**Currency:** GEL (₾)  
**Platform:** Full-Stack E-Commerce Website  
**Development:** Codex  
**Design Direction:** Premium, Realistic, Playful, Cinematic  
**Status:** Ready for Development Planning

---

# 1. PROJECT OVERVIEW

JOYBOX is a Georgian children's mystery box brand offering surprise packages filled with toys, puzzles, games, collectibles, and creative items.

Customers purchase mystery boxes without knowing their exact contents. The surprise, anticipation, and unboxing experience are central to the brand.

The goal is to build a complete, visually distinctive, modern e-commerce website that allows customers to discover and purchase JOYBOX products while giving the business owner full control over products, orders, inventory, and store operations.

The website must combine:

- Premium visual design.
- Realistic product presentation.
- Cinematic animations.
- Interactive elements.
- Fast and intuitive shopping.
- Secure card payments.
- Reliable order management.
- Professional administration tools.
- Excellent mobile performance.

**This is a real commercial platform, not a demonstration website or static landing-page concept.**

The final product should feel like a premium, professionally designed digital experience created by an experienced creative development agency.

## Target Audience

The primary target audience consists of:

- Parents purchasing gifts for children.
- Family members purchasing birthday or holiday presents.
- People looking for unusual children's gifts.
- Customers attracted to mystery boxes and surprise experiences.

Children are the primary gift recipients, but the purchasing experience should be designed around adults.

## Brand Positioning

JOYBOX should communicate:

- Excitement.
- Surprise.
- Joy.
- Discovery.
- Trust.
- Quality.
- Playfulness.

The visual experience must appeal to children while remaining trustworthy and easy to understand for parents.

---

# 2. MAIN TECHNOLOGY STACK

## Frontend

- Next.js (App Router)
- React
- TypeScript (strict mode)
- Tailwind CSS
- Reusable component-based architecture

## Animation and Interaction

- GSAP
- GSAP ScrollTrigger
- Lenis for smooth scrolling where beneficial
- Three.js
- React Three Fiber when genuine interactive 3D is required

Use these technologies selectively. Do not introduce unnecessary dependencies or animation libraries.

## Backend and Database

- Supabase
- PostgreSQL
- Supabase Storage for product media
- Server-side application services
- Secure database access and authorization

Supabase Auth will be used **only for administrators**, not for customers.

## Payment System

Integrate an appropriate Georgian bank or payment service provider.

Requirements:

- GEL payments.
- Secure hosted or provider-controlled card entry.
- Server-side payment verification.
- Verified payment webhooks.
- Payment success and failure handling.
- Secure order processing.

The final provider will be chosen according to available merchant credentials, API support, and business eligibility.

Do not fabricate an integration or simulate successful production payments.

## Hosting

- Vercel-compatible Next.js deployment.
- Supabase-hosted database and storage.
- Environment-based configuration.
- Production logging and monitoring.

The exact package versions must be checked for compatibility before implementation.

---

# 3. PLATFORM STRUCTURE

## Public Website

The website must contain:

1. Homepage
2. Shop / Product Catalog
3. Product Detail Pages
4. How It Works
5. About JOYBOX
6. Shopping Cart
7. Guest Checkout
8. Order Confirmation
9. Contact
10. FAQ
11. Delivery Information
12. Return & Refund Policy
13. Privacy Policy
14. Terms & Conditions

## Admin Platform

A private administration interface containing:

1. Secure Admin Login
2. Dashboard Overview
3. Product Management
4. Order Management
5. Inventory Management
6. Customer Order Information
7. Store Settings
8. Basic Sales Analytics

## Authentication Decision — IMPORTANT

**Customer registration and login must NOT be implemented.**

Customers should be able to purchase without creating an account.

Do not build:

- Customer registration.
- Customer login.
- Customer profile pages.
- Customer account dashboards.
- Customer password management.
- Wishlist features requiring an account.

The public header must not contain an unnecessary user-account icon.

Only administrators require authentication.

---

# 4. CORE FEATURES

## 4.1 Homepage — Cinematic Landing Experience

The homepage is the most important visual component of JOYBOX.

### Mandatory Design Reference

Use the **FIRST realistic Mystery Club landing-page screenshot provided by the project owner** as the primary design reference.

This is the screenshot featuring:

- Dark-blue bedroom environment.
- Large realistic cardboard mystery box.
- Teddy bear inside the box.
- Toys placed naturally around the scene.
- Warm lighting.
- Large headline on the left.
- Bright yellow shopping button.
- Rounded cream-colored How It Works section.

The SECOND fantasy-style screenshot is a secondary reference for playful motion ideas only.

**The first design must remain the primary visual direction.**

Do not replace it with a fantasy landscape, generic gradient, floating product carousel, or unrelated concept.

### Header

Create a clean, premium navigation system.

Include:

- JOYBOX logo.
- მთავარი
- ყუთები
- როგორ მუშაობს?
- ჩვენ შესახებ
- Cart icon with item count.

Search can be added if product volume makes it useful.

Do not include a customer login icon.

### Header Behavior

- Transparent or visually integrated at the top of the hero.
- Sticky positioning when scrolling.
- Smooth, restrained transitions.
- Accessible mobile navigation.
- Functional cart counter.
- Clear active navigation states.

### Hero Section

Use a premium photographic or photorealistic composition.

**Left side:**

- Large Georgian headline.
- Short supporting description.
- Primary shopping button.
- Optional subtle handwritten-style detail.

**Right side:**

- A realistic cardboard JOYBOX.
- Open lid.
- Warm light from inside.
- Carefully arranged toys.
- Realistic shadows and textures.
- Natural environmental lighting.

The box should appear physically real rather than like an exaggerated cartoon or plastic 3D object.

### Hero Environment

The environment should resemble a warm, premium children's room.

Visual details may include:

- Deep navy walls.
- Soft carpeting.
- Warm practical lighting.
- Tasteful shelves.
- Natural decorative elements.
- Carefully selected toys.

Avoid unnecessary objects and distracting decorations.

The mystery box must remain the focal point.

### Primary CTA

Use a prominent yellow button.

Suggested Georgian label:

**ყუთების დათვალიერება**

The button must navigate to the actual product catalog.

### Hero Animation

Develop a carefully choreographed sequence:

1. Background becomes visible.
2. Headline enters naturally.
3. Supporting text reveals.
4. Mystery box gains subtle visual emphasis.
5. CTA appears.
6. Small environmental elements respond subtly.

Animation must feel cinematic and deliberate, not exaggerated.

---

## 4.2 How It Works

Immediately below the hero, create a large, cream-colored section with a softly curved upper edge.

This section should visually follow the approved reference.

### Three Steps

**Step 1 — აირჩიე ყუთი**

Customers browse and select a mystery box.

**Step 2 — შეუკვეთე**

Customers provide delivery information and complete payment.

**Step 3 — გახსენი სიურპრიზი!**

The mystery box is delivered and ready to open.

### Visual Requirements

- Three horizontally arranged steps on desktop.
- Custom illustrations or professionally designed icons.
- Subtle animations.
- Clear progression between steps.
- Excellent mobile adaptation.
- Readable Georgian typography.

Keep the design clean and visually consistent with the hero.

---

## 4.3 Featured Products

Create a premium product showcase section.

Initial products:

- Mini Mystery Box
- Classic Mystery Box
- Mega Mystery Box

These names are working categories.

Product prices, sizes, and contents must be controlled through the administration panel rather than hardcoded.

Each product should display:

- Image.
- Name.
- Price.
- Age recommendation.
- Short description.
- Availability.
- Shopping CTA.

Avoid repetitive generic cards.

Use thoughtful spacing, varied composition, and polished interactions.

---

## 4.4 Product Catalog

Build a complete, functional catalog page.

Features:

- Dynamic product data.
- Responsive product grid.
- Filtering where relevant.
- Price sorting.
- Availability status.
- Product detail navigation.
- Add-to-cart functionality.
- Empty states.
- Loading states.

Do not display fake product ratings, reviews, stock counts, or discounts.

---

## 4.5 Product Detail Pages

Every mystery box must have a dedicated product page.

Required elements:

- High-quality product gallery.
- Product name.
- Price in GEL.
- Recommended age.
- Description.
- Possible content categories.
- Box dimensions when confirmed.
- Safety information.
- Availability.
- Quantity controls.
- Add to Cart.
- Delivery details.
- Relevant return information.

The precise contents can remain secret, but customers must understand the general product category and important characteristics.

### Product Interaction

Use polished transitions and responsive interactions.

Avoid excessive movement that interferes with viewing products.

---

## 4.6 Shopping Cart

Implement a fully functional cart.

Required features:

- Add products.
- Remove products.
- Update quantities.
- Show product images and prices.
- Calculate subtotal.
- Calculate applicable delivery charges.
- Calculate final total.
- Proceed to checkout.
- Persist cart contents between visits where appropriate.

Provide a polished cart drawer and/or dedicated cart page.

All totals and product availability must be validated on the backend.

---

# 5. GUEST CHECKOUT & PAYMENT SYSTEM

## Critical Business Decision

**JOYBOX must use guest-only checkout.**

Customer registration and authentication are unnecessary.

The purchasing experience should be extremely simple and fast.

## Customer Purchase Flow

1. Customer chooses a mystery box.
2. Customer adds it to the cart.
3. Customer opens checkout.
4. Customer enters delivery information.
5. Customer selects card payment.
6. The payment provider securely processes the payment.
7. Payment result is verified server-side.
8. Order is confirmed.
9. Customer receives an order confirmation.
10. The order appears in the Admin Dashboard.

## Checkout Form

Required information:

- Full name.
- Mobile phone number.
- City or delivery area.
- Full delivery address.

Optional:

- Additional delivery instructions.
- Email address, unless required by the payment provider.

The customer must see the full payable amount before payment.

## Card Payment

Card details must be handled by the selected payment provider.

Do not collect or store raw card numbers, CVV codes, or other sensitive card credentials in the JOYBOX application.

Use secure provider-controlled payment fields or hosted checkout.

### Payment States

Support:

- Pending.
- Processing.
- Paid.
- Failed.
- Cancelled.
- Refunded, when supported.

Payment status and shipping status must be managed separately.

Never mark an order as paid only because the customer returns to a success URL.

Verify payment results on the backend.

## Order Confirmation

After a successful verified payment, display:

- Confirmation message.
- Unique order number.
- Purchased products.
- Amount paid.
- Delivery address summary.
- Current order status.

Order confirmation notifications should be sent through an approved messaging provider when configured.

Do not claim an SMS or email was sent unless delivery was actually initiated.

## No Customer Accounts

Do not require:

- Registration.
- Password creation.
- Email verification.
- Customer dashboard.
- Login before checkout.

Customers must be able to complete the entire process as guests.

---

# 6. ADMIN DASHBOARD

Build a secure, professional administration dashboard.

The administration interface may have a cleaner, more functional visual style than the public storefront, while retaining JOYBOX branding.

## Admin Authentication

Only authorized administrators may access the dashboard.

Use secure Supabase authentication and server-side role verification.

Protect all administrative routes and operations.

## 6.1 Dashboard Overview

Display:

- Total orders.
- Confirmed revenue.
- Pending orders.
- Orders being prepared.
- Completed deliveries.
- Low-stock products.
- Recent purchases.

Use real database records.

Include useful sales charts where appropriate.

## 6.2 Product Management

Administrators must be able to:

- Add products.
- Edit products.
- Delete or archive products.
- Upload images.
- Set prices.
- Edit descriptions.
- Configure age recommendations.
- Set stock quantities.
- Publish or unpublish products.

Changes must appear on the storefront.

## 6.3 Order Management

Administrators must be able to:

- View incoming orders.
- Inspect order details.
- View customer name and phone number.
- View delivery address.
- Review payment status.
- Update fulfillment status.
- Search orders.
- Filter orders.
- Review previous orders.
- Record cancellations and refunds where supported.

### Order Statuses

- Pending
- Confirmed
- Preparing
- Shipped
- Delivered
- Cancelled

Order states must follow valid transitions.

A cancelled order must not be accidentally treated as a completed sale.

## 6.4 Inventory Management

Track:

- Available stock.
- Reserved stock.
- Sold quantities.
- Low-stock warnings.
- Inventory adjustments.

Prevent customers from purchasing more units than are available.

For the initial launch, stock can be tracked at the finished-box product level.

Component-level toy inventory can be introduced later if operationally necessary.

## 6.5 Customer Information

Store only customer information needed to process and fulfill orders.

The admin should be able to view order contact details but must not have access to customer payment-card credentials.

## 6.6 Store Settings

Allow authorized administrators to configure appropriate business settings, including:

- Delivery areas.
- Delivery prices.
- Basic store contact information.
- Product availability.
- Relevant checkout configuration.

Secrets and provider credentials must remain in secure server-side configuration.

---

# 7. DATABASE & BACKEND ARCHITECTURE

Build a reliable backend with clearly separated data models and services.

## Core Database Entities

- Admin users and roles.
- Products.
- Product images.
- Product inventory.
- Inventory adjustments.
- Guest carts.
- Cart items.
- Orders.
- Order items.
- Delivery addresses.
- Payment records.
- Payment events.
- Shipment records.
- Store settings.
- Admin audit logs.

## Database Requirements

- Proper relationships.
- Foreign keys.
- Database constraints.
- Appropriate indexes.
- Secure access policies.
- Transaction-safe inventory operations.
- Database migrations.
- Order history preservation.

Prices should be stored in integer minor currency units where appropriate to avoid floating-point calculation errors.

## Order Creation

The backend must:

1. Validate product availability.
2. Validate prices.
3. Calculate shipping.
4. Calculate the final total.
5. Create an order.
6. Reserve inventory safely.
7. Initiate payment.
8. Verify the payment result.
9. Confirm or release inventory as appropriate.
10. Update the order state.

Use transactions and idempotent operations to prevent duplicate orders, repeated payments, or overselling.

Handle payment failures and abandoned checkouts.

---

# 8. DELIVERY SYSTEM

JOYBOX will initially serve customers in Georgia.

Build configurable delivery logic.

## Required Features

- Customer delivery address.
- City selection.
- Configurable delivery rates.
- Order fulfillment status.
- Delivery information visible to administrators.
- Optional shipment notes.
- Customer-facing delivery policy.

Do not hardcode unsupported shipping promises.

The exact courier company and integration will be determined later.

### Initial Approach

Use administrator-managed delivery fulfillment unless an actual courier API is selected.

A customer must be able to place an order even if courier automation has not been implemented, provided the supported delivery zones and fulfillment process are configured.

---

# 9. SECURITY & RELIABILITY

Security must be treated as a core requirement.

## Security

- Supabase Row Level Security.
- Secure administrator authentication.
- Role-based access controls.
- Server-side input validation.
- Protected API endpoints.
- Secure payment verification.
- Webhook signature validation.
- Rate limiting on sensitive endpoints.
- No exposed service-role keys.
- No plaintext secrets in source code.
- Protection against unauthorized data access.
- Secure product-media uploads.

## Reliability

- Transaction-safe order creation.
- Duplicate webhook protection.
- Inventory consistency.
- Error handling.
- Logging and monitoring.
- Appropriate retry behavior.
- Database migration management.
- Backup and recovery planning.

## Privacy

Collect only information necessary for order processing.

Do not create unnecessary customer profiles or collect personal information directly from children.

Protect phone numbers, addresses, and order information.

## Legal Readiness

Before launch, provide reviewed versions of:

- Terms & Conditions.
- Privacy Policy.
- Return & Refund Policy.
- Delivery Policy.
- Product safety information.

These documents must reflect actual Georgian business operations and applicable requirements.

Do not invent legal guarantees or certifications.

---

# 10. DESIGN DIRECTION — MOST IMPORTANT

## Visual Fidelity Requirement

The approved FIRST realistic Mystery Club screenshot is the primary reference.

Codex must treat it as the foundation of the visual design.

Preserve its:

- Overall composition.
- Color atmosphere.
- Product realism.
- Warm lighting.
- Typography scale.
- Header simplicity.
- CTA prominence.
- Hero proportions.
- Curved transition to the next section.

Replace Mystery Club with JOYBOX.

Do not duplicate another brand's distinctive logo or proprietary artwork.

Use the approved JOYBOX brand identity and original assets.

## Brand Colors

Initial tokens:

- Deep Navy: `#102D57`
- Bright Yellow: `#FFCC20`
- Warm Orange: `#F59A23`
- Cream: `#FFF7E9`
- Dark Ink: `#15213A`

Fine-tune the palette to match the approved reference and brand assets.

## Typography

Use premium, rounded typography that supports Georgian characters correctly.

Avoid broken Georgian glyphs, awkward character spacing, and poor font combinations.

Use a clear type hierarchy.

The site must remain readable on mobile.

## Photography and Assets

Use realistic product materials:

- Real cardboard texture.
- Natural teddy bear fabric.
- Believable toys.
- Proper shadows.
- Realistic reflections.
- Warm environmental lighting.

Final product photography must correspond to actual products.

Use the reference screenshots for art direction, not as substitutes for all website assets.

## Avoid AI Slop

Do not use:

- Generic AI-looking hero illustrations.
- Excessive neon glow.
- Random glassmorphism.
- Generic SaaS cards.
- Repeated gradient backgrounds.
- Unnecessary floating shapes.
- Oversized decorative icons.
- Fake parallax without purpose.
- Plastic-looking photorealistic objects.
- Generic sales copy.
- Repetitive layouts.
- Random 3D objects.

Aim for refined, intentionally art-directed design.

## Interface Quality

Every element must feel considered.

Maintain consistency in:

- Border radii.
- Typography.
- Spacing.
- Color contrast.
- Shadows.
- Buttons.
- Hover states.
- Layout grids.
- Animation timing.

Do not sacrifice usability for visual effects.

---

# 11. ANIMATION & INTERACTIVE EXPERIENCE

Animation is an essential part of JOYBOX but must remain controlled.

## Hero Entrance

On initial loading:

- Background appears naturally.
- Headline reveals smoothly.
- CTA enters with appropriate timing.
- Product visual gains subtle depth.
- Environmental animation remains minimal.

Avoid long loading sequences.

## Cinematic Scroll

Create a premium scroll experience using GSAP and ScrollTrigger.

Suggested motion concept:

1. The mystery box becomes more prominent.
2. The camera or composition subtly moves closer.
3. The lid begins to open where technically supported.
4. Warm light appears inside.
5. A small number of toys respond naturally.
6. The scene transitions into the next section.

Motion should be reversible when scrolling upward.

## Real 3D Requirements

If using Three.js or React Three Fiber:

- Use genuine 3D geometry or appropriate models.
- Apply realistic materials and lighting.
- Optimize model complexity.
- Use responsive camera composition.
- Provide performance fallbacks.

Do not pretend a flat image is a fully interactive 3D environment.

If the necessary 3D assets are unavailable, create a polished 2D/layered experience and document the limitation rather than implementing fake interactions.

## Interaction Quality

Implement:

- Refined hover effects.
- Natural button feedback.
- Smooth transitions.
- Product image interactions.
- Animated cart updates.
- Meaningful microinteractions.

## Reduced Motion and Mobile

Respect reduced-motion preferences.

Disable or simplify expensive effects on lower-performance devices.

Ensure animations do not prevent scrolling, navigation, or checkout.

---

# 12. RESPONSIVE DESIGN

JOYBOX must work on:

- Large desktops.
- Standard laptops.
- Tablets.
- Mobile devices.

Mobile design must be intentional, not merely a compressed desktop layout.

## Mobile Requirements

- Readable Georgian headlines.
- Optimized hero composition.
- Easy navigation.
- Visible shopping CTA.
- Touch-friendly buttons.
- Fast product browsing.
- Simple checkout forms.
- Accessible cart interactions.
- Reduced animation complexity.

The realistic mystery box must remain recognizable on mobile.

Avoid cutting off important elements or allowing text to overlap imagery.

---

# 13. SEO, PERFORMANCE & ACCESSIBILITY

## SEO

Implement:

- Page metadata.
- Descriptive Georgian page titles.
- Semantic heading structure.
- Product structured data where appropriate.
- Sitemap.
- Robots configuration.
- Canonical URLs.
- Open Graph metadata.
- Optimized product descriptions.

## Performance

Optimize:

- Image sizes.
- Loading behavior.
- Fonts.
- JavaScript bundle size.
- Animation execution.
- Database queries.
- Heavy 3D assets.

Lazy-load nonessential animations and models.

Measure actual Core Web Vitals.

## Accessibility

Implement:

- Semantic HTML.
- Keyboard navigation.
- Focus indicators.
- Accessible forms.
- Screen-reader descriptions.
- Appropriate contrast.
- Reduced-motion support.
- Responsive touch targets.

---

# 14. DEVELOPMENT PHASES

Development must be divided into controlled milestones.

## M01 — Project Foundation

- Inspect existing repository.
- Initialize Next.js application if necessary.
- Configure TypeScript.
- Configure Tailwind CSS.
- Define design tokens.
- Set up folder structure.
- Configure Supabase.
- Establish database schema and migrations.
- Prepare documentation.

**Acceptance:** Application builds successfully and the architecture is documented.

## M02 — Homepage & Visual System

- JOYBOX navigation.
- Cinematic hero.
- How It Works.
- Featured products.
- Supporting homepage sections.
- Footer.
- Responsive layouts.

Follow the first approved screenshot closely.

**Acceptance:** Desktop and mobile visuals match the approved design direction.

## M03 — Animation System

- GSAP setup.
- ScrollTrigger.
- Hero entrance.
- Scroll-driven effects.
- Section transitions.
- Interaction animations.
- Responsive and reduced-motion behavior.

**Acceptance:** Animations behave correctly, remain smooth, and do not interfere with navigation.

## M04 — Product Catalog

- Product database.
- Shop page.
- Product detail pages.
- Product media.
- Availability.
- Product filtering and sorting.

**Acceptance:** Real database products are displayed correctly.

## M05 — Cart & Guest Checkout

- Shopping cart.
- Persistent cart state.
- Guest checkout forms.
- Address handling.
- Delivery pricing.
- Order creation.
- Payment integration boundary.
- Payment status verification.

**Acceptance:** A verified test purchase creates an accurate database order with correct totals and stock updates.

## M06 — Admin Dashboard

- Administrator authentication.
- Dashboard statistics.
- Product management.
- Order management.
- Inventory management.
- Delivery statuses.
- Store settings.

**Acceptance:** Authorized admins can manage real orders and products, while unauthorized users cannot access them.

## M07 — Supporting Pages & Operations

- About.
- Contact.
- FAQ.
- Delivery.
- Returns.
- Privacy.
- Terms.
- Order confirmation.
- Notification integration where configured.

**Acceptance:** All required public pages function and display approved content.

## M08 — Final QA & Production

- Full functionality testing.
- Responsive QA.
- Accessibility review.
- Performance audit.
- Security review.
- Payment verification.
- Database review.
- Error-state testing.
- Deployment configuration.
- Production documentation.

**Acceptance:** All launch-critical purchase and administrative workflows have been tested successfully.

---

# 15. MVP REQUIREMENTS

The initial commercially usable release must support:

- Functional responsive homepage.
- Product catalog.
- Product detail pages.
- Shopping cart.
- Guest-only checkout.
- Customer name and phone collection.
- Delivery address collection.
- Secure card payments.
- Order creation.
- Inventory management.
- Admin authentication.
- Product administration.
- Order administration.
- Delivery status management.
- Order confirmation.
- Georgian localization.
- Essential legal and information pages.

## Explicitly Excluded

Do not build these features unless separately requested:

- Customer registration.
- Customer login.
- Customer accounts.
- Customer dashboards.
- Subscription billing.
- Loyalty systems.
- Complex rewards programs.
- Marketplace functionality.
- Multi-vendor support.
- Unnecessary customer social features.

The project must remain focused on efficient mystery box sales.

Advanced cinematic motion is an important brand feature, but it must not delay or compromise core commerce reliability.

---

# 16. QUALITY ASSURANCE & TESTING

Test the following:

### Storefront

- Navigation.
- Product loading.
- Responsive layouts.
- Product images.
- Cart behavior.
- Checkout validation.
- Georgian typography.
- Accessibility.

### Payments and Orders

- Successful payment.
- Failed payment.
- Cancelled payment.
- Duplicate webhook handling.
- Incorrect customer input.
- Out-of-stock purchases.
- Concurrent stock reservations.
- Order total consistency.
- Delivery price calculations.

### Administration

- Admin login.
- Unauthorized access.
- Product creation.
- Product updates.
- Inventory changes.
- Order visibility.
- Order status updates.
- Financial reporting.

### Animation

- Desktop motion.
- Mobile fallback.
- Reverse scrolling.
- Reduced-motion preferences.
- Performance on lower-powered devices.

Do not claim tests passed unless they were actually executed.

---

# 17. REQUIRED PROJECT DOCUMENTATION

Maintain the following documents:

- `PROJECT_BRIEF.md`
- `ARCHITECTURE.md`
- `DESIGN_SYSTEM.md`
- `ANIMATION_SPEC.md`
- `DATABASE_SCHEMA.md`
- `PAYMENT_INTEGRATION.md`
- `DEPLOYMENT.md`
- `TESTING.md`
- `MILESTONES.md`
- `DECISIONS.md`

Keep documentation aligned with implemented behavior.

Track unresolved business decisions separately.

---

# 18. CODEX EXECUTION INSTRUCTIONS

Act as a senior full-stack engineer, software architect, UX/UI designer, creative developer, and QA engineer.

You are responsible for developing JOYBOX into a complete, premium, commercially functional e-commerce platform.

## Before Coding

1. Inspect the repository.
2. Review the entire Master Development Brief.
3. Analyze the supplied JOYBOX logo and original landing-page reference.
4. Identify existing assets and reusable code.
5. Define the technical architecture.
6. Identify unresolved external integrations.
7. Create a milestone-based implementation plan.
8. Define acceptance criteria.

Do not begin by blindly generating the entire project.

## During Development

- Follow the approved design reference.
- Use production-quality code.
- Maintain clear architectural boundaries.
- Avoid unnecessary dependencies.
- Write reusable components.
- Preserve type safety.
- Implement real functionality.
- Use meaningful animations.
- Optimize performance.
- Validate user inputs.
- Protect sensitive operations.
- Test critical functionality.

Do not invent:

- Payment credentials.
- Product prices.
- Product inventory.
- Customer reviews.
- Courier integrations.
- Delivery promises.
- Business contact information.
- Legal certifications.

Use clearly identified development fixtures when real data is unavailable.

## Milestone Reporting

After every milestone, report:

- What was implemented.
- Which files were changed.
- Which features work.
- Which tests were executed.
- Any unresolved issues.
- Any missing external dependencies.
- The next implementation phase.

Do not describe incomplete or simulated features as production-ready.

## Design Enforcement

The first provided realistic Mystery Club screenshot is the primary visual reference.

Maintain its visual direction unless explicitly instructed otherwise.

Do not substitute generic templates or independently redesign the homepage.

The public brand must be JOYBOX.

All customer-facing content must be natural Georgian.

## Execution Policy

Continue implementing approved, independent work according to the milestone plan.

If work depends on unavailable credentials, confirmed prices, supplier information, or business approval, document the dependency and continue with components that can be safely implemented.

Never bypass payment verification, authorization, or security requirements simply to make a feature appear functional.

---

# 19. DEFINITION OF DONE

JOYBOX is complete and ready for commercial launch only when:

- The website follows the approved design reference.
- The JOYBOX identity is consistent throughout.
- The application works on desktop and mobile.
- Products load from the database.
- Cart functionality is reliable.
- Customers can purchase without accounts.
- Checkout securely processes payments.
- Orders are persisted correctly.
- Payment verification works.
- Inventory cannot be oversold.
- Administrators can manage products and orders.
- Admin access is secure.
- Delivery information is accurate.
- Critical tests pass.
- Required business configuration is complete.
- Legal and policy content is approved.
- The application is deployable and monitored.
- No production-critical feature is simulated.

---

# 20. OVERALL PRODUCT GOAL

**Discover → Choose → Add to Cart → Enter Delivery Details → Pay Securely → Receive Order → Open the Surprise.**

JOYBOX must become a distinctive Georgian children's mystery box brand supported by a reliable, beautiful, high-performance e-commerce platform.

The final experience should combine the emotional excitement of opening a mystery box with the simplicity and trust of a professionally operated online store.

### Final Creative Principle

**Realistic magic, not artificial spectacle.**

### Final Engineering Principle

**Every essential commercial feature must actually work.**

### Final User Experience Principle

**No unnecessary friction. No mandatory accounts. Just choose a box, pay, and enjoy the surprise.**