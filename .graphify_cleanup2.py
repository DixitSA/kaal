import json
from pathlib import Path
from datetime import datetime, timezone
from graphify.detect import save_manifest

# Save manifest for --update (re-detect since we deleted the file)
from graphify.detect import detect
detect_result = detect(Path('.'))
save_manifest(detect_result['files'])

# Update cumulative cost tracker
cost_path = Path('graphify-out/cost.json')
if cost_path.exists():
    cost = json.loads(cost_path.read_text(encoding='utf-8'))
else:
    cost = {'runs': [], 'total_input_tokens': 0, 'total_output_tokens': 0}

# No input/output tokens (used Agent tool, not direct LLM calls)
cost['runs'].append({
    'date': datetime.now(timezone.utc).isoformat(),
    'input_tokens': 0,
    'output_tokens': 0,
    'files': detect_result.get('total_files', 177),
})
cost['total_input_tokens'] += 0
cost['total_output_tokens'] += 0
cost_path.write_text(json.dumps(cost, indent=2), encoding='utf-8')

print(f'This run: 0 input tokens, 0 output tokens')
print(f'All time: {cost["total_input_tokens"]:,} input, {cost["total_output_tokens"]:,} output ({len(cost["runs"])} runs)')

# Clean up remaining temp files
for f in ['.graphify_detect.json', '.graphify_python', '.graphify_merge.py', 
          '.graphify_cleanup.py', '.graphify_split_chunks.py']:
    try:
        Path(f).unlink()
    except:
        pass

# Remove graphify-out/.needs_update if exists
try:
    Path('graphify-out/.needs_update').unlink()
except:
    pass

print('Cleanup done')
