
import json
import urllib.request
import os

OUTPUT_PATH = 'src/data/coming_soon.json'

def ingest_coming_soon():
    print("--- ENTRANCE: Ingesting Coming Soon (501-550) via Python ---")
    query = 'collection:(feature_films) AND mediatype:(movies)'
    url = f"https://archive.org/advancedsearch.php?q=collection:(feature_films)%20AND%20mediatype:(movies)&sort[]=downloads%20desc&output=json&rows=550&fl[]=identifier&fl[]=title&fl[]=description&fl[]=downloads&fl[]=subject&fl[]=publicdate&fl[]=date"
    
    try:
        with urllib.request.urlopen(url) as response:
            data = json.load(response)
            all_docs = data['response']['docs']
            items = all_docs[500:550]
            
            processed = []
            for item in items:
                processed.append({
                    "id": item.get('identifier'),
                    "title": item.get('title'),
                    "description": " ".join(item.get('description')) if isinstance(item.get('description'), list) else item.get('description', ''),
                    "downloads": item.get('downloads'),
                    "image": f"https://archive.org/download/{item.get('identifier')}/__ia_thumb.jpg",
                    "backdrop": f"https://archive.org/download/{item.get('identifier')}/__ia_thumb.jpg",
                    "embedUrl": f"https://archive.org/embed/{item.get('identifier')}",
                    "date": item.get('publicdate') or item.get('date') or 'To be announced',
                    "topics": item.get('subject') if isinstance(item.get('subject'), list) else ([item.get('subject')] if item.get('subject') else []),
                    "rating": None,
                    "isComingSoon": True
                })
            
            os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
            with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
                json.dump(processed, f, indent=2)
                
            print(f"--- SUCCESS: Saved 50 upcoming movies to {OUTPUT_PATH} ---")
    except Exception as e:
        print(f"--- ERROR: Ingestion failed --- {e}")

if __name__ == "__main__":
    ingest_coming_soon()
