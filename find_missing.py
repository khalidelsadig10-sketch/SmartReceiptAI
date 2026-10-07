import re

with open(r'g:\Smart\frontend\assets\js\language.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract en block
en_match = re.search(r'en:\s*\{(.*?)\},?\s*ar:\s*\{', content, re.DOTALL)
ar_match = re.search(r'ar:\s*\{(.*?)\}\s*\};\s*const\s*titles', content, re.DOTALL)

if not en_match or not ar_match:
    print('Regex failed to match blocks')
    exit()

en_block = en_match.group(1)
ar_block = ar_match.group(1)

def get_keys(block):
    # Match keys before colon. e.g. dashboard: "Dashboard",
    return set(re.findall(r'^\s*([a-zA-Z0-9_]+)\s*:', block, re.MULTILINE))

en_keys = get_keys(en_block)
ar_keys = get_keys(ar_block)

missing = en_keys - ar_keys
print('Missing keys count:', len(missing))
for k in missing:
    print(k)
