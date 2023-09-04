import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { add, edit, remove, show } from './helper/command.js';

const commands = [add, show, edit, remove];

yargs(hideBin(process.argv)).command(commands).parse();
