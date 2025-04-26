import { Telegraf, Context } from 'telegraf';
import chalk from 'chalk';

export function registerCommandsCommand(bot: Telegraf<Context>) {
  bot.command('commands', async (ctx) => {
    const user = ctx.from;

    // Validate user
    if (!user) {
      console.error(chalk.red('Could not identify user for /commands.'));
      try {
        await ctx.reply('⚠️ Could not identify you. Please try again.', { parse_mode: 'Markdown' });
      } catch (replyError) {
        console.error(chalk.red('Failed to send reply for missing user info:'), replyError);
      }
      return;
    }

    // Log command usage
    const logPrefix = `[${new Date().toISOString()}] [User: ${user.username || user.id}]`;
    console.log(chalk.blue(`${logPrefix} Requested command list`));

    // Command list in the requested format
    const commandList = `
*Haxurn Core Command List* 🚩

/start - Begin your journey with Haxurn Core
/submit - Submit a CTF flag (e.g., \`/submit <flag>\` or \`/submit <challenge_slug> <flag>\`)
/commands - Show this list of commands
/help - Get help and additional tips
/empty - Keep the list empty (no commands added)
    `.trim();

    try {
      await ctx.reply(commandList, { parse_mode: 'Markdown' });
      console.log(chalk.green(`${logPrefix} Sent command list to user`));
    } catch (error) {
      console.error(chalk.red(`${logPrefix} Error sending command list:`), error);
      const fallbackMessage = 'Haxurn Core Commands:\n/start - Begin your journey\n/submit - Submit a CTF flag\n/commands - Show this list\n/help - Get help\n/empty - Keep the list empty';
      try {
        await ctx.reply(fallbackMessage);
        console.warn(chalk.yellow(`${logPrefix} Sent plain text fallback for command list`));
      } catch (fallbackError) {
        console.error(chalk.red(`${logPrefix} Failed to send fallback command list:`), fallbackError);
      }
    }
  });
}