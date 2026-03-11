
import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { order } = body;

        if (!order) {
            return NextResponse.json({ error: 'Order data missing' }, { status: 400 });
        }

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('Telegram credentials missing');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

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

        const message = [
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

        // Decrement stock in Strapi for each ordered item
        if (order.items && Array.isArray(order.items)) {
            const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
            const strapiToken = process.env.STRAPI_API_TOKEN;

            for (const item of order.items as { documentId?: string; name: string; quantity: number }[]) {
                if (!item.documentId) continue;
                try {
                    const fetchHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
                    if (strapiToken) fetchHeaders['Authorization'] = `Bearer ${strapiToken}`;

                    // Get current stock
                    const productRes = await fetch(`${strapiUrl}/api/products/${item.documentId}`, { headers: fetchHeaders });
                    if (!productRes.ok) {
                        const err = await productRes.text();
                        console.error(`[Stock Update] Failed to fetch product ${item.documentId}: ${productRes.status} ${err}`);
                        continue;
                    }

                    const productData = await productRes.json();
                    const currentStock: number = productData?.data?.stock ?? 0;
                    const newStock = Math.max(0, currentStock - item.quantity);

                    console.log(`[Stock Update] Updating "${item.name}" (${item.documentId}): ${currentStock} → ${newStock}`);

                    // Update stock in Strapi
                    const updateRes = await fetch(`${strapiUrl}/api/products/${item.documentId}`, {
                        method: 'PUT',
                        headers: fetchHeaders,
                        body: JSON.stringify({ data: { stock: newStock } }),
                    });

                    if (!updateRes.ok) {
                        const err = await updateRes.text();
                        console.error(`[Stock Update] Failed to UPDATE product ${item.documentId}: ${updateRes.status} ${err}`);
                    } else {
                        console.log(`[Stock Update] SUCCESS for "${item.name}"`);
                    }
                } catch (e) {
                    console.error(`Failed to update stock for "${item.name}":`, e);
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
