import chalk from 'chalk';

const info = messages => {
  console.log(`${chalk.bgCyan.black.bold(' INFO ')} ${chalk.bold(messages)}`);
};
const warn = messages => {
  console.log(`${chalk.bgYellow.black.bold(' WARN ')} ${chalk.bold(messages)}`);
};
const error = messages => {
  console.log(`${chalk.bgRed.black.bold(' ERROR ')} ${chalk.bold(messages)}`);
};
const success = messages => {
  console.log(
    `${chalk.bgGreen.black.bold(' SUCCESS ')} ${chalk.bold(messages)}`
  );
};

export { info, warn, error, success };
