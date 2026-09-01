const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder
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

// 🦀 Krabs-Antworten
const krabsAntworten = [
  "ARRR! Was gibt's, Matrose?! 🦀💰",
  "Was willst du denn von mir?! Ich bin beschäftigt, Geld zu zählen! 💰",
  "Hast du etwa Profit gesagt?! 👀💰",
  "ARRR! Immer schön den Regeln folgen, Matrose! 🦀",
  "Keine Panik! Mr. Krabs... äh, der Krabs Bot ist da! 🦀",
  "Das kostet dich normalerweise 5 Dollar... aber heute hast du Glück! 💰",
  "PLANKTON?! Wo?! 😱🦀",
  "Zeit ist Geld, Matrose! ⏰💰"
];

const commands = [
  new SlashCommandBuilder()
    .setName("krabs")
    .setDescription("Sprich mit dem Krabs Bot")
    .addStringOption(option =>
      option
        .setName("nachricht")
        .setDescription("Was möchtest du Krabs sagen?")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("hilfe")
    .setDescription("Zeigt alle Krabs-Bot-Befehle"),

  new SlashCommandBuilder()
    .setName("regeln")
    .setDescription("Zeigt die Clan-Regeln"),

  new SlashCommandBuilder()
    .setName("info")
    .setDescription("Zeigt Informationen über den Krabs Clan"),

  new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warnt ein Mitglied")
    .addUserOption(option =>
      option.setName("mitglied").setDescription("Mitglied").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("grund").setDescription("Grund").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kickt ein Mitglied")
    .addUserOption(option =>
      option.setName("mitglied").setDescription("Mitglied").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("grund").setDescription("Grund").setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bannt ein Mitglied")
    .addUserOption(option =>
      option.setName("mitglied").setDescription("Mitglied").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("grund").setDescription("Grund").setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Gibt einem Mitglied einen Timeout")
    .addUserOption(option =>
      option.setName("mitglied").setDescription("Mitglied").setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("minuten")
        .setDescription("Dauer in Minuten")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320)
    )
];

client.once("ready", async () => {
  console.log(`🦀 Krabs Bot ist online als ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands.map(command => command.toJSON()) }
    );

    console.log("✅ Slash-Befehle registriert!");
  } catch (error) {
    console.error("❌ Fehler beim Registrieren:", error);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;

  if (command === "krabs") {
    const text = interaction.options.getString("nachricht");
    const antwort =
      krabsAntworten[Math.floor(Math.random() * krabsAntworten.length)];

    await interaction.reply(
      `🦀 **Krabs Bot:** ${antwort}\n\n💬 *Du hast gesagt:* ${text}`
    );
    return;
  }

  if (command === "hilfe") {
    const embed = new EmbedBuilder()
      .setTitle("🦀 Krabs Bot – Hilfe")
      .setDescription(
        "**Befehle:**\n\n" +
        "🦀 `/krabs <nachricht>` – Sprich mit Krabs\n" +
        "📜 `/regeln` – Clan-Regeln\n" +
        "ℹ️ `/info` – Clan-Infos\n" +
        "🆘 `/hilfe` – Diese Übersicht\n" +
        "⚠️ `/warn` – Mitglied verwarnen\n" +
        "👢 `/kick` – Mitglied kicken\n" +
        "🔨 `/ban` – Mitglied bannen\n" +
        "🔇 `/timeout` – Mitglied timeouten"
      );

    await interaction.reply({ embeds: [embed] });
    return;
  }

  if (command === "regeln") {
    await interaction.reply(
      "🦀 **KRABS CLAN – REGELN** 🦀\n\n" +
      "🤝 Respekt gegenüber allen Mitgliedern\n" +
      "🚫 Kein Spam oder unnötiges Pingen\n" +
      "🤫 Interne Clan-Infos bleiben intern\n" +
      "⚔️ Kein unnötiger Beef\n" +
      "🎤 Kein absichtliches Stören im Voice\n" +
      "🦀 Zusammenhalten und Spaß haben!\n\n" +
      "💰 **Zeit ist Geld, Matrosen!**"
    );
    return;
  }

  if (command === "info") {
    await interaction.reply(
      "🦀 **KRABS CLAN** 🦀\n\n" +
      "🎮 Hugo SMP\n" +
      "💰 Profit seit Tag 1\n" +
      "🦀 Zusammenhalt steht an erster Stelle\n\n" +
      "**ARRR!** Willkommen an Bord, Matrose!"
    );
    return;
  }

  if (
    ["warn", "kick", "ban", "timeout"].includes(command) &&
    !interaction.member.permissions.has(
      PermissionsBitField.Flags.ModerateMembers
    )
  ) {
    await interaction.reply({
      content: "🦀 Arrr! Du hast dafür keine Berechtigung, Matrose! 🚫",
      ephemeral: true
    });
    return;
  }

  if (command === "warn") {
    const member = interaction.options.getMember("mitglied");
    const grund = interaction.options.getString("grund");

    await interaction.reply(
      `⚠️ **VERWARNUNG**\n🦀 ${member}\n📄 Grund: ${grund}\n\n💰 Benehmt euch, Matrosen!`
    );
    return;
  }

  if (command === "kick") {
    const member = interaction.options.getMember("mitglied");
    const grund =
      interaction.options.getString("grund") || "Kein Grund angegeben";

    if (!member || !member.kickable) {
      await interaction.reply({
        content: "🦀 Diesen Matrosen kann ich nicht kicken!",
        ephemeral: true
      });
      return;
    }

    await member.kick(grund);

    await interaction.reply(
      `👢 **Gekickt!**\n🦀 ${member.user.tag}\n📄 Grund: ${grund}`
    );
    return;
  }

  if (command === "ban") {
    const member = interaction.options.getMember("mitglied");
    const grund =
      interaction.options.getString("grund") || "Kein Grund angegeben";

    if (!member || !member.bannable) {
      await interaction.reply({
        content: "🦀 Diesen Matrosen kann ich nicht bannen!",
        ephemeral: true
      });
      return;
    }

    await member.ban({ reason: grund });

    await interaction.reply(
      `🔨 **Gebannt!**\n🦀 ${member.user.tag}\n📄 Grund: ${grund}`
    );
    return;
  }

  if (command === "timeout") {
    const member = interaction.options.getMember("mitglied");
    const minuten = interaction.options.getInteger("minuten");

    if (!member || !member.moderatable) {
      await interaction.reply({
        content: "🦀 Diesen Matrosen kann ich nicht timeouten!",
        ephemeral: true
      });
      return;
    }

    await member.timeout(
      minuten * 60 * 1000,
      `Krabs Bot Timeout: ${minuten} Minuten`
    );

    await interaction.reply(
      `🔇 **Timeout!**\n🦀 ${member.user.tag}\n⏱️ ${minuten} Minuten`
    );
  }
});

// 🦀 Automatische Antwort auf "Krabs"
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().includes("krabs")) {
    if (Math.random() < 0.25) {
      const antwort =
        krabsAntworten[Math.floor(Math.random() * krabsAntworten.length)];

      await message.reply(`🦀 ${antwort}`);
    }
  }
});

client.on("guildMemberAdd", async member => {
  try {
    const channel = member.guild.systemChannel;

    if (channel) {
      await channel.send(
        `🦀 **ARRR! Ein neuer Matrose ist angekommen!**\n` +
        `Willkommen ${member}! 💰\n` +
        `Lies zuerst die Regeln und dann: AB AUFS DECK! ⚓`
      );
    }
  } catch (error) {
    console.error("Fehler bei Begrüßung:", error);
  }
});

client.login(TOKEN);
