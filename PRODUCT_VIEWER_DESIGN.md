# Product Viewer Builder Design

## Direction

The builder is a professional 3D product studio, not a marketing landing page.
Use a bright gradient workspace with glassy tool panels, while keeping the
model stage as the visual protagonist. The interface should feel precise and
polished, but lighter and more approachable than a pure dark developer tool.

## Sources

- Linear: surface ladder, hairline borders, restrained accent usage.
- Raycast: command-palette density and compact controls.
- Figma: clear editing panels and friendly empty states, but without large
  pastel storytelling blocks.

## Color System

- Canvas: light blue-gray paper with restrained teal and coral gradients.
- Surface 1: raised translucent panel.
- Surface 2: nested glass control surface.
- Hairline: low-contrast 1px borders.
- Primary action: deep graphite button on the light canvas.
- Accent: teal for focus/selection.
- Secondary accent: coral or muted amber only for small section markers.

## Layout

- Left rail: project metadata and part list.
- Center: full-bleed 3D stage with no card frame.
- Right inspector: part, material, and position editing.
- Bottom-right dock: lighting, settings, build action, and status.
- Panels should not visually collide. If content exceeds height, scroll inside
  the relevant panel instead of shrinking controls.

## Components

- Panel radius: 8px.
- Input height: 36-40px.
- Buttons: 8px radius, compact, confident.
- Primary button: high contrast, one per viewport.
- Preset cards: 2-column compact grid with material swatch, name, and default
  material numbers.
- Checkboxes: use browser-native checkbox with accent color, not custom novelty.

## Typography

- Use Inter-like Latin and Noto Sans SC fallback for Chinese.
- Headings are small and functional; no hero-scale text inside the tool.
- Captions can use uppercase English for system labels, but Chinese labels stay
  concise and readable.
- Letter spacing stays at 0 except tiny uppercase metadata.

## Avoid

- Giant hero text.
- Decorative cards inside cards.
- Beige, purple-gradient, dark-only, or one-color theme dominance.
- Big shadows as a substitute for hierarchy.
- Empty floating panels with no state.
- Visible tutorial copy beyond necessary empty states and labels.
