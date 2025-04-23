const Template = require('../models/Template');

class TemplateService {
  async getAllTemplates() {
    try {
      return await Template.findAll({
        order: [['created_at', 'DESC']]
      });
    } catch (error) {
      console.error('TemplateService error - getAllTemplates:', error);
      throw error;
    }
  }

  async getTemplateById(id) {
    try {
      const template = await Template.findByPk(id);
      if (!template) {
        throw new Error('Template not found');
      }
      return template;
    } catch (error) {
      console.error(`TemplateService error - getTemplateById(${id}):`, error);
      throw error;
    }
  }

  async createTemplate(templateData) {
    try {
      return await Template.create({
        name: templateData.name,
        content: templateData.content
      });
    } catch (error) {
      console.error('TemplateService error - createTemplate:', error);
      throw error;
    }
  }

  async updateTemplate(id, templateData) {
    try {
      const template = await this.getTemplateById(id);
      
      template.name = templateData.name;
      template.content = templateData.content;
      template.updated_at = new Date();
      
      await template.save();
      return template;
    } catch (error) {
      console.error(`TemplateService error - updateTemplate(${id}):`, error);
      throw error;
    }
  }

  async deleteTemplate(id) {
    try {
      const template = await this.getTemplateById(id);
      await template.destroy();
      return true;
    } catch (error) {
      console.error(`TemplateService error - deleteTemplate(${id}):`, error);
      throw error;
    }
  }

  async updateTemplateUsage(id) {
    try {
      const template = await this.getTemplateById(id);
      template.lastUsed = new Date();
      await template.save();
      return template;
    } catch (error) {
      console.error(`TemplateService error - updateTemplateUsage(${id}):`, error);
      throw error;
    }
  }
}

module.exports = new TemplateService();