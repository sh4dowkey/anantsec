#!/usr/bin/env python3
"""
Create placeholder images for missing gallery assets
Run: python create_placeholders.py
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder(width, height, text, filename, bg_color=(40, 42, 45), text_color=(169, 169, 179)):
    """Create a placeholder image with text"""
    img = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a font, fallback to default if not available
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 40)
    except:
        font = ImageFont.load_default()
    
    # Calculate text position (center)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    position = ((width - text_width) // 2, (height - text_height) // 2)
    
    # Draw text
    draw.text(position, text, fill=text_color, font=font)
    
    # Save image
    img.save(filename)
    print(f"✅ Created: {filename}")

def main():
    """Create all placeholder images"""
    
    # Create directory if it doesn't exist
    os.makedirs('assets/album_images', exist_ok=True)
    
    placeholders = [
        ("assets/album_images/pwndbg_contribution_pr.png", 800, 600, "PWNDBG PR"),
        ("assets/album_images/crawler_output.png", 800, 600, "Crawler Output"),
        ("assets/album_images/ad_lab_diagram.png", 800, 600, "AD Lab Diagram"),
        ("assets/album_images/notebook_MITRE ATT&CK.png", 800, 600, "MITRE ATT&CK"),
        ("assets/album_images/github_workflow.png", 800, 600, "GitHub Workflow"),
        ("assets/album_images/crawler_code.png", 800, 600, "Crawler Code"),
        ("assets/album_images/ad_lab_readme.png", 800, 600, "AD Lab README"),
        ("assets/album_images/stegno_hide_msg.webp", 800, 600, "Steganography"),
        ("assets/album_images/htb_logo.png", 800, 600, "HackTheBox"),
        ("assets/img/favicon.png", 64, 64, "AS"),  # Favicon
        ("assets/img/og-image.png", 1200, 630, "anantsec Portfolio"),  # Open Graph
        ("assets/img/og-gallery.png", 1200, 630, "Portfolio Gallery"),
        ("assets/img/placeholder-cert.png", 800, 600, "Certificate"),
    ]
    
    for filename, width, height, text in placeholders:
        if not os.path.exists(filename):
            create_placeholder(width, height, text, filename)
        else:
            print(f"⏭️  Skipped: {filename} (already exists)")
    
    print("\n✨ All placeholders created successfully!")
    print("Replace these with your actual images when available.")

if __name__ == "__main__":
    main()