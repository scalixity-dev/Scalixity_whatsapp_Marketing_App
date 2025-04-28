const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

const parseCSV = (csvData) => {
  try {
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true
    });

    return records.map(record => ({
      name: record.name,
      phone_number: record.phone_number || record.phone || record.phoneNumber || '',
      company: record.company,
      position: record.position,
      imported_from: 'CSV',
      imported_at: new Date(),
      status: 'active'
    }));
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Invalid CSV format');
  }
};

const generateCSV = (contacts) => {
  try {
    const records = contacts.map(contact => ({
      name: contact.name,
      phone_number: contact.phone_number,
      company: contact.company || '',
      position: contact.position || '',
      status: contact.status,
      last_contacted: contact.lastContacted || '',
      imported_at: contact.importedAt
    }));

    return stringify(records, {
      header: true,
      columns: {
        name: 'Name',
        phone_number: 'Phone Number',
        company: 'Company',
        position: 'Position',
        status: 'Status',
        last_contacted: 'Last Contacted',
        imported_at: 'Imported At'
      }
    });
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw new Error('Error generating CSV');
  }
};

module.exports = {
  parseCSV,
  generateCSV
}; 