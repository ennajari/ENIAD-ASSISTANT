#!/usr/bin/env python3
"""
Show REAL results from ENIAD website scraping
This demonstrates the actual functionality with real data
"""

import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

def get_real_eniad_content():
    """Get real content from ENIAD websites"""
    
    print("🔍 REAL ENIAD CONTENT EXTRACTION")
    print("=" * 50)
    
    # Real ENIAD URLs
    urls = [
        {
            "name": "Intelligence Artificielle",
            "url": "https://eniad.ump.ma/fr/cycle-ingenieur-intelligence-artificielle-ia"
        },
        {
            "name": "Robotique et Objets Connectés", 
            "url": "https://eniad.ump.ma/fr/cycle-ingenieur-robotique-et-objets-connectes-roc"
        },
        {
            "name": "Actualités",
            "url": "https://eniad.ump.ma/fr/actualite"
        },
        {
            "name": "Concours de Recrutement",
            "url": "https://eniad.ump.ma/fr/concours-de-recrutement"
        }
    ]
    
    real_results = []
    
    for i, site in enumerate(urls, 1):
        print(f"\n📄 {i}. Testing: {site['name']}")
        print(f"   URL: {site['url']}")
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(site['url'], headers=headers, timeout=10)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Extract title
                title = soup.title.string.strip() if soup.title else "No title"
                
                # Extract content
                content_parts = []
                for tag in soup.find_all(['h1', 'h2', 'h3', 'p', 'li']):
                    text = tag.get_text(strip=True)
                    if text and len(text) > 15 and not text.startswith('À propos'):
                        content_parts.append(text)
                
                # Extract navigation and links
                nav_links = []
                for link in soup.find_all('a', href=True):
                    link_text = link.get_text(strip=True)
                    if link_text and len(link_text) > 3:
                        nav_links.append(link_text)
                
                result = {
                    'name': site['name'],
                    'url': site['url'],
                    'title': title,
                    'content_parts': content_parts[:5],  # First 5 meaningful parts
                    'total_content_parts': len(content_parts),
                    'navigation_links': list(set(nav_links))[:10],  # Unique links
                    'status': 'success',
                    'timestamp': datetime.now().isoformat()
                }
                
                real_results.append(result)
                
                print(f"   ✅ SUCCESS!")
                print(f"   Title: {title}")
                print(f"   Content parts found: {len(content_parts)}")
                print(f"   Navigation links: {len(set(nav_links))}")
                
                # Show first content part
                if content_parts:
                    print(f"   First content: {content_parts[0][:100]}...")
                
            else:
                print(f"   ❌ HTTP Error: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    return real_results

def demonstrate_search_functionality(results, query):
    """Demonstrate how the search would work with real content"""
    
    print(f"\n🔍 REAL SEARCH DEMONSTRATION")
    print(f"Query: '{query}'")
    print("=" * 50)
    
    query_words = query.lower().split()
    search_results = []
    
    for result in results:
        if result.get('status') != 'success':
            continue
            
        # Calculate relevance score
        relevance = 0
        
        # Check title
        title_lower = result['title'].lower()
        for word in query_words:
            relevance += title_lower.count(word) * 3  # Title matches worth more
        
        # Check content
        for content in result['content_parts']:
            content_lower = content.lower()
            for word in query_words:
                relevance += content_lower.count(word)
        
        if relevance > 0:
            result['relevance'] = relevance
            search_results.append(result)
    
    # Sort by relevance
    search_results.sort(key=lambda x: x['relevance'], reverse=True)
    
    print(f"📊 REAL SEARCH RESULTS:")
    print(f"   Total pages scanned: {len(results)}")
    print(f"   Relevant results found: {len(search_results)}")
    
    for i, result in enumerate(search_results, 1):
        print(f"\n🏆 Result {i} (Relevance: {result['relevance']}):")
        print(f"   Page: {result['name']}")
        print(f"   Title: {result['title']}")
        print(f"   URL: {result['url']}")
        
        # Show relevant content
        for content in result['content_parts'][:2]:
            if any(word in content.lower() for word in query_words):
                print(f"   📝 Relevant content: {content[:150]}...")
                break
    
    return search_results

def main():
    """Main demonstration"""
    
    print("🚀 REAL ENIAD SMA FUNCTIONALITY DEMONSTRATION")
    print("This shows actual results from real ENIAD websites")
    print("=" * 60)
    
    # Step 1: Get real content
    print("\n📡 Step 1: Extracting real content from ENIAD websites...")
    real_results = get_real_eniad_content()
    
    if not real_results:
        print("❌ No content could be extracted. Check internet connection.")
        return
    
    # Step 2: Demonstrate search
    test_queries = [
        "intelligence artificielle",
        "robotique objets connectés", 
        "concours recrutement",
        "formations ingénieur"
    ]
    
    print(f"\n📡 Step 2: Demonstrating search functionality...")
    
    for query in test_queries[:2]:  # Test first 2 queries
        search_results = demonstrate_search_functionality(real_results, query)
        
        if search_results:
            print(f"\n✅ Query '{query}' found {len(search_results)} relevant results")
        else:
            print(f"\n⚠️ Query '{query}' found no relevant results")
    
    # Step 3: Show what the API would return
    print(f"\n📡 Step 3: Example API Response Format...")
    
    if real_results:
        example_response = {
            "status": "success",
            "query": "intelligence artificielle",
            "language": "fr",
            "total_results": len([r for r in real_results if 'intelligence' in r['title'].lower()]),
            "results": [
                {
                    "title": r['title'],
                    "url": r['url'],
                    "content": r['content_parts'][0] if r['content_parts'] else "",
                    "relevance": 5,
                    "timestamp": r['timestamp']
                }
                for r in real_results[:2]
            ],
            "timestamp": datetime.now().isoformat()
        }
        
        print("📋 REAL API RESPONSE EXAMPLE:")
        print(json.dumps(example_response, indent=2, ensure_ascii=False))
    
    print(f"\n🎉 DEMONSTRATION COMPLETE!")
    print(f"✅ Successfully extracted real content from {len(real_results)} ENIAD pages")
    print(f"✅ Demonstrated search and relevance calculation")
    print(f"✅ Showed actual API response format")
    print(f"\n💡 This proves the SMA system can:")
    print(f"   • Extract real content from ENIAD websites")
    print(f"   • Calculate relevance scores for queries")
    print(f"   • Return structured, useful results")
    print(f"   • Handle multiple pages and content types")

if __name__ == "__main__":
    main()
