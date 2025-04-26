import { Telegraf, Context } from 'telegraf';

export function registerStartCommand(bot: Telegraf<Context>) {
  bot.start(async (ctx) => {
    const user = ctx.from;

    if (!user) {
      try {
        await ctx.reply("❌ Sorry, I couldn't identify you. Please try starting again.");
        console.warn("Missing user info during /start command.");
      } catch (replyError) {
        console.error("Failed to send reply for missing user info:", replyError);
      }
      return;
    }

    const firstName = user.first_name || 'Hacker';
    const welcomeMessage = `
🎉 *Welcome to the CTF Flag Submission Bot, ${firstName}!* 🚩

I'm your trusty companion for submitting Capture The Flag (CTF) challenge flags securely and efficiently. Let's get you started! 💻



📜 *How to Submit Flags*
Use the \`/submit\` command in one of these formats:

1️⃣ *Simple Flag Submission* (when no challenge ID is required):
\`\`\`
/submit flag{the_actual_flag}
\`\`\`
_Example_: \`/submit flag{super_secret_123}\`

2️⃣ *Challenge-Specific Submission* (when a challenge slug/ID is provided):
\`\`\`
/submit <challenge_slug> flag{the_actual_flag}
\`\`\`
_Example_: \`/submit web-101 flag{some_secret}\`

⚠️ *Tip*: Check the challenge instructions! If a slug or identifier is mentioned, use the second format. Otherwise, the first one works fine.


🛠 *Other Commands*
- *Need help?* Use \`/help\` to see all available commands and tips.
- *Lost a flag?* Don’t worry, submit it again—I’ll handle duplicates gracefully.



🌟 *Pro Tips*
- *Double-check your flag*: Flags are case-sensitive and often follow a specific format (e.g., \`flag{...}\`).
- *Stay secure*: Never share your flags in public chats. Always submit them directly to me via commands.
- *Have fun!* CTF challenges are all about learning and hacking. Enjoy the journey! 🚀



Ready to conquer those challenges? Submit your first flag with \`/submit\` or type \`/help\` for more details. *Good luck, ${firstName}!* 🏆`;

    try {
      await ctx.telegram.sendMessage(ctx.chat.id, welcomeMessage, { parse_mode: 'Markdown' });
      console.log(`Sent welcome message to user: ${user.username || user.id} (${firstName})`);
    } catch (error) {
      console.error(`Error sending welcome message to user ${user.id} (${user.username}):`, error);
      const fallbackMessage = `Welcome, ${firstName}! I'm the CTF Flag Submission Bot. Use /submit <flag> or /submit <challenge_slug> <flag> to submit flags. Type /help for more info.`;
      try {
        await ctx.reply(fallbackMessage);
        console.warn(`Sent plain text fallback message to user ${user.id}.`);
      } catch (fallbackError) {
        console.error(`Failed to send plain text fallback message to user ${user.id}:`, fallbackError);
      }
    }
  });
}