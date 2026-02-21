
import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { order, type = 'cart' } = body;

        if (!order) {
            return NextResponse.json({ error: 'Order data missing' }, { status: 400 });
        }

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('Telegram credentials missing');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        let message = '';

        if (type === 'fast') {
            message = [
                `<b>⚡️ БЫСТРЫЙ ЗАКАЗ (В 1 КЛИК)</b>`,
                ``,
                `<b>👤 Клиент:</b>`,
                `• Имя: ${order.name}`,
                `• Телефон: ${order.phone}`,
                ``,
                `<b>📦 Товар:</b>`,
                `• ${order.productName}`,
                `• Объем: ${order.volume}`,
                `• Цена: ${order.price.toLocaleString()} ₽`,
                ``,
                `<b>💰 Итого: ${order.price.toLocaleString()} ₽</b>`
            ].join('\n');
        } else {
            const deliveryText = order.deliveryType === "pickup"
                ? "🏪 Самовывоз"
                : order.deliveryType === "delivery"
                    ? "🚚 Доставка"
                    : "Не указан";

            const itemsList = order.items
                .map((item: { name: string; volume: string; quantity: number; price: number }, index: number) =>
                    `   ${index + 1}. ${item.name} (${item.volume}) × ${item.quantity} шт. = ${(item.price * item.quantity).toLocaleString()} ₽`
                )
                .join("\n");

            message = [
                `<b>🛒 НОВЫЙ ЗАКАЗ ИЗ КОРЗИНЫ</b>`,
                ``,
                `<b>👤 Контактные данные:</b>`,
                `• Имя: ${order.name}`,
                `• Телефон: ${order.phone}`,
                `• Email: ${order.email || 'Не указан'}`,
                order.inn ? `• ИНН: ${order.inn}` : "",
                ``,
                `<b>📍 Доставка:</b>`,
                `• Способ: ${deliveryText}`,
                order.city ? `• Город: ${order.city}` : "",
                order.address ? `• Адрес: ${order.address}` : "",
                ``,
                `<b>📦 Товары:</b>`,
                itemsList,
                ``,
                `<b>💰 Итого: ${order.totalPrice.toLocaleString()} ₽</b>`,
                ``,
                order.comment ? `<b>💬 Комментарий:</b>\n${order.comment}` : ""
            ].filter(Boolean).join('\n');
        }

        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: "HTML",
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Telegram API error:", errorText);
            return NextResponse.json({ error: 'Failed to send to Telegram', details: errorText }, { status: 502 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
