import { Template } from '../types';
import { mockTemplates } from '../data/mockData';

class TemplateService {
  private templates: Template[] = [...mockTemplates];
  
  getAllTemplates(): Promise<Template[]> {
    return Promise.resolve([...this.templates]);
  }
  
  getTemplateById(id: number): Promise<Template | undefined> {
    const template = this.templates.find(t => t.id === id);
    return Promise.resolve(template);
  }
  
  createTemplate(template: Omit<Template, 'id' | 'createdAt'>): Promise<Template> {
    const newTemplate: Template = {
      ...template,
      id: Math.max(0, ...this.templates.map(t => t.id)) + 1,
      createdAt: new Date().toISOString(),
    };
    
    this.templates.push(newTemplate);
    return Promise.resolve(newTemplate);
  }
  
  updateTemplate(id: number, templateData: Partial<Template>): Promise<Template | undefined> {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) {
      return Promise.resolve(undefined);
    }
    
    this.templates[index] = { ...this.templates[index], ...templateData };
    return Promise.resolve(this.templates[index]);
  }
  
  deleteTemplate(id: number): Promise<boolean> {
    const initialLength = this.templates.length;
    this.templates = this.templates.filter(t => t.id !== id);
    return Promise.resolve(this.templates.length < initialLength);
  }
  
  // Mark template as used
  markTemplateAsUsed(id: number): Promise<Template | undefined> {
    return this.updateTemplate(id, { lastUsed: new Date().toISOString() });
  }
  
  // Apply template with variable substitution
  applyTemplate(templateId: number, variables: Record<string, string>): Promise<string> {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      return Promise.resolve('Template not found');
    }
    
    let content = template.content;
    
    // Replace all variables in the content
    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    // Mark template as used
    this.markTemplateAsUsed(templateId);
    
    return Promise.resolve(content);
  }
}

export const templateService = new TemplateService();