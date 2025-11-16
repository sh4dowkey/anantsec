# scripts/generate_certificates_json.py

import os
import json
import csv

CERT_FOLDER = '../assets/certificates'
OUTPUT_FILE = '../data/certificates.json'
METADATA_FILE = '../assets/certificates/cert_metadata.csv'

# Load CSV metadata into a dictionary
metadata = {}
if os.path.exists(METADATA_FILE):
    with open(METADATA_FILE, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            filename = row['file'].strip()
            metadata[filename] = {
                "title": row.get("title", "").strip(),
                "issuer": row.get("issuer", "").strip()
            }

certificates = []
badges = []
jobsim =[]

for file in sorted(os.listdir(CERT_FOLDER)):
    if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        meta = metadata.get(file, {})
        entry = {
            "file": file,
            "title": meta.get("title", "Unknown"),
            "issuer": meta.get("issuer", "Unknown")
        }

        if 'badge' in file.lower():
            badges.append(entry)
        elif 'jobsim' in file.lower():
            jobsim.append(entry)
        else:
            certificates.append(entry)

data = {
    "certificates": certificates,
    "jobsim" : jobsim,
    "badges": badges
}

with open(OUTPUT_FILE, 'w') as f:
    json.dump(data, f, indent=2)

print(f"✅ Generated {OUTPUT_FILE}")
