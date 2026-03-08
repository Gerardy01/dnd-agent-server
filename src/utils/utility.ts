import path from 'path';
import fs from 'fs';
import ejs from 'ejs';

export const renderTemplate = async (templateName: string, data: Record<string, unknown>): Promise<string> => {
    const templatePath = path.join(__dirname, '../templates', templateName);
    const template = fs.readFileSync(templatePath, 'utf-8');
    return ejs.render(template, data);
};
