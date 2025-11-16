import os
import json
from datetime import datetime

notes_dir = '../assets/pdf/notes'
output_file = '../data/notes.json'

valid_extensions = ('.pdf', '.ppt', '.pptx', '.doc', '.docx', '.txt', '.xlsx', '.csv', '.md', '.html')

notes = []
for fname in os.listdir(notes_dir):
    if fname.lower().endswith(valid_extensions):
        path = os.path.join(notes_dir, fname)
        stat = os.stat(path)
        notes.append({
            "name": fname,
            "url": f"{notes_dir}/{fname}",
            "date": datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d')
        })

notes.sort(key=lambda x: x["date"], reverse=True)

with open(output_file, 'w') as f:
    json.dump(notes, f, indent=4)

print(f"[+] {len(notes)} notes written to {output_file}")
