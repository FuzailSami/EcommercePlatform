import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Star, Shield, Truck, HeartHandshake } from "lucide-react";

export default function Landing() {
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">ShopHub</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-900 hover:text-primary font-medium">Home</a>
              <a href="#" className="text-gray-700 hover:text-primary">Categories</a>
              <a href="#" className="text-gray-700 hover:text-primary">Deals</a>
              <a href="#" className="text-gray-700 hover:text-primary">About</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button onClick={handleLogin} className="bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to ShopHub</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Your trusted online shopping destination with quality products and excellent service
            </p>
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
            >
              Start Shopping
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ShopHub?</h2>
            <p className="text-gray-600 text-lg">We provide the best shopping experience with these amazing features</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                <p className="text-gray-600">Thousands of products across multiple categories</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
                <p className="text-gray-600">Only the best quality items from trusted brands</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
                <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
                <p className="text-gray-600">Safe and secure payment processing</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <HeartHandshake className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Shopping?</h2>
          <p className="text-gray-600 text-lg mb-8">
            Join thousands of satisfied customers and discover amazing products at great prices
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
          >
            Sign In to Continue
          </Button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 text-lg mb-8">
            Subscribe to our newsletter for the latest deals and product updates
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-r-none"
              required
            />
            <Button 
              type="submit"
              className="bg-primary hover:bg-primary/90 rounded-l-none"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
