import re

path = 'src/components/AboutAndTransformations.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Colors
text = text.replace('const AMBER = "#F97316";', 'const ACCENT_BLUE = "#3B82F6";')
text = text.replace('AMBER', 'ACCENT_BLUE')
text = text.replace('249,115,22', '59,130,246')

# 2. Main background
text = text.replace('style={{ background: "#0B0C0E" }}', 'style={{ background: "#ffffff" }}')

# 3. Replace all text-white variants with text-black variants
text = text.replace('text-white', 'text-black')
text = text.replace('text-black/25', 'text-black/40')
text = text.replace('text-black/45', 'text-black/60')
text = text.replace('text-black/55', 'text-black/70')
text = text.replace('text-black/42', 'text-black/60')
text = text.replace('text-black/75', 'text-black/80')

# 4. Invert rgba for borders and dividers
text = text.replace('rgba(255,255,255', 'rgba(0,0,0')

# 5. Fix the vignette over images
text = text.replace('rgba(11,12,14,0)', 'rgba(255,255,255,0)')
text = text.replace('rgba(11,12,14,0.72)', 'rgba(255,255,255,0.85)')

# 6. Fix the PRE badge background
text = text.replace('rgba(11,12,14,0.70)', 'rgba(255,255,255,0.85)')

# 7. Drag handle divider line
text = text.replace(
    'linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.95) 85%, rgba(0,0,0,0.0) 100%)',
    'linear-gradient(to bottom, rgba(59,130,246,0.0) 0%, rgba(59,130,246,0.8) 15%, rgba(59,130,246,0.8) 85%, rgba(59,130,246,0.0) 100%)'
)
text = text.replace('boxShadow:  "0 0 16px rgba(0,0,0,0.22)"', 'boxShadow: "0 0 16px rgba(59,130,246,0.4)"')

# 8. Minor fixes
text = text.replace('color: "#C9B99A"', 'color: ACCENT_BLUE')
text = text.replace('text-[9.5px] font-medium tracking-[0.35em]', 'text-[9.5px] font-bold tracking-[0.35em]')
text = text.replace('0 32px 80px rgba(0,0,0,0.55)', '0 32px 80px rgba(0,0,0,0.12)')
text = text.replace('background: "rgba(90,80,70,0.25)"', 'background: "rgba(200,200,200,0.25)"')
text = text.replace('opacity-[0.018]', 'opacity-[0.03]')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated successfully')
