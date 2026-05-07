---
name: Finance Management System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#9b3e3b'
  on-tertiary: '#ffffff'
  tertiary-container: '#ba5551'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ae'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#7f2928'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  number-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  section-gap: 32px
  stack-sm: 8px
  stack-md: 16px
---

## Brand & Style
The design system is anchored in the concept of **Financial Serenity and Growth**. It targets young professionals and families in Vietnam who seek a reliable, sophisticated tool to manage their wealth. 

The aesthetic follows a **Corporate / Modern** style with a heavy emphasis on **Minimalism**. It prioritizes clarity over decorative elements, using generous whitespace to reduce cognitive load when viewing complex financial data. The emotional response is one of stability, competence, and clarity, ensuring users feel in control of their economic future.

## Colors
The palette uses **Emerald Green (#059669)** as the primary brand color to symbolize growth and prosperity. **Deep Navy Blue (#1E293B)** provides a foundation of institutional stability and is used for primary text and navigation elements.

Categorization is handled through a secondary palette designed for high contrast in charts and lists:
- **Thu nhập (Income/Salary):** Vibrant Green.
- **Ăn uống (Food):** Amber.
- **Hóa đơn (Bills):** Soft Red.
- **Mua sắm (Shopping):** Purple.
- **Di chuyển (Transport):** Blue.

The interface utilizes a light-mode default with a cool-grey background to minimize eye strain and make the emerald accents pop.

## Typography
This design system utilizes **Inter** for its exceptional readability in data-heavy environments. The typographic hierarchy is strictly enforced to guide the user through financial statements.

- **Numbers:** Use "tabular lining" figures where possible to ensure that currency amounts align perfectly in tables and lists.
- **Vietnamese Language:** Particular attention is paid to line heights (minimum 1.4x) to accommodate diacritics without crowding the text blocks.
- **Weight Usage:** Semi-bold and Bold weights are reserved for currency amounts and section headers to establish immediate visual importance.

## Layout & Spacing
The layout follows a **12-column fluid grid** for desktop and a **single-column fluid layout** for mobile, with a focus on "generous whitespace." 

- **Rhythm:** A 4px baseline grid ensures consistent vertical rhythm.
- **Padding:** Internal card padding is set to a minimum of 20px to prevent data from feeling cramped.
- **Grouping:** Use the `section-gap` (32px) to clearly separate different financial modules (e.g., separating "Tài khoản hiện có" from "Giao dịch gần đây").

## Elevation & Depth
This design system employs **Ambient Shadows** and **Tonal Layers** to create a sense of organized hierarchy.

- **Level 0 (Background):** #F8FAFC - The canvas.
- **Level 1 (Cards/Containers):** Pure white (#FFFFFF) with a very soft, diffused shadow (0px 4px 20px rgba(30, 41, 59, 0.05)). This is used for all primary content blocks.
- **Level 2 (Interactive/Floating):** Use a slightly tighter, darker shadow to indicate elements that can be dragged or clicked, such as "Thêm giao dịch" buttons.
- **Dividers:** Use low-contrast borders (1px Solid #E2E8F0) only when whitespace is insufficient to separate list items.

## Shapes
The shape language is **Rounded**, reflecting a modern and approachable professional tool.

- **Standard Elements:** Input fields, buttons, and cards use a 0.5rem (8px) corner radius.
- **Large Containers:** Dashboard widgets and main modals use a 1rem (16px) radius to soften the overall appearance of the interface.
- **Progress Bars:** Use fully rounded (pill-shaped) ends to communicate "completion" and "fluidity" in savings goals.

## Components

### Input Fields
Inputs must have a clear "Trạng thái" (State). The default border is #CBD5E1. On focus, the border transitions to Primary Emerald with a 2px outer glow. Labels are always visible above the field in `label-caps` style.

### Progress Bars
Used for "Mục tiêu tiết kiệm" (Savings Goals). The track is a light grey (#F1F5F9), and the fill is a gradient of Primary Emerald. Include a percentage label and a "Còn lại" (Remaining) amount indicator below the bar.

### Professional Charts
- **Biểu đồ tròn (Pie Charts):** Used for "Phân bổ chi tiêu" (Spending Allocation). Use a "Donut" style with the total amount displayed in the center.
- **Biểu đồ đường (Line Charts):** Used for "Xu hướng tài sản" (Wealth Trends). Use a smooth bezier curve with a subtle gradient area fill underneath the line.

### Data Tables
Structured with `body-md` text. The header row should have a subtle background tint (#F8FAFC) and use `label-caps`. Rows should have a hover state to improve scanability of long transaction lists.

### Buttons
- **Primary:** Solid Emerald with White text. Used for "Lưu" (Save) or "Thêm mới" (Add new).
- **Secondary:** Deep Navy outline or ghost style for "Hủy" (Cancel) or "Xuất báo cáo" (Export report).

### Cards
All financial summaries (Balance, Income, Expense) are housed in white cards with Level 1 elevation. Titles in these cards should always be in Deep Navy blue for maximum authority.