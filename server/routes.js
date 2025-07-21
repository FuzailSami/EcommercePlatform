import { createServer } from "http";
import { storage } from "./storage.js";
import { setupAuth, isAuthenticated } from "./replitAuth.js";
import { insertCategorySchema, insertProductSchema, insertCartItemSchema } from "../shared/schema.js";

export async function registerRoutes(app) {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Sample data initialization
  app.post('/api/init-data', isAuthenticated, async (req, res) => {
    try {
      // Check if categories already exist
      const existingCategories = await storage.getAllCategories();
      if (existingCategories.length > 0) {
        return res.json({ message: "Sample data already initialized" });
      }

      // Create sample categories
      const electronicsCategory = await storage.createCategory({
        name: "Electronics",
        slug: "electronics"
      });
      
      const clothingCategory = await storage.createCategory({
        name: "Clothing",
        slug: "clothing"
      });
      
      const homeCategory = await storage.createCategory({
        name: "Home & Garden",
        slug: "home-garden"
      });

      // Create sample products
      const products = [
        {
          name: "Premium Wireless Headphones",
          description: "High-quality wireless headphones with noise cancellation",
          price: "199.99",
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
          categoryId: electronicsCategory.id,
          stock: 50
        },
        {
          name: "Smartphone",
          description: "Latest model smartphone with advanced features",
          price: "699.99",
          imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
          categoryId: electronicsCategory.id,
          stock: 30
        },
        {
          name: "Cotton T-Shirt",
          description: "Comfortable 100% cotton t-shirt",
          price: "24.99",
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
          categoryId: clothingCategory.id,
          stock: 100
        },
        {
          name: "Jeans",
          description: "Classic blue jeans, comfortable fit",
          price: "59.99",
          imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
          categoryId: clothingCategory.id,
          stock: 75
        },
        {
          name: "Indoor Plant",
          description: "Beautiful indoor plant perfect for home decoration",
          price: "39.99",
          imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500",
          categoryId: homeCategory.id,
          stock: 25
        },
        {
          name: "Coffee Maker",
          description: "Automatic coffee maker for perfect morning brew",
          price: "129.99",
          imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500",
          categoryId: homeCategory.id,
          stock: 20
        }
      ];

      for (const productData of products) {
        await storage.createProduct(productData);
      }

      res.json({ message: "Sample data initialized successfully" });
    } catch (error) {
      console.error("Error initializing sample data:", error);
      res.status(500).json({ message: "Failed to initialize sample data" });
    }
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Product routes
  app.get('/api/products/', async (req, res) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category) {
        products = await storage.getProductsByCategory(parseInt(category));
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProductById(parseInt(id));
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart routes
  app.get('/api/cart', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post('/api/cart', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItemData = { ...req.body, userId };
      
      // Validate request body
      const validatedData = insertCartItemSchema.parse(cartItemData);
      
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put('/api/cart/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const updatedItem = await storage.updateCartItem(parseInt(id), quantity);
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete('/api/cart/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.removeFromCart(parseInt(id));
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete('/api/cart', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearCart(userId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Order routes
  app.post('/api/orders', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { shippingAddress, paymentInfo } = req.body;
      
      // Get cart items
      const cartItems = await storage.getCartItems(userId);
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Calculate total
      const total = cartItems.reduce((sum, item) => 
        sum + parseFloat(item.product.price) * item.quantity, 0
      ).toFixed(2);
      
      // Create order
      const order = await storage.createOrder({
        userId,
        total,
        shippingAddress,
        paymentInfo,
        status: 'pending'
      });
      
      // Create order items
      for (const cartItem of cartItems) {
        await storage.addOrderItem({
          orderId: order.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          price: cartItem.product.price
        });
      }
      
      // Clear cart
      await storage.clearCart(userId);
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/orders', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}