import json
from pathlib import Path
from collections import Counter
import re

# Load extraction (has node id -> label mapping)
extraction = json.loads(Path('.graphify_extract.json').read_text())
id_to_label = {n['id']: n.get('label', n['id']) for n in extraction['nodes']}
id_to_file = {n['id']: n.get('source_file', '') for n in extraction['nodes']}

# Load analysis
analysis = json.loads(Path('.graphify_analysis.json').read_text())
communities_raw = analysis['communities']  # {str(cid): [node_ids]}

# Build labels
labels = {}
for cid_str, node_ids in communities_raw.items():
    cid = int(cid_str)
    # Get labels for this community
    labels_in_community = [id_to_label.get(nid, nid) for nid in node_ids]
    files_in_community = [id_to_file.get(nid, '') for nid in node_ids]
    
    # Derive label from common terms in labels and files
    all_text = ' '.join(labels_in_community + files_in_community)
    # Extract meaningful words (skip generic terms)
    words = re.findall(r'[a-zA-Z]{4,}', all_text.lower())
    # Count and get top terms
    common = Counter(words).most_common(8)
    
    # Build 2-5 word label
    skip = {'calculate', 'compute', 'build', 'derive', 'generate', 'get', 'set', 'create', 
             'update', 'delete', 'route', 'page', 'component', 'module', 'index', 'config',
                 'utils', 'helper', 'service', 'data', 'info', 'test', 'spec', 'check'}
    meaningful = [w for w, c in common if w not in skip and len(w) > 3]
    
    if meaningful:
        label = ' '.join(meaningful[:3]).title()
    else:
        label = f'Community {cid}'
    
    labels[cid] = label[:40]  # Max 40 chars

# Print summary
for cid in sorted(labels.keys()):
    n_nodes = len(communities_raw[str(cid)])
    print(f'Community {cid:3d}: {labels[cid]:40s} ({n_nodes} nodes)')

# Save labels
Path('.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}, indent=2))
print(f'\nSaved labels for {len(labels)} communities')
