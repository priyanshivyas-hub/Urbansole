const express = require("express");
const morgan = require("morgan");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Product = require("./models/productModel");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Update with your frontend URL
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "20kb" }));

app.use("/products", productRoutes);
app.use("/users", userRoutes);

// Create Stripe Checkout Session (Indian Rupees)
app.post("/create-checkout-session", async (req, res, next) => {
  try {
    const { items, user } = req.body;

    // Fetch product prices from database (assumed to be in INR)
    const productIds = items.map((item) => item.product_id);
    const products = await Product.find({ _id: { $in: productIds } }).select("price");

    // Build line items with tax included
    const line_items = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.product_id);
      if (!product) throw new Error(`Product ${item.product_id} not found`);

      const basePriceINR = product.price;        // Price in INR from DB
      const taxRate = item.tax || 0.05;          // 5% tax from frontend
      const priceWithTax = basePriceINR * (1 + taxRate);
      const unitAmountPaise = Math.round(priceWithTax * 100); // Convert to paise

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: unitAmountPaise,
        },
        quantity: parseInt(item.quantity, 10),
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["IN"], // Only India
      },
      success_url: `${req.headers.origin}/checkout/success`, // Fixed from :success
      cancel_url: `${req.headers.origin}/cart/cancel`,       // Fixed from :cancel
    });

    res.status(200).json({
      link: session.url,
      items,
      status: session.payment_status === "paid" ? "paid" : "pending",
      total_amount: session.amount_total / 100, // Now correctly returns INR rupees
      user: user,
      session,
    });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.get("/logout", (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({
    status: "success",
    message: "User logged out",
  });
});
// TEMPORARY SEED ROUTE - Remove after use
const fs = require("fs");
const path = require("path");

app.get("/seed", async (req, res) => {
  try {
    const productsPath = path.join(__dirname, "data", "products.json");
    const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
    await Product.deleteMany();
    await Product.insertMany(products);
    res.status(200).json({ message: `Seeded ${products.length} products!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle non-existing routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;