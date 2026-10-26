#!/usr/bin/env python3
"""Consistency check for one product in the docs prototype.

Usage: python3 .claude/skills/pkd-to-docs/scripts/check_product.py <product-id> [--deny deny.txt] [--repo PATH]

Checks:
  - product is registered in products.js and its nav file exports NAV + PAGE_TITLES
  - every nav page id has a title, an App.jsx case and (unless a reference page) a TOC_MAP entry
  - every TOC id exists as an h2 id in the product's page files
  - ApiLinks pageId/productId targets resolve
  - each page component renders a draft banner and a quick-answer
  - no banned naming (Genesis, v2-private, v4/v5 labels)
  - no deny-list terms (customers, partners, competitors, people) in page files or the AI context file
Exit code 1 if any ERROR.
"""
import argparse
import os
import re
import sys

ap = argparse.ArgumentParser()
ap.add_argument('product')
ap.add_argument('--deny', help='file with one screened term per line')
ap.add_argument('--repo', default=os.getcwd())
a = ap.parse_args()

SRC = os.path.join(a.repo, 'src')
errors, warns = [], []
def err(m): errors.append(m)
def warn(m): warns.append(m)
def read(p):
    with open(p, encoding='utf-8') as f:
        return f.read()

products = read(os.path.join(SRC, 'data', 'products.js'))
m = re.search(r"'%s'\s*:\s*\{(.*?)\n  \}," % re.escape(a.product), products, re.S)
if not m:
    sys.exit("ERROR product '%s' not found in src/data/products.js" % a.product)
entry = m.group(1)
nav_var = re.search(r"nav:\s*([A-Z0-9_]+)", entry).group(1)
titles_var = re.search(r"pageTitles:\s*([A-Z0-9_]+)", entry).group(1)
imp = re.search(r"import\s*\{([^}]*\b%s\b[^}]*)\}\s*from\s*'\./(nav-[^']+)'" % nav_var, products)
if not imp:
    sys.exit("ERROR cannot find the import for %s in products.js" % nav_var)
nav_src = read(os.path.join(SRC, 'data', imp.group(2) + '.js'))

def block(name):
    mm = re.search(r"(?:export )?const %s\s*=\s*([\[{])" % name, nav_src)
    if not mm:
        return ''
    i, depth, open_c = mm.end() - 1, 0, mm.group(1)
    close_c = ']' if open_c == '[' else '}'
    for j in range(i, len(nav_src)):
        if nav_src[j] == open_c: depth += 1
        elif nav_src[j] == close_c:
            depth -= 1
            if depth == 0: return nav_src[i:j + 1]
    return ''

real_nav = nav_var
alias = re.search(r"\b(\w+)\s+as\s+%s\b" % nav_var, imp.group(1))
if alias: real_nav = alias.group(1)
nav_block = block(real_nav)
for _ in range(3):  # expand ...SPREAD references to other const arrays
    for sp in set(re.findall(r"\.\.\.([A-Z0-9_]+)", nav_block)):
        nav_block = nav_block.replace('...' + sp, block(sp))
titles_block = block(titles_var)
if not nav_block: err('nav export %s not found' % real_nav)
if not titles_block: err('page titles export %s not found' % titles_var)

nav_items = re.findall(r"\{\s*id:\s*'([^']+)'([^}]*)\}", nav_block)
page_ids = [i for i, rest in nav_items if "type: 'anchor'" not in rest]
ref_ids = {i for i, rest in nav_items if 'ref: true' in rest}
title_ids = set(re.findall(r"'([^']+)'\s*:", titles_block))

app = read(os.path.join(SRC, 'App.jsx'))
toc = read(os.path.join(SRC, 'components', 'layout', 'TOC.jsx'))
app_cases = set(re.findall(r"case\s+'([^']+)'\s*:", app))
toc_keys = set(re.findall(r"^\s*'([^']+)'\s*:\s*\[", toc, re.M))

# page files that implement this product's cases
comp_for = {}
for pid in page_ids:
    mm = re.search(r"case\s+'%s'\s*:\s*return\s*<(\w+)" % re.escape(pid), app)
    if mm: comp_for[pid] = mm.group(1)
page_files = set()
for comp in set(comp_for.values()):
    mm = re.search(r"import\s*\{[^}]*\b%s\b[^}]*\}\s*from\s*'\./pages/([^']+)'" % comp, app) or \
         re.search(r"import\s+%s\s+from\s*'\./pages/([^']+)'" % comp, app)
    if mm:
        f = os.path.join(SRC, 'pages', mm.group(1))
        f = f if f.endswith('.jsx') else f + '.jsx'
        if os.path.exists(f): page_files.add(f)
page_src = {f: read(f) for f in page_files}
all_pages = '\n'.join(page_src.values())

def comp_body(name):
    for s in page_src.values():
        mm = re.search(r"export (?:default )?function %s\b" % name, s)
        if mm:
            nxt = re.search(r"\nexport (?:default )?function ", s[mm.end():])
            return s[mm.start(): mm.end() + (nxt.start() if nxt else len(s))]
    return ''

for pid in page_ids:
    if pid not in title_ids: err('%s: no entry in %s' % (pid, titles_var))
    if pid not in app_cases: err('%s: no case in App.jsx (falls through to Placeholder)' % pid)
    elif pid not in comp_for: warn('%s: App.jsx case does not return a component directly' % pid)
    if pid not in ref_ids and pid not in toc_keys: err('%s: no TOC_MAP entry' % pid)
    body = comp_body(comp_for.get(pid, '__none__'))
    if body:
        if 'DraftBanner' not in body and 'data-draft-banner' not in body: err('%s: no draft banner' % pid)
        if 'quick-answer' not in body: err('%s: no quick-answer paragraph' % pid)
        if '<PageActions' not in body: warn('%s: no <PageActions /> (Ask AI entry point)' % pid)
        # TOC ids exist as h2 ids
        mm = re.search(r"'%s'\s*:\s*\[(.*?)\]" % re.escape(pid), toc, re.S)
        if mm:
            for tid in re.findall(r"id:\s*'([^']+)'", mm.group(1)):
                if not re.search(r"id=[\"']%s[\"']|id:\s*'%s'" % (re.escape(tid), re.escape(tid)), body):
                    err('%s: TOC id "%s" has no matching h2 id on the page' % (pid, tid))

# ApiLinks targets
for pg, prod in re.findall(r"pageId:\s*'([^']+)'\s*,\s*productId:\s*'([^']+)'", all_pages):
    if pg not in app_cases: err('ApiLinks target %s has no route' % pg)
    if not re.search(r"^\s*'%s'\s*:\s*\{" % re.escape(prod), products, re.M): err('ApiLinks productId %s is not a product' % prod)

# naming
ctx_path = os.path.join(SRC, 'data', 'claude-context-%s.js' % a.product)
ctx = read(ctx_path) if os.path.exists(ctx_path) else ''
if not ctx: warn('no AI context file at src/data/claude-context-%s.js' % a.product)
elif re.search(r"(?<!\\)`", ctx.split('= `', 1)[-1].rsplit('`;', 1)[0]):
    err('AI context file: unescaped backtick inside the template literal')
for label, pat in [('"Genesis"', r'\bGenesis\b'), ('v2-private', r'v2-private'), ('v4/v5 as a version label', r"version=\"v[45]\"|'v[45]'")]:
    for f, s in list(page_src.items()) + [(ctx_path, ctx)]:
        if re.search(pat, s): err('%s found in %s' % (label, os.path.relpath(f, a.repo)))

# deny list: case-sensitive whole words; "i:term" matches any case. Scans pages, AI context and every product data file.
if a.deny:
    scan = list(page_src.items()) + [(ctx_path, ctx)]
    for f in os.listdir(os.path.join(SRC, 'data')):
        if a.product in f and f.endswith('.js') and not f.startswith('claude-context'):
            fp = os.path.join(SRC, 'data', f); scan.append((fp, read(fp)))
    scan.append((os.path.join(SRC, 'data', imp.group(2) + '.js'), nav_src))
    for raw in read(a.deny).splitlines():
        t = raw.strip()
        if not t or t.startswith('#'): continue
        flags = re.I if t.startswith('i:') else 0
        t = t[2:].strip() if t.startswith('i:') else t
        for f, s in scan:
            if re.search(r'(?<![A-Za-z0-9])%s(?![A-Za-z0-9])' % re.escape(t), s, flags):
                err('screened term "%s" in %s' % (t, os.path.relpath(f, a.repo)))

# diagrams: every Figure has a title; every diagram has a screen-reader label; flag var(--text) (undefined token)
fig_total = 0
for f, s in page_src.items():
    for m in re.finditer(r"<Figure\b([^>]*)>", s):
        fig_total += 1
        if 'title=' not in m.group(1): err('Figure without a title in %s' % os.path.relpath(f, a.repo))
    for m in re.finditer(r"<(SequenceDiagram|LayerDiagram|StepsDiagram)\b", s):
        if 'label=' not in s[m.start(): m.start() + 400]: warn('%s without label= (screen readers) in %s' % (m.group(1), os.path.relpath(f, a.repo)))
    if re.search(r"var\(--text\)", s): warn('var(--text) is not a defined token; use var(--black) in %s' % os.path.relpath(f, a.repo))
print('Diagrams: %d figure(s)' % fig_total)

gap_page = [p for p in page_ids if p.endswith('gap-report')]
if not gap_page: err('no <prefix>-gap-report page in the nav')

print('Product %s: %d pages, %d page files' % (a.product, len(page_ids), len(page_files)))
for w in warns: print('WARN  ', w)
for e in errors: print('ERROR ', e)
print('OK' if not errors else '%d error(s)' % len(errors))
sys.exit(1 if errors else 0)
