import { ContactMiddleware } from "../common/middlewares/global/contact.middleware.js";
import { GroupLogMiddleware } from "../common/middlewares/global/group.middleware.js";
import { LogMiddleware } from "../common/middlewares/global/log.middleware.js";
import BotCommand from "./general/bot/bot.module.js";
import PingCommand from "./general/ping/ping.module.js";
import PromoteCommand from "./admin/promote/promote.module.js";
import SayCommand from "./general/say/say.module.js";
import TraductorCommand from "./general/traductor/traductor.module.js";
import WhatsappCommand from "./general/whatsapp/whatsapp.module.js";
import { EveryoneCommand } from "./admin/everyone/everyone.module.js";


export const ALL_COMMANDS = [
    PingCommand,
    SayCommand,
    TraductorCommand,
    WhatsappCommand,
    BotCommand,
    PromoteCommand,
    EveryoneCommand
]


export const GLOBAL_MIDDLEWARES = [
    LogMiddleware,
    ContactMiddleware,
    GroupLogMiddleware
]