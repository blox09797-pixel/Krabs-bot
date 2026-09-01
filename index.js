require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  SlashCommandBuilder
} = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

console.log("TOKEN vorhanden:", !!TOKEN);
console.log("CLIENT_ID vorhanden:", !!CLIENT_ID);

if (!TOKEN || !CLIENT_ID) {
  console.error("❌ DISCORD_TOKEN oder CLIENT_ID fehlt!");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const commands = [
  new SlashCommandBuilder()
    .setName("krabs")
    .setDescription("Krabs antwortet dir!")
    .addStringOption(option =>
      option
        .setName("nachricht")
        .setDescription("Was willst du Krabs sagen?")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("hilfe")
    .setDescription("Zeigt alle Krabs-Befehle"),

  new SlashCommandBuilder()
    .setName("regeln")
    .setDescription("Zeigt die Krabs-Clan Discord-Regeln"),

  new SlashCommandBuilder()
    .setName("info")
    .setDescription("Infos über den Krabs Clan"),

  new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warnt einen User")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User auswählen")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("grund")
        .setDescription("Grund für die Warnung")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kickt einen User")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User auswählen")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("grund")
        .setDescription("Grund")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bannt einen User")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User auswählen")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("grund")
        .setDescription("Grund")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Gibt einem User einen Timeout")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User auswählen")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("minuten")
        .setDescription("Dauer in Minuten")
        .setRequired(true)
    )
];

const krabsReplies = [
  "🦀 Arrr! Geld riecht immer nach Arbeit! 💰",
  "🦀 Was ist los, Matrose? Mach hinne!",
  "🦀 Zeit ist Geld – und davon haben wir nicht genug! 💰",
  "🦀 Arrr, der Clan braucht dich!",
  "🦀 Keine Panik! Krabs hat alles unter Kontrolle. 🦀",
  "🦀 Wer hat hier nach Krabs gerufen?!",
  "🦀 Ordnung im Clan, sonst wird die Schatzkiste leer! 💰",
  "🦀 Arrr! Das klingt nach einem Geschäft!",
  "🦀 Erst die Arbeit, dann die Schatzkiste!",
  "🦀 Krabs ist da. Jetzt kann nichts mehr schiefgehen! 🦀"
];

client.once("ready", async () => {
  console.log(`🦀 Krabs Bot ist online als ${client.user.tag}`);

  try {
    await client.application.commands.set(
      commands.map(command => command.toJSON())
    );

    console.log("✅ Slash-Befehle registriert!");
  } catch (error) {
    console.error("❌ Fehler beim Registrieren der Slash-Befehle:", error);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "krabs") {
    const message = interaction.options.getString("nachricht");

    const reply =
      krabsReplies[Math.floor(Math.random() * krabsReplies.length)];

    await interaction.reply(
      `🦀 **Krabs:** ${reply}\n\n📩 Deine Nachricht: ${message}`
    );
  }

  if (commandName === "hilfe") {
    await interaction.reply({
      content:
        "🦀 **Krabs Clan – Befehle**\n\n" +
        "💰 `/krabs <nachricht>` – Krabs antwortet\n" +
        "📜 `/regeln` – Clan-Regeln\n" +
        "ℹ️ `/info` – Clan-Infos\n" +
        "❓ `/hilfe` – Diese Hilfe\n\n" +
        "🛡️ **Moderation:**\n" +
        "`/warn` – User warnen\n" +
        "`/kick` – User kicken\n" +
        "`/ban` – User bannen\n" +
        "`/timeout` – User timeouten",
      ephemeral: true
    });
  }

  if (commandName === "regeln") {
    await interaction.reply(
      "🦀 **KRABS CLAN – DISCORD REGELN** 🦀\n\n" +
      "1️⃣ Respekt gegenüber allen Mitgliedern.\n" +
      "2️⃣ Kein Spam oder unnötiges Pingen.\n" +
      "3️⃣ Benutzt die richtigen Channels.\n" +
      "4️⃣ Kein unnötiger Beef im Clan.\n" +
      "5️⃣ Keine privaten Informationen anderer weitergeben.\n" +
      "6️⃣ Voice-Chat: nicht absichtlich nerven oder schreien.\n" +
      "7️⃣ Entscheidungen der Clan-Leitung respektieren.\n" +
      "8️⃣ Habt Spaß und bleibt fair! 🦀\n\n" +
      "💰 **Wer die Regeln bricht, zahlt die Krabben-Steuer!**"
    );
  }

  if (commandName === "info") {
    await interaction.reply(
      "🦀 **KRABS CLAN** 🦀\n\n" +
      "⛏️ Minecraft: Hugo SMP\n" +
      "💰 Clan: Krabs Clan\n" +
      "⚓ Gemeinsam spielen, bauen und gewinnen!\n\n" +
      "🦀 **Arrr – willkommen an Bord!**"
    );
  }

  if (
    ["warn", "kick", "ban", "timeout"].includes(commandName) &&
    !interaction.member.permissions.has(
      PermissionsBitField.Flags.ModerateMembers
    )
  ) {
    return interaction.reply({
      content: "❌ Du hast keine Berechtigung für diesen Befehl.",
      ephemeral: true
    });
  }

  if (commandName === "warn") {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("grund");

    await interaction.reply(
      `⚠️ **Verwarnung!**\n${user} wurde verwarnt.\n📋 Grund: ${reason}`
    );
  }

  if (commandName === "kick") {
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("grund") || "Kein Grund angegeben";

    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ User wurde nicht gefunden.",
        ephemeral: true
      });
    }

    try {
      await member.kick(reason);

      await interaction.reply(
        `👢 ${user.tag} wurde aus dem Clan gekickt.\n📋 Grund: ${reason}`
      );
    } catch {
      await interaction.reply({
        content: "❌ Ich konnte diesen User nicht kicken.",
        ephemeral: true
      });
    }
  }

  if (commandName === "ban") {
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("grund") || "Kein Grund angegeben";

    try {
      await interaction.guild.members.ban(user.id, { reason });

      await interaction.reply(
        `🔨 ${user.tag} wurde gebannt.\n📋 Grund: ${reason}`
      );
    } catch {
      await interaction.reply({
        content: "❌ Ich konnte diesen User nicht bannen.",
        ephemeral: true
      });
    }
  }

  if (commandName === "timeout") {
    const user = interaction.options.getUser("user");
    const minutes = interaction.options.getInteger("minuten");

    if (minutes < 1 || minutes > 40320) {
      return interaction.reply({
        content: "❌ Die Dauer muss zwischen 1 und 40320 Minuten liegen.",
        ephemeral: true
      });
    }

    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ User wurde nicht gefunden.",
        ephemeral: true
      });
    }

    try {
      await member.timeout(
        minutes * 60 * 1000,
        "Krabs Clan Moderation"
      );

      await interaction.reply(
        `⏰ ${user.tag} hat einen Timeout für **${minutes} Minuten** bekommen.`
      );
    } catch {
      await interaction.reply({
        content: "❌ Ich konnte diesem User keinen Timeout geben.",
        ephemeral: true
      });
    }
  }
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().includes("krabs")) {
    if (Math.random() <= 0.25) {
      const reply =
        krabsReplies[Math.floor(Math.random() * krabsReplies.length)];

      await message.reply(`🦀 ${reply}`);
    }
  }
});

client.on("guildMemberAdd", async member => {
  const channel = member.guild.systemChannel;

  if (!channel) return;

  await channel.send(
    `🦀 **Arrr, ${member.user.username}!**\n\n` +
    `Willkommen im **Krabs Clan**! 💰⚓\n` +
    `Mach es dir gemütlich und halt dich an die Regeln.\n\n` +
    `🦀 Viel Spaß an Bord!`
  );
});

client.login(TOKEN);
