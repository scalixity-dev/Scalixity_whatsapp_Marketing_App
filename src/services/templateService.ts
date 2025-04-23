import axios from 'axios';
import { Template } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class TemplateService {
  async getAllTemplates(): Promise<Template[]> {
    try {
      const response = await axios.get(`${API_URL}/templates`);
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  async getTemplateById(id: number): Promise<Template> {
    try {
      const response = await axios.get(`${API_URL}/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching template ${id}:`, error);
      throw error;
    }
  }

  async createTemplate(templateData: Omit<Template, 'id' | 'createdAt'>): Promise<Template> {
    try {
      const response = await axios.post(`${API_URL}/templates`, templateData);
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  async updateTemplate(id: number, templateData: Omit<Template, 'id' | 'createdAt'>): Promise<Template> {
    try {
      const response = await axios.put(`${API_URL}/templates/${id}`, templateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating template ${id}:`, error);
      throw error;
    }
  }

  async deleteTemplate(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/templates/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting template ${id}:`, error);
      throw error;
    }
  }

  async updateTemplateUsage(id: number): Promise<Template> {
    try {
      const response = await axios.patch(`${API_URL}/templates/${id}/used`);
      return response.data;
    } catch (error) {
      console.error(`Error updating template usage ${id}:`, error);
      throw error;
    }
  }
}

export const templateService = new TemplateService();