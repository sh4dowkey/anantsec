import os
import json
from bs4 import BeautifulSoup
from datetime import datetime

def extract_info_from_html(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        soup = BeautifulSoup(content, "html.parser")
        title = soup.title.string.strip() if soup.title else os.path.basename(filepath)
        date_tag = soup.find(attrs={"data-date": True})
        if date_tag:
            date = date_tag["data-date"]
        else:
            mtime = os.path.getmtime(filepath)
            date = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")
        return {
            "name": title,
            "file": os.path.basename(filepath),
            "date": date
        }

def generate_json_from_folder(input_folder, output_file):
    items = []
    for filename in os.listdir(input_folder):
        if filename.endswith(".html"):
            full_path = os.path.join(input_folder, filename)
            items.append(extract_info_from_html(full_path))

    items.sort(key=lambda x: x["date"], reverse=True)

    os.makedirs("data", exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2)

if __name__ == "__main__":
    folders = {
        "../posts/htb": "../data/htb.json",
        "../posts/bugbounty": "../data/bugbounty.json"
    }

    for folder, output in folders.items():
        generate_json_from_folder(folder, output)

    print("✅ JSON files for HTB and Bug Bounty generated successfully.")
