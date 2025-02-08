const { createBot, createProvider, createFlow, addKeyword, utils } = require('@builderbot/bot');
const { BaileysProvider } = require('@builderbot/provider-baileys');
const { MemoryDB } = require('@builderbot/bot');

const PORT = process.env.PORT ?? 3008

const welcomeFlow = addKeyword(['hi', 'hello', 'hola'])
    .addAnswer(
        '*Enter the number to check:*',
        { capture: true },
        async (ctx, { provider, flowDynamic }) => {
            utils.printer('Testing', 'Title', 'bgGreen')
            const checkNumber = ctx.body
            try {
                const onWhats = await provider.vendor.onWhatsApp(checkNumber)
                if (onWhats[0]?.exists) {
                    await flowDynamic([`*Exists:* ${onWhats[0].exists}\n*JID:* ${onWhats[0].jid}`, `*Object:* ${JSON.stringify(onWhats, null, 6)}`])
                }
                else {
                    await flowDynamic(`The number *${checkNumber}* does not exists on Whatsapp.`)
                }
            } catch (error) {
                await flowDynamic(`*Error:* ${error}`);
            }
        }
    )

const main = async () => {
    const adapterFlow = createFlow([welcomeFlow])
    const adapterProvider = createProvider(BaileysProvider)
    const adapterDB = new MemoryDB()
    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    httpServer(+PORT)
}

main()
