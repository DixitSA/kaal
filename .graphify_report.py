import sys, json
from graphify.build import build_from_json
from graphify.cluster import score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json, to_html
from pathlib import Path

extraction = json.loads(Path('.graphify_extract.json').read_text())
analysis = json.loads(Path('.graphify_analysis.json').read_text())
labels_raw = json.loads(Path('.graphify_labels.json').read_text()) if Path('.graphify_labels.json').exists() else {}

G = build_from_json(extraction)
communities = {int(k): v for k, v in analysis['communities'].items()}
cohesion = {int(k): v for k, v in analysis['cohesion'].items()}
tokens = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}

# Use the labels we generated
labels = {int(k): v for k, v in labels_raw.items()}

# Regenerate questions with real community labels
questions = suggest_questions(G, communities, labels)

detection = json.loads(Path('.graphify_detect.json').read_text()) if Path('.graphify_detect.json').exists() else {
    'total_files': 177, 'total_words': 123182, 'needs_graph': True, 'warning': None, 'files': {}
}

report = generate(G, communities, cohesion, labels, analysis['gods'], analysis['surprises'], detection, tokens, '.', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding='utf-8')

# Also save updated analysis with questions
analysis['questions'] = questions
Path('.graphify_analysis.json').write_text(json.dumps(analysis, indent=2), encoding='utf-8')

# Generate HTML visualization
if G.number_of_nodes() <= 5000:
    to_html(G, communities, 'graphify-out/graph.html', community_labels=labels or None)
    print('graph.html written - open in any browser, no server needed')
else:
    print(f'Graph has {G.number_of_nodes()} nodes - too large for HTML viz. Use Obsidian vault instead.')

print('Report updated with community labels')
print(f'Questions available: {len(questions)}')
