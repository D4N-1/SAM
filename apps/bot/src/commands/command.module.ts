import BotCommand from "./bot/bot.module.js";
import PingCommand from "./ping/ping.module.js";
import SayCommand from "./say/say.module.js";
import TraductorCommand from "./traductor/traductor.module.js";
import WhatsappCommand from "./whatsapp/whatsapp.module.js";


export const ALL_COMMANDS = [
    PingCommand,
    SayCommand,
    TraductorCommand,
    WhatsappCommand,
    BotCommand
]