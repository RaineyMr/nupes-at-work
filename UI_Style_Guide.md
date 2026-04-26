# Nupes at Work UI Style Guide

## 1. Brand Foundations

### Colors

#### Primary Palette
- **Crimson**: `#9D2235`
- **Cream**: `#F5E1C8`
- **On-Crimson Text (Light)**: `#FDF7F0`
- **On-Cream Text (Dark)**: `#1F2933`

#### Neutrals
- **Ink**: `#111827`
- **Charcoal**: `#4B5563`
- **Steel**: `#9CA3AF`
- **Fog**: `#E5E7EB`
- **Paper**: `#F9FAFB`

#### Accents
- **Gold Accent (achievement)**: `#CFAF5A`
- **Success (hired / complete)**: `#059669`
- **Warning (incomplete profile)**: `#D97706`
- **Error (failed action)**: `#B91C1C`

### Typography

#### Display / Brand
- **Font**: "Playfair Display" or "Cormorant Garamond" (serif)
- **Use**: Logo text, page titles, key headings

#### Body / UI
- **Font**: "Inter" or "System UI" (sans-serif)
- **Weights**: 400, 500, 600

#### Type Scale
- **H1**: 32px / 40px, bold (display font)
- **H2**: 24px / 32px, semibold
- **H3**: 20px / 28px, semibold
- **Body**: 16px / 24px, regular
- **Caption**: 13px / 18px, medium

### Spacing & Radius

#### Spacing Scale
4, 8, 12, 16, 24, 32 px

#### Border Radius
- **Buttons / inputs**: 6px
- **Cards**: 10px

#### Shadows
- **Card**: `0 8px 20px rgba(15, 23, 42, 0.08)`

## 2. Iconography System

Use abstract, non-trademarked symbols inspired by fraternity themes:

- **Shield outline**: dashboard, protection, home
- **Laurel wreath**: jobs, opportunities, achievement
- **Handshake**: networking, connections
- **Scroll**: resources, documents, resumes
- **Star trio**: milestones, honors, featured items
- **Cane-like divider**: subtle decorative line (no literal cane logo)

### Style
- **Stroke**: 1.5–2px
- **Corners**: slightly rounded
- **Default color**: Crimson `#9D2235` on light backgrounds, Cream `#F5E1C8` on Crimson

## 3. Component Library

### Buttons

#### Primary Button
- **Use**: main actions (Apply, Save, Continue)
- **Background**: Crimson `#9D2235`
- **Text**: `#FDF7F0`
- **Radius**: 6px
- **Padding**: 10px 18px
- **Hover**: darken to `#7F1B2A`
- **Disabled**: `#9CA3AF` background, `#E5E7EB` text

#### Secondary Button
- **Use**: secondary actions (View details, Cancel)
- **Background**: transparent
- **Border**: 1px Crimson
- **Text**: Crimson
- **Hover**: Crimson background, Cream text

#### Tertiary / Ghost
- **Use**: low-emphasis actions (View all, Learn more)
- **Text**: Charcoal `#4B5563`
- **Hover**: Fog background `#E5E7EB`

### Inputs

#### Text Input
- **Background**: Paper `#F9FAFB`
- **Border**: 1px Fog `#E5E7EB`
- **Radius**: 6px
- **Focus border**: Crimson `#9D2235`
- **Label**: 14px, medium, Charcoal
- **Helper text**: 13px, Steel `#9CA3AF`

#### Select / Dropdown
Same as text input, with right-aligned chevron icon in Steel.

### Cards

#### Job Card
- **Background**: Cream `#F5E1C8`
- **Left border**: 4px Crimson
- **Title**: H3, Crimson
- **Company / location**: Body, Charcoal
- **Meta row**: small icons (wreath, star) in Crimson
- **CTA**: Primary button (Apply) in bottom-right

#### Profile Summary Card
- **Background**: White
- **Border**: 1px Fog
- **Header**: "Profile Strength" with star trio icon
- **Progress bar**:
  - **Track**: Fog
  - **Fill**: Crimson

### Badges & Chips

#### Status Badge (Hired / Active / Pending)
- **Hired**: background `#ECFDF3`, text `#166534`
- **Active**: background `#EFF6FF`, text `#1D4ED8`
- **Pending**: background `#FEF3C7`, text `#92400E`

#### Tag Chip (e.g., "Finance", "STEM")
- **Background**: Fog
- **Text**: Charcoal
- **Radius**: 999px

## 4. Layout Wireframe (Dashboard)

### Overall Layout
**Structure**:
- Fixed top nav (64px height)
- Left sidebar (240px width)
- Main content area (fluid)
- **Background**: Paper `#F9FAFB`

### Top Nav
**Left**:
- "Nupes at Work" (display font, Cream)

**Right**:
- Notification icon
- User avatar with dropdown

### Sidebar

#### Sections

**Section 1: Core**
- Shield icon — Dashboard
- Laurel icon — Jobs
- Handshake icon — Network

**Section 2: Profile & Resources**
- User icon — My Profile
- Scroll icon — Resources
- Star trio — Achievements

**Active item**: Crimson pill with Cream text.

### Main Dashboard Content

#### Row 1: Welcome + Quick Stats
**Left (2/3 width)**:
- H1: "Welcome, Brother [Name]" (Crimson)
- Subtext: "Here's where your next opportunity begins."
- Thin decorative divider in faint Crimson (cane-like line)

**Right (1/3 width)**:
- Profile completion card
- Progress bar + "Complete profile" button

#### Row 2: Key Metrics (3 Cards)
- **Card 1**: Jobs Applied (wreath icon)
- **Card 2**: Connections Made (handshake icon)
- **Card 3**: Saved Roles (shield or star icon)

Each card: White background, subtle shadow, small icon in Crimson top-left.

#### Row 3: Job Listings
- **Section title**: "Opportunities for Achievement"
- List of job cards (as defined above)
- Right side: filters (location, industry, experience) in a filter panel.

#### Row 4: Resources & Community
**Left**: "Career Resources" (scroll icon) — links to resume templates, interview prep
**Right**: "Community Highlights" — curated content, events, or spotlight roles

## 5. Usage Hierarchy

- **Crimson**: primary actions, headings, key icons, active nav
- **Cream**: backgrounds for emphasis areas, sidebar, cards
- **Neutrals**: text, dividers, secondary UI
- **Gold**: subtle accent for "achievement" moments (badges, highlights)

## 6. Implementation Notes

### CSS Custom Properties
```css
:root {
  /* Colors */
  --crimson: #9D2235;
  --cream: #F5E1C8;
  --on-crimson: #FDF7F0;
  --on-cream: #1F2933;
  --ink: #111827;
  --charcoal: #4B5563;
  --steel: #9CA3AF;
  --fog: #E5E7EB;
  --paper: #F9FAFB;
  --gold: #CFAF5A;
  --success: #059669;
  --warning: #D97706;
  --error: #B91C1C;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  
  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-full: 999px;
}
```

### Typography Classes
```css
.display-font { font-family: 'Playfair Display', serif; }
.body-font { font-family: 'Inter', sans-serif; }

.h1 { font-size: 32px; line-height: 40px; font-weight: bold; }
.h2 { font-size: 24px; line-height: 32px; font-weight: 600; }
.h3 { font-size: 20px; line-height: 28px; font-weight: 600; }
.body { font-size: 16px; line-height: 24px; font-weight: 400; }
.caption { font-size: 13px; line-height: 18px; font-weight: 500; }
```

### Component Examples

#### Primary Button
```css
.btn-primary {
  background-color: var(--crimson);
  color: var(--on-crimson);
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px 18px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #7F1B2A;
}

.btn-primary:disabled {
  background-color: var(--steel);
  color: var(--fog);
}
```

#### Job Card
```css
.job-card {
  background-color: var(--cream);
  border-left: 4px solid var(--crimson);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}
```

## 7. Accessibility Guidelines

### Color Contrast
- Ensure all text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Crimson on Cream: ✅ Meets contrast requirements
- Charcoal on Paper: ✅ Meets contrast requirements

### Focus States
- All interactive elements must have visible focus states
- Use Crimson border for primary focus indicators
- Minimum 2px border width for focus indicators

### Screen Readers
- Use semantic HTML5 elements appropriately
- Provide alt text for all meaningful icons
- Ensure form inputs have proper labels and descriptions

## 8. Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Adaptations
- Stack dashboard rows vertically
- Convert sidebar to bottom navigation on mobile
- Adjust spacing scale for smaller screens (use 2px base unit)
- Ensure touch targets are minimum 44px

---

*This style guide should be referenced for all UI development in the Nupes at Work platform. Consistency in implementation is crucial for maintaining brand identity and user experience.*
