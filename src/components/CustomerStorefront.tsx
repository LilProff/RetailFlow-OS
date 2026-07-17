import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  X, 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Search, 
  MessageSquare, 
  Send,
  User,
  Heart,
  Tag,
  ThumbsUp,
  RotateCcw,
  ArrowLeft,
  Star
} from 'lucide-react';
import { Product, CartItem, Order } from '../types';
import { PRODUCTS } from '../data';

interface CustomerStorefrontProps {
  onBackToLanding: () => void;
  onAddOrder: (newOrder: Order) => void;
  onSelectOrder: (order: Order) => void;
  existingOrders: Order[];
}

export default function CustomerStorefront({ 
  onBackToLanding, 
  onAddOrder, 
  onSelectOrder,
  existingOrders 
}: CustomerStorefrontProps) {
  
  // Shopping views
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'SMARTPHONES' | 'LAPTOPS' | 'AUDIO'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Specifications selectors for the individual product details page
  const [selectedStorage, setSelectedStorage] = useState<'128GB' | '256GB' | '512GB'>('256GB');
  const [selectedColor, setSelectedColor] = useState<string>('');

  // Track user-placed orders during this session to restrict tracking
  const [placedOrderIds, setPlacedOrderIds] = useState<string[]>([]);

  // Seeded reviews for products
  const [productReviews, setProductReviews] = useState<Record<string, Array<{ author: string; rating: number; text: string; date: string }>>>({
    'prod-1': [
      { author: 'Tunde Adeyemi', rating: 5, text: 'Awesome A17 Pro performance. The build quality in titanium is incredible! Shipping to Lekki was super fast.', date: 'Today' },
      { author: 'Chinedu Eze', rating: 4, text: 'Excellent display, but gets a bit warm during heavy gaming. Camera is top notch.', date: '3 days ago' }
    ],
    'prod-2': [
      { author: 'Folake Balogun', rating: 5, text: 'The M3 chip handles all my spreadsheet and coding work with ease. Absolutely silent and battery lasts forever!', date: 'Yesterday' },
      { author: 'Yemi A.', rating: 5, text: 'Lightweight, beautiful Liquid Retina screen. Highly recommend TechHub GRA for authentic items.', date: '1 week ago' }
    ],
    'prod-3': [
      { author: 'Amaka Okafor', rating: 5, text: 'The Galaxy AI features are very helpful, especially live translation. Cameras are beastly! Excellent service from RetailFlow.', date: '2 days ago' },
      { author: 'Kola O.', rating: 4, text: 'S-Pen makes note taking so easy in meetings. Display brightness is unbelievable under the sun.', date: '5 days ago' }
    ],
    'prod-4': [
      { author: 'Oluwaseun S.', rating: 5, text: 'Best active noise cancellation on the market. Used it on my flight from Lagos to London, didn’t hear a thing!', date: 'Today' },
      { author: 'Ifeanyi N.', rating: 5, text: 'Extremely comfortable earcups, clear sound signature with deep bass. Connection is rock solid.', date: '4 days ago' }
    ],
    'prod-5': [
      { author: 'Temi L.', rating: 5, text: 'Stunning Liquid Retina XDR screen. Paired with Magic Keyboard, it completely replaces my laptop.', date: 'Yesterday' }
    ],
    'prod-6': [
      { author: 'Chioma Obi', rating: 5, text: 'Outstanding battery life and 5x optical zoom is mindblowing! Same day delivery to Lekki was verified.', date: 'Today' }
    ]
  });

  const handleAddReview = (productId: string, author: string, rating: number, text: string) => {
    if (!author.trim() || !text.trim()) return;
    setProductReviews(prev => ({
      ...prev,
      [productId]: [
        ...(prev[productId] || []),
        { author, rating, text, date: 'Just now' }
      ]
    }));
  };

  const colorsForCategory = (cat: string) => {
    if (cat === 'SMARTPHONES') {
      return [
        { name: 'Natural Titanium', hex: '#A8A9AD' },
        { name: 'Titanium Black', hex: '#1E1E1E' },
        { name: 'Titanium Blue', hex: '#232E3C' }
      ];
    }
    if (cat === 'LAPTOPS') {
      return [
        { name: 'Space Gray', hex: '#5E6064' },
        { name: 'Midnight', hex: '#1A2332' },
        { name: 'Silver', hex: '#DDDFE1' }
      ];
    }
    return [
      { name: 'Charcoal Black', hex: '#202020' },
      { name: 'Platinum Silver', hex: '#DCDCDC' }
    ];
  };

  const getDynamicPrice = (product: Product, storage: '128GB' | '256GB' | '512GB') => {
    if (product.category !== 'SMARTPHONES' && product.category !== 'LAPTOPS') {
      return product.price;
    }
    if (storage === '128GB') return product.price - 80000;
    if (storage === '512GB') return product.price + 120000;
    return product.price;
  };
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [discountError, setDiscountError] = useState('');

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('Lekki Phase 1');
  const [customLocation, setCustomLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'TRANSFER' | 'POS_DELIVERY'>('TRANSFER');
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);

  // AI assistant state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiThread, setAiThread] = useState<Array<{ sender: 'user' | 'ai'; text: string; actionProduct?: Product; timestamp: string }>>([
    {
      sender: 'ai',
      text: "Hi there! I'm Aisha, your RetailFlow dynamic shopping assistant. 🇳🇬 How can I help you find the best tech deals in Lagos today? Ask me about spec comparisons, bulk discounts, or what is currently in stock at our Ikeja warehouse!",
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Filter products
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.specs.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiThread, isAiTyping]);

  // Cart operations
  const addToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        // cap at stock
        const newQty = Math.min(existing.quantity + qty, product.stock);
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: newQty } : item);
      }
      return [...prev, { product, quantity: Math.min(qty, product.stock) }];
    });
  };

  const handleAddCustomProductToCart = () => {
    if (!selectedProduct) return;
    const finalPrice = getDynamicPrice(selectedProduct, selectedStorage);
    const specDetails = [];
    if (selectedProduct.category === 'SMARTPHONES' || selectedProduct.category === 'LAPTOPS') {
      specDetails.push(selectedStorage);
    }
    if (selectedColor) {
      specDetails.push(selectedColor);
    }
    
    const configString = specDetails.length > 0 ? ` (${specDetails.join(', ')})` : '';
    
    // Create custom product variant
    const customizedProduct: Product = {
      ...selectedProduct,
      id: `${selectedProduct.id}-${selectedStorage}-${selectedColor.replace(/\s+/g, '')}`,
      name: `${selectedProduct.name}${configString}`,
      price: finalPrice
    };
    
    addToCart(customizedProduct, 1);
    setIsCartOpen(true);
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.stock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Financial calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Dynamic Lagos volume bulk discount: 5% off if 2 or more laptops/smartphones or cart totals above ₦2,000,000
  const isBulkEligible = cart.some(item => item.quantity >= 2) || subtotal >= 2000000;
  const bulkDiscountAmount = isBulkEligible ? subtotal * 0.05 : 0;
  
  // Promo code discount
  const promoDiscountAmount = appliedDiscount ? (subtotal - bulkDiscountAmount) * (appliedDiscount.percent / 100) : 0;
  
  const deliveryFee = subtotal > 0 ? 5000 : 0; // Standard Naira delivery
  const total = subtotal - bulkDiscountAmount - promoDiscountAmount + deliveryFee;

  // Apply promo codes
  const handleApplyPromo = () => {
    setDiscountError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'LAGOSDEV5' || code === 'WELCOME5') {
      setAppliedDiscount({ code, percent: 5 });
    } else if (code === 'RETAILFLOW10') {
      setAppliedDiscount({ code, percent: 10 });
    } else {
      setDiscountError('Invalid code. Try "LAGOSDEV5" (5% off) or ask AI Aisha!');
    }
  };

  // Check out order completion
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const locationStr = deliveryLocation === 'Other' ? customLocation : deliveryLocation;
    const orderId = `RF-${Math.floor(1000 + Math.random() * 9000)}-LX`;

    const productNames = cart.map(item => `${item.quantity}x ${item.product.name}`).join(', ');

    const newOrder: Order = {
      id: orderId,
      customerName,
      location: locationStr,
      product: productNames,
      value: total,
      channel: 'Web',
      status: 'NEW',
      time: 'Just now'
    };

    onAddOrder(newOrder);
    setPlacedOrderIds(prev => [...prev, newOrder.id]);
    setOrderComplete(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  // Aisha AI reply handler
  const handleSendAiMessage = (e?: React.FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const textToSend = directText || aiMessage;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setAiThread(prev => [...prev, userMsg]);
    if (!directText) setAiMessage('');
    setIsAiTyping(true);

    // Simulate smart shopping agent
    setTimeout(() => {
      const normalized = textToSend.toLowerCase();
      let aiText = '';
      let actionProduct: Product | undefined;

      // 1. Identify product request
      const matchedProd = PRODUCTS.find(p => normalized.includes(p.name.toLowerCase()) || normalized.includes(p.id));

      if (normalized.includes('discount') || normalized.includes('promo') || normalized.includes('coupon') || normalized.includes('cheap')) {
        aiText = "Oh! You want some discounts? I got you! Use the promo code **RETAILFLOW10** during checkout for an extra 10% off your entire cart. Also, remember if you buy 2 or more of any item, our Lagos OS automatically applies a 5% bulk discount!";
      } else if (normalized.includes('delivery') || normalized.includes('shipping') || normalized.includes('lagos') || normalized.includes('dispatch')) {
        aiText = "We offer lightning-fast dispatch from our main hub in Ikeja GRA. Standard delivery to Lekki Phase 1, Victoria Island, and Ikoyi is just ₦5,000, and we deliver same-day for orders confirmed before 2:00 PM.";
      } else if (normalized.includes('iphone') || normalized.includes('phone') || normalized.includes('s24')) {
        const iphone = PRODUCTS.find(p => p.id === 'prod-1')!;
        const ultra = PRODUCTS.find(p => p.id === 'prod-3')!;
        aiText = `We have the latest smartphones in stock! \n\n* **${iphone.name}**: ₦${iphone.price.toLocaleString()} (Stock: ${iphone.stock} left in Lagos). \n* **${ultra.name}**: ₦${ultra.price.toLocaleString()} (Stock: ${ultra.stock} left in Lagos). \n\nBoth are eligible for same-day delivery. Would you like me to add one of these to your shopping cart?`;
        actionProduct = iphone;
      } else if (normalized.includes('macbook') || normalized.includes('laptop') || normalized.includes('computer')) {
        const mac = PRODUCTS.find(p => p.id === 'prod-2')!;
        aiText = `The **MacBook Air M3** is a beast! It retails for ₦${mac.price.toLocaleString()} and we currently have ${mac.stock} units left at our physical storefront. It features the Apple M3 chip and gorgeous space gray finish. I can add it directly to your cart right now.`;
        actionProduct = mac;
      } else if (normalized.includes('sony') || normalized.includes('audio') || normalized.includes('headphone') || normalized.includes('music')) {
        const sony = PRODUCTS.find(p => p.id === 'prod-4')!;
        aiText = `Ah, excellent taste! The **Sony WH-1000XM5** headphones deliver industry-leading ANC. They are retailing for ₦${sony.price.toLocaleString()} with ${sony.stock} units available. Would you like me to add them to your cart?`;
        actionProduct = sony;
      } else if (matchedProd) {
        aiText = `Great inquiry! The **${matchedProd.name}** goes for ₦${matchedProd.price.toLocaleString()}. Specs: ${matchedProd.specs.join(', ')}. Stock level: ${matchedProd.stock} units. Let me know if you would like me to add this to your cart!`;
        actionProduct = matchedProd;
      } else if (normalized.includes('cart') || normalized.includes('buy') || normalized.includes('order')) {
        aiText = "You can add any product to your cart by clicking the blue 'Add to Cart' buttons or telling me 'Add [product name] to cart'. Once ready, click the Cart icon at the top right to complete your order!";
      } else {
        aiText = "I can definitely help with that! At RetailFlow, we offer premium electronics with fully trackable same-day dispatch. Ask me about our iPhones, MacBook Air M3s, or Sony WH-1000XM5. I can also generate a discount code for you!";
      }

      setAiThread(prev => [...prev, {
        sender: 'ai',
        text: aiText,
        actionProduct,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsAiTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0F0F11] text-[#E4E4E7] font-sans selection:bg-[#3B82F6]/30 relative pb-20">
      
      {/* Background Decor */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[5%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation Store Header */}
      <header className="sticky top-0 z-40 bg-[#161619]/90 border-b border-[#27272A] backdrop-blur-md px-4 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight">RetailFlow Store</span>
            <span className="text-[9px] font-mono text-blue-400 block tracking-widest uppercase">Lagos Retail Client Node</span>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center gap-2 bg-[#1B1B1F] border border-[#27272A] rounded-xl px-3 py-1.5 w-96">
          <Search className="w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search phones, laptops, audio specs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-white focus:outline-none w-full placeholder-zinc-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-zinc-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Shopping CTAs */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAiOpen(true)}
            className="relative px-3.5 py-1.5 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 border border-blue-500/30 text-blue-400 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>Ask Aisha AI</span>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-[#1B1B1F] hover:bg-[#27272A] border border-[#27272A] rounded-xl text-white transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4.5 h-4.5" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          <button 
            onClick={onBackToLanding}
            className="text-xs font-mono font-semibold text-zinc-400 hover:text-white px-3 py-1.5 bg-[#1C1C1E] border border-transparent hover:border-[#27272A] rounded-xl transition-all cursor-pointer"
          >
            Exit Shop
          </button>
        </div>
      </header>

      {/* Category Tabs & Welcome Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        
        {/* Mobile Search bar */}
        <div className="flex md:hidden items-center gap-2 bg-[#1B1B1F] border border-[#27272A] rounded-xl px-3 py-2 w-full">
          <Search className="w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
          />
        </div>

        {!selectedProduct ? (
          <>
            {/* Promo Code Flash Tip */}
            <div className="bg-gradient-to-r from-blue-950/40 via-[#161619] to-[#161619] border border-blue-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Lagos Dynamic Tech Sales Active!</h4>
                  <p className="text-xs text-zinc-400">Apply code <span className="font-mono text-cyan-400 font-bold bg-[#1C1C1E] px-1.5 py-0.5 rounded">RETAILFLOW10</span> at checkout for 10% off. Automatic 5% bulk discount on 2+ units.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setPromoCode('RETAILFLOW10');
                  setIsCartOpen(true);
                }} 
                className="text-xs font-semibold text-[#3B82F6] hover:underline self-start sm:self-center cursor-pointer"
              >
                Apply Code Now →
              </button>
            </div>

            {/* Categories Bar */}
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {(['ALL', 'SMARTPHONES', 'LAPTOPS', 'AUDIO'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all cursor-pointer border ${
                      selectedCategory === cat 
                        ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-blue-500/30' 
                        : 'bg-transparent text-zinc-400 border-transparent hover:text-white hover:bg-[#1B1B1F]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                Showing {filteredProducts.length} of {PRODUCTS.length} premium models
              </span>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const inCartQty = cart.find(item => item.product.id === product.id)?.quantity || 0;
                  const isOutOfStock = product.stock === 0;
                  const isLowStock = product.stock > 0 && product.stock <= 4;

                  return (
                    <div 
                      key={product.id} 
                      className="bg-[#161619] border border-[#27272A] rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-zinc-700 hover:shadow-lg relative"
                    >
                      {/* Stock Alerts */}
                      {isOutOfStock ? (
                        <span className="absolute top-3 left-3 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full z-10">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="absolute top-3 left-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full z-10 animate-pulse">
                          Low Stock: Only {product.stock} left
                        </span>
                      ) : (
                        <span className="absolute top-3 left-3 bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full z-10">
                          Instock
                        </span>
                      )}

                      {/* Product Image Area */}
                      <div 
                        onClick={() => {
                          setSelectedProduct(product);
                          setSelectedStorage('256GB');
                          setSelectedColor(colorsForCategory(product.category)[0]?.name || '');
                        }}
                        className="relative bg-[#111] h-52 w-full flex items-center justify-center p-4 overflow-hidden border-b border-[#27272A]/40 cursor-pointer"
                      >
                        <img 
                          src={product.imageSrc} 
                          alt={product.imageAlt}
                          className="h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161619]/40 to-transparent pointer-events-none" />
                        
                        {/* View Specs & Details Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                          <span className="bg-[#1C1C1E]/90 border border-[#27272A] px-3.5 py-1.5 rounded-xl text-xs font-bold text-white tracking-wide shadow flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            View Specs & Reviews →
                          </span>
                        </div>
                      </div>

                      {/* Details Area */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{product.category}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-amber-400 text-xs font-semibold">★</span>
                              <span className="text-[11px] font-mono text-zinc-300">{product.rating}</span>
                            </div>
                          </div>
                          <h3 
                            onClick={() => {
                              setSelectedProduct(product);
                              setSelectedStorage('256GB');
                              setSelectedColor(colorsForCategory(product.category)[0]?.name || '');
                            }}
                            className="font-bold text-base text-white group-hover:text-blue-400 transition-colors cursor-pointer"
                          >
                            {product.name}
                          </h3>
                          <p className="text-xs text-zinc-400 leading-relaxed font-light line-clamp-2">{product.description}</p>
                        </div>

                        {/* Specs badges */}
                        <div className="flex flex-wrap gap-1.5 py-1">
                          {product.specs.slice(0, 3).map((spec, i) => (
                            <span key={i} className="text-[10px] font-mono text-zinc-400 bg-[#1D1D22] border border-[#27272A]/30 px-2 py-0.5 rounded">
                              {spec}
                            </span>
                          ))}
                        </div>

                        <div className="border-t border-[#27272A]/40 pt-4 flex items-center justify-between">
                          <div>
                            <span className="text-zinc-500 text-[10px] block uppercase font-mono tracking-wider">Lekki/Ikeja Hub</span>
                            <span className="text-lg font-bold text-white">₦{product.price.toLocaleString()}</span>
                          </div>

                          {inCartQty > 0 ? (
                            <div className="flex items-center gap-2 bg-[#212124] border border-[#27272A] rounded-xl p-1">
                              <button 
                                onClick={() => updateQty(product.id, -1)}
                                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-mono font-bold px-1">{inCartQty}</span>
                              <button 
                                onClick={() => updateQty(product.id, 1)}
                                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              disabled={isOutOfStock}
                              onClick={() => addToCart(product)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isOutOfStock 
                                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-transparent' 
                                  : 'bg-[#3B82F6] text-white hover:bg-blue-600 border border-transparent'
                              }`}
                            >
                              <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#161619] border border-[#27272A] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-500">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white">No products match your search</h3>
                <p className="text-xs text-zinc-400">Try checking your spelling, choosing another category, or ask Aisha our AI Assistant to check stock details for you!</p>
                <button 
                  onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-4 py-2 rounded-xl border border-[#27272A] transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        ) : (
          /* Detailed Individual Product Page View */
          <div className="space-y-8 animate-scale-up">
            
            {/* Back Button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 hover:text-white group transition-all cursor-pointer bg-[#1C1C1F] border border-[#27272A] px-4 py-2 rounded-xl w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Catalog</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Image & Reviews */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Big Image Card */}
                <div className="bg-[#161619] border border-[#27272A] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden h-96 group">
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <span className="bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full">
                      {selectedProduct.category}
                    </span>
                    {selectedProduct.stock > 0 && selectedProduct.stock <= 4 ? (
                      <span className="bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                        Low Stock: {selectedProduct.stock} left
                      </span>
                    ) : selectedProduct.stock === 0 ? (
                      <span className="bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full">
                        Sold Out
                      </span>
                    ) : (
                      <span className="bg-green-500/10 border border-green-500/25 text-green-400 text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full">
                        In Stock (Hub GRA)
                      </span>
                    )}
                  </div>

                  <img 
                    src={selectedProduct.imageSrc} 
                    alt={selectedProduct.imageAlt}
                    className="h-64 object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-4 text-center">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Premium Tech Hub Spec</p>
                  </div>
                </div>

                {/* Reviews Block */}
                <div className="bg-[#161619] border border-[#27272A] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#27272A] pb-2">
                    <h4 className="text-xs font-mono uppercase font-bold text-zinc-400 tracking-wider">Customer Reviews</h4>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-amber-400">★</span>
                      <span className="text-white font-bold font-mono">{selectedProduct.rating}</span>
                      <span className="text-zinc-500">/ 5.0</span>
                    </div>
                  </div>

                  {/* Review list */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                    {((productReviews[selectedProduct.id] || []).length > 0) ? (
                      (productReviews[selectedProduct.id] || []).map((rev, idx) => (
                        <div key={idx} className="p-3.5 bg-[#1C1C1F]/60 border border-[#27272A]/40 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-200">{rev.author}</span>
                            <span className="text-[10px] font-mono text-zinc-500">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, rIdx) => (
                              <span key={rIdx} className={rIdx < rev.rating ? 'text-amber-400' : 'text-zinc-700'}>★</span>
                            ))}
                          </div>
                          <p className="text-zinc-400 font-light leading-relaxed">{rev.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-500 text-xs italic py-2 pl-1">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>

                  {/* Submit Review Form */}
                  <div className="bg-[#1C1C1F]/30 border border-[#27272A]/40 rounded-xl p-4 space-y-3">
                    <h5 className="font-semibold text-xs text-white">Write a customer review</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        id="review-author"
                        className="bg-[#161619] border border-[#27272A] focus:outline-none rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500"
                      />
                      <select 
                        id="review-rating"
                        className="bg-[#161619] border border-[#27272A] focus:outline-none rounded-xl px-2 py-1.5 text-xs text-white"
                        defaultValue="5"
                      >
                        <option value="5">5 Stars ★★★★★</option>
                        <option value="4">4 Stars ★★★★</option>
                        <option value="3">3 Stars ★★★</option>
                        <option value="2">2 Stars ★★</option>
                        <option value="1">1 Star ★</option>
                      </select>
                    </div>
                    <textarea 
                      placeholder="Write your review comments here..." 
                      id="review-text"
                      rows={2}
                      className="w-full bg-[#161619] border border-[#27272A] focus:outline-none rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 resize-none"
                    />
                    <button
                      onClick={() => {
                        const authorEl = document.getElementById('review-author') as HTMLInputElement;
                        const ratingEl = document.getElementById('review-rating') as HTMLSelectElement;
                        const textEl = document.getElementById('review-text') as HTMLTextAreaElement;
                        
                        const author = authorEl?.value || '';
                        const rating = parseInt(ratingEl?.value || '5', 10);
                        const text = textEl?.value || '';
                        
                        if (author.trim() && text.trim()) {
                          handleAddReview(selectedProduct.id, author, rating, text);
                          if (authorEl) authorEl.value = '';
                          if (textEl) textEl.value = '';
                        }
                      }}
                      className="px-3.5 py-1.5 bg-[#1C1C1E] hover:bg-zinc-800 border border-[#27272A] text-zinc-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Configurations */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Title & Price Box */}
                <div className="bg-[#161619] border border-[#27272A] rounded-2xl p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">TechHub Original Model</span>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400">★</span>
                        <span className="text-xs font-mono font-bold text-white">{selectedProduct.rating} Rating</span>
                      </div>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white leading-tight">{selectedProduct.name}</h2>
                    <p className="text-sm text-zinc-300 font-light leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  <div className="border-t border-[#27272A]/40 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase font-mono tracking-wider block">Configured Price</span>
                      <span className="text-2xl font-extrabold text-white">
                        ₦{getDynamicPrice(selectedProduct, selectedStorage).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        disabled={selectedProduct.stock === 0}
                        onClick={handleAddCustomProductToCart}
                        className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_4px_12px_rgba(59,130,246,0.15)] ${
                          selectedProduct.stock === 0
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : 'bg-[#3B82F6] text-white hover:bg-blue-600'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add Configuration to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Specs Interactive Customizer */}
                <div className="bg-[#161619] border border-[#27272A] rounded-2xl p-6 space-y-5">
                  <h4 className="text-xs font-mono uppercase font-bold text-zinc-400 tracking-wider border-b border-[#27272A] pb-2">
                    1. Choose Custom Specifications
                  </h4>
                  
                  {/* Storage Selector */}
                  {(selectedProduct.category === 'SMARTPHONES' || selectedProduct.category === 'LAPTOPS') && (
                    <div className="space-y-2">
                      <span className="text-[11px] text-zinc-400 font-medium block">Storage Capacity:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {(['128GB', '256GB', '512GB'] as const).map(storage => {
                          let offsetLabel = '';
                          if (storage === '128GB') offsetLabel = '-₦80,000';
                          if (storage === '512GB') offsetLabel = '+₦120,000';
                          if (storage === '256GB') offsetLabel = 'Base Price';

                          return (
                            <button
                              key={storage}
                              onClick={() => setSelectedStorage(storage)}
                              className={`p-3 border rounded-xl text-left flex flex-col justify-between transition-all cursor-pointer ${
                                selectedStorage === storage
                                  ? 'bg-[#3B82F6]/10 text-white border-blue-500/50 shadow-sm'
                                  : 'bg-[#1C1C1F] border-[#27272A] text-zinc-400 hover:text-white hover:border-zinc-700'
                              }`}
                            >
                              <span className="text-xs font-bold block">{storage}</span>
                              <span className="text-[9px] font-mono text-zinc-500 block mt-1">{offsetLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Color Selector */}
                  <div className="space-y-2">
                    <span className="text-[11px] text-zinc-400 font-medium block">Color & Finish:</span>
                    <div className="flex flex-wrap gap-2.5">
                      {colorsForCategory(selectedProduct.category).map(color => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`px-3.5 py-2 border rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                            selectedColor === color.name
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-[#1C1C1F] border-[#27272A] text-zinc-400 hover:text-white hover:border-zinc-700'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: color.hex }} />
                          <span>{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Technical Specs Highlights */}
                <div className="bg-[#161619] border border-[#27272A] rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-mono uppercase font-bold text-zinc-400 tracking-wider border-b border-[#27272A] pb-2">
                    2. Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProduct.specs.map((spec, i) => (
                      <div key={i} className="p-3 bg-[#1C1C1F]/60 border border-[#27272A]/40 rounded-xl flex items-center gap-2.5 text-xs">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
                        <span className="text-zinc-300 font-light">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aisha AI Product Copilot Card */}
                <div className="bg-gradient-to-br from-blue-950/20 to-zinc-900 border border-blue-500/25 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span className="font-bold text-xs text-white">Ask Aisha about the {selectedProduct.name}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Have questions about specific processor details, stock levels at our Ikeja/Victoria Island storefronts, or our same-day Lagos dispatch speed? Write below and get an instant expert consult!
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={`Ask Aisha... (e.g. Is ${selectedProduct.name} good for programming?)`}
                      id="product-question"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value;
                          if (val.trim()) {
                            setIsAiOpen(true);
                            handleSendAiMessage(undefined, `Tell me about the ${selectedProduct.name}: ${val}`);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="flex-1 bg-[#161619] border border-[#27272A] focus:outline-none rounded-xl px-3 py-2 text-[11px] text-white placeholder-zinc-500"
                    />
                    <button 
                      onClick={() => {
                        const inputEl = document.getElementById('product-question') as HTMLInputElement;
                        const val = inputEl?.value || '';
                        if (val.trim()) {
                          setIsAiOpen(true);
                          handleSendAiMessage(undefined, `Tell me about the ${selectedProduct.name}: ${val}`);
                          inputEl.value = '';
                        } else {
                          setIsAiOpen(true);
                          handleSendAiMessage(undefined, `Tell me more about the specifications of ${selectedProduct.name}`);
                        }
                      }}
                      className="px-3.5 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                    >
                      Ask AI
                    </button>
                  </div>
                </div>

                {/* Delivery Policies Box */}
                <div className="p-4 bg-[#1C1C1F]/60 border border-[#27272A]/40 rounded-xl text-xs space-y-1.5 text-zinc-400">
                  <p className="text-zinc-300 font-bold">Lagos Hub Logistics Dispatch Policy:</p>
                  <p className="font-light">🚀 Same-Day dispatch to Lekki Phase 1, Victoria Island, Ikeja GRA, and Ikoyi for orders locked before 2:00 PM.</p>
                  <p className="font-light">🛡️ 1-Year official brand warranty handled by local Ikeja service node.</p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Existing Order History tracker quick-link */}
        {existingOrders.some(o => placedOrderIds.includes(o.id)) && (
          <div className="bg-[#161619] border border-[#27272A] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-green-400" />
                <span>Your Live Store Orders ({existingOrders.filter(o => placedOrderIds.includes(o.id)).length})</span>
              </h3>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Lagos Delivery Fleet Active
              </span>
            </div>

            <div className="divide-y divide-[#27272A]/40">
              {existingOrders.filter(o => placedOrderIds.includes(o.id)).map(o => (
                <div key={o.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-cyan-400 font-bold">{o.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        o.status === 'DELIVERED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        o.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="text-zinc-300 font-medium">{o.product}</p>
                    <p className="text-zinc-500 text-[10px]">Destination: {o.location} • Value: ₦{o.value.toLocaleString()}</p>
                  </div>

                  <button 
                    onClick={() => onSelectOrder(o)}
                    className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-400/40 px-3 py-1.5 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 transition-all cursor-pointer flex items-center gap-1"
                  >
                    Launch Live Delivery Tracker <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />
          
          <div className="relative w-full max-w-md bg-[#161619] h-full shadow-2xl border-l border-[#27272A] flex flex-col justify-between p-6 z-10 animate-slide-left">
            
            <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-6">
              {/* Cart Header */}
              <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  <h3 className="font-bold text-lg text-white">Your Shopping Cart</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-4 p-3 bg-[#1C1C1F] border border-[#27272A]/60 rounded-xl relative">
                      <img 
                        src={item.product.imageSrc} 
                        alt={item.product.imageAlt} 
                        className="w-16 h-16 object-contain bg-[#111] p-1 rounded-lg"
                      />
                      
                      <div className="flex-1 space-y-1 text-xs">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-white text-sm leading-tight pr-4">{item.product.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-zinc-500 hover:text-rose-400 p-1 rounded transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[#3B82F6] font-semibold text-sm">₦{item.product.price.toLocaleString()}</p>
                        
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-zinc-500 font-mono">Stock limit: {item.product.stock}</span>
                          
                          <div className="flex items-center gap-2 bg-[#212124] border border-[#27272A] rounded-lg p-0.5">
                            <button 
                              onClick={() => updateQty(item.product.id, -1)}
                              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-bold px-1.5">{item.quantity}</span>
                            <button 
                              onClick={() => updateQty(item.product.id, 1)}
                              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-500">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Your cart is empty</h4>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">Explore the catalog or chat with Aisha our AI shopping assistant to add premium products directly!</p>
                  </div>
                  <button 
                    onClick={() => { setIsCartOpen(false); setIsAiOpen(true); }}
                    className="text-xs font-semibold text-blue-400 hover:underline cursor-pointer"
                  >
                    Let Aisha assist your shopping →
                  </button>
                </div>
              )}
            </div>

            {/* Financial Overview & Checkout Trigger */}
            {cart.length > 0 && (
              <div className="border-t border-[#27272A] pt-4 space-y-4 text-xs">
                
                {/* Promo Code Input */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="PROMO CODE (e.g. RETAILFLOW10)" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-[#1C1C1F] border border-[#27272A] focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button 
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-[#27272A] font-bold cursor-pointer transition-all"
                  >
                    Apply
                  </button>
                </div>
                {discountError && <p className="text-rose-400 text-[10px] pl-1">{discountError}</p>}
                {appliedDiscount && <p className="text-green-400 text-[10px] pl-1">✓ Promo '{appliedDiscount.code}' Applied successfully! ({appliedDiscount.percent}% off)</p>}

                {/* Money breakdown */}
                <div className="space-y-2 font-mono bg-[#1C1C1F] p-4 rounded-xl border border-[#27272A]/40 text-zinc-400">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-white">₦{subtotal.toLocaleString()}</span>
                  </div>

                  {isBulkEligible && (
                    <div className="flex justify-between text-green-400 text-[11px]">
                      <span>Lagos Bulk Discount (5%):</span>
                      <span>-₦{bulkDiscountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {appliedDiscount && (
                    <div className="flex justify-between text-green-400 text-[11px]">
                      <span>Promo Discount ({appliedDiscount.percent}%):</span>
                      <span>-₦{promoDiscountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Dispatch Logistics Charge:</span>
                    <span className="text-white">₦{deliveryFee.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-[#27272A]/40 my-2 pt-2 flex justify-between text-sm font-bold">
                    <span className="text-white">Estimated Total:</span>
                    <span className="text-[#3B82F6]">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all text-sm cursor-pointer shadow-[0_4px_12px_rgba(59,130,246,0.2)]"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161619] border border-[#27272A] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative animate-scale-up">
            
            <div className="px-6 py-4 bg-[#1C1C1F] border-b border-[#27272A] flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <CreditCard className="w-4.5 h-4.5 text-[#3B82F6]" />
                <span>Secure Checkout • dispatch from Ikeja HUB</span>
              </h3>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 text-zinc-500 hover:text-white rounded transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="space-y-3">
                <h4 className="font-bold text-zinc-300 uppercase tracking-widest text-[10px] border-b border-[#27272A] pb-1.5">1. Delivery Destination (Lagos Fleet)</h4>
                
                <div className="grid grid-cols-2 gap-2">
                  {['Lekki Phase 1', 'Ikeja GRA', 'Victoria Island', 'Other'].map(loc => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setDeliveryLocation(loc);
                        if (loc !== 'Other') setCustomLocation('');
                      }}
                      className={`py-2 px-3 border rounded-xl text-left font-semibold transition-all ${
                        deliveryLocation === loc 
                          ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-blue-500/40' 
                          : 'bg-[#1C1C1F] border-[#27272A] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 inline mr-1.5 opacity-70" />
                      {loc}
                    </button>
                  ))}
                </div>

                {deliveryLocation === 'Other' && (
                  <input 
                    type="text" 
                    placeholder="Enter Custom Lagos Location (e.g. Ikoyi, Gbagada)"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    required
                    className="w-full bg-[#1C1C1F] border border-[#27272A] focus:outline-none rounded-xl px-3 py-2 text-white"
                  />
                )}
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-zinc-300 uppercase tracking-widest text-[10px] border-b border-[#27272A] pb-1.5">2. Customer Details</h4>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Full Name (e.g. Tunde Adeyemi)" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full bg-[#1C1C1F] border border-[#27272A] focus:outline-none rounded-xl px-3 py-2 text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="w-full bg-[#1C1C1F] border border-[#27272A] focus:outline-none rounded-xl px-3 py-2 text-white"
                    />
                    <input 
                      type="tel" 
                      placeholder="Phone Number (e.g. +234...)" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full bg-[#1C1C1F] border border-[#27272A] focus:outline-none rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-zinc-300 uppercase tracking-widest text-[10px] border-b border-[#27272A] pb-1.5">3. Payment Dispatch Preference</h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['TRANSFER', 'CARD', 'POS_DELIVERY'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 border rounded-xl text-center font-bold tracking-wider transition-all uppercase text-[10px] ${
                        paymentMethod === method 
                          ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-blue-500/40' 
                          : 'bg-[#1C1C1F] border-[#27272A] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {method === 'TRANSFER' && 'Bank Transfer'}
                      {method === 'CARD' && 'Secure Pay'}
                      {method === 'POS_DELIVERY' && 'POS Terminal'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#27272A] pt-4 font-mono text-zinc-400 flex items-center justify-between text-xs bg-[#1C1C1F] p-4 rounded-xl border border-[#27272A]/40">
                <div>
                  <p>Order Delivery Cargo Value:</p>
                  <p className="text-xs text-zinc-500">Includes Lagos Express Delivery Logistics Fee</p>
                </div>
                <span className="text-base font-extrabold text-[#3B82F6]">₦{total.toLocaleString()}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all text-sm cursor-pointer shadow-lg"
              >
                Confirm Purchase Manifest
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Success Screen */}
      {orderComplete && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161619] border border-green-500/20 max-w-md w-full rounded-2xl p-6 text-center space-y-6 shadow-2xl relative overflow-hidden animate-scale-up">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-pulse" />
            
            <div className="w-14 h-14 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest font-bold">Purchase Manifest Registered</span>
              <h3 className="font-extrabold text-xl text-white">Order Successfully Dispatched!</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Thank you, <span className="font-semibold text-white">{orderComplete.customerName}</span>. Your shipment <span className="font-mono text-cyan-400 font-bold bg-[#1C1C1F] px-1.5 py-0.5 rounded">{orderComplete.id}</span> is loaded onto our dynamic logistics fleet.
              </p>
            </div>

            <div className="bg-[#1C1C1F] border border-[#27272A] rounded-xl p-4 text-xs font-mono text-zinc-400 text-left space-y-1.5">
              <div className="flex justify-between">
                <span>Value:</span>
                <span className="text-white">₦{orderComplete.value.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-white">{orderComplete.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-400 font-bold">DISPATCHING (IKEJA HUB)</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onSelectOrder(orderComplete);
                  setOrderComplete(null);
                }}
                className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow"
              >
                Track Delivery Real-Time
              </button>

              <button
                onClick={() => setOrderComplete(null)}
                className="w-full border border-[#27272A] hover:bg-[#1C1C1F] text-zinc-300 font-semibold py-3 rounded-xl transition-all text-xs cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Assistant Panel */}
      {isAiOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] md:w-[400px] h-[550px] bg-[#161619] border border-[#27272A] rounded-2xl shadow-2xl flex flex-col justify-between z-50 overflow-hidden animate-slide-up">
          
          {/* AI Panel Header */}
          <div className="bg-gradient-to-r from-blue-900/30 to-[#1C1C1F] px-5 py-3.5 border-b border-[#27272A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#3B82F6] rounded-lg flex items-center justify-center shadow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs leading-none">Aisha AI Concierge</h4>
                <span className="text-[9px] font-mono text-cyan-400 mt-1 block uppercase tracking-wider">Shopper Copilot</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsAiOpen(false)}
              className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AI Thread Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 no-scrollbar bg-[#111113]">
            {aiThread.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar icon */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  msg.sender === 'user' ? 'bg-[#3B82F6] text-white' : 'bg-[#1C1C1F] border border-[#27272A] text-zinc-400'
                }`}>
                  {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : 'A'}
                </div>

                <div className="space-y-1.5">
                  <div className={`rounded-2xl p-3.5 text-xs font-light leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#3B82F6] text-white rounded-tr-none' 
                      : 'bg-[#1C1C1F] border border-[#27272A] text-zinc-300 rounded-tl-none'
                  }`}>
                    {/* Render simple bullets for AI markdown look */}
                    {msg.text.split('\n').map((line, lidx) => {
                      if (line.startsWith('* **')) {
                        // Bold bullet line
                        return <p key={lidx} className="my-1.5 pl-2 border-l border-cyan-500/40 text-white font-medium">{line.replace(/\* \*\*/g, '• ').replace(/\*\*/g, '')}</p>;
                      }
                      return <p key={lidx} className="my-0.5">{line}</p>;
                    })}
                  </div>

                  {/* Dynamic assistant action button right in the conversation thread */}
                  {msg.actionProduct && msg.sender === 'ai' && (
                    <div className="animate-pulse pl-2">
                      <button
                        onClick={() => {
                          addToCart(msg.actionProduct!);
                          setAiThread(prev => [...prev, {
                            sender: 'ai',
                            text: `✓ I have successfully added the **${msg.actionProduct!.name}** (₦${msg.actionProduct!.price.toLocaleString()}) to your shopping cart! Let me know if you would like to ask anything else.`,
                            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                          }]);
                        }}
                        className="bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <ShoppingCart className="w-3 h-3" /> Add {msg.actionProduct.name} to Cart
                      </button>
                    </div>
                  )}

                  <span className="text-[9px] font-mono text-zinc-500 block text-right pr-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-6 h-6 rounded-full bg-[#1C1C1F] border border-[#27272A] flex items-center justify-center text-[10px] text-zinc-400 font-bold shrink-0">
                  A
                </div>
                <div className="bg-[#1C1C1F] border border-[#27272A] rounded-2xl rounded-tl-none p-3.5 text-xs text-zinc-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Preset Prompts Buttons */}
          <div className="px-4 py-2 bg-[#1C1C1F]/60 border-t border-[#27272A] flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { label: 'Compare phones', text: 'Compare iPhone and Galaxy S24 Ultra' },
              { label: 'Suggest laptop', text: 'Show me MacBook Air M3 details' },
              { label: 'Any discounts?', text: 'Are there any discount or promo codes?' },
              { label: 'Logistics / VI shipping', text: 'How is same day delivery to Victoria Island?' }
            ].map((p, pidx) => (
              <button
                key={pidx}
                onClick={(e) => handleSendAiMessage(undefined, p.text)}
                className="shrink-0 bg-[#161619] hover:bg-[#27272A] border border-[#27272A] text-zinc-400 hover:text-white rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-all cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* AI Input Area */}
          <form onSubmit={handleSendAiMessage} className="p-4 bg-[#1C1C1F] border-t border-[#27272A] flex gap-2">
            <input 
              type="text" 
              placeholder="Ask Aisha (e.g. Can I get a discount?)..." 
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              className="flex-1 bg-[#161619] border border-[#27272A] focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
            />
            <button 
              type="submit" 
              className="p-2 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
