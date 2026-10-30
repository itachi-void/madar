#!/usr/bin/env python3
"""Builds wordpress/madar-headless/data/seed.json from the storefront's own data.

Sources: src/content/catalog.json, captured product pages (SKU, sizes, description),
src/i18n/locales/*.json (existing translations), src/content/size-guide.json and the
image brief manifest (output file names). Run from the repository root.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LANGS = ['sa', 'en', 'fr', 'es']
loc = {l: json.loads((ROOT / f'src/i18n/locales/{l}.json').read_text()) for l in LANGS}
catalog_list = json.loads((ROOT / 'src/content/catalog.json').read_text())
catalog = {p['id']: p for p in catalog_list}
catalog_order = {p['id']: i for i, p in enumerate(catalog_list, 1)}
pages = {p['path']: p for p in json.loads((ROOT / 'src/content/pages.json').read_text())}
size_guide = json.loads((ROOT / 'src/content/size-guide.json').read_text())
manifest = json.loads((ROOT / 'deliverables/madar-image-brief/image-manifest.json').read_text())

# Output image names per garment, in brief order: front, back, details..., on-model.
files = {}
for item in manifest:
    parts = item['file'].split('/')
    if parts[1] == 'products':
        files.setdefault(parts[2], []).append(parts[3])

def roles(key):
    out = {}
    details = []
    for name in files[key]:
        stem = name.rsplit('.', 1)[0][len(key) + 1:]
        if stem in ('front', 'back'):
            out[stem] = name
        elif stem == 'on-model':
            out['on_model'] = name
        else:
            details.append((stem, name))
    for i, (_, name) in enumerate(details, 1):
        out[f'detail_{i}'] = name
    return out, [d[0] for d in details]

def page_data(path):
    text = (ROOT / 'src/content/pages' / pages[path]['contentFile']).read_text()
    sku = re.search(r'<span class="sku">([^<]+)', text).group(1)
    variations = json.loads(html.unescape(re.search(r'data-product_variations="([^"]+)"', text).group(1)))
    sizes = [value for v in variations for value in v['attributes'].values()]
    rows = []
    for v in variations:
        for value in v['attributes'].values():
            row = dict(size=value, price=str(v['display_regular_price']), in_stock=bool(v['is_in_stock']))
            if v['display_price'] < v['display_regular_price']:
                row['sale_price'] = str(v['display_price'])
            rows.append(row)
    start = text.find('id="tab-description"')
    block = text[start:text.find('</div>', start)]
    raw = [p.strip() for p in re.findall(r'<p[^>]*>(.*?)</p>', block, re.S)]
    paras = [html.unescape(re.sub('<[^>]+>', '', p)).strip() for p in raw]
    description = ''.join(f'<p>{p}</p>' for p in raw if re.sub('<[^>]+>', '', p).strip())
    return sku, sizes, [p for p in paras if p], rows, description

LABELS = {
    'collar': ('الياقة', 'الياقة', 'Collar', 'Col', 'Cuello'),
    'pocket-buttons': ('الجيب والزرار', 'الجيب والزر', 'Pocket and button', 'Poche et bouton', 'Bolsillo y botón'),
    'lapel-button': ('الياقة والزرار', 'الياقة والزر', 'Lapel and button', 'Revers et bouton', 'Solapa y botón'),
    'cuff-weave': ('الكم والنسيج', 'الكم والنسيج', 'Cuff and weave', 'Poignet et tissage', 'Puño y tejido'),
    'collar-rib': ('الياقة العالية', 'الياقة العالية', 'Turtleneck collar', 'Col roulé', 'Cuello alto'),
    'cuff-hem': ('الأساور والحافة', 'الأساور والحافة', 'Cuff and hem', 'Poignet et ourlet', 'Puño y bajo'),
    'pocket-closure': ('الجيب والإغلاق', 'الجيب والإغلاق', 'Pocket and closure', 'Poche et fermeture', 'Bolsillo y cierre'),
    'collar-placket': ('الياقة والأزرار', 'الياقة والأزرار', 'Collar and placket', 'Col et patte', 'Cuello y tapeta'),
    'pocket-cuff': ('الجيب والكم', 'الجيب والكم', 'Pocket and cuff', 'Poche et poignet', 'Bolsillo y puño'),
    'collar-stripes': ('الياقة والخطوط', 'الياقة والخطوط', 'Collar and stripes', 'Col et rayures', 'Cuello y rayas'),
    'cuff-button': ('الكم والزرار', 'الكم والزر', 'Cuff and button', 'Poignet et bouton', 'Puño y botón'),
    'neck-stripes': ('فتحة الرقبة والخطوط', 'فتحة الرقبة والخطوط', 'Neckline and stripes', 'Encolure et rayures', 'Escote y rayas'),
    'sleeve-hem': ('حافة الكم', 'حافة الكم', 'Sleeve hem', 'Ourlet de manche', 'Bajo de manga'),
    'collar-buttons': ('الياقة والأزرار', 'الياقة والأزرار', 'Collar and buttons', 'Col et boutons', 'Cuello y botones'),
    'fabric-stripes': ('القماش والخطوط', 'القماش والخطوط', 'Fabric and stripes', 'Tissu et rayures', 'Tejido y rayas'),
    'waistband': ('الوسط', 'الخصر', 'Waistband', 'Ceinture', 'Cinturilla'),
}
def label(key):
    return dict(zip(['eg'] + LANGS, LABELS[key]))

# Provisional hotspot positions (percent of the front image). Adjust after the images are approved.
POSITIONS = {
    'coat-camel': [(44, 17), (36, 52)], 'suit-charcoal': [(45, 20), (22, 48)], 'knit-cream': [(50, 12), (26, 64)],
    'coat-black': [(44, 17), (36, 52)], 'overshirt': [(50, 15), (38, 32)], 'shirt-striped': [(50, 13), (22, 70)],
    'kids-sweatshirt-striped': [(50, 13), (24, 74)], 'kids-tee-striped': [(50, 11), (24, 30)],
    'kids-shirt-brown': [(50, 15), (38, 30)], 'kids-polo-striped': [(50, 13), (55, 55)],
    'trouser-charcoal': [(50, 8)], 'trouser-stone': [(50, 8)], 'kids-chino-navy': [(50, 8)],
}
SALE = {  # brief key -> catalog id and audience
    'coat-camel': (141, 'men'), 'suit-charcoal': (98, 'men'), 'knit-cream': (86, 'men'), 'coat-black': (93, 'men'),
    'overshirt': (128, 'men'), 'shirt-striped': (118, 'men'), 'kids-sweatshirt-striped': (111, 'kids'),
    'kids-tee-striped': (105, 'kids'), 'kids-shirt-brown': (134, 'kids'), 'kids-polo-striped': (123, 'kids'),
}
STYLING = {
    'trouser-charcoal': ('MDR-STYLE-1', 'بنطلون رمادي فحمي', 'men', ['S', 'M', 'L', 'XL'],
                         ('بنطال رمادي فحمي', 'Charcoal tapered trousers', 'Pantalon fuselé anthracite', 'Pantalón entallado gris carbón')),
    'trouser-stone': ('MDR-STYLE-2', 'تشينو بلون الحجر', 'men', ['S', 'M', 'L', 'XL'],
                      ('تشينو بلون الحجر', 'Stone chinos', 'Chino couleur pierre', 'Chino color piedra')),
    'kids-chino-navy': ('MDR-STYLE-3', 'تشينو أطفال كحلي', 'kids', ['2–3', '4–5', '6–7', '8–9'],
                        ('تشينو أطفال كحلي', 'Kids’ navy chinos', 'Chino enfant marine', 'Chino infantil azul marino')),
}
PAIRS = {
    'coat-camel': ['knit-cream', 'trouser-charcoal', 'trouser-stone', 'shirt-striped', 'overshirt'],
    'suit-charcoal': ['coat-black', 'shirt-striped', 'knit-cream'],
    'knit-cream': ['coat-camel', 'coat-black', 'trouser-charcoal', 'trouser-stone'],
    'coat-black': ['suit-charcoal', 'knit-cream', 'trouser-charcoal', 'shirt-striped'],
    'overshirt': ['shirt-striped', 'trouser-stone', 'knit-cream', 'coat-camel'],
    'shirt-striped': ['overshirt', 'trouser-stone', 'trouser-charcoal', 'suit-charcoal'],
    'kids-sweatshirt-striped': ['kids-chino-navy', 'kids-tee-striped'],
    'kids-tee-striped': ['kids-chino-navy', 'kids-sweatshirt-striped'],
    'kids-shirt-brown': ['kids-chino-navy', 'kids-tee-striped'],
    'kids-polo-striped': ['kids-chino-navy'],
    'trouser-charcoal': ['coat-camel', 'knit-cream', 'coat-black', 'shirt-striped'],
    'trouser-stone': ['overshirt', 'shirt-striped', 'coat-camel', 'knit-cream'],
    'kids-chino-navy': ['kids-sweatshirt-striped', 'kids-polo-striped', 'kids-shirt-brown', 'kids-tee-striped'],
}
MATERIAL_OF = {'coat-camel': ['camel-coat-surface'], 'knit-cream': ['rib-knit'], 'suit-charcoal': ['suiting'],
               'shirt-striped': ['striped-shirting'], 'kids-sweatshirt-striped': ['kids-jersey']}

def hotspots(key, details):
    return [dict(id=d, x=xy[0], y=xy[1], view='front', image_role=f'detail_{i}', label=label(d))
            for i, (d, xy) in enumerate(zip(details, POSITIONS[key]), 1)]

products = []
for key in files:
    images, details = roles(key)
    if key in SALE:
        cid, audience = SALE[key]
        item = catalog[cid]
        sku, sizes, paras, rows, description = page_data(item['path'])
        i18n = {}
        for l in LANGS:
            entry = {}
            if loc[l].get(item['name']):
                entry['name'] = loc[l][item['name']]
            translated = [loc[l].get(p) for p in paras]
            if paras and all(translated):
                entry['description'] = ''.join(f'<p>{html.escape(t, quote=False)}</p>' for t in translated)
            if entry:
                i18n[l] = entry
        products.append(dict(key=key, sku=sku, source_id=cid, name=item['name'],
                             slug=item['path'].strip('/').split('/')[-1], order=catalog_order[cid],
                             description=description, variations=rows, audience=audience,
                             size_chart=audience, categories=[audience], sizes=sizes, price=str(item['price']),
                             create_if_missing=True, styling_only=False, pairs=PAIRS[key],
                             materials=MATERIAL_OF.get(key, []), hotspots=hotspots(key, details),
                             i18n=i18n, images=images))
    else:
        sku, name, audience, sizes, names = STYLING[key]
        products.append(dict(key=key, sku=sku, name=name, order=100 + len(products), audience=audience, size_chart=audience,
                             categories=[audience], sizes=sizes, price='', create_if_missing=True,
                             styling_only=True, pairs=PAIRS[key], materials=[], hotspots=hotspots(key, details),
                             i18n={l: {'name': n} for l, n in zip(LANGS, names)}, images=images))

def tr(eg, *others):
    return eg, dict(zip(LANGS, others))

LOOKS = [
    ('camel-everyday', tr('الجملي، كل يوم', 'الجملي لكل يوم', 'Camel, every day', 'Camel, au quotidien', 'Camel, cada día'),
     tr('معطف جملي مفتوح فوق تريكو فاتح وبنطلون فحمي.', 'معطف جملي مفتوح فوق تريكو فاتح وبنطال فحمي.',
        'An open camel coat over a light knit and charcoal trousers.',
        'Un manteau camel ouvert sur une maille claire et un pantalon anthracite.',
        'Un abrigo camel abierto sobre un punto claro y un pantalón gris carbón.'),
     'men', 'everyday', 'earth', ['coat-camel', 'knit-cream', 'trouser-charcoal']),
    ('light-layers', tr('طبقات خفيفة', 'طبقات خفيفة', 'Light layers', 'Couches légères', 'Capas ligeras'),
     tr('أوفرشيرت مفتوح فوق قميص مقلّم وتشينو بلون الحجر.', 'أوفرشيرت مفتوح فوق قميص مقلّم وتشينو بلون الحجر.',
        'An open overshirt over a striped shirt and stone chinos.',
        'Une surchemise ouverte sur une chemise rayée et un chino pierre.',
        'Una sobrecamisa abierta sobre una camisa de rayas y un chino color piedra.'),
     'men', 'everyday', 'light', ['overshirt', 'shirt-striped', 'trouser-stone']),
    ('little-explorer', tr('مغامر صغير', 'مستكشف صغير', 'Little explorer', 'Petit explorateur', 'Pequeño explorador'),
     tr('سويتشيرت مخطط وتشينو كحلي ليوم في الهوا.', 'سويتشيرت مخطط وتشينو كحلي ليوم في الخارج.',
        'A striped sweatshirt and navy chinos for a day outdoors.',
        'Un sweat rayé et un chino marine pour une journée dehors.',
        'Una sudadera de rayas y un chino azul marino para un día al aire libre.'),
     'kids', 'everyday', 'light', ['kids-sweatshirt-striped', 'kids-chino-navy']),
    ('evening-city', tr('مساء المدينة', 'مساء المدينة', 'City evening', 'Soir en ville', 'Noche en la ciudad'),
     tr('بدلة فحمية تحت معطف أسود طويل.', 'بدلة فحمية تحت معطف أسود طويل.', 'A charcoal suit under a long black coat.',
        'Un costume anthracite sous un long manteau noir.', 'Un traje gris carbón bajo un abrigo negro largo.'),
     'men', 'evening', 'mono', ['suit-charcoal', 'coat-black']),
]
looks = []
for n, (slug, (title, title_i), (excerpt, excerpt_i), audience, occasion, palette, prods) in enumerate(LOOKS, 1):
    looks.append(dict(slug=slug, title=title, excerpt=excerpt, audience=audience, occasion=occasion, palette=palette,
                      products=prods, order=n, image=f'look-0{n}-main.jpg', detail_image=f'look-0{n}-detail.jpg',
                      i18n={l: {'title': title_i[l], 'excerpt': excerpt_i[l]} for l in LANGS}))

NOTE = tr('الصورة للتوضيح البصري، وتركيب الخامة والعناية بيظهروا هنا بعد تأكيدهم من بطاقة المورّد.',
          'الصورة للتوضيح البصري، ويظهر تركيب الخامة والعناية هنا بعد تأكيدهما من بطاقة المورّد.',
          'The image is a visual guide. Composition and care appear here once confirmed from the supplier label.',
          'L’image sert de repère visuel. La composition et l’entretien apparaîtront ici une fois confirmés par l’étiquette du fournisseur.',
          'La imagen es una guía visual. La composición y el cuidado aparecerán aquí cuando se confirmen con la etiqueta del proveedor.')
MATERIALS = [
    ('camel-coat-surface', 'material-camel-coat.jpg',
     tr('سطح المعطف الجملي', 'سطح المعطف الجملي', 'Camel coat surface', 'Surface du manteau camel', 'Superficie del abrigo camel'),
     tr('سطح كثيف المظهر وخياطة حافة دقيقة.', 'سطح كثيف المظهر وخياطة حافة دقيقة.', 'A dense-looking surface with fine edge stitching.',
        'Une surface d’aspect dense, avec une fine surpiqûre en bordure.', 'Una superficie de aspecto denso con un pespunte fino en el borde.'),
     ['coat-camel']),
    ('rib-knit', 'material-rib-knit.jpg', tr('تريكو مضلّع', 'تريكو مضلّع', 'Rib knit', 'Maille côtelée', 'Punto acanalado'),
     tr('خطوط تريكو عمودية واضحة عند الياقة والأساور والحافة.', 'خطوط تريكو عمودية واضحة عند الياقة والأساور والحافة.',
        'Clear vertical ribs at the collar, cuffs and hem.', 'Des côtes verticales nettes au col, aux poignets et à l’ourlet.',
        'Canalé vertical marcado en el cuello, los puños y el bajo.'), ['knit-cream']),
    ('suiting', 'material-suiting.jpg', tr('نسيج البدلة', 'نسيج البدلة', 'Suiting weave', 'Tissage du costume', 'Tejido del traje'),
     tr('نسيج مائل دقيق بلون فحمي.', 'نسيج مائل دقيق بلون فحمي.', 'A fine diagonal weave in charcoal.',
        'Un fin tissage diagonal anthracite.', 'Un tejido diagonal fino en gris carbón.'), ['suit-charcoal']),
    ('striped-shirting', 'material-striped-shirting.jpg',
     tr('قماش القميص المقلّم', 'قماش القميص المقلّم', 'Striped shirting', 'Toile de chemise rayée', 'Tejido de camisa de rayas'),
     tr('خطوط رفيعة متساوية بتتقابل عند الياقة والأساور.', 'خطوط رفيعة متساوية تتطابق عند الياقة والأساور.',
        'Fine, even stripes that line up at the collar and cuffs.', 'De fines rayures régulières qui se rejoignent au col et aux poignets.',
        'Rayas finas y regulares que coinciden en el cuello y los puños.'), ['shirt-striped']),
    ('kids-jersey', 'material-kids-jersey.jpg',
     tr('جيرسي الأطفال المقلّم', 'جيرسي الأطفال المقلّم', 'Kids’ striped jersey', 'Jersey rayé enfant', 'Punto rayado infantil'),
     tr('خطوط عريضة متساوية مع حواف مضلّعة.', 'خطوط عريضة متساوية مع حواف مضلّعة.', 'Broad, even stripes with ribbed edges.',
        'De larges rayures régulières et des bords côtelés.', 'Rayas anchas y regulares con bordes acanalados.'),
     ['kids-sweatshirt-striped']),
]
materials = []
for n, (key, image, (name, name_i), (story, story_i), prods) in enumerate(MATERIALS, 1):
    materials.append(dict(key=key, slug=key, title=name, story=f'{story} {NOTE[0]}', products=prods, order=n, image=image,
                          i18n={l: {'title': name_i[l], 'story': f'{story_i[l]} {NOTE[1][l]}'} for l in LANGS}))

seed = dict(
    version=1,
    notes='Madar storefront seed. Existing products are matched by SKU; their names, prices, stock and variations are never changed.',
    categories=[{'slug': 'men', 'name': 'رجالي'}, {'slug': 'kids', 'name': 'أطفال'}],
    size_charts={'source': 'Captured Madar product size guide (general; not per-product measurements).',
                 'men': {'columns': ['size', 'chest_cm', 'waist_cm', 'length_cm'], 'rows': size_guide['men']},
                 'kids': {'columns': ['age', 'height_cm', 'chest_cm'], 'rows': size_guide['kids']}},
    products=products, looks=looks, materials=materials,
    demo_skus=['TEST-JNS-450', 'TEST-TSHIRT-VAR', 'TEST-HDY-650', 'TEST-BRC-VAR', 'TEST-WLT-200', 'TEST-SNG-350'],
)
out = ROOT / 'wordpress/madar-headless/data/seed.json'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(seed, ensure_ascii=False, indent=2) + '\n')
print(f'{out.relative_to(ROOT)}: {len(products)} products, {len(looks)} looks, {len(materials)} materials')
