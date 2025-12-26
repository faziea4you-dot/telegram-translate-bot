import { Telegraf } from "telegraf";
import fetch from "node-fetch";

const BOT_TOKEN = process.env.BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "أهلاً 👋\nأرسل نصًا باللغة الإنجليزية وسأقوم بترجمته وتلخيصه إلى العربية."
  );
});

bot.on("text", async (ctx) => {
  const userText = ctx.message.text;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "ترجم النص من الإنجليزية إلى العربية ثم لخصه باختصار واضح."
          },
          {
            role: "user",
            content: userText
          }
        ]
      })
    });

    const data = await response.json();
    const result = data.choices[0].message.content;

    ctx.reply(result);
  } catch (error) {
    console.error(error);
    ctx.reply("حدث خطأ، حاول مرة أخرى.");
  }
});

bot.launch();
