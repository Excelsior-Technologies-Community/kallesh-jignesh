const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'src/Sections/Section7.jsx',
    'src/Pages/Wishlist.jsx',
    'src/Pages/LookbookInstagram.jsx',
    'src/Pages/LookbookBlog.jsx',
    'src/Pages/GridwithRightSidebar.jsx',
    'src/Pages/GridwithLeftSidebar.jsx',
    'src/Pages/Gridlayout.jsx',
    'src/Pages/FullWidth.jsx',
    'src/Pages/DrawerSidebar.jsx',
    'src/Pages/AddtoCart.jsx',
    'src/Components/SearchSidebar.jsx'
];

filesToUpdate.forEach(file => {
    let filePath = path.join('d:/kalles/Kalles', file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if useCurrency is already imported
        if (!content.includes('useCurrency')) {
            // Determine relative path to Context/CurrencyContext.jsx
            const depth = file.split('/').length - 1; 
            const prefix = depth === 2 ? '../../' : '../'; 
            const importStatement = `import { useCurrency } from '${prefix}Context/CurrencyContext';\n`;
            
            // Insert import after the last import statement
            const lastImportIndex = content.lastIndexOf('import ');
            const insertPosition = content.indexOf('\n', lastImportIndex) + 1;
            content = content.slice(0, insertPosition) + importStatement + content.slice(insertPosition);

            // Insert const { formatPrice } = useCurrency(); inside the component
            // We'll find the main component declaration
            const componentName = path.basename(file, '.jsx');
            const componentDeclRegex = new RegExp(`const\\s+${componentName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*{`);
            const match = content.match(componentDeclRegex);
            
            if (match) {
                const insertHookPosition = match.index + match[0].length;
                content = content.slice(0, insertHookPosition) + '\n    const { formatPrice } = useCurrency();' + content.slice(insertHookPosition);
            } else {
                 // Try alternative definition like function ComponentName
                 const functionDeclRegex = new RegExp(`function\\s+${componentName}\\s*\\([^)]*\\)\\s*{`);
                 const match2 = content.match(functionDeclRegex);
                 if (match2) {
                     const insertHookPosition = match2.index + match2[0].length;
                     content = content.slice(0, insertHookPosition) + '\n    const { formatPrice } = useCurrency();' + content.slice(insertHookPosition);
                 }
            }
        }

        // Now replace all Dhs. patterns
        // Pattern 1: Dhs. {someVar}
        content = content.replace(/Dhs\.\s*\{([^}]+)\}/g, (match, p1) => {
             // remove .toFixed if exists and just wrap in formatPrice
             p1 = p1.replace(/\.toFixed\(\d+\)/g, '');
             return `{formatPrice(${p1})}`;
        });

        // Pattern 2: Dhs. <number>
        content = content.replace(/Dhs\.\s*([\d.]+)/g, (match, p1) => {
             return `{formatPrice(${p1})}`;
        });

        // Pattern 3: `Dhs. ${someVar}` (template literal)
        content = content.replace(/`Dhs\.\s*\$\{([^}]+)\}`/g, (match, p1) => {
             p1 = p1.replace(/\.toFixed\(\d+\)/g, '');
             return `formatPrice(${p1})`;
        });

        // Pattern 4: "Dhs. " string literals
        content = content.replace(/"Dhs\.\s*([^"]+)"/g, (match, p1) => {
            if (/^\d+(\.\d+)?$/.test(p1.trim())) {
                return `{formatPrice(${p1.trim()})}`;
            }
            return match; // return original if not a number
        });

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
