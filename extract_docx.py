import zipfile
import xml.etree.ElementTree as ET
import glob
import os

files = glob.glob(r'C:\Users\RABAK STORE\OneDrive\Desktop\*\SmartReceiptAI_Thesis_with_TOC.docx')
if not files:
    print('File not found')
    exit()

docx_path = files[0]

try:
    with zipfile.ZipFile(docx_path) as docx:
        xml_content = docx.read('word/document.xml')
        
    tree = ET.fromstring(xml_content)
    
    # The namespace for Word XML
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    
    paragraphs = []
    for p in tree.findall('.//w:p', ns):
        texts = [node.text for node in p.findall('.//w:t', ns) if node.text]
        if texts:
            paragraphs.append(''.join(texts))
            
    # Save the extracted text to a markdown file in the workspace
    with open('thesis_extracted.md', 'w', encoding='utf-8') as f:
        f.write('\n\n'.join(paragraphs))
        
    print('Successfully extracted', len(paragraphs), 'paragraphs to thesis_extracted.md')
    print('First 10 paragraphs:')
    for p in paragraphs[:10]:
        print(p)
except Exception as e:
    print('Error:', e)
