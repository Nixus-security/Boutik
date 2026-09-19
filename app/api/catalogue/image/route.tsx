import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { catalogueRequestSchema } from "@/lib/schemas";
import { BORDERS, CATALOGUE_THEMES, SHAPES } from "@/lib/catalogue-themes";

export const runtime = "edge";

function formatPrice(value: number, currency: string) {
  return `${Math.round(value).toLocaleString("fr-FR")} ${currency}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = catalogueRequestSchema.safeParse(body);

  if (!parsed.success) {
    return new Response("Requête invalide", { status: 400 });
  }

  const { format, business, currency, items, logo } = parsed.data;
  const theme = CATALOGUE_THEMES[parsed.data.theme];
  const shape = SHAPES[parsed.data.shape];
  const border = BORDERS[parsed.data.border];

  const width = format === "story" ? 1080 : 1200;
  const height = format === "story" ? 1920 : 1500;
  const columns = 3;

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          flexDirection: "column",
          background: theme.bgGradient,
          padding: format === "story" ? 56 : 48,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32, gap: 20 }}>
          {logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              width={72}
              height={72}
              style={{ borderRadius: shape.chipRadius, objectFit: "cover", background: "#ffffff" }}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 30, color: theme.subheaderColor, fontWeight: 700 }}>
              {business}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: format === "story" ? 56 : 48,
                color: theme.headerColor,
                fontWeight: 800,
              }}
            >
              Notre catalogue
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            flex: 1,
            alignContent: "flex-start",
            gap: 16,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                width: (width - 48 * 2 - 16 * (columns - 1)) / columns,
                background: theme.cardBg,
                borderRadius: shape.cardRadius,
                border: border.width > 0 ? `${border.width}px solid ${theme.borderColor}` : "none",
                padding: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: format === "story" ? 90 : 110,
                  borderRadius: shape.chipRadius,
                  background: theme.chipBg,
                  marginBottom: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {item.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.photo}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <svg
                    width={40}
                    height={40}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={theme.priceColor}
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8h12l1 12.5H5L6 8Z" />
                    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                  </svg>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 20,
                  fontWeight: 700,
                  color: theme.nameColor,
                  lineHeight: 1.2,
                }}
              >
                {item.name.length > 26 ? item.name.slice(0, 24) + "…" : item.name}
              </div>
              <div style={{ display: "flex", fontSize: 20, fontWeight: 800, color: theme.priceColor, marginTop: 8 }}>
                {formatPrice(item.price, currency)}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginTop: 32,
            background: theme.footerBg,
            borderRadius: 999,
            padding: "16px 24px",
            alignSelf: "center",
          }}
        >
          <svg
            width={26}
            height={26}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.footerColor}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12a8 8 0 1 1 3.3 6.5L4 20l1.3-3.6A7.96 7.96 0 0 1 4 12Z" />
          </svg>
          <div style={{ display: "flex", fontSize: 24, color: theme.footerColor, fontWeight: 700 }}>
            Commande directement sur WhatsApp
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <div style={{ display: "flex", fontSize: 18, color: theme.subheaderColor, fontWeight: 600, opacity: 0.85 }}>
            Fait avec Boutik
          </div>
        </div>
      </div>
    ),
    { width, height }
  );
}
