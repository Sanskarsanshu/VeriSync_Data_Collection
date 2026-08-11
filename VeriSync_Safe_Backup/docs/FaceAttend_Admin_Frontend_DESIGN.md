# FaceAttend Admin Frontend — DESIGN.md

> **Document status:** Final design specification  
> **Product:** FaceAttend  
> **Surface:** Admin Portal  
> **Primary platform:** Desktop web application  
> **Secondary platforms:** Tablet and mobile web  
> **Design direction:** Modern institutional SaaS, privacy-preserving, data-dense, trustworthy, calm, and attendance-focused  
> **Default theme:** Light  
> **Optional theme:** Dark  
> **Primary chart library:** ApexCharts  
> **Only icon library:** Lucide React  
> **Primary font:** Inter  
> **Frontend stack alignment:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui primitives, TanStack Query, TanStack Table, React Hook Form, Zod

---

# 1. Purpose of This Document

This file is the single source of truth for the visual design, information architecture, interaction model, responsive behaviour, accessibility requirements, and reusable UI patterns of the FaceAttend Admin Frontend.

Antigravity must use this document before creating or modifying any Admin Frontend screen.

This document defines:

- The visual identity of the Admin Portal
- Page layout and navigation structure
- Design tokens
- Typography and spacing
- Icons and data visualisation rules
- Table, form, dialog, workflow, and feedback patterns
- Screen-by-screen UI requirements
- Responsive behaviour
- Accessibility standards
- Security and privacy UX
- Loading, empty, error, offline, and unavailable-API states
- Design-quality acceptance criteria

This is not a generic dashboard template. Every design decision must support the administration of institutional data and secure attendance workflows.

---

# 2. Product Design Positioning

FaceAttend must visually feel like a serious SaaS product used by colleges and universities.

It must not look like:

- A student-made CRUD project
- A generic Bootstrap dashboard
- A social network
- A classroom content platform
- An LMS
- A messaging application
- A colourful consumer application
- A collection of unrelated cards
- A template where every section uses the same layout without considering its workflow

The intended design character is:

> **Institutional trust + modern SaaS clarity + operational efficiency.**

The interface must feel:

- Professional
- Secure
- Calm
- Organised
- Responsive
- Accurate
- Audit-ready
- Privacy-aware
- Scalable
- Easy to learn
- Efficient for repeated administrative work

---

# 3. Strict Product Scope

FaceAttend is an attendance-management platform.

The Admin Frontend may include:

- Institutional configuration
- Academic structure
- Teachers and Students
- Teacher assignments
- Course authorisations
- Course registrations
- Timetables and scheduled classes
- Academic calendars and holidays
- Attendance monitoring
- Attendance records
- Correction workflows
- Attendance sheets
- Reports and analytics
- System-generated alerts
- Security monitoring
- Audit logs
- Data import and export
- System settings
- Admin and role management
- Help and operational support

The Admin Frontend must never contain:

- Chat
- Direct messages
- Group messages
- Announcement composer
- Teacher or Student posts
- Comments
- Replies
- Discussion feeds
- Class streams
- Assignments
- Assignment submissions
- Study-material upload
- Notes upload
- Syllabus upload
- Course documents
- File-sharing areas
- Social profile browsing
- Arbitrary free-text broadcasts

System Alerts are read-only, backend-generated operational events. They are not a messaging feature.

---

# 4. Core Design Principles

## 4.1 Clarity Before Decoration

Every component must communicate a task, status, risk, or result.

Do not add decorative charts, illustrations, badges, or animations that do not help the Admin make a decision.

## 4.2 Dense but Not Crowded

Admin software must support large tables and many filters.

Use:

- Clear grouping
- Progressive disclosure
- Sticky headers
- Secondary detail drawers
- Column controls
- Saved views
- Context-aware actions

Do not solve density by shrinking text below accessible sizes.

## 4.3 State Must Always Be Visible

Every workflow must expose its current state.

Examples:

- Teacher invitation pending
- Student verification under review
- Authorisation code expired
- Attendance session active
- Correction awaiting Teacher recommendation
- Import validation failed
- Export generating
- Account suspended

Use labels, icons, timestamps, and semantic badges. Never rely on colour alone.

## 4.4 Safe by Default

Sensitive and destructive actions must require deliberate confirmation.

The design must make safe actions easy and risky actions explicit.

## 4.5 One Consistent System

All modules must use the same:

- Typography
- Icons
- Status colours
- Spacing
- Card styles
- Table behaviour
- Form patterns
- Dialog patterns
- Toast patterns
- Empty states
- Error states

## 4.6 Configuration, Not Hardcoding

The UI must never assume only one College, Department, Programme, Session, Batch, Semester, Section, Teacher, or Course.

Every selector and page must support multiple records.

## 4.7 Accessibility Is a Base Requirement

Accessibility is not an optional final polish. Keyboard navigation, focus visibility, contrast, semantic labels, and screen-reader support must be part of every component.

---

# 5. Final Visual Direction

The final visual direction is:

> **Deep navy navigation, indigo primary actions, neutral light surfaces, compact professional typography, restrained status colours, thin borders, subtle shadows, and highly structured data presentation.**

The interface should resemble the quality level of modern products such as:

- Linear
- Stripe Dashboard
- Vercel Dashboard
- GitHub Enterprise
- Retool
- Modern university administration SaaS

Do not copy these products directly. Use them only as a quality benchmark.

---

# 6. Brand Identity

## 6.1 Product Name

Use **FaceAttend** everywhere.

Do not display:

- VaultID
- VeriSync
- Face Attend
- Face-Attend

## 6.2 Product Descriptor

Preferred descriptor:

> Privacy-Preserving Multi-Factor Attendance Management

Short UI descriptor:

> Secure Attendance Administration

## 6.3 Logo Treatment

The Admin sidebar logo area must include:

- FaceAttend symbol
- FaceAttend wordmark
- Optional environment badge in development or staging

Logo layout:

- Symbol size: 30–32 px
- Wordmark: 17–18 px, 650 weight
- Logo area height: 64 px
- Horizontal padding: 18–20 px

When the sidebar is collapsed, show only the symbol.

Do not place a large college logo in the global sidebar. College branding belongs in the context selector or College Configuration screen.

---

# 7. Colour System

## 7.1 Primary Brand Palette

| Token | Purpose | Value |
|---|---|---|
| `brand-50` | Pale selected backgrounds | `#EEF2FF` |
| `brand-100` | Hovered subtle controls | `#E0E7FF` |
| `brand-200` | Focus ring support | `#C7D2FE` |
| `brand-300` | Decorative accent | `#A5B4FC` |
| `brand-400` | Secondary accent | `#818CF8` |
| `brand-500` | Main brand | `#6366F1` |
| `brand-600` | Primary action | `#4F46E5` |
| `brand-700` | Primary hover | `#4338CA` |
| `brand-800` | Primary pressed | `#3730A3` |
| `brand-900` | Deep brand | `#312E81` |
| `brand-950` | Darkest brand | `#1E1B4B` |

Primary buttons must use `brand-600`.

The main source recommendation of `#4F46E5` remains the final primary action colour.

## 7.2 Sidebar Palette

| Token | Purpose | Value |
|---|---|---|
| `sidebar-bg` | Main sidebar | `#081A3A` |
| `sidebar-bg-elevated` | Hover/group surfaces | `#102655` |
| `sidebar-active` | Active item | `#4F46E5` |
| `sidebar-text` | Primary text | `#F8FAFC` |
| `sidebar-muted` | Inactive text | `#AAB7CE` |
| `sidebar-border` | Dividers | `#1E3765` |
| `sidebar-hover` | Hover surface | `rgba(255,255,255,0.07)` |

## 7.3 Light Theme Surface Palette

| Token | Purpose | Value |
|---|---|---|
| `page-bg` | Application background | `#F6F8FC` |
| `surface` | Cards and panels | `#FFFFFF` |
| `surface-subtle` | Secondary panels | `#F8FAFC` |
| `surface-hover` | Hover state | `#F8FAFC` |
| `surface-selected` | Selected neutral row | `#F1F5F9` |
| `text-primary` | Headings and values | `#0F172A` |
| `text-secondary` | Supporting text | `#64748B` |
| `text-muted` | Placeholders and hints | `#94A3B8` |
| `border` | Standard border | `#E2E8F0` |
| `border-strong` | Strong divider | `#CBD5E1` |
| `focus-ring` | Keyboard focus | `#818CF8` |

## 7.4 Semantic Colours

| State | Foreground | Background | Border |
|---|---|---|---|
| Success / Active / Present | `#15803D` | `#DCFCE7` | `#BBF7D0` |
| Warning / Pending | `#B45309` | `#FEF3C7` | `#FDE68A` |
| Danger / Error / Absent | `#B91C1C` | `#FEE2E2` | `#FECACA` |
| Information | `#1D4ED8` | `#DBEAFE` | `#BFDBFE` |
| Neutral / Inactive | `#475569` | `#F1F5F9` | `#E2E8F0` |
| Late / Attention | `#C2410C` | `#FFEDD5` | `#FED7AA` |
| Review / Suspicious | `#7E22CE` | `#F3E8FF` | `#E9D5FF` |

Never use red for ordinary navigation or decorative highlights.

## 7.5 Dark Theme Tokens

Dark mode is supported but is not the default.

| Token | Value |
|---|---|
| `dark-page-bg` | `#07101F` |
| `dark-surface` | `#0D1728` |
| `dark-surface-subtle` | `#111D31` |
| `dark-surface-hover` | `#17243A` |
| `dark-text-primary` | `#F8FAFC` |
| `dark-text-secondary` | `#CBD5E1` |
| `dark-text-muted` | `#94A3B8` |
| `dark-border` | `#22314A` |
| `dark-border-strong` | `#334155` |

Dark theme must preserve semantic meaning and chart readability.

## 7.6 CSS Token Contract

```css
:root {
  --brand-50: #EEF2FF;
  --brand-100: #E0E7FF;
  --brand-200: #C7D2FE;
  --brand-300: #A5B4FC;
  --brand-400: #818CF8;
  --brand-500: #6366F1;
  --brand-600: #4F46E5;
  --brand-700: #4338CA;
  --brand-800: #3730A3;
  --brand-900: #312E81;
  --brand-950: #1E1B4B;

  --sidebar-bg: #081A3A;
  --sidebar-bg-elevated: #102655;
  --sidebar-active: #4F46E5;
  --sidebar-text: #F8FAFC;
  --sidebar-muted: #AAB7CE;
  --sidebar-border: #1E3765;

  --page-bg: #F6F8FC;
  --surface: #FFFFFF;
  --surface-subtle: #F8FAFC;
  --surface-hover: #F8FAFC;
  --surface-selected: #F1F5F9;

  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;

  --border: #E2E8F0;
  --border-strong: #CBD5E1;
  --focus-ring: #818CF8;

  --success: #15803D;
  --success-bg: #DCFCE7;
  --success-border: #BBF7D0;

  --warning: #B45309;
  --warning-bg: #FEF3C7;
  --warning-border: #FDE68A;

  --danger: #B91C1C;
  --danger-bg: #FEE2E2;
  --danger-border: #FECACA;

  --info: #1D4ED8;
  --info-bg: #DBEAFE;
  --info-border: #BFDBFE;

  --neutral: #475569;
  --neutral-bg: #F1F5F9;
  --neutral-border: #E2E8F0;

  --review: #7E22CE;
  --review-bg: #F3E8FF;
  --review-border: #E9D5FF;

  --chart-1: #4F46E5;
  --chart-2: #2563EB;
  --chart-3: #0891B2;
  --chart-4: #16A34A;
  --chart-5: #F59E0B;
  --chart-6: #EF4444;
  --chart-7: #9333EA;
  --chart-8: #64748B;

  --shadow-card:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.05);

  --shadow-popover:
    0 12px 30px rgba(15, 23, 42, 0.12),
    0 2px 8px rgba(15, 23, 42, 0.08);
}
```

---

# 8. Typography

## 8.1 Font Family

Use **Inter** for the complete Admin Portal.

Fallback:

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Use tabular numerals for:

- Attendance percentages
- Counts
- Dates
- Times
- IDs
- Report values
- Matrix totals

```css
font-variant-numeric: tabular-nums;
```

## 8.2 Type Scale

| Role | Size | Line height | Weight |
|---|---:|---:|---:|
| Display metric | 32 px | 40 px | 700 |
| Page title | 24 px | 32 px | 700 |
| Section title | 18 px | 26 px | 650 |
| Card title | 15 px | 22 px | 600 |
| Body | 14 px | 21 px | 400 |
| Body strong | 14 px | 21 px | 600 |
| Small | 13 px | 18 px | 400 |
| Label | 12 px | 16 px | 600 |
| Metadata | 12 px | 16 px | 400 |
| Table heading | 12 px | 16 px | 650 |

Do not use 10 px or 11 px text for essential information.

## 8.3 Text Rules

- Use sentence case.
- Avoid full uppercase except compact technical badges.
- Page titles must be short and descriptive.
- Avoid vague buttons such as “Submit” when “Create Teacher” is clearer.
- Use consistent terminology across all modules.
- Keep secondary explanations below 90 characters where practical.
- Do not use marketing language inside operational screens.

---

# 9. Spacing and Geometry

## 9.1 Base Spacing Scale

Use a 4 px base with an 8 px layout rhythm.

| Token | Value |
|---|---:|
| `space-1` | 4 px |
| `space-2` | 8 px |
| `space-3` | 12 px |
| `space-4` | 16 px |
| `space-5` | 20 px |
| `space-6` | 24 px |
| `space-8` | 32 px |
| `space-10` | 40 px |
| `space-12` | 48 px |
| `space-16` | 64 px |

## 9.2 Border Radius

| Component | Radius |
|---|---:|
| Small controls | 6 px |
| Inputs/buttons | 8 px |
| Cards | 12 px |
| Large panels | 14 px |
| Dialogs | 16 px |
| Pills/badges | 999 px |

Avoid excessive rounded “bubble” styling.

## 9.3 Shadows

Cards primarily use borders. Shadows are subtle.

Use:

- Border + minimal shadow for cards
- Stronger shadow only for dialogs, command palettes, menus, and popovers
- No coloured shadows
- No large floating-card effects

---

# 10. Icon System

## 10.1 Only Icon Library

Use **Lucide React** for all interface icons.

Do not mix:

- Lucide
- Font Awesome
- Material Icons
- Heroicons
- Tabler
- Bootstrap icons
- Emoji icons

If Lucide does not include an exact concept:

1. Choose the closest Lucide icon.
2. Use a text label to clarify it.
3. Create a custom icon only as a final option, matching Lucide’s visual geometry.

## 10.2 Icon Style

- Outline icons only
- Default size: 18 px
- Sidebar size: 18 px
- Summary-card size: 20–22 px
- Empty-state size: 36–44 px
- Stroke width: 1.8
- Button icon gap: 8 px
- Icons must align to a 20 px box

Do not use an icon without an accessible name when the icon is the only control content.

## 10.3 Final Navigation Icon Mapping

| Navigation | Lucide icon |
|---|---|
| Dashboard | `LayoutDashboard` |
| College Configuration | `Landmark` |
| Campuses | `MapPinned` |
| Departments | `Building2` |
| Programmes | `BookOpen` |
| Academic Sessions | `CalendarRange` |
| Batches / Cohorts | `UsersRound` |
| Academic Structure | `Network` |
| Rooms | `DoorOpen` |
| Subjects | `BookMarked` |
| Subject Offerings | `LibraryBig` |
| Teachers | `UserRoundCheck` |
| Teacher Assignments | `UserCog` |
| Students | `Users` |
| Student Verification | `ScanFace` |
| Course Authorisations | `KeyRound` |
| Active Courses | `PanelsTopLeft` |
| Course Registrations | `ClipboardCheck` |
| Timetable | `CalendarDays` |
| Scheduled Classes | `Clock3` |
| Academic Calendar | `Calendar` |
| Holidays | `CalendarOff` |
| Attendance Management | `ScanLine` |
| Attendance Records | `ClipboardList` |
| Attendance Corrections | `FilePenLine` |
| Attendance Sheets | `TableProperties` |
| Reports and Analytics | `ChartNoAxesCombined` |
| System Alerts | `Bell` |
| Security Centre | `ShieldCheck` |
| Audit Logs | `ScrollText` |
| Data Import | `FileUp` |
| Data Export | `FileDown` |
| System Settings | `Settings` |
| Admin Management | `ShieldUser` |
| Help and Support | `CircleHelp` |

---

# 11. Data Visualisation

## 11.1 Chart Library

Use **ApexCharts** for every chart.

Do not mix ApexCharts with:

- Chart.js
- ECharts
- D3 charts
- Highcharts

## 11.2 Chart Principles

Charts must:

- Answer an operational question
- Use real backend data
- Include accessible text summaries
- Include tooltips
- Use percentage or count formatting correctly
- Support responsive resizing
- Have loading, empty, and error states
- Use restrained animation
- Use stable category-to-colour mapping
- Avoid three-dimensional effects
- Avoid gradients that reduce readability
- Avoid decorative gauge charts when a number is clearer

## 11.3 Chart Type Mapping

| Information | Preferred chart |
|---|---|
| Monthly attendance trend | Smooth area-line |
| Daily attendance trend | Line or column |
| Present vs absent | Stacked bar |
| Subject comparison | Horizontal bar |
| Department comparison | Horizontal bar |
| Attendance status distribution | Donut |
| Verification success | Donut or radial progress |
| Low-attendance distribution | Histogram or horizontal bar |
| Attendance by weekday/time | Heatmap |
| Scheduled vs conducted classes | Grouped column |
| Correction workflow volume | Stacked bar |
| Login/security events | Line or column |
| Import validation results | Stacked bar |

## 11.4 Chart Colour Order

```css
--chart-1: #4F46E5;
--chart-2: #2563EB;
--chart-3: #0891B2;
--chart-4: #16A34A;
--chart-5: #F59E0B;
--chart-6: #EF4444;
--chart-7: #9333EA;
--chart-8: #64748B;
```

For semantic attendance charts:

- Present: green
- Absent: red
- Pending review: amber or purple
- Late: orange
- Cancelled: slate
- Holiday: blue
- Not applicable: light slate

Do not assign random colours on every render.

## 11.5 Chart Container

Standard analytics card:

- Header height determined by content
- Title: 15 px / 600
- Description: 13 px
- Optional period selector on right
- Chart minimum height: 280 px
- Standard height: 320 px
- Large dashboard chart: 360 px
- Card padding: 20–24 px
- Tooltip values formatted with tabular numerals

## 11.6 Chart Empty State

Do not render empty axes.

Show:

- Relevant Lucide icon
- “No attendance data yet”
- One-line explanation
- Optional link to configure the timetable or open Attendance Management

---

# 12. Responsive Breakpoints

Use these product breakpoints:

| Name | Width |
|---|---:|
| Mobile small | 360 px |
| Mobile | 480 px |
| Tablet | 768 px |
| Compact desktop | 1024 px |
| Desktop | 1280 px |
| Wide desktop | 1440 px |
| Extra wide | 1600 px+ |

Admin is desktop-primary, but every page must remain functional at 768 px and readable at 360 px.

---

# 13. Global Application Shell

## 13.1 Desktop Structure

```text
┌──────────────────────────────────────────────────────────────────┐
│ Sidebar │ Sticky top bar                                         │
│         ├─────────────────────────────────────────────────────────┤
│         │ Breadcrumb + Page title + Page actions                  │
│         ├─────────────────────────────────────────────────────────┤
│         │ Contextual filter bar, when required                    │
│         ├─────────────────────────────────────────────────────────┤
│         │ Main page content                                      │
└──────────────────────────────────────────────────────────────────┘
```

## 13.2 Sidebar Dimensions

- Expanded width: 264 px
- Collapsed width: 72 px
- Fixed on desktop
- Full-height
- Internal scroll for navigation
- Logo area: 64 px
- Bottom account/help area remains visible
- Smooth width transition: 160–200 ms
- No exaggerated slide animation

At widths below 1024 px, the sidebar becomes a drawer.

## 13.3 Top Bar

- Height: 64 px
- White surface in light theme
- Bottom border
- Sticky
- Left: mobile navigation trigger and breadcrumbs
- Centre: optional global search
- Right: context selector, alerts, help, appearance, profile

Top bar actions must not wrap.

## 13.4 Page Content Width

For data-heavy pages:

- Use available width
- Maximum content width: 1680 px
- Page horizontal padding:
  - 32 px on wide desktop
  - 24 px on desktop
  - 20 px on tablet
  - 16 px on mobile

For forms:

- Preferred maximum form width: 880–1040 px
- Do not stretch input fields across a 1600 px screen

## 13.5 Page Header

Every page uses:

- Breadcrumb
- Page title
- Short description, when necessary
- Primary action
- Secondary actions or overflow menu
- Optional status/context chip

Example:

```text
Students
Manage authorised Student records and verification status.

[Import Students] [Add Student]
```

---

# 14. Navigation Architecture

## 14.1 Sidebar Groups

### Overview

- Dashboard

### Academic Setup

- College Configuration
- Campuses
- Departments
- Programmes
- Academic Sessions
- Batches / Cohorts
- Academic Structure
- Rooms
- Subjects
- Subject Offerings
- Timetable
- Scheduled Classes
- Academic Calendar
- Holidays

### User Management

- Teachers
- Teacher Assignments
- Students
- Student Verification
- Admin Management

### Course Management

- Course Authorisations
- Active Courses
- Course Registrations

### Attendance

- Attendance Management
- Attendance Records
- Attendance Corrections
- Attendance Sheets

### Insights

- Reports and Analytics
- System Alerts

### Security and Data

- Security Centre
- Audit Logs
- Data Import
- Data Export

### Configuration

- System Settings
- Help and Support

## 14.2 Navigation Behaviour

- Groups may collapse.
- The active group remains expanded.
- The active page uses indigo background and white icon/text.
- Inactive items use muted sidebar text.
- Hover uses a transparent white surface.
- Group headings use 11–12 px uppercase only as compact navigation metadata.
- Collapsed mode shows tooltips.
- Use badges only for actionable counts:
  - Pending Student verification
  - Open corrections
  - Security alerts
- Do not display decorative counters.

## 14.3 Permission-Aware Navigation

Navigation must be generated from the authenticated Admin’s permissions.

Do not merely hide pages while leaving routes reachable.

The same permission model must control:

- Sidebar visibility
- Page access
- Buttons
- Bulk actions
- Row actions
- Export access
- Sensitive fields

---

# 15. Global Context Selector

Institutional Admin work depends on context.

The top bar must provide a structured context selector when the Admin has access to multiple entities:

- Organisation
- College
- Campus
- Academic Session
- Programme
- Semester
- Section

Behaviour:

- Only show dimensions relevant to the current Admin scope.
- Preserve context across navigation.
- Reflect active context in the URL when appropriate.
- Provide “All permitted” only where aggregate data is allowed.
- Warn before changing context when an unsaved form exists.
- Never silently change the academic session.

Compact display example:

```text
Patna Women's College
2025–2027 · Semester IV
```

---

# 16. Global Search and Command Palette

Use a command palette opened with:

- `Ctrl + K`
- `Cmd + K`

Search categories:

- Pages
- Students
- Teachers
- Courses
- Subjects
- Attendance sessions
- Correction requests
- Audit records, only with permission

Rules:

- Group results by category.
- Show identifying metadata.
- Respect RBAC and scope.
- Keyboard navigation is mandatory.
- Never expose out-of-scope records.
- Provide recent destinations.
- Do not search raw biometric data.

---

# 17. Reusable Page Templates

## 17.1 Data Index Page

Use for Students, Teachers, Subjects, Courses, and similar records.

Structure:

1. Page header
2. KPI summary strip when useful
3. Filter toolbar
4. Bulk-action toolbar when rows are selected
5. Server-driven data table
6. Pagination
7. Optional detail drawer

## 17.2 Record Detail Page

Structure:

1. Back navigation
2. Record identity header
3. Status badge
4. Primary and secondary actions
5. Summary information
6. Tabs
7. Activity or audit history
8. Related records

## 17.3 Create/Edit Form Page

Structure:

1. Page header
2. Form section cards
3. Sticky action bar on long forms
4. Validation summary
5. Save/cancel controls
6. Unsaved-change protection

## 17.4 Review Queue

Use for:

- Student verification
- Attendance corrections
- Class-change approvals
- Security events
- Import validation

Structure:

1. Queue metrics
2. Filter bar
3. Split layout on desktop:
   - Queue list
   - Review detail panel
4. Full-screen stacked view on mobile
5. Decision actions remain sticky

## 17.5 Analytics Page

Structure:

1. Global filters
2. Key metrics
3. Primary trend
4. Comparison charts
5. Detailed tables
6. Export action
7. Data freshness timestamp

## 17.6 Settings Page

Structure:

- Left secondary navigation
- Settings form in main panel
- Save state
- Change history
- Permission warning
- Sensitive-setting confirmation

---

# 18. Core Components

## 18.1 Buttons

Variants:

- Primary
- Secondary
- Outline
- Ghost
- Danger
- Link

Sizes:

- Small: 32 px
- Default: 38–40 px
- Large: 44 px

Rules:

- Use one primary button per action region.
- Destructive buttons use danger styling.
- Loading buttons retain width.
- Disabled buttons must provide an explanation when the reason is not obvious.
- Icon-only buttons require tooltips and accessible labels.

## 18.2 Inputs

Standard height: 40 px.

Every field includes:

- Visible label
- Optional indicator
- Help text when necessary
- Error text
- Correct autocomplete value
- Disabled reason where relevant

Do not use placeholders as labels.

## 18.3 Selectors

Use:

- Searchable combobox for long lists
- Standard select for fewer than 8 stable options
- Cascading selectors for academic hierarchy
- Multi-select only when a workflow genuinely supports multiple values

Cascading example:

```text
College → Department → Programme → Session → Batch → Semester → Section
```

Clear dependent values when a parent changes.

## 18.4 Date and Time Controls

- Use locale-aware display.
- Store and transmit ISO values.
- Show timezone when operationally relevant.
- Avoid ambiguous date formats.
- Use `26 Jul 2026` in dense tables.
- Use `26 July 2026` in detail views.
- Use `10:30 AM` for time in the India deployment.

## 18.5 Status Badges

Badge includes:

- Text
- Optional Lucide icon
- Semantic foreground
- Pale semantic background
- Border

Examples:

- Active
- Pending approval
- Suspended
- Expired
- Present
- Absent
- Pending review
- Cancelled
- Not applicable

## 18.6 Cards

Card styles:

- Standard card
- Metric card
- Alert card
- Review card
- Security card
- Chart card

Standard card:

- Radius: 12 px
- Border: 1 px
- Padding: 20–24 px
- Subtle shadow
- No unnecessary coloured header

## 18.7 Metric Cards

Metric card contains:

- Label
- Main value
- Optional comparison
- Small semantic icon
- Optional trend
- Click-through only when a meaningful destination exists

Do not overload one card with a mini chart, progress bar, three labels, and multiple buttons.

## 18.8 Tabs

- Use tabs for peer views of one record.
- Do not use tabs as a replacement for main navigation.
- Maintain selected tab in the URL.
- Support keyboard navigation.
- Use horizontal scrolling on small screens.

## 18.9 Tooltips

Use for:

- Icon-only controls
- Abbreviations
- Truncated labels
- Security or verification status explanation
- Disabled action reasons

Do not place essential information only inside a tooltip.

---

# 19. Data Table System

## 19.1 Table Behaviour

All large tables use TanStack Table with server-side:

- Pagination
- Sorting
- Filtering
- Search
- Column visibility
- Saved views where useful

## 19.2 Table Structure

- Sticky header
- Row height: 48–56 px
- Compact density option
- Checkbox selection
- Primary identity column remains visible
- Actions column pinned right on desktop
- Horizontal scroll when necessary
- Clear focus state for keyboard navigation

## 19.3 Column Rules

- Do not show every database field by default.
- Prioritise decision-relevant information.
- Show IDs only when useful.
- Truncate long values with tooltip.
- Align numbers right.
- Align status and dates consistently.
- Use tabular numerals.
- Use friendly values, not raw enum names.

## 19.4 Bulk Actions

When rows are selected:

- Replace or augment the filter toolbar with a bulk toolbar.
- Show selected count.
- Allow clear selection.
- Require confirmation for sensitive actions.
- Display partial-failure results clearly.

## 19.5 Row Actions

Preferred:

- One clear primary row action when applicable
- Overflow menu for secondary actions

Do not display 6 small icon buttons in every row.

## 19.6 Mobile Tables

At mobile widths:

- Keep critical columns visible.
- Allow horizontal scroll for attendance matrices.
- Convert administrative lists into structured cards when this improves usability.
- Provide a full record drawer/page for hidden details.
- Never remove access to an action solely because the screen is narrow.

---

# 20. Forms and Validation

## 20.1 Form Layout

- Single column for critical workflows
- Two columns for related short fields on desktop
- One column on mobile
- Group fields into semantic cards
- Keep related identifiers together
- Use clear section descriptions

## 20.2 Validation

Use:

- Zod client validation
- Backend validation as source of truth
- Inline errors
- Error summary at top for long forms
- Focus first invalid field
- Preserve entered values after server errors

## 20.3 Unsaved Changes

When leaving a dirty form:

- Show confirmation dialog
- Explain that changes will be lost
- Allow stay or discard
- Do not display the warning when no changes exist

## 20.4 Dependent Field Loading

When a field depends on another field:

- Disable until the parent is selected
- Show contextual helper text
- Show loading state
- Clear stale selections
- Handle empty result

---

# 21. Dialog, Drawer, and Confirmation Patterns

## 21.1 Dialog

Use for:

- Short focused forms
- Confirmation
- Step-up authentication
- One-time secret reveal
- Simple approval/rejection

Maximum standard width: 560–640 px.

## 21.2 Drawer

Use for:

- Record preview
- Secondary details
- Audit history
- Quick edit
- Review detail

Desktop width: 520–680 px.

On mobile, drawers become full-screen.

## 21.3 Destructive Confirmation

Must include:

- Exact record name
- Consequence
- Required reason when policy demands it
- Password/MFA step-up for high-risk actions
- Explicit destructive button label

Example:

```text
Deactivate Dr. Asha Singh?

The Teacher will no longer be able to access FaceAttend. Historical
courses and attendance records will remain available.

Reason [required]

[Cancel] [Deactivate Teacher]
```

## 21.4 One-Time Secret Dialog

For Course Authorisation codes:

- Prevent accidental closing without warning
- Clearly state it is shown once
- Copy button
- Secure email-delivery action if backend supports it
- Expiry and scope summary
- Mask after dismissal
- Never allow later retrieval
- Do not store plaintext in frontend state longer than needed

---

# 22. Feedback and System States

## 22.1 Loading

Use:

- Skeletons for initial page loads
- Inline spinner for small actions
- Button loading state for mutations
- Progress indicator for imports and exports
- Never blank the entire page during refetch

## 22.2 Empty State

Every empty state includes:

- Relevant icon
- Clear title
- Short explanation
- Primary next step when permitted

Examples:

- No Teachers have been added
- No active Attendance Sessions
- No Corrections awaiting review
- No records match these filters

## 22.3 Error State

Show:

- What failed
- Whether the user can retry
- Stable request ID when provided
- Safe next step
- Support link for persistent failures

Never expose stack traces.

## 22.4 Offline State

- Persistent compact banner
- Disable unsafe mutations
- Preserve form input locally in memory
- Allow retry
- Do not falsely report success
- Attendance monitoring must show stale-data timestamp

## 22.5 Success Feedback

- Use toast for simple successful actions
- Use persistent result panel for imports, exports, or complex workflows
- Update the UI immediately after confirmed mutations
- Do not show a toast as the only evidence of a critical result

## 22.6 API Unavailable State

During development or incomplete backend integration:

- Show a clearly labelled development-only integration banner.
- Display the exact missing API capability.
- Keep forms inspectable.
- Disable mutation controls only when the endpoint genuinely does not exist.
- Do not silently substitute fake data.
- Do not label disabled pages as complete.
- Do not ship production with “API unavailable” actions.

Production Definition of Done requires every required action to use a real backend endpoint.

---

# 23. Notifications and System Alerts

System Alerts are backend-generated.

The Admin UI may:

- List alerts
- Filter alerts
- Mark read
- Mark all read
- Open the related record
- Display severity
- Display generated timestamp
- Display delivery state

The Admin UI must not include:

- Compose alert
- Message field
- Broadcast button
- Reply
- Comment
- Free-text template editor

Alert wording must be rendered from approved frontend templates and structured payloads.

---

# 24. Security and Privacy UX

## 24.1 Sensitive Data

Do not expose:

- Password hashes
- Refresh tokens
- OTP secrets
- Raw face embeddings
- Biometric vectors
- Internal encryption keys
- Full device fingerprints
- Hidden risk-model fields
- Out-of-scope Student or Teacher data

## 24.2 Sensitive Field Display

Use masking for:

- Phone numbers where full value is unnecessary
- Email addresses in broad lists when policy requires it
- Authorisation codes
- Device identifiers
- IP addresses for lower-privilege roles

## 24.3 Student Face Verification Review

The review UI must:

- Show only authorised temporary review media
- Display consent and retention status
- Display capture quality and risk flags
- Avoid download actions
- Avoid exposing embeddings
- Clearly record approval/rejection/resubmission
- Show auto-deletion or retention information
- Require a reason for rejection or resubmission

## 24.4 Step-Up Authentication

Require password or MFA re-verification for:

- Deactivating an Admin
- Changing role/scope
- Resetting face enrolment
- Blocking a device
- Undoing an approved correction
- Changing critical attendance policy
- Restoring data
- Generating high-scope exports

## 24.5 Session UX

Provide:

- Current session indicator
- Automatic-expiry warning
- “Stay signed in” action
- Logout everywhere
- Session revocation
- Suspicious login warning
- Clear login-history timestamps

---

# 25. Dashboard Design

## 25.1 Dashboard Goal

The Dashboard must answer:

1. What requires action now?
2. What is happening today?
3. Is attendance operating normally?
4. Are there verification or security risks?
5. How is attendance trending?

## 25.2 Dashboard Layout

### Row 1: Page Heading and Context

- Dashboard title
- Current College/session/semester context
- Last updated timestamp
- Refresh action

### Row 2: Priority Metrics

Recommended cards:

- Students
- Verified Students
- Teachers
- Active Courses
- Classes Today
- Attendance Sessions Today
- Average Attendance
- Open Corrections

Use 4 columns at 1440 px, 2 columns on tablet, 1 column on mobile.

### Row 3: Operational Attention

Two-column layout:

- Action Required queue
- Today’s Schedule / Live Sessions

Action Required may contain:

- Pending Student verification
- Courses awaiting approval
- Correction requests
- Expiring Course Authorisations
- Security incidents

### Row 4: Primary Analytics

- Attendance Trend: 2/3 width
- Attendance Status Distribution: 1/3 width

### Row 5: Comparison Analytics

- Subject-wise attendance
- Students below threshold
- Scheduled vs conducted classes

### Row 6: Recent Administrative Activity

Read-only audit-backed activity table.

This is not a social feed and has no reply or reaction controls.

## 25.3 Dashboard Interaction

- Metric cards link to filtered pages.
- Charts support period selection.
- Clicking a chart point opens a filtered detail view where meaningful.
- Live sessions update without full-page reload.
- Stale data must be labelled.
- Dashboard filters must be reflected in API requests.

---

# 26. Screen-by-Screen Design Requirements

# 26.1 College Configuration

Layout:

- College identity card
- Institutional settings
- Attendance policy summary
- Working days
- Timezone
- Default class duration
- Branding preview
- Change history

Use a structured form, not a large table when only one College is in context.

For multi-College Administrators, begin with a College table and open detail/edit pages.

# 26.2 Campuses

Table columns:

- Campus
- Code
- College
- Address summary
- Rooms
- Status

Actions:

- Add Campus
- Edit
- Activate/deactivate
- Open Rooms

# 26.3 Departments

Table columns:

- Department
- Code
- Head
- Programmes
- Teachers
- Students
- Status

Detail tabs:

- Overview
- Programmes
- Teachers
- Students
- Audit history

# 26.4 Programmes

Table columns:

- Programme
- Short name
- Code
- Department
- Duration
- Semesters
- Section capacity
- Status

Use numeric validation and prevent impossible semester/year combinations.

# 26.5 Academic Sessions

Use a timeline-oriented detail view.

Show:

- Admission period
- Session start/end
- Semester start
- Teaching start
- Attendance start
- Exam period
- Vacation
- Current status

Highlight that dates before the teaching start are Not Applicable for attendance.

# 26.6 Batches / Cohorts

Table columns:

- Batch
- Programme
- Admission year
- Graduation year
- Current year
- Student count
- Status

Batch is distinct from Academic Session.

# 26.7 Academic Structure

Use a hierarchical tree/table hybrid:

```text
Programme
└── Session
    └── Batch
        └── Year
            └── Semester
                └── Section
```

Allow expansion without loading the full hierarchy at once.

# 26.8 Rooms

Table columns:

- Room
- Code
- Campus
- Capacity
- Type
- Availability status

Show timetable conflicts and capacity warnings.

# 26.9 Subjects

Table columns:

- Subject
- Code
- Programme
- Year/Semester
- Type
- Credits
- Weekly classes
- Status

Do not include syllabus or document-upload controls.

# 26.10 Subject Offerings

Show the specific delivery of a Subject within a Session/Batch/Semester/Section.

Columns:

- Subject
- Programme
- Session
- Batch
- Semester
- Section
- Teachers assigned
- Course status

# 26.11 Teachers

Table columns:

- Teacher identity
- Employee ID
- Department
- Designation
- Verification
- Assigned Subjects
- Active Courses
- Account status
- Last login

Detail tabs:

- Overview
- Assignments
- Courses
- Attendance activity
- Security
- Audit history

Do not show uploaded documents or messaging activity.

# 26.12 Teacher Assignments

Use a guided assignment workflow:

1. Select Teacher
2. Select academic context
3. Select Subject
4. Select role
5. Set effective dates
6. Review conflicts
7. Confirm

Display server validation before final save.

# 26.13 Students

Table columns:

- Student identity
- Roll number
- Registration number
- Programme
- Semester
- Section
- Verification
- Courses
- Attendance
- Account status

Detail tabs:

- Overview
- Enrolments
- Attendance
- Corrections
- Verification
- Security
- Audit history

# 26.14 Student Verification

Use a review queue.

Desktop layout:

- Left: filtered queue
- Centre: Student identity and capture comparison
- Right: quality, consent, risk, and decision controls

Do not provide image-download controls.

# 26.15 Course Authorisations

Table columns:

- Teacher
- Subject
- Session
- Semester
- Section
- Status
- Created
- Expires
- Uses

Primary action:

- Generate Authorisation

Use the one-time secret dialog.

# 26.16 Active Courses

Card/table toggle may be offered.

Default to table for Admin efficiency.

Columns:

- Course
- Subject code
- Teacher
- Academic context
- Enrolled count
- Next class
- Attendance average
- Status

Do not show streams, posts, materials, assignments, or messages.

# 26.17 Course Registrations

Table columns:

- Student
- Course
- Method
- Eligibility
- Capacity state
- Approval
- Registration date

Provide:

- Automatic enrolment run
- Manual authorised registration
- Student-request review

Final approval belongs to authorised Admin/Academic Coordinator.

# 26.18 Timetable

Desktop design:

- Week grid
- Day and list view
- Filters
- Conflict panel
- Drag-and-drop only if backend validation is preserved
- Explicit save/confirm after movement

Use colour by course only as a secondary cue. Text labels remain essential.

# 26.19 Scheduled Classes

Table/calendar hybrid.

Columns:

- Date
- Time
- Subject
- Teacher
- Section
- Room
- Class type
- Attendance method
- Status

Actions:

- View
- Reschedule
- Cancel
- Approve change
- Open Attendance Session

# 26.20 Academic Calendar

Views:

- Month
- Week
- Agenda

Event types use semantic chips.

Do not overload the month view with full descriptions.

# 26.21 Holidays

Table columns:

- Holiday
- Date range
- Scope
- Type
- Recurrence
- Status

Clearly distinguish:

- Holiday
- Special Working Day
- Single-class cancellation

# 26.22 Attendance Management

This is the central Admin attendance page.

Top metrics:

- Active sessions
- Present today
- Absent today
- Pending review
- Verification failures

Main sections:

- Live Sessions
- Session History
- Attendance Records
- Suspicious Attempts

Live session card/table includes:

- Course
- Teacher
- Section
- Start time
- Time remaining
- Enrolled
- Present
- Pending
- Failed attempts

# 26.23 Attendance Records

High-density server table.

Columns:

- Date/time
- Student
- Roll number
- Course
- Scheduled class
- Status
- Verification
- Marked time
- Correction state

Do not allow inline direct status editing.

# 26.24 Emergency Manual Attendance

Use a dedicated guarded workflow:

1. Select Scheduled Class
2. Select Student
3. View current state
4. Select requested emergency result
5. Enter structured reason
6. Step-up authentication
7. Confirm
8. Record audit result

Manual attendance must never look like an ordinary editable table cell.

# 26.25 Attendance Corrections

Review queue with:

- Student and class context
- Existing status
- Requested status
- Structured reason
- Technical event references
- Teacher recommendation
- Timeline
- Admin decision

No supporting-document uploader.

Decision controls:

- Approve
- Reject
- Request structured clarification
- Close

# 26.26 Attendance Sheets

Use a matrix.

- Rows: Students
- Columns: actual dates
- Sticky first columns
- Sticky summary columns
- Horizontal scrolling
- Status legend
- Month selector
- Course/subject/section filters
- Print/export actions

Statuses:

- `1`
- `0`
- `H`
- `C`
- `NA`
- `E`
- `P`
- `M`
- `L`, only when configured

Do not assume 30 days.

# 26.27 Reports and Analytics

Sections:

- Students
- Teachers
- Courses
- Departments
- Verification
- Corrections
- Security
- Administrative activity

Every chart must have:

- Filter context
- Date range
- Data freshness
- Text/table alternative
- Export where permitted

# 26.28 System Alerts

Read-only table/feed.

Fields:

- Alert type
- Recipient
- Severity
- Related record
- Generated time
- Delivery/read state

No compose control.

# 26.29 Security Centre

Dashboard cards:

- Failed logins
- Locked accounts
- Face mismatches
- QR replay attempts
- Device anomalies
- Suspicious exports
- Course-code failures

Main layout:

- Security trend
- Open events queue
- Risk-type distribution
- High-risk accounts
- Administrative actions

Use red only for real risk or destructive actions.

# 26.30 Audit Logs

Read-only table.

Columns:

- Time
- Actor
- Role
- Action
- Target
- Result
- IP summary
- Request ID

Detail drawer:

- Old values
- New values
- Reason
- Device context
- Correlation/request ID

Audit records must have no edit or delete controls.

# 26.31 Data Import

Wizard:

1. Select entity
2. Download template
3. Upload CSV/XLSX
4. Validate
5. Review errors
6. Confirm commit
7. View result

Show:

- Valid rows
- Invalid rows
- Duplicates
- Warnings
- Row-level reasons

No commit before validation preview.

# 26.32 Data Export

Show:

- Report type
- Applied filters
- Requested by
- Generated time
- Expiry
- Status
- Download

Use background-generation progress.

Generated links must expire.

# 26.33 System Settings

Settings groups:

- Attendance
- Account security
- Course Authorisation
- Biometric retention
- Alerts
- Data retention
- Imports and exports
- Operational settings

Use typed controls, not a generic key/value editor for normal Administrators.

# 26.34 Admin Management

Table columns:

- Admin
- Role
- Scope
- MFA
- Status
- Last login

Role assignment must show the exact permission and institutional scope.

# 26.35 Help and Support

Include:

- Searchable help topics
- Admin setup guide
- Attendance policy explanation
- Verification troubleshooting
- Import guide
- Security guidance
- Privacy and retention policy
- Technical issue reporting

Do not introduce live chat unless separately approved outside the attendance platform.

---

# 27. Authentication Screens

## 27.1 Admin Login

Layout:

- Clean split-screen at wide desktop
- Form panel remains dominant
- Optional restrained brand/illustration panel
- No stock photos
- No distracting motion

Fields:

- Official email
- Password
- Remember this device, only if policy supports it

Actions:

- Sign in
- Forgot password
- Verification/help

Security states:

- Incorrect credentials
- Account locked
- MFA required
- Password expired
- Suspended account
- Session timeout

## 27.2 MFA

Support:

- Authenticator code
- Recovery code
- Optional verified email OTP

Use six separate visual slots only if keyboard/paste behaviour remains accessible.

## 27.3 Forgot/Reset Password

- Clear password rules
- Strength feedback
- Expired-link state
- Success state
- Return-to-login action

---

# 28. Responsive Behaviour

## 28.1 Desktop

- Expanded sidebar
- Multi-column dashboard
- Split review queues
- Full data tables
- Sticky actions
- Detail drawers

## 28.2 Compact Desktop and Tablet

- Collapsible sidebar
- Two-column dashboard
- Reduced table columns
- Filters in a drawer where needed
- Review detail may become a two-panel layout

## 28.3 Mobile

- Navigation drawer
- Single-column pages
- Sticky bottom primary action only when helpful
- Tables become cards or horizontally scroll
- Dialogs become full-screen sheets
- Forms become single-column
- Charts use reduced labels and horizontal scrolling only when necessary

Admin mobile support must prioritise:

- Viewing live attendance
- Approving or rejecting urgent corrections
- Reviewing alerts
- Checking schedules
- Basic account security

Complex bulk import and large attendance sheets may remain desktop-optimised, but must display a clear explanation instead of breaking.

---

# 29. Motion and Micro-Interactions

Use motion sparingly.

Allowed:

- Sidebar collapse
- Menu opening
- Dialog/drawer transition
- Skeleton shimmer
- Chart initial reveal
- Status update transition
- Button loading state

Timing:

- Micro interaction: 120–160 ms
- Standard transition: 160–220 ms
- Large drawer/dialog: 200–260 ms

Respect `prefers-reduced-motion`.

Do not use:

- Constant floating animations
- Bouncing icons
- Large parallax
- Confetti for administrative actions
- Long page transitions
- Motion that delays data access

---

# 30. Accessibility Standard

Target **WCAG 2.2 AA**.

Requirements:

- Keyboard access to every action
- Visible focus ring
- Logical tab order
- Semantic heading order
- Form labels
- Error announcements
- Dialog focus trapping
- Escape to close where safe
- Screen-reader table labels
- Chart text alternatives
- Colour contrast
- 44 px touch targets where possible
- Status not communicated by colour alone
- Reduced-motion support
- Zoom support at 200%
- Skip-to-content link

Axe checks must be part of automated UI testing.

---

# 31. Performance Design Requirements

- Use route-level code splitting.
- Lazy-load ApexCharts.
- Virtualise large tables when necessary.
- Debounce search.
- Use server pagination.
- Avoid fetching hidden tabs.
- Preserve filter state.
- Use optimistic updates only for low-risk actions.
- Avoid optimistic updates for attendance corrections, role changes, security actions, or authorisation generation.
- Show data freshness for live pages.
- Use image optimisation for profile photos.
- Never load raw verification images before the review panel is opened.

---

# 32. Error Code to UX Mapping

| Backend condition | UI behaviour |
|---|---|
| Unauthenticated | Refresh once, then redirect to login |
| Forbidden | Permission page or disabled control with explanation |
| Out-of-scope/not found | Standard not-found state without leaking existence |
| Validation error | Inline field error |
| Conflict | Preserve form and show conflict resolution |
| Rate limited | Countdown and retry guidance |
| Session expired | Re-authentication dialog |
| MFA required | Open step-up flow |
| Backend unavailable | Persistent service-status banner |
| Request timeout | Retry with request ID |
| Duplicate action | Show existing result rather than duplicate |
| Stale update | Display conflict and reload latest data |

---

# 33. Development Integration Gap Policy

The current implementation report indicates that Auth endpoints exist but many Phase 1 REST controllers are missing.

The correct product decision is:

1. Do not create fake production data.
2. Do not claim missing integrations are complete.
3. The design system and page structure may be implemented while backend work is completed.
4. Mutation actions may be visibly disabled in development only.
5. Every disabled action must state the exact missing backend capability.
6. The final Phase 2 Definition of Done is not satisfied until all required real endpoints exist.
7. The preferred path is to complete the missing Phase 1 controllers before declaring Phase 2 complete.
8. UI-only scaffolding may be used for design review, but it is not the final integrated Admin Frontend.
9. Do not build a permanent “API unavailable” product experience around unfinished backend work.
10. Generate and maintain an endpoint integration matrix.

---

# 34. Design QA Checklist

## Brand and Consistency

- [ ] FaceAttend name used globally
- [ ] Inter used globally
- [ ] Lucide is the only icon library
- [ ] ApexCharts is the only chart library
- [ ] Indigo/navy palette used consistently
- [ ] No arbitrary colours
- [ ] No mismatched border radii
- [ ] No mixed button styles

## Navigation and Layout

- [ ] Sidebar groups match the information architecture
- [ ] Permission-aware navigation
- [ ] Active state is obvious
- [ ] Breadcrumbs are correct
- [ ] Context selector persists
- [ ] Page headers have clear primary actions
- [ ] No horizontal page overflow outside intentional tables/matrices

## Tables

- [ ] Server pagination
- [ ] Sorting and filters
- [ ] Loading, empty, and error states
- [ ] Keyboard access
- [ ] Column visibility
- [ ] Mobile alternative
- [ ] No direct attendance status editing

## Forms

- [ ] Visible labels
- [ ] Zod validation
- [ ] Backend errors mapped
- [ ] Dirty-form warning
- [ ] Dependent selectors clear correctly
- [ ] Destructive actions require confirmation
- [ ] Sensitive actions use step-up authentication

## Charts

- [ ] Real operational purpose
- [ ] Correct chart type
- [ ] Stable colours
- [ ] Tooltips
- [ ] Text alternative
- [ ] Empty state
- [ ] Loading state
- [ ] API error state
- [ ] Responsive labels

## Accessibility

- [ ] WCAG 2.2 AA
- [ ] Keyboard navigation
- [ ] Visible focus
- [ ] Screen-reader labels
- [ ] Contrast
- [ ] Reduced motion
- [ ] 200% zoom
- [ ] Axe tests pass

## Scope

- [ ] No messages
- [ ] No announcement composer
- [ ] No assignments
- [ ] No materials
- [ ] No document-sharing
- [ ] No posts/comments/replies
- [ ] No syllabus upload
- [ ] No correction attachment upload
- [ ] System Alerts remain event-generated

---

# 35. Final Antigravity Design Instruction

```text
Read DESIGN.md before implementing any FaceAttend Admin Frontend screen.

Build a modern, institutional, production-grade SaaS Admin Portal. Use a deep
navy sidebar, indigo primary actions, light neutral surfaces, restrained status
colours, Inter typography, Lucide React icons, and ApexCharts visualisations.

The Admin Portal is desktop-primary and data-dense, but must remain responsive,
accessible, and usable on tablet and mobile. Use consistent page headers,
server-driven tables, structured forms, review queues, secure confirmation
dialogs, meaningful loading/empty/error states, and permission-aware navigation.

Use only Lucide React for icons. Do not mix icon libraries.
Use only ApexCharts for graphs. Do not mix chart libraries.
Do not use fake data as a permanent substitute for missing APIs.
Do not mark a module complete until its real Phase 1 API is integrated.

Do not build messaging, announcements, assignments, materials, file sharing,
social feeds, posts, comments, replies, syllabus uploads, or correction
attachment uploads.

All sensitive actions must be explicit, permission-aware, audit-conscious, and
protected by confirmation or step-up authentication where required.

Every page must look like part of one coherent FaceAttend SaaS design system,
not a collection of unrelated templates.
```

---

# 36. Final Design Decision

The final FaceAttend Admin Frontend design is:

- **Brand:** FaceAttend
- **Style:** Modern institutional SaaS
- **Default theme:** Light
- **Sidebar:** Deep navy
- **Primary action:** Indigo
- **Page background:** Soft neutral grey
- **Cards:** White with thin borders and restrained shadows
- **Font:** Inter
- **Icons:** Lucide React only
- **Charts:** ApexCharts only
- **Layout:** Data-dense, structured, desktop-primary
- **Responsive model:** Full desktop, condensed tablet, functional mobile
- **Accessibility:** WCAG 2.2 AA
- **Scope:** Attendance-only
- **Security:** Privacy-aware and confirmation-driven
- **Data policy:** Real API integration, no permanent mocks
- **Interaction quality:** Calm, fast, explicit, and audit-ready
