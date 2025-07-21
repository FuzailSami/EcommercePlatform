import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const addToCartMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest("POST", "/api/cart", {
        productId,
        quantity: 1,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate(product.id);
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition duration-200">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          <Button 
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending || product.stock === 0}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {addToCartMutation.isPending ? (
              "Adding..."
            ) : product.stock === 0 ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
        {product.stock && product.stock < 10 && product.stock > 0 && (
          <p className="text-sm text-orange-600 mt-2">Only {product.stock} left in stock!</p>
        )}
      </CardContent>
    </Card>
  );
}
