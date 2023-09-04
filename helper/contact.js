import { existsSync, mkdirSync, writeFileSync, readFileSync, read } from 'fs';
import * as logger from './logger.js';
import { insertTableRow, p } from './table.js';
import chalk from 'chalk';
import prompts from 'prompts';

const path = './data';
if (!existsSync(path)) mkdirSync(path);

const filePath = './data/contacts.json';
if (!existsSync(filePath)) writeFileSync(filePath, '[]');

const fileBuffer = readFileSync(filePath, 'utf-8');
if (fileBuffer === '') writeFileSync(filePath, '[]');

const saveContact = (name, email, phoneNumber) => {
  const data = readFileSync('./data/contacts.json', 'utf-8');
  const contacts = JSON.parse(data);
  let duplicate;

  duplicate = contacts.find(cn => cn.name === name);
  if (duplicate) {
    logger.warn(
      'This contact name has been used. Please use other contact name'
    );
    return false;
  }

  duplicate = contacts.find(cn => cn.phoneNumber === phoneNumber);
  if (duplicate) {
    logger.warn('This phone number has been added.');
    return false;
  }

  const contact = { name, email, phoneNumber };
  contacts.push(contact);

  // parse contacts back to json
  const contactsJSON = JSON.stringify(contacts, null, 2);

  writeFileSync('./data/contacts.json', contactsJSON);
  logger.success('Thank you for submitting data');
};

const listAllContacts = () => {
  const data = readFileSync('./data/contacts.json', 'utf-8');
  const contacts = JSON.parse(data);

  showContacts(contacts);
};

const showContacts = data => {
  if (data.length > 0) {
    data.forEach((v, i) => {
      // Insert each data to table row
      insertTableRow(i + 1, v.name, v.email, v.phoneNumber);
    });

    // Print table
    p.printTable();
  } else {
    logger.info("You don't have any contact right now...");
  }
};

const showContactByName = name => {
  const data = readFileSync('./data/contacts.json', 'utf-8');
  const contacts = JSON.parse(data);

  const contact = contacts.find(cn => cn.name === name);

  // Handle if the contact name inputted by user match with the one of the existing contact
  if (contact) {
    // Insert table row
    insertTableRow(1, contact.name, contact.email, contact.phoneNumber);
    // Print table
    p.printTable();
  }

  // Handle if no contact matches
  if (!contact) {
    logger.error(
      `Sorry, you don't have any contact with name '${chalk.italic(name)}'`
    );
  }
};

const editContact = name => {
  const data = readFileSync('./data/contacts.json', 'utf-8');
  const contacts = JSON.parse(data);
  const contact = contacts.find(cn => cn.name === name);

  const contactIndex = contacts
    .map(function (e) {
      return e.name;
    })
    .indexOf(name);

  if (contact) {
    const questions = [
      {
        type: 'text',
        name: 'name',
        message: 'Wanna change this contact name?',
        initial: contact.name,
      },
      {
        type: 'text',
        name: 'email',
        message: 'Wanna change this email?',
        initial: contact.email,
      },
      {
        type: 'text',
        name: 'phoneNumber',
        message: 'Wanna change this contact phone number?',
        initial: contact.phoneNumber,
      },
    ];
    (async () => {
      // Get answer from input
      const response = await prompts(questions);

      contacts[contactIndex] = response;

      const contactsJSON = JSON.stringify(contacts, null, 2);
      writeFileSync('./data/contacts.json', contactsJSON);
      logger.success('Contact edited successfully!');
    })();
  }

  if (!contact) {
    logger.error(`Contact with name '${chalk.italic(name)}' can't be found`);
  }
};

const deleteContact = name => {
  const data = readFileSync('./data/contacts.json', 'utf-8');
  const contacts = JSON.parse(data);
  const contact = contacts.find(cn => cn.name === name);

  const contactIndex = contacts
    .map(function (e) {
      return e.name;
    })
    .indexOf(name);

  if (contact) {
    const question = {
      type: 'toggle',
      name: 'value',
      message: 'Are you sure you want to delete this contact?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    };

    (async () => {
      const response = await prompts(question);

      if (response.value) {
        contacts.splice(contactIndex, 1);

        const contactsJSON = JSON.stringify(contacts, null, 2);
        writeFileSync('./data/contacts.json', contactsJSON);
        logger.success('Contact deleted successfully!');
      }
    })();
  }

  if (!contact) {
    logger.error(`Contact with name '${chalk.italic(name)}' can't be found`);
  }
};

export {
  saveContact,
  listAllContacts,
  showContactByName,
  editContact,
  deleteContact,
};
