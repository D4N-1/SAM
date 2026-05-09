# Sistema monorepo de tres aplicaciones

## ¿Qué es Sam?

A partir de lo aprendido (y con herramientas adicionales que hoy tengo), creé esta nota para orientarme, registrar lo que voy a construir y documentar el diseño del sistema.

Sam es un **proyecto monorepo** donde convivirán **tres aplicaciones** (Bot, API y Web) para construir un ecosistema completo alrededor de **comunidades y grupos de WhatsApp**.

La idea central es que exista un **sistema de usuarios** (identidad, progreso, inventario, economía, reputación, etc.) que pueda vivir “más allá” de una sola conversación, y que ese estado se pueda usar para habilitar **dinámicas, minijuegos y automatizaciones** dentro de los grupos.

En otras palabras: la **WEB** es la “cara” del sistema (interacción), la **API** es el “cerebro” (reglas + datos) y el **BOT** es el respaldo de la web para integración natural con la aplicación de mensajeria

### Qué problema resuelve (y qué NO)

- **Qué sí**: crear una base técnica seria para una experiencia divertida y extensible en WhatsApp: comandos, eventos, minijuegos, perfiles, economía, moderación ligera, y funciones que ayuden a mantener viva una comunidad.
- **Qué no** (por ahora): competir con plataformas de comunidad externas o construir una red social. El foco es **WhatsApp-first** y en un **MVP** con alcance controlado.

### Componentes del sistema (visión general)

- **Identidad y cuentas**: registro/vinculación por número de WhatsApp, perfiles, preferencias y seguridad básica.
- **Comunidades / grupos**: configuración por grupo, roles, permisos, y “features” activables por comunidad.
- **Economía y progresión**: monedas, items, recompensas, cooldowns, rankings y balance.
- **Minijuegos y dinámicas**: módulos enchufables (trivia, duelos, apuestas simples, retos) con reglas claras y persistencia.
- **Moderación y automatización**: comandos administrativos, anti-spam simple, logs y eventos relevantes.

### Cómo se comunican las apps

- El **Bot** recibe mensajes/eventos de WhatsApp, valida, interpreta intención y llama a la **API**.
- La **API** aplica reglas de negocio, persiste datos y responde con lo necesario para que el Bot “sepa qué decir”.
- La **Web** consume la **API** para configurar el sistema (por comunidad) y mostrar métricas/estado
