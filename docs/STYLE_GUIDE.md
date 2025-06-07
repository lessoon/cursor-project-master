# Style Guide

## 1. Brand Palette
| Token | HEX | Usage |
| ----- | --- | ----- |
| --color-primary   | #4F46E5 | Buttons, links |
| --color-secondary | #06B6D4 | Accents, tags |
| --color-bg        | #FFFFFF | App background |
| --color-surface   | #F8FAFC | Card / input bg |
| --color-text      | #111827 | Body text |

## 2. Typography
| Level | Font | Size / Line-height | Weight |
| ----- | ---- | ------------------ | ------ |
| H1 | Inter | 36 / 44 px | 700 |
| H2 | Inter | 28 / 36 px | 600 |
| Body | Inter | 16 / 24 px | 400 |
| Caption | Inter | 12 / 16 px | 400 |

## 3. Spacing & Sizing
- **Grid unit:** 4 px  
- **Container max-width:** 1280 px  
- **Section padding:** 24 px (top/bottom)  

## 4. Components
### 4.1 Button
| Variant | Background | Text | Radius | Shadow |
| ------- | ---------- | ---- | ------ | ------ |
| Primary | `--color-primary` | #FFF | 8 px | md |
| Secondary | `--color-surface` | `--color-primary` | 8 px | sm |

‘md’ shadow = 0 2 4 rgba(0,0,0,.08)

### 4.2 Card
- Border-radius: 16 px  
- Shadow: lg (0 4 12 rgba(0,0,0,.10))  
- Padding: 24 px  

## 5. Motion
- Enter animation: fade-in 200 ms + y-translate 8 px  
- Easing: cubic-bezier(.4, 0, .2, 1)

## 6. Accessibility
- Color-contrast ≥ 4.5 : 1 for text vs background  
- Focus ring: 2 px outline `--color-secondary`
