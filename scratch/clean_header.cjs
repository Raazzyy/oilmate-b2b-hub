const fs = require('fs');
const path = 'c:/Users/raazz/OneDrive/Desktop/oil/oilmate-b2b-hub/src/components/Header.tsx';
let content = fs.readFileSync(path, 'utf8');

// The broken block identified from view_file
const brokenBlock = `{allProductsImage ? (
                      <Image src={allProductsImage} alt="Все товары" fill className="object-cover" />
                    ) : (
                      {allProductsImage ? (
                      <Image src={allProductsImage} alt="Все товары" fill className="object-cover" />
                    ) : (
                      <LayoutGrid className="h-5 w-5 text-foreground" />
                    )}
                    )}`;

const fixedBlock = `{allProductsImage ? (
                      <Image src={allProductsImage} alt="Все товары" fill className="object-cover" />
                    ) : (
                      <LayoutGrid className="h-5 w-5 text-foreground" />
                    )}`;

if (content.includes(brokenBlock)) {
    content = content.replace(brokenBlock, fixedBlock);
    fs.writeFileSync(path, content);
    console.log('Successfully cleaned Header.tsx');
} else {
    console.log('Broken block not found, check indentation or content');
}
