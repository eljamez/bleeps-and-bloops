# Brand

The mark is one thick stroke with round caps and joins. It runs along a flat baseline, jumps into a small point, and comes back down. That point is the bleep. It then rises into a round bump with two dot eyes. That bump is the bloop, a little creature peeking up. The choice not to use a robot is [0006](decisions/0006-waveform-creature-not-a-robot.md).

## Files

Artwork lives in `site/public/brand/`. Favicon files live in `site/app/`, where Next.js picks them up.

| File | What it is |
| --- | --- |
| `mark.svg` | The mark in brand orange, transparent ground. |
| `mark-current.svg` | The same paths in `currentColor`. |
| `lockup-light.svg` | Mark plus the wordmark on cream. The ampersand is orange. Letters are outlines. |
| `lockup-dark.svg` | The same lockup, cream text on deep charcoal. |
| `app-icon.svg` | The mark centered on a cream rounded square. |

| File | Served as |
| --- | --- |
| `site/app/favicon.ico` | `/favicon.ico`, at 16, 32, and 48. |
| `site/app/icon.svg` | The icon SVG. A cream square with the mark, square corners, so a tab does not show empty corners. |
| `site/app/apple-icon.png` | The Apple touch icon, 180×180, full bleed. iOS masks the corners. The same pixels are at `site/public/apple-touch-icon.png`. |
| `site/app/opengraph-image.png` | The social image, 1200×630, the light lockup on cream. |

## Colors

| Name | Hex | Use |
| --- | --- | --- |
| Orange | `#F47428` | The stroke, the eyes, the ampersand. |
| Cream | `#FFFAEE` | Light ground, the app icon, text on the dark lockup. |
| Charcoal | `#2D2D2B` | The wordmark on the light lockup. |
| Deep charcoal | `#1B1E23` | The ground of the dark lockup. |

The site page uses a deeper paper, `#F3EEE4`, and ink `#2A241C`. The header logo sits on that paper. The mark stays `#F47428`. The header wordmark uses the page ink.

Charcoal `#2D2D2B` on cream `#FFFAEE` is 13.3:1. Cream `#FFFAEE` on deep charcoal `#1B1E23` is 16:1. Ink `#2A241C` on the page paper `#F3EEE4` is 13.3:1. All of those clear WCAG 2.1 AA for text.

Orange `#F47428` on cream is 2.7:1, and on the page paper it is 2.5:1. That is under the 3:1 mark for a graphic. A logo and a logotype are exempt from that test. The orange stays this bright. The name next to it is the charcoal or ink wordmark, which carries the contrast.

On deep charcoal the orange is 5.9:1. On the site's teal band (`#1F4F52`) it is 3.2:1.

## Type

The wordmark is [Nunito](https://fonts.google.com/specimen/Nunito) Bold, weight 700. It is a rounded geometric sans, under the SIL Open Font License. The lockup SVGs convert the letters to outlines, so they do not need the font installed. The site loads Nunito Bold only for the header wordmark.

Set it lowercase: `bleeps & bloops`. The ampersand is orange. The other letters are charcoal on a light ground, or cream on the dark ground.

## Minimum size

- The mark is 32px tall at the smallest. The eyes need about 48px of height before they read as dots. Under that, use it only where the wave itself is enough, such as a favicon.
- The lockup is 220px wide at the smallest. Narrower than that, use the mark on its own.
- Clear space is the thickness of the stroke, about one sixth of the mark's height, on every side. Do not crop the round caps.

## Do

- Use `mark.svg` on cream, on the site paper, or on deep charcoal.
- Use `mark-current.svg` when the mark should follow the text color.
- Use the light lockup on a light ground and the dark lockup on a dark ground.
- Keep the two eyes. They are what makes the bump a creature.
- On the site, the header wordmark is real text, so the name is on the page and not only in an image. The mark image is decorative (`alt=""`).

## Don't

- Don't replace the mark with a robot, an antenna, or a face with a mouth.
- Don't redraw the stroke in the site coral (`#8A3418`) or the teal.
- Don't add a smile, a body, or legs.
- Don't stretch it, rotate it, or outline the stroke in a second color.
- Don't set the wordmark in Fraunces, Atkinson, or another face.
- Don't put the light lockup on a dark ground, or the dark lockup on a light one.
- Don't use the lockup narrower than 220px.
