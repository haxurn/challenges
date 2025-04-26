// apps/bot/src/index.ts
import { Telegraf, Context } from 'telegraf';
import { BOT_TOKEN } from './env';
import { registerStartCommand } from './commands/start';
import { registerSubmitCommand } from './commands/submit';
import { registerCommandsCommand } from './commands/commands';

async function startBot() {
    console.log('[Bot] Initializing Telegraf...');
    
    if (!BOT_TOKEN) {
        console.error("❌ [Bot] BOT_TOKEN is not defined. Bot cannot start.");
        process.exit(1);
    }

    const bot = new Telegraf<Context>(BOT_TOKEN);

    // Register commands
    registerStartCommand(bot);
    registerSubmitCommand(bot);
    registerCommandsCommand(bot);

    // Error handler for Telegraf
    bot.catch((err, ctx) => {
        console.error(`[Telegraf Error] Update Type: ${ctx.updateType}`, err);
        try {
            if (ctx && typeof ctx.reply === 'function') {
                ctx.reply('Sorry, an error occurred processing your request.').catch(e => {
                    console.error('[Telegraf Error] Failed to send error reply to user:', e);
                });
            } else {
                console.error('[Telegraf Error] Context or reply function unavailable for error message.');
            }
        } catch (e) {
            console.error('[Telegraf Error] Failed to send generic error message to user:', e);
        }
    });

    // Start polling
    console.log('[Bot] Starting bot polling...');
    bot.launch().then(() => {
        console.log('✅ [Bot] Bot started successfully!');
    }).catch(err => {
        console.error("❌ [Bot] Failed to launch bot:", err);
        process.exit(1);
    });

    // Graceful stop
    process.once('SIGINT', () => {
        console.log('[Bot] SIGINT received, stopping bot...');
        bot.stop('SIGINT');
        setTimeout(() => process.exit(0), 500);
    });
    process.once('SIGTERM', () => {
        console.log('[Bot] SIGTERM received, stopping bot...');
        bot.stop('SIGTERM');
        setTimeout(() => process.exit(0), 500);
    });
}

startBot();