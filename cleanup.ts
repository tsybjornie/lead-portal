import fs from 'fs';
import path from 'path';

const targetDir = 'c:/Users/Tina/Desktop/numbers/arc-quote';
const oldNames = ['Roof', 'Roof', 'Roof', 'Roof'];
const newName = 'Roof';

function walkDir(dir: string, callback: (filePath: string) => void) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (!f.startsWith('.') && f !== 'node_modules' && f !== '.next') {
                walkDir(dirPath, callback);
            }
        } else {
            callback(path.join(dir, f));
        }
    });
}

const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

walkDir(targetDir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // Rename branding
        oldNames.forEach(name => {
            const regex = new RegExp(name, 'g');
            content = content.replace(regex, newName);
        });

        // Remove emojis
        content = content.replace(emojiRegex, '');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    }
});
