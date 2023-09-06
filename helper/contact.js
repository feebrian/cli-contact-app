import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import * as logger from './logger.js';
import { insertTableRow, p } from './table.js';
import chalk from 'chalk';
import prompts from 'prompts';
import validator from 'validator';

const path = './data';
if (!existsSync(path)) mkdirSync(path);

const filePath = './data/contacts.json';
if (!existsSync(filePath)) writeFileSync(filePath, '[]');

const fileBuffer = readFileSync(filePath, 'utf-8');
if (validator.isEmpty(fileBuffer)) writeFileSync(filePath, '[]');

const readContacts = path => {
  const data = readFileSync(path, 'utf-8');
  const contacts = JSON.parse(data);

  return contacts;
};

const findContactByName = (contacts, name) => {
  const contact = contacts.find(cn => cn.name === name);
  return contact;
};

const findContactIndexByName = (contacts, name) => {
  const contactIndex = contacts
    .map(function (e) {
      return e.name;
    })
    .indexOf(name);

  return contactIndex;
};

const saveToFile = (path, data, message) => {
  writeFileSync(path, JSON.stringify(data, null, 2));
  logger.success(message);
};

const saveContact = (name, email, phoneNumber) => {
  const contacts = readContacts(filePath);
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

  if (email) {
    duplicate = contacts.find(cn => cn.email === email);
    if (duplicate) {
      logger.warn('This email address has been used, please use another.');
      return false;
    }

    if (!duplicate) {
      if (!validator.isEmail(email)) {
        logger.error('Please use valid email.');
        return false;
      }
    }
  }

  const contact = { name, email, phoneNumber };
  contacts.push(contact);

  // Save file to contacts.json
  saveToFile(filePath, contacts, 'Thank you for submitting data');
};

const listAllContacts = () => {
  const contacts = readContacts(filePath);

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
  const contacts = readContacts(filePath);
  const contact = findContactByName(contacts, name);

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
  const contacts = readContacts(filePath);
  const contact = findContactByName(contacts, name);

  const contactIndex = findContactIndexByName(contacts, name);

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

      // Save file to contacts.json
      saveToFile(filePath, contacts, 'Contact edited successfully!');
    })();
  }

  if (!contact) {
    logger.error(`Contact with name '${chalk.italic(name)}' can't be found`);
  }
};

const deleteContact = name => {
  const contacts = readContacts(filePath);
  const contact = findContactByName(contacts, name);

  const contactIndex = findContactIndexByName(contacts, name);

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

        saveToFile(filePath, contacts, 'Contact deleted successfully!');
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
