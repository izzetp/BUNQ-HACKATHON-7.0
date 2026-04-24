import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json({ error: "Unsupported image format. Use JPEG, PNG, GIF, or WebP." }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    // Normalize image/jpg → image/jpeg (image/jpg is non-standard and rejected by Anthropic)
    const mediaType = (imageFile.type === "image/jpg" ? "image/jpeg" : imageFile.type) as
      "image/jpeg" | "image/png" | "image/gif" | "image/webp";

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: `You are an AI that analyzes images for a financial assistant app.

Determine if the image contains a purchasable product. If yes, extract the product name and price.

Return ONLY valid JSON. No text before or after.

Rules:
* Only return isProduct: true if this is clearly a purchasable product (electronics, clothing, shoes, etc.)
* Do not guess or hallucinate
* If unsure, return isProduct: false
* If price is not visible, return price: null
* Product name must be specific (brand + model if possible)
* If price is in a currency other than euros, convert it approximately
* price must be a number (e.g. 9.99), never a string

If product: {"isProduct": true, "name": "product name", "price": 9.99}
If not:     {"isProduct": false}`,
            },
          ],
        },
      ],
    });

    console.log("Vision API raw response:", JSON.stringify(message, null, 2));

    const content = message.content[0];
    if (content.type !== "text") {
      console.warn("Vision API: unexpected non-text content block");
      return NextResponse.json({ name: null, price: null });
    }

    // Strip markdown code fences if present, then extract the JSON object
    const cleaned = content.text.replace(/```(?:json)?/gi, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn("Vision API: no JSON found in response:", content.text);
      return NextResponse.json({ name: null, price: null });
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.warn("Vision API: JSON.parse failed:", jsonMatch[0], parseErr);
      return NextResponse.json({ name: null, price: null });
    }

    // Not a purchasable product
    if (parsed.isProduct === false) {
      return NextResponse.json({ name: null, price: null, isProduct: false });
    }

    const name = typeof parsed.name === "string" && parsed.name.trim() ? parsed.name.trim() : null;
    const price = typeof parsed.price === "number" ? parsed.price : null;

    if (!name && price === null) {
      return NextResponse.json({ name: null, price: null });
    }

    // Name found but no price — let the user fill it in
    if (name && price === null) {
      return NextResponse.json({ name, price: null, needsManualPrice: true });
    }

    return NextResponse.json({ name, price });
  } catch (err) {
    console.error("Scan error:", err);
    return NextResponse.json({ error: "Image scan failed." }, { status: 500 });
  }
}
