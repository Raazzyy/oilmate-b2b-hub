const fs = require('fs');
const path = 'c:/Users/raazz/OneDrive/Desktop/oil/oilmate-b2b-hub/src/components/Header.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update Props
content = content.replace(
  'const Header = ({ categories = [], navigation = [] }: { categories?: StrapiCategory[], navigation?: StrapiNavigationItem[] }) => {',
  'const Header = ({ \n  categories = [], \n  navigation = [], \n  allProductsImage \n}: { \n  categories?: StrapiCategory[], \n  navigation?: StrapiNavigationItem[],\n  allProductsImage?: string\n}) => {'
);

// 2. Update Mobile Menu Icon
content = content.replace(
  '<LayoutGrid className="h-5 w-5 text-foreground" />',
  '{allProductsImage ? (\n                      <Image src={allProductsImage} alt="Все товары" fill className="object-cover" />\n                    ) : (\n                      <LayoutGrid className="h-5 w-5 text-foreground" />\n                    )}'
);

// 3. Update Desktop Dropdown Button
content = content.replace(
  'className="w-full justify-center text-primary hover:text-primary hover:bg-primary/10"',
  'className="w-full justify-center text-primary hover:text-primary hover:bg-primary/10 flex items-center gap-2"'
);

// 4. Update Desktop Dropdown Content
content = content.replace(
  '>\n                        Все товары\n                      </Button>',
  '>\n                        {allProductsImage ? (\n                          <div className="w-5 h-5 rounded-sm relative overflow-hidden shrink-0">\n                            <Image src={allProductsImage} alt="Все товары" fill className="object-cover" />\n                          </div>\n                        ) : (\n                          <LayoutGrid className="h-4 w-4" />\n                        )}\n                        Все товары\n                      </Button>'
);

fs.writeFileSync(path, content);
console.log('Successfully updated Header.tsx');
