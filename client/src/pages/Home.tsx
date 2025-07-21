import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ShoppingCart from "@/components/ShoppingCart";
import CheckoutModal from "@/components/CheckoutModal";
import { Button } from "@/components/ui/button";
import type { Product, Category } from "@shared/schema";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Initialize sample data
  const initDataMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/init-data", { method: "POST" });
      if (!response.ok) throw new Error("Failed to initialize data");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      initDataMutation.mutate();
    }
  }, [isAuthenticated]);

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", selectedCategory !== "all" ? `?category=${selectedCategory}` : ""],
    enabled: isAuthenticated,
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated,
  });

  // Fetch cart items
  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartItemCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleCheckoutOpen = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        cartItemCount={cartItemCount}
        onCartOpen={handleCartOpen}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Summer Sale</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">Up to 50% off on selected items</p>
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant={selectedCategory === "all" ? "default" : "secondary"}
              onClick={() => handleCategoryChange("all")}
            >
              All Products
            </Button>
            {categories.map((category: Category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id.toString() ? "default" : "secondary"}
                onClick={() => handleCategoryChange(category.id.toString())}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-600">Discover our most popular items</p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shopping Cart Sidebar */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={handleCartClose}
        onCheckout={handleCheckoutOpen}
        cartItems={cartItems}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCheckoutClose}
        cartItems={cartItems}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ShopHub</h3>
              <p className="text-gray-300 mb-4">Your trusted online shopping destination with quality products and excellent service.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition duration-200">Home</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Categories</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Deals</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition duration-200">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Returns</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="text-gray-300 space-y-2">
                <p>Email: support@shophub.com</p>
                <p>Phone: 1-800-SHOPHUB</p>
                <p>Hours: Mon-Fri 9AM-6PM</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
