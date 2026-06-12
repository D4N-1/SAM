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
import { KickCommand } from "./admin/kick/kick.module.js";
import { CloseCommand } from "./admin/close/close.module.js";
import { OpenCommand } from "./admin/open/open.module.js";
import { AddCommand } from "./admin/add/add.module.js";
import { SetNameCommand } from "./admin/set-name/set-name.module.js";
import { SetDescriptionCommand } from "./admin/set-description/set-description.module.js";
import { EveryoneAdminCommand } from "./admin/everyone-admin/everyone-admin.module.js";


export const ALL_COMMANDS = [
    PingCommand,
    SayCommand,
    TraductorCommand,
    WhatsappCommand,
    BotCommand,
    PromoteCommand,
    EveryoneCommand,
    EveryoneAdminCommand,
    KickCommand,
    AddCommand,
    CloseCommand,
    OpenCommand,
    SetNameCommand,
    SetDescriptionCommand
]


export const GLOBAL_MIDDLEWARES = [
    LogMiddleware,
    ContactMiddleware,
    GroupLogMiddleware
]