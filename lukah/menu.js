const { gmd, commands, DEFAULT_SETTINGS } = require("../luka");

gmd(
  {
    pattern: "menu",
    aliases: ["help", "cmd", "commands", "list"],
    category: "general",
    react: "💜",
    description: "Show LUKA-XMD command menu",
  },

  async (from, Luka, conText) => {
    const {
      reply,
      react,
      botName,
      botFooter,
    } = conText;

    try {
      const settings = DEFAULT_SETTINGS || {};

      const name =
        botName ||
        settings.BOT_NAME ||
        "LUKA-XMD";

      const prefix =
        settings.PREFIX ||
        conText.prefix ||
        ".";

      // Get all registered commands
      const allCommands = Array.isArray(commands)
        ? commands.filter(
            (cmd) =>
              cmd &&
              cmd.pattern &&
              !cmd.dontAddCommandList
          )
        : [];

      // Group commands by category
      const categories = {};

      for (const cmd of allCommands) {
        const category = String(
          cmd.category || "general"
        ).toLowerCase();

        if (!categories[category]) {
          categories[category] = [];
        }

        categories[category].push(cmd);
      }

      // Category icons
      const icons = {
        general: "🌐",
        owner: "👑",
        admin: "🛡️",
        group: "👥",
        downloader: "📥",
        download: "📥",
        search: "🔎",
        fun: "🎮",
        games: "🎮",
        tools: "🛠️",
        utility: "🔧",
        media: "🎵",
        ai: "🤖",
        sticker: "🎨",
        image: "🖼️",
        settings: "⚙️",
        economy: "💰",
        maker: "🧰",
        misc: "✨"
      };

      let menu = "";

      // =========================
      // HEADER
      // =========================

      menu += `╭━━━〔 💜 *LUKA-XMD* 〕━━━╮\n`;
      menu += `┃\n`;
      menu += `┃ 👋 *Hello! Welcome to LUKA-XMD*\n`;
      menu += `┃ 🤖 WhatsApp AI Assistant\n`;
      menu += `┃\n`;
      menu += `┃ ⚡ Status   : *ONLINE*\n`;
      menu += `┃ 📌 Prefix   : *${prefix}*\n`;
      menu += `┃ 📊 Commands : *${allCommands.length}*\n`;
      menu += `┃\n`;
      menu += `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;

      // =========================
      // COMMAND MENU
      // =========================

      menu += `╭────〔 📚 *COMMAND MENU* 〕────╮\n`;

      const categoryNames =
        Object.keys(categories).sort();

      for (const category of categoryNames) {
        const list = categories[category];

        if (!list || list.length === 0) {
          continue;
        }

        const icon =
          icons[category] || "✨";

        const title =
          category.charAt(0).toUpperCase() +
          category.slice(1);

        menu += `┃\n`;
        menu += `┃ ${icon} *${title}*\n`;
        menu += `┃\n`;

        list.sort((a, b) =>
          String(a.pattern).localeCompare(
            String(b.pattern)
          )
        );

        for (const cmd of list) {
          menu += `┃ ${icon} ${prefix}${cmd.pattern}`;

          if (cmd.description) {
            menu += `\n┃    └─ ${cmd.description}`;
          }

          menu += `\n`;
        }
      }

      menu += `┃\n`;
      menu += `╰────────────────────────╯\n\n`;

      // =========================
      // USAGE
      // =========================

      menu += `╭────〔 💡 *USAGE* 〕────╮\n`;
      menu += `┃\n`;
      menu += `┃ 📌 *Command:* ${prefix}menu\n`;
      menu += `┃\n`;
      menu += `┃ 💜 *Examples:*\n`;
      menu += `┃ ${prefix}play song name\n`;
      menu += `┃ ${prefix}video video name\n`;
      menu += `┃ ${prefix}sendaudio url\n`;
      menu += `┃ ${prefix}sendvideo url\n`;
      menu += `┃ ${prefix}menu\n`;
      menu += `┃\n`;
      menu += `╰───────────────────────╯\n\n`;

      // =========================
      // FOOTER
      // =========================

      menu += `╭──────〔 💜 *LUKA-XMD* 〕──────╮\n`;
      menu += `┃\n`;
      menu += `┃ ⚡ Fast • Smart • Powerful\n`;
      menu += `┃ 🤖 Your WhatsApp Assistant\n`;
      menu += `┃\n`;
      menu += `╰──────✦ *LUKABRAND* ✦──────╯\n\n`;

      menu += `> _${botFooter || "Powered by LUKABRAND"}_`;

      await react("💜");

      return reply(menu);

    } catch (error) {
      console.error(
        "[LUKA-XMD MENU ERROR]",
        error
      );

      await react("❌");

      return reply(
        `╭━━〔 ❌ *MENU ERROR* 〕━━╮\n` +
        `┃\n` +
        `┃ Failed to load menu.\n` +
        `┃\n` +
        `┃ ${error.message || "Unknown error"}\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
        `> _${botFooter || "LUKA-XMD"}_`
      );
    }
  }
);
