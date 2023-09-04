import {
  deleteContact,
  editContact,
  listAllContacts,
  saveContact,
  showContactByName,
} from './contact.js';

const add = {
  command: 'add',
  describe: `Add new contact`,
  builder: {
    name: {
      describe: 'Input contact name',
      demandOption: true,
      type: 'string',
    },
    email: {
      describe: 'Input email contact',
      demandOption: false,
      type: 'string',
    },
    phoneNumber: {
      describe: 'Input contact phone number',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    saveContact(argv.name, argv.email, argv.phoneNumber);
  },
};

const show = {
  command: 'show',
  describe: 'List all existing contact',
  builder: {
    all: {
      describe: 'Show list all of existing contacts',
      type: 'boolean',
    },
    only: {
      describe: 'Show specified contact by contact name',
      demandOption: false,
      type: 'string',
    },
  },
  handler(argv) {
    // Handle list --all arguments
    if (argv.all) listAllContacts();
    // Handle list --only arguments
    if (argv.only) {
      showContactByName(argv.only);
    }
  },
};

const edit = {
  command: 'edit',
  describe: 'Edit a contact',
  builder: {
    name: {
      describe: 'Specified name to edit contact',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    editContact(argv.name);
  },
};

const remove = {
  command: 'delete',
  describe: 'Delete a contact',
  builder: {
    name: {
      describe: 'Specified name to delete ',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    deleteContact(argv.name);
  },
};

export { add, show, edit, remove };
