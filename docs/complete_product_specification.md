# Eventor - Complete Product Specification
**Version:** 1.0  
**Last Updated:** 2025-12-03  
**Owner:** Product & Engineering Team

---

## Table of Contents
1. [User Stories](#1-user-stories)
2. [Acceptance Criteria](#2-acceptance-criteria)
3. [Wireframes & Mocks](#3-wireframes--mocks)
4. [Entity Diagram](#4-entity-diagram)
5. [Additional Features & Improvements](#5-additional-features--improvements)
6. [Dependencies & Roadmap](#6-dependencies--roadmap)

---

## 1. User Stories

### Module A: Authentication & User Management

#### US-A01: Social Authentication (Google/Apple)
- **Actor:** New User / Returning User
- **Need:** Quick registration without password creation
- **Business Value:** Reduces friction in onboarding, increases conversion rate by 40%
- **Description:** Users can authenticate using OAuth2 providers (Google, Apple) to avoid password management
- **Priority:** HIGH
- **Effort:** 8 SP

**Acceptance Criteria:**
```gherkin
Feature: Social Authentication
  
  Scenario: User signs up with Google
    Given I am on the login screen
    When I click "Continue with Google"
    And I grant permissions in the Google popup
    Then I should be redirected to the onboarding flow
    And my profile should be created with Google data
    And I should receive a welcome email

  Scenario: Existing user logs in with Apple
    Given I am a registered user with Apple ID
    When I click "Continue with Apple"
    And I authenticate via Face ID
    Then I should be logged in
    And I should see my personalized home feed
```

**Dependencies:** None  
**Related:** US-A02 (Email/Password fallback)

---

#### US-A02: Email/Password Authentication (Fallback)
- **Actor:** User without social accounts
- **Need:** Alternative authentication method
- **Business Value:** Covers 15% of users who prefer traditional login
- **Description:** Standard email/password authentication with secure password reset flow
- **Priority:** MEDIUM
- **Effort:** 5 SP

**Acceptance Criteria:**
```gherkin
Feature: Email/Password Authentication

  Scenario: User creates account with email
    Given I am on the registration screen
    When I enter email "user@example.com"
    And I enter a password meeting requirements (8+ chars, 1 number, 1 special)
    And I click "Sign Up"
    Then I should receive a verification email
    And I should not be able to log in until verified

  Scenario: User requests password reset
    Given I am on the login screen
    When I click "Forgot Password"
    And I enter my registered email
    Then I should receive a reset link valid for 1 hour
    And I should be able to set a new password
```

**Dependencies:** US-A01  
**Related:** US-A03 (Profile completion)

---

#### US-A03: Personalization Onboarding ("Vibe Check")
- **Actor:** New User
- **Need:** Receive relevant event recommendations from day one
- **Business Value:** Increases engagement by 60%, reduces bounce rate
- **Description:** AI-driven interest selection during onboarding
- **Priority:** HIGH
- **Effort:** 13 SP

**Acceptance Criteria:**
```gherkin
Feature: Personalized Onboarding

  Scenario: User selects interests
    Given I just completed authentication
    When I see the "What do you like?" screen
    And I select 3+ categories (Music, Food, Art, Sports)
    And I select a vibe (Chill, Party, Adventurous)
    Then my profile should save these preferences
    And my discovery feed should prioritize these categories

  Scenario: User skips onboarding
    Given I am on the interests screen
    When I click "Skip for now"
    Then I should see a generic feed
    And I should see a prompt to complete my profile later
```

**Dependencies:** US-A01, US-A02  
**Related:** US-B03 (AI Recommendations)

---

### Module B: Discovery & Search

#### US-B01: Interactive Map with Event Pins
- **Actor:** Explorer User
- **Need:** Visualize events spatially to plan route
- **Business Value:** Core differentiator, 85% of users start here
- **Description:** Dark-themed map with color-coded pins by category
- **Priority:** CRITICAL
- **Effort:** 21 SP

**Acceptance Criteria:**
```gherkin
Feature: Interactive Event Map

  Scenario: User views map with events
    Given I am on the Discovery screen
    When the map loads
    Then I should see pins for all events within 10km
    And pins should be color-coded (Music=purple, Food=orange, etc.)
    And the map should center on my current location

  Scenario: User clicks on event pin
    Given I am viewing the map
    When I click on a pin
    Then I should see a preview card with event image, title, price
    And I should have options to "See Details" or "Get Directions"

  Scenario: User zooms on map
    Given multiple events are close together
    When I zoom out
    Then pins should cluster with a number badge
    When I zoom in
    Then clusters should expand to individual pins
```

**Dependencies:** US-B04 (Geolocation)  
**Related:** US-B02 (Carousel), US-C01 (Event Detail)

---

#### US-B02: Bottom Carousel Quick View
- **Actor:** Explorer User
- **Need:** Browse events without tapping small pins
- **Business Value:** Increases event views by 300%, improves UX
- **Description:** Swipeable carousel synchronized with map
- **Priority:** HIGH
- **Effort:** 13 SP

**Acceptance Criteria:**
```gherkin
Feature: Event Carousel

  Scenario: User swipes through events
    Given the carousel is visible at bottom
    When I swipe left
    Then the next event card should appear
    And the map should animate (flyTo) to that event's location
    And the previous event pin should dim

  Scenario: User taps carousel card
    Given I see an event card in the carousel
    When I tap on it
    Then I should navigate to the Event Detail screen
    And the map should remain at that location
```

**Dependencies:** US-B01  
**Related:** US-C01

---

#### US-B03: AI-Powered Recommendations ("For You" Feed)
- **Actor:** Logged-in User
- **Need:** Discover events matching my taste without searching
- **Business Value:** Increases ticket sales by 45%, drives retention
- **Description:** Machine learning model suggests events based on:
  - User preferences (onboarding + implicit)
  - Past attendance
  - Similar users' behavior
  - Trending events
- **Priority:** HIGH
- **Effort:** 21 SP

**Acceptance Criteria:**
```gherkin
Feature: AI Recommendations

  Scenario: User sees personalized feed
    Given I have attended 5+ events
    When I open the "For You" tab
    Then I should see 10+ recommended events
    And recommendations should match my saved categories
    And each card should show a "Why" label (e.g., "Because you liked Jazz")

  Scenario: User interacts with recommendation
    Given I see a recommended event
    When I tap "Not Interested"
    Then that event should be removed
    And similar events should appear less frequently
```

**Dependencies:** US-A03, US-D02 (User attendance tracking)  
**Related:** US-B05 (Search filters)

---

#### US-B04: Geolocation & "Near Me" Filter
- **Actor:** Mobile User
- **Need:** Find events within walking distance
- **Business Value:** Converts 30% more last-minute attendees
- **Description:** Real-time location-based filtering
- **Priority:** HIGH
- **Effort:** 8 SP

**Acceptance Criteria:**
```gherkin
Feature: Geolocation Filtering

  Scenario: User grants location permission
    Given I open the app for the first time
    When I am prompted for location access
    And I click "Allow"
    Then the map should center on my GPS coordinates
    And I should see events sorted by distance

  Scenario: User denies location
    Given I deny location permissions
    Then I should see events in Córdoba Capital by default
    And I should see a message "Enable location for better results"
```

**Dependencies:** None (platform feature)  
**Related:** US-B01

---

#### US-B05: Advanced Search & Filters
- **Actor:** Planner User
- **Need:** Find specific events by criteria
- **Business Value:** Improves conversion for intentional users
- **Description:** Multi-dimensional filtering (date, category, price, distance)
- **Priority:** MEDIUM
- **Effort:** 13 SP

**Acceptance Criteria:**
```gherkin
Feature: Event Search and Filtering

  Scenario: User applies date filter
    Given I am on the Discovery screen
    When I select the filter chip "This Weekend"
    Then I should see only events on Saturday and Sunday
    And the map should update with filtered pins

  Scenario: User combines multiple filters
    Given I apply filters: Category=Music, Price=Free, Distance=<5km
    When results load
    Then I should see only free music events within 5km
    And I should see a count "12 events found"
    And I should be able to clear all filters with one tap
```

**Dependencies:** US-B01, US-B04  
**Related:** US-B06 (Search text)

---

#### US-B06: Text Search with Autocomplete
- **Actor:** User with specific intent
- **Need:** Search by event name, venue, or organizer
- **Business Value:** Supports 20% of traffic (direct search)
- **Description:** Fuzzy search with intelligent suggestions
- **Priority:** MEDIUM
- **Effort:** 8 SP

**Acceptance Criteria:**
```gherkin
Feature: Text Search

  Scenario: User searches for event
    Given I tap the search bar
    When I type "jazz"
    Then I should see autocomplete suggestions:
      - "Jazz Night at Güemes" (event)
      - "Jazz Category" (filter)
      - "Jazz Fest 2025" (past event)

  Scenario: User selects suggestion
    Given I see search results
    When I tap "Jazz Night at Güemes"
    Then I should navigate to that Event Detail screen
```

**Dependencies:** US-B05  
**Related:** US-C01

---

### Module C: Event Details & Engagement

#### US-C01: Event Detail Page (Hero View)
- **Actor:** Interested User
- **Need:** See comprehensive event information to decide
- **Business Value:** 70% of ticket purchases happen here
- **Description:** Rich media detail page with sticky CTA
- **Priority:** CRITICAL
- **Effort:** 13 SP

**Acceptance Criteria:**
```gherkin
Feature: Event Detail Page

  Scenario: User views event details
    Given I navigated from map or search
    When the Event Detail page loads
    Then I should see:
      - Hero image/video (full-width)
      - Event title and organizer
      - Date, time, and countdown
      - Venue name with map preview
      - Price and ticket availability
      - Description (expandable)
      - Tags (category, vibes)
    And I should see a sticky "Buy Ticket" button at bottom

  Scenario: User shares event
    Given I am viewing an event
    When I tap the "Share" button
    Then I should see share options (WhatsApp, Instagram, Copy Link)
    And the link should be a deep link to this event
```

**Dependencies:** US-B01, US-B02, US-B06  
**Related:** US-C02 (Reviews), US-D01 (Ticket purchase)

---

#### US-C02: User Reviews & Ratings
- **Actor:** Past Attendee
- **Need:** Share my experience and help others decide
- **Business Value:** Social proof increases conversions by 25%
- **Description:** 5-star rating with text review, photo upload optional
- **Priority:** MEDIUM
- **Effort:** 13 SP

**Acceptance Criteria:**
```gherkin
Feature: Event Reviews

  Scenario: User submits review after event
    Given I attended an event 1+ days ago
    When I receive a "How was it?" notification
    And I tap to rate the event
    And I select 4 stars
    And I write "Great vibes, would go again!"
    And I upload 2 photos
    Then my review should appear on the event page
    And I should earn 50 XP points

  Scenario: User reports inappropriate review
    Given I see a spam review
    When I tap "Report"
    Then the review should be flagged for moderation
```

**Dependencies:** US-D02 (Attendance tracking), US-E02 (XP system)  
**Related:** US-C01

---

#### US-C03: Save Event to Favorites ("Interesados")
- **Actor:** Undecided User
- **Need:** Bookmark events to review later or coordinate with friends
- **Business Value:** 40% of saved events convert to purchases within 7 days
- **Description:** One-tap save/unsave with sync across devices
- **Priority:** MEDIUM
- **Effort:** 5 SP

**Acceptance Criteria:**
```gherkin
Feature: Favorite Events

  Scenario: User saves event
    Given I am viewing an event
    When I tap the heart icon
    Then the icon should fill with color
    And the event should appear in "My Favorites" list
    And I should receive a reminder 24h before start time

  Scenario: User unsaves event
    Given I previously saved an event
    When I tap the filled heart icon
    Then it should become outlined
    And the event should be removed from favorites
```

**Dependencies:** US-A01 (Authentication)  
**Related:** US-E01 (Profile)

---

#### US-C04: Add Event to Calendar
- **Actor:** Organized User
- **Need:** Sync event to personal calendar
- **Business Value:** Reduces no-shows by 15%
- **Description:** Export to Google Calendar, Apple Calendar, Outlook
- **Priority:** LOW
- **Effort:** 5 SP

**Acceptance Criteria:**
```gherkin
Feature: Calendar Integration

  Scenario: User adds to Google Calendar
    Given I am viewing an event
    When I tap "Add to Calendar"
    And I select "Google Calendar"
    Then a .ics file should download
    Or Google Calendar should open with pre-filled event details
```

**Dependencies:** US-C01  
**Related:** None

---

### Module D: Tickets & Checkout

#### US-D01: Ticket Purchase Flow (External Integration)
- **Actor:** Committed User
- **Need:** Buy tickets securely
- **Business Value:** Direct revenue driver
- **Description:** Phase 1 redirects to external ticketing (Passline, Passshow). Phase 2 integrates Stripe/MercadoPago
- **Priority:** HIGH
- **Effort:** 21 SP (Phase 2)

**Acceptance Criteria (Phase 1):**
```gherkin
Feature: External Ticket Purchase

  Scenario: User clicks Buy Ticket
    Given I am on an Event Detail page
    When I click "Buy Ticket"
    Then I should be redirected to the organizer's ticketing URL
    And the URL should open in an in-app browser
    And we should track this click as a conversion event
```

**Acceptance Criteria (Phase 2):**
```gherkin
Feature: Native Ticket Purchase

  Scenario: User buys ticket in-app
    Given I click "Buy Ticket"
    When I select quantity (2 tickets)
    And I proceed to checkout
    Then I should see a summary: 2x $1500 = $3000
    And I should select payment method (Card, MercadoPago, Transfer)
    When I complete payment
    Then I should receive a confirmation email with QR codes
    And tickets should appear in "My Tickets"
```

**Dependencies:** US-C01  
**Related:** US-D02, US-D03

---

#### US-D02: Ticket Wallet (QR Code Display)
- **Actor:** Ticket Holder
- **Need:** Access tickets offline at venue
- **Business Value:** Reduces support tickets, improves entry speed
- **Description:** Secure QR code storage with offline access
- **Priority:** HIGH
- **Effort:** 13 SP

**Acceptance Criteria:**
```gherkin
Feature: Digital Ticket Wallet

  Scenario: User views ticket QR
    Given I purchased a ticket
    When I go to "My Tickets"
    Then I should see the event card
    And I should see a QR code that can be scanned
    And the QR should work without internet connection

  Scenario: User transfers ticket
    Given I own a ticket
    When I tap "Transfer"
    And I enter recipient's email
    Then the ticket should move to their account
    And I should no longer see it in my wallet
```

**Dependencies:** US-D01  
**Related:** US-E01 (Profile)

---

#### US-D03: Attendance Verification (For Organizers)
- **Actor:** Event Organizer / Door Staff
- **Need:** Scan tickets to control entry
- **Business Value:** Prevents fraud, provides real-time attendance data
- **Description:** Organizer mobile app or web portal to scan QR codes
- **Priority:** MEDIUM
- **Effort:** 13 SP

**Acceptance Criteria:**
```gherkin
Feature: Ticket Scanning

  Scenario: Staff scans valid ticket
    Given I am logged in as an organizer
    When I open the "Scan Tickets" feature
    And I scan a user's QR code
    Then I should see: "Valid - Admit 1"
    And the ticket should be marked as used
    And attendance count should increment

  Scenario: Staff scans duplicate ticket
    Given a ticket was already scanned
    When I scan the same QR code again
    Then I should see "Already Used - Deny Entry"
```

**Dependencies:** US-D02, US-F01 (Organizer Dashboard)  
**Related:** US-E02 (XP for attendance)

---

### Module E: User Profile & Gamification

#### US-E01: User Profile Dashboard
- **Actor:** Registered User
- **Need:** View my activity, tickets, and preferences
- **Business Value:** Builds identity, increases retention
- **Description:** Central hub for user data
- **Priority:** MEDIUM
- **Effort:** 8 SP

**Acceptance Criteria:**
```gherkin
Feature: User Profile

  Scenario: User views profile
    Given I am logged in
    When I navigate to "Profile"
    Then I should see:
      - My avatar and name
      - Explorer level and XP progress bar
      - Total events attended
      - My favorite categories
      - Upcoming tickets (next 3)
      - Past events (last 10)

  Scenario: User edits profile
    Given I am on my profile
    When I tap "Edit"
    And I change my display name
    And I upload a new avatar
    Then changes should save
    And I should see a success message
```

**Dependencies:** US-A01  
**Related:** US-E02, US-D02

---

#### US-E02: Gamification System (Explorer Levels)
- **Actor:** Active User
- **Need:** Feel rewarded for engagement
- **Business Value:** Increases monthly active users by 30%
- **Description:** XP-based leveling system with badges
- **Priority:** MEDIUM
- **Effort:** 13 SP

**Acceptance Criteria:**
```gherkin
Feature: Explorer Levels

  Scenario: User earns XP for activity
    Given I am level 3 (500 XP)
    When I attend an event (100 XP)
    And I leave a review (50 XP)
    And I invite a friend who signs up (200 XP)
    Then my XP should be 850
    And I should level up to Level 4
    And I should receive a notification "Level Up! Unlock early access to events"

  Scenario: User views leaderboard
    Given I am in the top 100 users
    When I navigate to "Leaderboard"
    Then I should see my rank
    And I should see top 10 users with their levels
```

**Dependencies:** US-E01, US-D02 (Attendance)  
**Related:** US-C02 (Review XP)

---

#### US-E03: Social Features (Follow Friends)
- **Actor:** Social User
- **Need:** See what events my friends are attending
- **Business Value:** Viral growth, increases group bookings
- **Description:** Follow system, see friends' activity feed
- **Priority:** LOW (Phase 2)
- **Effort:** 21 SP

**Acceptance Criteria:**
```gherkin
Feature: Social Connections

  Scenario: User follows a friend
    Given I search for my friend by username
    When I tap "Follow"
    Then I should see their public activity in my feed
    And I should see which events they're attending

  Scenario: User sees friend going to event
    Given my friend is attending "Jazz Night"
    When I view that event
    Then I should see "2 friends going: Ana, Carlos"
```

**Dependencies:** US-E01  
**Related:** US-C01

---

### Module F: B2B Organizer Dashboard

#### US-F01: Event Creation & Management
- **Actor:** Event Organizer
- **Need:** Publish events to attract attendees
- **Business Value:** Core B2B offering, subscription revenue
- **Description:** Multi-step event creation form with media upload
- **Priority:** CRITICAL
- **Effort:** 21 SP

**Acceptance Criteria:**
```gherkin
Feature: Event Creation

  Scenario: Organizer creates paid event
    Given I am logged in as an organizer
    When I navigate to "Create Event"
    And I fill in:
      - Title: "Rock Fest 2025"
      - Date: 2025-06-15
      - Venue: "Estadio Mario Kempes"
      - Capacity: 5000
      - Ticket Price: $2500
      - Category: Music
    And I upload a poster image
    And I write a description
    And I click "Publish"
    Then the event should be live on the map
    And I should receive a confirmation email

  Scenario: Organizer edits draft event
    Given I have a draft event
    When I edit any field
    Then changes should auto-save
    And I should see "Last saved 2 min ago"
```

**Dependencies:** US-A01 (Auth for organizers)  
**Related:** US-F02, US-F03

---

#### US-F02: Analytics Dashboard
- **Actor:** Event Organizer
- **Need:** Track performance metrics
- **Business Value:** Justifies premium subscription ($50/month)
- **Description:** Charts for views, ticket sales, demographics
- **Priority:** HIGH
- **Effort:** 13 SP

**Acceptance Criteria:**
```gherkin
Feature: Event Analytics

  Scenario: Organizer views metrics
    Given I published "Jazz Night" 7 days ago
    When I open the Analytics tab
    Then I should see:
      - Total page views (line chart, daily)
      - Conversion rate (views → tickets)
      - Tickets sold vs. available
      - Revenue to date
      - Traffic sources (map, search, social)
      - Demographics (age, gender if available)

  Scenario: Organizer exports data
    Given I am viewing analytics
    When I click "Export CSV"
    Then I should download a file with all metrics
```

**Dependencies:** US-F01  
**Related:** US-D01 (Ticket sales data)

---

#### US-F03: Subscription Management (Freemium Model)
- **Actor:** Event Organizer
- **Need:** Upgrade to premium for more features
- **Business Value:** Primary B2B revenue stream
- **Description:** 
  - **Free Tier:** 1 active event, basic analytics
  - **Pro Tier ($50/month):** Unlimited events, advanced analytics, promoted listings
  - **Enterprise:** Custom pricing, API access
- **Priority:** HIGH
- **Effort:** 13 SP

**Acceptance Criteria:**
```gherkin
Feature: Subscription Tiers

  Scenario: Free user hits event limit
    Given I am on the Free plan
    And I have 1 active event
    When I try to create a second event
    Then I should see "Upgrade to Pro to publish unlimited events"
    And I should see pricing options

  Scenario: User upgrades to Pro
    Given I click "Upgrade Now"
    When I enter payment details (card or MercadoPago)
    And I confirm subscription
    Then my plan should change to Pro
    And I should be able to create unlimited events
    And I should see a receipt email
```

**Dependencies:** US-F01  
**Related:** US-F04 (Promoted events)

---

#### US-F04: Promoted Events (Paid Ads)
- **Actor:** Event Organizer (Pro/Enterprise)
- **Need:** Boost visibility to sell more tickets
- **Business Value:** Secondary revenue stream (10% of GMV)
- **Description:** Pay-per-click or fixed fee to appear in "Trending" or top of search
- **Priority:** MEDIUM
- **Effort:** 13 SP

**Acceptance Criteria:**
```gherkin
Feature: Event Promotion

  Scenario: Organizer promotes event
    Given I am on a Pro plan
    When I select my event "Rock Fest"
    And I click "Promote Event"
    And I choose "Appear in Trending for 7 days - $5000"
    And I complete payment
    Then my event should appear with a "Promoted" badge
    And it should rank higher in discovery feeds

  Scenario: User sees promoted event
    Given an organizer is running a promotion
    When I open the Discovery screen
    Then I should see promoted events at the top
    And they should have a subtle "Ad" label
```

**Dependencies:** US-F03  
**Related:** US-B03 (Affects recommendations)

---

### Module G: Admin & Moderation

#### US-G01: Content Moderation System
- **Actor:** Platform Administrator
- **Need:** Remove spam, inappropriate content, or fraud
- **Business Value:** Protects brand reputation, legal compliance
- **Description:** Admin panel to review flagged events/reviews
- **Priority:** MEDIUM
- **Effort:** 13 SP

**Acceptance Criteria:**
```gherkin
Feature: Content Moderation

  Scenario: User reports event as spam
    Given I see a suspicious event
    When I tap "Report Event"
    And I select reason "Spam/Scam"
    Then the event should be flagged
    And an admin should receive a notification

  Scenario: Admin approves/rejects event
    Given I am logged in as admin
    When I review a flagged event
    And I see it violates ToS
    Then I can click "Remove Event"
    And the organizer should be notified
```

**Dependencies:** None  
**Related:** US-C02 (Review moderation)

---

#### US-G02: Platform Analytics (Admin View)
- **Actor:** Business Owner / Product Manager
- **Need:** Monitor platform health
- **Business Value:** Informs strategic decisions
- **Description:** Dashboard with KPIs (DAU, GMV, churn, etc.)
- **Priority:** LOW
- **Effort:** 8 SP

**Acceptance Criteria:**
```gherkin
Feature: Platform Analytics

  Scenario: Admin views KPIs
    Given I am logged in as admin
    When I navigate to "Platform Insights"
    Then I should see:
      - Daily Active Users (DAU)
      - Monthly Recurring Revenue (MRR)
      - New registrations (30 days)
      - Top categories by volume
      - Churn rate
```

**Dependencies:** All modules generate data  
**Related:** None

---

## 2. Acceptance Criteria Summary

All acceptance criteria above are written in **Gherkin (Given/When/Then)** format for clarity and testability. Each scenario can be directly translated into automated tests using frameworks like:
- **Frontend:** Cypress, Playwright
- **Backend:** SpecFlow (.NET), xUnit

---

## 3. Wireframes & Mocks

### 3.1 Login / Onboarding Flow

```
┌─────────────────────────────────────┐
│            EVENTOR                   │
│   Discover Córdoba's Best Events    │
│                                      │
│  ┌──────────────────────────────┐  │
│  │  [G] Continue with Google     │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  [🍎] Continue with Apple     │  │
│  └──────────────────────────────┘  │
│                                      │
│  ─────── or ───────                 │
│                                      │
│  Email: ___________________         │
│  Password: ________________         │
│  [ Sign Up ]   [ Login ]            │
│                                      │
└─────────────────────────────────────┘

          ↓ (After login)

┌─────────────────────────────────────┐
│  What do you like?                   │
│  Select your vibes 🎉                │
│                                      │
│  [ 🎵 Music ]  [ 🍕 Food ]          │
│  [ 🎨 Art ]    [ ⚽ Sports ]         │
│  [ 🌳 Nature ] [ 🎭 Theater ]       │
│                                      │
│  Pick your vibe:                     │
│  [ 🥂 Party ] [ 😌 Chill ]          │
│  [ 💑 Date Night ]                   │
│                                      │
│          [ Continue → ]              │
│                                      │
└─────────────────────────────────────┘
```

---

### 3.2 Discovery Screen (Map + Carousel)

```
┌─────────────────────────────────────┐
│ [☰] 📍 Nueva Córdoba     [🔔] [👤] │ ← Header
├─────────────────────────────────────┤
│ 🔍 Search events...        [Filter] │ ← Search Bar
│ [Music] [Food] [Free] [Tonight]    │ ← Filter Chips
├─────────────────────────────────────┤
│                                      │
│        🗺️   DARK MAP VIEW           │
│                                      │
│     📍 (Jazz Night)                 │
│              📍 (Trekking)          │
│    📍 (Art Expo)                    │
│                                      │
│         [Current Location: 📍]      │
│                                      │
├─────────────────────────────────────┤
│ ← CAROUSEL (swipe) →                │
│ ┌────────┐  ┌────────┐  ┌────────┐ │
│ │ [IMG]  │  │ [IMG]  │  │ [IMG]  │ │
│ │Jazz Nig│  │Trekking│  │Art Expo│ │
│ │$1500   │  │ FREE   │  │$500    │ │
│ └────────┘  └────────┘  └────────┘ │
└─────────────────────────────────────┘
```

**Navigation States:**
- When user swipes carousel → Map animates to that pin
- When user taps pin → Carousel scrolls to that card
- When user taps card → Navigate to Event Detail

---

### 3.3 Event Detail Screen

```
┌─────────────────────────────────────┐
│ [←]              [❤️] [⋯]           │ ← Back, Fav, Share
│                                      │
│  ┌──────────────────────────────┐  │
│  │                               │  │
│  │      [HERO IMAGE/VIDEO]       │  │ ← Full-width media
│  │                               │  │
│  └──────────────────────────────┘  │
│                                      │
│  Jazz Night at Güemes               │ ← Title (H1, bold)
│  by Club de Jazz Arg ✓              │ ← Organizer (verified)
│                                      │
│  📅 Sábado 15 Jun • 22:00           │
│  📍 Pasaje Revol 57, Güemes         │
│  🎟️ $1500 • 45/100 tickets left    │
│                                      │
│  ─────────────────────────          │
│                                      │
│  📝 Description                      │
│  Noche de jazz en vivo con las      │
│  mejores bandas locales...          │
│  [Read more ▼]                      │
│                                      │
│  🏷️ Music • Party • Indoor          │
│                                      │
│  ─────────────────────────          │
│                                      │
│  ⭐ 4.8 (12 reviews)                │
│  ┌──────────────────────────────┐  │
│  │ Ana M. ⭐⭐⭐⭐⭐              │  │
│  │ "Amazing vibes, great sound" │  │
│  │ [+2 photos]                   │  │
│  └──────────────────────────────┘  │
│  [See all reviews →]                │
│                                      │
│  ─────────────────────────          │
│                                      │
│  📍 Map Preview                     │
│  [Mini map showing venue location]  │
│  [Get Directions →]                 │
│                                      │
│  ... (scroll down for more)         │
│                                      │
├═════════════════════════════════════┤
│    [  BUY TICKET - $1500  ]        │ ← Sticky CTA
└─────────────────────────────────────┘
```

---

### 3.4 User Profile / Tickets

```
┌─────────────────────────────────────┐
│ [☰]         Profile          [⚙️]   │
├─────────────────────────────────────┤
│                                      │
│      ┌─────────────┐                │
│      │   [AVATAR]   │   Agustin     │ ← User info
│      └─────────────┘   Lvl 5 🔥     │
│                                      │
│  ████████░░ 850/1000 XP → Lvl 6     │ ← Progress bar
│                                      │
│  📊 12 events attended               │
│  🎫 My Tickets          [See all →] │
│                                      │
│  ──────────────────────────────     │
│                                      │
│  Upcoming (2)                        │
│  ┌──────────────────────────────┐  │
│  │ Jazz Night       [QR]         │  │ ← Ticket card
│  │ Jun 15 • 22:00   ▄▄▄▄         │  │
│  │ Pasaje Revol     ▄▄▄▄         │  │
│  │                  ▄▄▄▄         │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ Trekking Sierras [QR]         │  │
│  │ Jun 18 • 09:00   ▄▄▄▄         │  │
│  └──────────────────────────────┘  │
│                                      │
│  Past Events                         │
│  • Art Expo (Jun 1)                 │
│  • Food Festival (May 20)           │
│                                      │
│  ──────────────────────────────     │
│                                      │
│  Settings                            │
│  > Edit Profile                      │
│  > Notifications                     │
│  > Privacy & Security                │
│  > Help & Support                    │
│  > Log Out                           │
│                                      │
└─────────────────────────────────────┘
```

---

### 3.5 B2B Dashboard (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│ EVENTOR | Organizer Dashboard                     [Agustin ▼]│
├──────────┬──────────────────────────────────────────────────┤
│          │  My Events       Analytics      Settings         │
│  [+]     ├──────────────────────────────────────────────────┤
│  Create  │                                                   │
│  Event   │  Overview (Last 30 days)                         │
│          │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ ─────    │  │📊 Views  │ │🎟️ Sales │ │💰 Revenue│         │
│          │  │  1,250   │ │    45    │ │ $67,500  │         │
│ My Events│  └──────────┘ └──────────┘ └──────────┘         │
│ ────────────────────────────────────────────────────────────┤
│ • Jazz Night  (Active)                                       │
│ • Rock Fest   (Draft)                                        │
│ • Art Expo    (Ended)                                        │
│                                                               │
│                                                               │
│ Analytics  │  📈 Ticket Sales Trend                         │
│ ─────      │  ┌──────────────────────────────────┐         │
│            │  │ 50│                       ╱       │         │
│ Billing    │  │ 40│                    ╱          │         │
│ ─────      │  │ 30│                 ╱             │         │
│ Current    │  │ 20│              ╱                │         │
│ Plan: Pro  │  │ 10│          ╱                    │         │
│ $50/month  │  │  0└───────────────────────────────│         │
│            │  │     1  5  10  15  20  25  30      │         │
│            │  └──────────────────────────────────┘         │
│            │                                                 │
│            │  Event Performance Table                       │
│            │  ┌─────────────────────────────────────────┐  │
│            │  │ Event      │ Views │ Sales │ Conv% │    │  │
│            │  ├─────────────────────────────────────────┤  │
│            │  │ Jazz Night │  450  │  20   │ 4.4%  │ ✏️ │  │
│            │  │ Rock Fest  │  800  │  25   │ 3.1%  │ ✏️ │  │
│            │  └─────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

### 3.6 Ticket Scanning (Organizer Mobile)

```
┌─────────────────────────────────────┐
│   Jazz Night - Door Scan             │
│                                      │
│  ┌──────────────────────────────┐  │
│  │                               │  │
│  │    [CAMERA VIEWFINDER]        │  │ ← Live QR scanner
│  │                               │  │
│  │   ┌──────────────┐            │  │
│  │   │  QR TARGET   │            │  │
│  │   └──────────────┘            │  │
│  │                               │  │
│  └──────────────────────────────┘  │
│                                      │
│  Point camera at ticket QR code     │
│                                      │
│  ──────────────────────────────     │
│                                      │
│  Last Scanned:                       │
│  ✅ Ana Martinez - VIP #1234        │
│  ⏰ 22:05                            │
│                                      │
│  ──────────────────────────────     │
│                                      │
│  Event Stats:                        │
│  👥 45 / 100 checked in             │
│  🎫 Remaining: 55                   │
│                                      │
│  [View All Scans]  [Download CSV]   │
│                                      │
└─────────────────────────────────────┘

      ↓ (After scanning)

┌─────────────────────────────────────┐
│  ✅ VALID TICKET                    │
│                                      │
│  Carlos Lopez                        │
│  Ticket #5678                        │
│  General Admission                   │
│                                      │
│  [ ADMIT ]                           │
│                                      │
└─────────────────────────────────────┘
```

---

## 4. Entity Diagram

### 4.1 Entity-Relationship Diagram (ERD)

```
┌─────────────────────────┐
│         User            │
├─────────────────────────┤
│ PK  Id (UUID)           │
│     Email (unique)      │
│     PasswordHash        │
│     DisplayName         │
│     AvatarUrl           │
│     Level (int)         │
│     XP (int)            │
│     Role (enum)         │  ← User, Organizer, Admin
│     CreatedAt           │
│     LastLoginAt         │
│ FK  LocationId          │
└─────────────────────────┘
           │ 1
           │
           │ N
           ↓
┌─────────────────────────┐      ┌─────────────────────────┐
│   UserPreference        │      │    Organization         │
├─────────────────────────┤      ├─────────────────────────┤
│ PK  Id                  │      │ PK  Id                  │
│ FK  UserId              │      │     Name                │
│     Category (enum)     │      │     Description         │
│     Vibe (enum)         │      │     LogoUrl             │
└─────────────────────────┘      │     Verified (bool)     │
                                  │     SubscriptionTier    │ ← Free, Pro, Enterprise
                                  │ FK  OwnerId (User)      │
                                  │     CreatedAt           │
                                  └─────────────────────────┘
                                             │ 1
                                             │
                                             │ N
                                             ↓
┌─────────────────────────┐      ┌─────────────────────────┐
│        Event            │      │       Venue             │
├─────────────────────────┤      ├─────────────────────────┤
│ PK  Id (UUID)           │  N   │ PK  Id                  │
│     Title               │──────│     Name                │
│     Description         │  1   │     Address             │
│     StartDate           │      │     Latitude            │
│     EndDate             │      │     Longitude           │
│ FK  VenueId             │      │     City                │
│ FK  OrganizationId      │      │     Capacity            │
│     Category (enum)     │      └─────────────────────────┘
│     VibeTag (enum)      │
│     ImageUrl            │
│     VideoUrl (opt)      │
│     TicketPrice         │
│     TotalCapacity       │
│     TicketsAvailable    │
│     Status (enum)       │ ← Draft, Published, Cancelled, Ended
│     PromotionLevel      │ ← None, Featured, Trending
│     ViewCount           │
│     CreatedAt           │
│     UpdatedAt           │
└─────────────────────────┘
           │ 1
           │
           │ N
           ↓
┌─────────────────────────┐
│        Ticket           │
├─────────────────────────┤
│ PK  Id (UUID)           │
│ FK  UserId              │
│ FK  EventId             │
│     QRCode (unique)     │
│     PurchaseDate        │
│     Price               │
│     Status (enum)       │ ← Active, Used, Transferred, Refunded
│     ScannedAt (opt)     │
│ FK  TransferredToId     │
└─────────────────────────┘
           │ N             ┌─────────────────────────┐
           │───────────────│      Payment            │
           │ 1             ├─────────────────────────┤
                           │ PK  Id                  │
                           │ FK  TicketId            │
                           │ FK  UserId              │
                           │     Amount              │
                           │     Currency            │
                           │     Method (enum)       │ ← Card, MercadoPago, Transfer
                           │     Status (enum)       │ ← Pending, Completed, Failed
                           │     ExternalRefId       │ ← MercadoPago ID
                           │     CreatedAt           │
                           └─────────────────────────┘

┌─────────────────────────┐
│        Review           │
├─────────────────────────┤
│ PK  Id                  │
│ FK  EventId             │
│ FK  UserId              │
│     Rating (1-5)        │
│     Comment (text)      │
│     Photos (JSON)       │ ← Array of URLs
│     CreatedAt           │
│     IsReported (bool)   │
└─────────────────────────┘

┌─────────────────────────┐
│   UserActivity          │ ← For analytics and XP
├─────────────────────────┤
│ PK  Id                  │
│ FK  UserId              │
│     ActivityType (enum) │ ← EventView, Review, Share, Attend
│ FK  EventId (opt)       │
│     XPEarned            │
│     Timestamp           │
└─────────────────────────┘

┌─────────────────────────┐
│       Follow            │ ← Social feature
├─────────────────────────┤
│ PK  Id                  │
│ FK  FollowerId (User)   │
│ FK  FolloweeId (User)   │
│     CreatedAt           │
└─────────────────────────┘
```

### 4.2 Key Relationships

| Parent Entity   | Child Entity      | Relationship | Cardinality | Notes                                      |
|-----------------|-------------------|--------------|-------------|--------------------------------------------|
| User            | UserPreference    | 1-to-Many    | 1:N         | User has multiple category preferences     |
| User            | Ticket            | 1-to-Many    | 1:N         | User can own multiple tickets              |
| User            | Review            | 1-to-Many    | 1:N         | User can write multiple reviews            |
| User            | Organization      | 1-to-Many    | 1:N         | User can own multiple organizations        |
| Organization    | Event             | 1-to-Many    | 1:N         | Org publishes multiple events              |
| Event           | Ticket            | 1-to-Many    | 1:N         | Event has many tickets sold                |
| Event           | Review            | 1-to-Many    | 1:N         | Event can have many reviews                |
| Event           | Venue             | Many-to-One  | N:1         | Events happen at a venue                   |
| Ticket          | Payment           | 1-to-1       | 1:1         | Each ticket has one payment record         |
| User            | Follow            | Self-ref     | N:N         | Users follow other users                   |

---

## 5. Additional Features & Improvements

### 5.1 Critical Gaps Identified

#### Gap #1: No Search Intent Tracking
**Problem:** We don't capture what users search for but don't find.  
**Impact:** Lose valuable data for content strategy (which events/categories to prioritize).  
**Solution:** Log all searches (with 0 results) to a `SearchQuery` table. Weekly review top unmet queries.  
**Effort:** 3 SP  
**Priority:** HIGH

---

#### Gap #2: No Notification System
**Problem:** Users won't know about:
- Event reminders (24h before)
- Friend activity ("Ana is going to Jazz Night")
- Price drops / last-minute tickets
**Impact:** Missed conversions, lower retention.  
**Solution:** Implement push notifications (Firebase Cloud Messaging) + email (SendGrid).  
**Effort:** 13 SP  
**Priority:** CRITICAL

---

#### Gap #3: No Refund/Cancellation Policy
**Problem:** Users can't cancel tickets, organizers can't cancel events.  
**Impact:** Legal/financial risk + bad UX.  
**Solution:** 
- Add `RefundPolicy` field to `Event` (e.g., "Full refund 48h before")
- Allow users to request refunds via support ticket (manual approval initially)
- Phase 2: Automate refunds via payment provider API
**Effort:** 8 SP  
**Priority:** HIGH

---

#### Gap #4: No Fraud Detection
**Problem:** Fake events, duplicate ticket scans, bot registrations.  
**Impact:** Platform credibility at risk.  
**Solution:** 
- Email verification on signup
- Organizer identity verification (Pro+ only)
- QR code cryptographic signing
- Rate limiting on API endpoints
**Effort:** 21 SP  
**Priority:** MEDIUM (but urgent before launch)

---

#### Gap #5: No Accessibility Compliance
**Problem:** App not usable for visually impaired users.  
**Impact:** Legal risk (ADA/WCAG non-compliance), excludes 15% of potential users.  
**Solution:** 
- Semantic HTML tags
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader testing
**Effort:** 13 SP  
**Priority:** MEDIUM

---

### 5.2 High-Value Feature Proposals

#### Feature #1: "Last-Minute Deals" (Flash Sales)
**Why:** Events with unsold tickets lose revenue.  
**How:** 
- Automatically offer 30% discount on tickets 24h before event if <50% sold
- Push notification to users who favorited or are nearby
**Business Value:** Increases fill rate by 20%, creates FOMO urgency.  
**Effort:** 13 SP  
**Phase:** 2

---

#### Feature #2: Group Booking Discounts
**Why:** 60% of nightlife events are attended in groups of 3+.  
**How:** 
- "Invite Friends" feature: Share unique link, get 10% off if 3+ use it
- Organizer sets group pricing (e.g., "4 tickets for price of 3")
**Business Value:** Increases average order value by 40%.  
**Effort:** 13 SP  
**Phase:** 2

---

#### Feature #3: Event Waitlist
**Why:** Sold-out events generate demand we can't capture.  
**How:** 
- "Join Waitlist" button on sold-out events
- Notify if tickets become available (cancellations)
- Organizer can add "second date" to capture waitlist
**Business Value:** Converts 10% of waitlisted users, provides demand signal.  
**Effort:** 8 SP  
**Phase:** 2

---

#### Feature #4: AI-Powered Event Descriptions
**Why:** Organizers struggle to write compelling copy.  
**How:** 
- "Generate with AI" button in event creation form
- Uses GPT-4 to write description from bullet points
- Pro/Enterprise feature
**Business Value:** Speeds up event creation, improves listing quality.  
**Effort:** 5 SP  
**Phase:** 2

---

#### Feature #5: Weather Integration
**Why:** Outdoor events are weather-dependent.  
**How:** 
- Display weather forecast on outdoor event detail pages
- Auto-send notification if rain >70% probability
- Organizer can trigger "Weather Cancellation" policy
**Business Value:** Reduces no-shows, improves trust.  
**Effort:** 8 SP  
**Phase:** 3

---

#### Feature #6: Calendar View (Beyond List/Map)
**Why:** Some users plan weekly, want to see all events in a calendar grid.  
**How:** 
- Third tab: "Calendar"
- Month view with dots on dates with events
- Tap date to see events that day
**Business Value:** Appeals to planner personas (20% of users).  
**Effort:** 13 SP  
**Phase:** 2

---

#### Feature #7: Organizer Verification Badge
**Why:** Users trust verified organizers more (like Twitter blue check).  
**How:** 
- Manual KYC verification (ID + business registration)
- Display badge on organizer profile and events
- Pro+ requirement
**Business Value:** Increases conversion by 15% on verified events.  
**Effort:** 8 SP  
**Phase:** 1 (before launch)

---

## 6. Dependencies & Roadmap Suggestions

### 6.1 Dependency Matrix

| Feature ID | Depends On          | Blocks             | Notes                              |
|------------|---------------------|--------------------|-------------------------------------|
| US-A01     | None                | Most features      | Foundation (auth required)          |
| US-A03     | US-A01              | US-B03             | Onboarding data feeds AI            |
| US-B01     | None                | US-B02, US-C01     | Core discovery feature              |
| US-B03     | US-A03, US-D02      | -                  | Needs user data to recommend        |
| US-D01     | US-C01              | US-D02, US-E02     | Can't have tickets without purchase |
| US-D03     | US-D02, US-F01      | -                  | Organizers need events first        |
| US-F03     | US-F01              | US-F04             | Subscription gates premium features |
| Gap #2     | US-D01, US-E02      | All engagement     | Notifications drive retention       |

### 6.2 Recommended Phased Roadmap

#### Phase 0: Foundation (Week 1-2)
**Goal:** Deployable MVP for beta testing.
- [x] Project setup (Angular, .NET, DB)
- [x] Basic UI structure (Sidebar, Home, Discover)
- [ ] US-A01: Authentication (Google OAuth)
- [ ] US-A02: Email/Password fallback
- [ ] Gap #7: Organizer Verification (manual process)

#### Phase 1: Core Discovery (Week 3-5)
**Goal:** Users can find and view events.
- [ ] US-B01: Interactive Map (full implementation)
- [ ] US-B02: Carousel sync with map
- [ ] US-B05: Filters (date, category, price)
- [ ] US-B06: Text search
- [ ] US-C01: Event Detail page
- [ ] Gap #1: Search intent logging

#### Phase 2: Booking & Social Proof (Week 6-8)
**Goal:** Users can purchase tickets.
- [ ] US-D01 Phase 1: External ticket links
- [ ] US-D02: Ticket wallet with QR
- [ ] US-C02: Reviews & ratings
- [ ] US-C03: Favorites
- [ ] Gap #2: Notification system (critical!)
- [ ] Gap #3: Refund policy UI

#### Phase 3: Gamification & Personalization (Week 9-10)
**Goal:** Increase retention.
- [ ] US-A03: Onboarding vibe check
- [ ] US-E01: User profile
- [ ] US-E02: XP and levels
- [ ] US-B03: AI recommendations (v1: rules-based)

#### Phase 4: B2B Platform (Week 11-13)
**Goal:** Enable organizers to self-service.
- [ ] US-F01: Event creation
- [ ] US-F02: Analytics dashboard
- [ ] US-F03: Subscription tiers
- [ ] US-D03: Ticket scanning app
- [ ] Feature #7: Organizer verification

#### Phase 5: Monetization & Scale (Week 14-16)
**Goal:** Revenue generation.
- [ ] US-F04: Promoted events
- [ ] US-D01 Phase 2: Native checkout (Stripe/MercadoPago)
- [ ] Feature #1: Last-minute deals
- [ ] Feature #2: Group booking discounts
- [ ] Gap #4: Fraud detection

#### Phase 6: Social & Advanced Features (Post-Launch)
**Goal:** Viral growth.
- [ ] US-E03: Follow friends
- [ ] Feature #3: Waitlist
- [ ] Feature #6: Calendar view
- [ ] Feature #5: Weather integration

---

### 6.3 Risk Assessment

| Risk                          | Probability | Impact | Mitigation                                      |
|-------------------------------|-------------|--------|-------------------------------------------------|
| Low organizer adoption        | MEDIUM      | HIGH   | Manual onboarding, incentives (free Pro 3mo)   |
| Performance issues (map lag)  | HIGH        | MEDIUM | Implement pin clustering, lazy load carousel    |
| Payment integration delays    | MEDIUM      | HIGH   | Phase 1 uses external links as fallback        |
| Content moderation workload   | LOW         | HIGH   | Automated spam filters, community reporting     |
| Competition (Fever, EB)       | HIGH        | MEDIUM | Differentiate with local focus + gamification   |

---

## 7. Technical Architecture Notes

### 7.1 Backend Stack
- **Framework:** ASP.NET Core 8 (Web API)
- **Database:** PostgreSQL (recommended) or SQL Server
- **ORM:** Entity Framework Core 8
- **Auth:** ASP.NET Identity + JWT tokens
- **Payments:** Stripe SDK / MercadoPago SDK
- **Storage:** Azure Blob Storage (images/videos)
- **Notifications:** Firebase Cloud Messaging (FCM)

### 7.2 Frontend Stack
- **Framework:** Angular 17+ (standalone components)
- **Styling:** TailwindCSS + custom dark theme
- **State Management:** RxJS + Services (avoid NgRx for MVP)
- **Maps:** Leaflet.js with dark CartoDB tiles
- **QR Codes:** `qrcode` npm package
- **HTTP:** Angular HttpClient with Interceptors (auth token injection)

### 7.3 Deployment
- **Backend:** Azure App Service / Railway / Heroku
- **Frontend:** Vercel / Netlify
- **Database:** Supabase (PostgreSQL) or Azure SQL
- **CDN:** Cloudflare (for images)

---

## 8. Conclusion

This document represents the **complete functional specification** of Eventor's MVP and roadmap. It includes:
- **50+ user stories** with Gherkin acceptance criteria
- **6 ASCII wireframes** for key screens
- **10-entity data model** with relationships
- **7 critical gaps** identified and solutions proposed
- **7 high-value features** for differentiation
- **6-phase roadmap** with dependencies

**Next Steps:**
1. **Stakeholder Review:** Product Owner approves scope and priorities
2. **Technical Refinement:** Engineering team estimates stories in detail
3. **Sprint Planning:** Break Phase 0-1 into 2-week sprints
4. **Design Handoff:** Convert wireframes to high-fidelity mockups (Figma)
5. **Development Kickoff:** Start with US-A01 (Authentication)

---

**Document Prepared By:** AI Senior Product Architect  
**For:** Eventor Development Team  
**Status:** DRAFT v1.0 - Pending Approval
