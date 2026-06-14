import sys, os

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)

username = sys.argv[1]
text = sys.stdin.read()

output_dir = os.path.join(project_root, "output", username)
os.makedirs(output_dir, exist_ok=True)

filepath = os.path.join(output_dir, "result.txt")
with open(filepath, "w", encoding="utf-8") as f:
    f.write(text)

print(filepath)