import { Table } from 'console-table-printer';
import chalk from 'chalk';

const tableStyle = {
  headerTop: {
    left: chalk.greenBright('╔'),
    mid: chalk.greenBright('╦'),
    right: chalk.greenBright('╗'),
    other: chalk.greenBright('═'),
  },
  headerBottom: {
    left: chalk.greenBright('╟'),
    mid: chalk.greenBright('╬'),
    right: chalk.greenBright('╢'),
    other: chalk.greenBright('═'),
  },
  tableBottom: {
    left: chalk.greenBright('╚'),
    mid: chalk.greenBright('╩'),
    right: chalk.greenBright('╝'),
    other: chalk.greenBright('═'),
  },
  vertical: chalk.greenBright('║'),
};

const tableColumn = [
  {
    name: 'no',
    title: chalk.bgYellowBright.black(' No '),
    alignment: 'left',
  },
  {
    name: 'name',
    title: chalk.bgYellowBright.black(' Name '),
    alignment: 'left',
  },
  {
    name: 'email',
    title: chalk.bgYellowBright.black(' Email '),
    alignment: 'left',
  },
  {
    name: 'phone_number',
    title: chalk.bgYellowBright.black(' Phone Number '),
    alignment: 'left',
  },
];

const tableTitle = chalk.bgCyan.black.bold(' Contacts List ');

const p = new Table({
  title: tableTitle,
  columns: tableColumn,
  style: tableStyle,
});

const insertTableRow = (no, name, email, phone_number) => {
  p.addRow({
    no,
    name,
    email,
    phone_number,
  });
};

export { p, insertTableRow };
