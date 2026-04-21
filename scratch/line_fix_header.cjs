const fs = require('fs');
const path = 'c:/Users/raazz/OneDrive/Desktop/oil/oilmate-b2b-hub/src/components/Header.tsx';
const lines = fs.readFileSync(path, 'utf8').split('\n');

// Lines 516-526 (0-indexed: 515-525) were broken
const fixedBlock = [
  '                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden relative">',
  '                    {allProductsImage ? (',
  '                      <Image src={allProductsImage} alt="Все товары" fill className="object-cover" />',
  '                    ) : (',
  '                      <LayoutGrid className="h-5 w-5 text-foreground" />',
  '                    )}',
  '                  </div>'
];

// Replace the range
lines.splice(515, 11, ...fixedBlock);

fs.writeFileSync(path, lines.join('\n'));
console.log('Successfully fixed Header.tsx by line numbers');
