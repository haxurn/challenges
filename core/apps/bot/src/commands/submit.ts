import { Telegraf, Context } from 'telegraf';
import axios, { AxiosError } from 'axios';
import chalk from 'chalk';
import { BOT_API_URL } from '../env';

// Constants for regex and common messages
const FLAG_REGEX = /^flag\{[a-zA-Z0-9_@!?-]+\}$/;
const SLUG_REGEX = /^[a-zA-Z0-9_-]+$/;
const ERR_NO_USER = '⚠️ Could not identify you. Please try again.';
const ERR_INVALID_FLAG = 'Invalid flag format. Flags should look like: `flag{...}`';
const ERR_INVALID_SLUG = 'Invalid challenge slug. Use alphanumeric characters, hyphens, or underscores (e.g., `web-101`).';
const ERR_NO_INPUT = 'Please provide the flag after the /submit command.\n*Usage*:`/submit <challenge_slug> <flag>`';
const ERR_API_FAIL = '⚠️ An error occurred while submitting your flag. Please try again with `/submit`.';
const ERR_TIMEOUT = '⚠️ The submission request timed out. Please try again with `/submit`.';
const ERR_NO_CONNECTION = '⚠️ Could not connect to the submission service. Please check your connection or try again with `/submit`.';
const ERR_RATE_LIMIT = '⚠️ Too many submissions! Please wait a moment and try again with `/submit`.';
const ERR_INTERNAL = '🆘 An unexpected internal error occurred. Please contact an admin or try again with `/submit`.';

// Interfaces for API responses and payload
interface SubmissionPayload {
  user: {
    telegramUsername: number;
  };
  chatId: number;
  flag: string;
  challengeSlug?: string;
}

interface ApiSuccessResponse {
  message: string;
  submissionId: number;
  isCorrect?: boolean;
}

interface ApiErrorResponse {
  message: string;
  errors?: any;
}

export function registerSubmitCommand(bot: Telegraf<Context>) {
  bot.command('submit', async (ctx) => {
    const user = ctx.from;
    const chat = ctx.chat;

    // Validate user and chat
    if (!user || !chat) {
      console.error(chalk.red('Could not identify user or chat info.'));
      try {
        await ctx.reply(ERR_NO_USER, { parse_mode: 'Markdown' });
      } catch (replyError) {
        console.error(chalk.red('Failed to send reply for missing user/chat info:'), replyError);
      }
      return;
    }

    // Extract and validate input
    const text = ctx.message?.text?.substring(ctx.message.text.indexOf(' ') + 1).trim() || '';
    if (!text || text === '/submit') {
      return ctx.reply(ERR_NO_INPUT, { parse_mode: 'Markdown' });
    }

    // Parse input into flag and optional challenge slug
    const parts = text.split(' ').filter((p) => p.trim());
    let challengeSlug: string | undefined;
    let flag: string | undefined;

    if (parts.length === 1) {
      flag = parts[0].trim();
    } else if (parts.length >= 2) {
      const potentialFlag = parts[parts.length - 1].trim();
      if (FLAG_REGEX.test(potentialFlag)) {
        flag = potentialFlag;
        challengeSlug = parts.slice(0, -1).join(' ').trim();
      } else {
        flag = text.trim();
      }
    }

    // Validate flag
    if (!flag) {
      return ctx.reply('Could not parse the flag from your message. Please try again with `/submit`.', { parse_mode: 'Markdown' });
    }
    if (!FLAG_REGEX.test(flag)) {
      return ctx.reply(ERR_INVALID_FLAG, { parse_mode: 'Markdown' });
    }

    // Validate challenge slug if provided
    if (challengeSlug && !SLUG_REGEX.test(challengeSlug)) {
      return ctx.reply(ERR_INVALID_SLUG, { parse_mode: 'Markdown' });
    }

    // Log submission attempt
    const logPrefix = `[${new Date().toISOString()}] [User: ${user.username || user.id}]`;
    console.log(chalk.blue(`${logPrefix} Submission request: Challenge='${challengeSlug || 'none'}', Flag='${flag}'`));

    // Send processing message
    await ctx.reply('⏳ *Submitting your flag...*', { parse_mode: 'Markdown' });

    // Prepare API payload
    const payload: SubmissionPayload = {
      user: {
        telegramUsername: user.id,
      },
      chatId: chat.id,
      flag,
      challengeSlug,
    };

    console.log(chalk.blue(`${logPrefix} Submission payload:`), payload);

    try {
      // Validate API URL
      if (!BOT_API_URL) {
        throw new Error('BOT_API_URL is not defined');
      }

      const apiUrl = `${BOT_API_URL}/bot/submissions`;
      console.log(chalk.green(`${logPrefix} Calling API: POST ${apiUrl}`));

      // Make API request
      const response = await axios.post<ApiSuccessResponse>(apiUrl, payload, {
        timeout: 10000,
      });

      console.log(chalk.green(`${logPrefix} API Response Status: ${response.status}`));
      console.log(chalk.green(`${logPrefix} API Response Data:`), response.data);

      // Format success message
      const successMessage = `
✅ *Submission Successful!*
- *Submission ID*: \`${response.data.submissionId}\`
- *Flag*: \`${flag}\`
${challengeSlug ? `- *Challenge*: \`${challengeSlug}\`\n` : ''}
${response.data.isCorrect !== undefined ? `- *Correct*: ${response.data.isCorrect ? 'Yes ✅' : 'No ❌'}\n` : ''}
*Message*: ${response.data.message || 'Your flag has been recorded.'}
      `.trim();
      await ctx.reply(successMessage, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error(chalk.red(`${logPrefix} Error submitting flag via API:`));

      let replyMessage = ERR_API_FAIL;
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        console.error(chalk.red(`  -> Status: ${axiosError.response?.status}`));
        console.error(chalk.red(`  -> Data: ${JSON.stringify(axiosError.response?.data)}`));
        console.error(chalk.red(`  -> Code: ${axiosError.code}`));

        if (axiosError.response) {
          const status = axiosError.response.status;
          const apiErrorMessage = axiosError.response.data?.message;

          if (status === 429) {
            replyMessage = ERR_RATE_LIMIT;
          } else if (apiErrorMessage) {
            replyMessage = `⚠️ *${apiErrorMessage}* Please try again with \`/submit\`.`;
          } else {
            replyMessage = `⚠️ Submission failed (Status: ${status}). Please try again with \`/submit\`.`;
          }
        } else if (axiosError.request) {
          replyMessage = axiosError.code === 'ETIMEDOUT' || axiosError.code === 'ECONNABORTED' ? ERR_TIMEOUT : ERR_NO_CONNECTION;
        }
      } else {
        console.error(chalk.red('  -> Non-Axios Error:'), error);
        replyMessage = ERR_INTERNAL;
      }

      await ctx.reply(replyMessage, { parse_mode: 'Markdown' });
    }
  });
}