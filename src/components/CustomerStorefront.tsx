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
  Star,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { Product, CartItem, Order } from '../types';

interface CustomerStorefrontProps {
  onBackToLanding: () => void;
  onAddOrder: (newOrder: Order) => void;
  onSelectOrder: (order: Order) => void;
  existingOrders: Order[];
  products: Product[];
}

export default function CustomerStorefront({ 
  onBackToLanding, 
  onAddOrder, 
  onSelectOrder,
  existingOrders,
  products
}: CustomerStorefrontProps) {
  
  // Shopping views
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'SMARTPHONES' | 'LAPTOPS' | 'AUDIO'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Selective filters state
  const [selectedBrand, setSelectedBrand] = useState<'ALL' | 'Apple' | 'Samsung' | 'Sony'>('ALL');
  const [priceRange, setPriceRange] = useState<'ALL' | 'under-500k' | '500k-1.2m' | 'over-1.2m'>('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'in-stock' | 'low-stock'>('ALL');
  const [sortBy, setSortBy] = useState<'RELEVANCE' | 'PRICE_ASC' | 'PRICE_DESC' | 'RATING_DESC'>('RELEVANCE');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(true);

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
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.specs.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Brand extraction
    const brandName = p.name.toLowerCase().includes('iphone') || p.name.toLowerCase().includes('macbook') || p.name.toLowerCase().includes('ipad') ? 'Apple' :
                      p.name.toLowerCase().includes('galaxy') ? 'Samsung' :
                      p.name.toLowerCase().includes('sony') ? 'Sony' : '';
    const matchesBrand = selectedBrand === 'ALL' || brandName === selectedBrand;

    // Price range
    let matchesPrice = true;
    if (priceRange === 'under-500k') {
      matchesPrice = p.price < 500000;
    } else if (priceRange === '500k-1.2m') {
      matchesPrice = p.price >= 500000 && p.price <= 1200000;
    } else if (priceRange === 'over-1.2m') {
      matchesPrice = p.price > 1200000;
    }

    // Stock level
    let matchesStock = true;
    if (stockFilter === 'in-stock') {
      matchesStock = p.stock > 0;
    } else if (stockFilter === 'low-stock') {
      matchesStock = p.stock > 0 && p.stock <= 4;
    }

    return matchesCategory && matchesSearch && matchesBrand && matchesPrice && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'PRICE_ASC') return a.price - b.price;
    if (sortBy === 'PRICE_DESC') return b.price - a.price;
    if (sortBy === 'RATING_DESC') return b.rating - a.rating;
    return 0; // RELEVANCE
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
      const matchedProd = products.find(p => normalized.includes(p.name.toLowerCase()) || normalized.includes(p.id));

      if (normalized.includes('discount') || normalized.includes('promo') || normalized.includes('coupon') || normalized.includes('cheap')) {
        aiText = "Oh! You want some discounts? I got you! Use the promo code **RETAILFLOW10** during checkout for an extra 10% off your entire cart. Also, remember if you buy 2 or more of any item, our Lagos OS automatically applies a 5% bulk discount!";
      } else if (normalized.includes('delivery') || normalized.includes('shipping') || normalized.includes('lagos') || normalized.includes('dispatch')) {
        aiText = "We offer lightning-fast dispatch from our main hub in Ikeja GRA. Standard delivery to Lekki Phase 1, Victoria Island, and Ikoyi is just ₦5,000, and we deliver same-day for orders confirmed before 2:00 PM.";
      } else if (normalized.includes('iphone') || normalized.includes('phone') || normalized.includes('s24')) {
        const iphone = products.find(p => p.id === 'prod-1')!;
        const ultra = products.find(p => p.id === 'prod-3')!;
        aiText = `We have the latest smartphones in stock! \n\n* **${iphone ? iphone.name : 'iPhone 15 Pro'}**: ₦${iphone ? iphone.price.toLocaleString() : '1,450,000'} (Stock: ${iphone ? iphone.stock : '12'} left in Lagos). \n* **${ultra ? ultra.name : 'Galaxy S24 Ultra'}**: ₦${ultra ? ultra.price.toLocaleString() : '1,620,000'} (Stock: ${ultra ? ultra.stock : '15'} left in Lagos). \n\nBoth are eligible for same-day delivery. Would you like me to add one of these to your shopping cart?`;
        actionProduct = iphone;
      } else if (normalized.includes('macbook') || normalized.includes('laptop') || normalized.includes('computer')) {
        const mac = products.find(p => p.id === 'prod-2')!;
        aiText = `The **MacBook Air M3** is a beast! It retails for ₦${mac ? mac.price.toLocaleString() : '1,400,000'} and we currently have ${mac ? mac.stock : '8'} units left at our physical storefront. It features the Apple M3 chip and gorgeous space gray finish. I can add it directly to your cart right now.`;
        actionProduct = mac;
      } else if (normalized.includes('sony') || normalized.includes('audio') || normalized.includes('headphone') || normalized.includes('music')) {
        const sony = products.find(p => p.id === 'prod-4')!;
        aiText = `Ah, excellent taste! The **Sony WH-1000XM5** headphones deliver industry-leading ANC. They are retailing for ₦${sony ? sony.price.toLocaleString() : '385,000'} with ${sony ? sony.stock : '20'} units available. Would you like me to add them to your cart?`;
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500/10 relative pb-20">
      
      {/* Background Decor */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-blue-500/[0.01] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[5%] w-[400px] h-[400px] bg-indigo-500/[0.01] rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation Store Header */}
      <header className="sticky top-0 z-40 bg-white/90 border-b border-slate-200 backdrop-blur-md px-4 lg:px-8 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-black text-base text-slate-950 tracking-tight">RetailFlow Store</span>
            <span className="text-[9px] font-mono font-bold text-blue-700 block tracking-widest uppercase">Lagos Retail Client Node</span>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-96">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search phones, laptops, audio specs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-950 focus:outline-none w-full placeholder-slate-400 font-light"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-900">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Shopping CTAs */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAiOpen(true)}
            className="relative px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-250 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-blue-700" />
            <span>Ask Aisha AI</span>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-900 transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4.5 h-4.5" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-700 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-bounce">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          <button 
            onClick={onBackToLanding}
            className="text-xs font-mono font-bold text-slate-500 hover:text-slate-900 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/40 rounded-xl transition-all cursor-pointer"
          >
            Exit Shop
          </button>
        </div>
      </header>

      {/* Category Tabs & Welcome Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        
        {/* Mobile Search bar */}
        <div className="flex md:hidden items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-900 focus:outline-none w-full"
          />
        </div>

        {!selectedProduct ? (
          <>
            {/* Promo Code Flash Tip */}
            <div className="bg-gradient-to-r from-blue-500/[0.03] via-white to-white border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Lagos Dynamic Tech Sales Active!</h4>
                  <p className="text-xs text-slate-500">Apply code <span className="font-mono text-cyan-700 font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100">RETAILFLOW10</span> at checkout for 10% off. Automatic 5% bulk discount on 2+ units.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setPromoCode('RETAILFLOW10');
                  setIsCartOpen(true);
                }} 
                className="text-xs font-bold text-blue-700 hover:underline self-start sm:self-center cursor-pointer"
              >
                Apply Code Now →
              </button>
            </div>

            {/* Categories & Toggle Filters Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {(['ALL', 'SMARTPHONES', 'LAPTOPS', 'AUDIO'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-mono font-extrabold tracking-wider transition-all cursor-pointer border ${
                      selectedCategory === cat 
                        ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' 
                        : 'bg-transparent text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold text-slate-400 hidden lg:inline">
                  Showing {filteredProducts.length} of {products.length} premium models
                </span>
                
                <button 
                  onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isFilterPanelOpen 
                      ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5 text-blue-700" />
                  <span>Filters</span>
                  {(selectedBrand !== 'ALL' || priceRange !== 'ALL' || stockFilter !== 'ALL' || sortBy !== 'RELEVANCE') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700 animate-pulse" />
                  )}
                </button>
              </div>
            </div>

            {/* Layout Wrapper with Side Filter Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
              
              {/* Left Side Filter Panel Tab */}
              {isFilterPanelOpen && (
                <aside className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-6 shadow-sm sticky top-20 z-10 animate-fade-in w-full">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-blue-700" />
                      <h4 className="text-[11px] font-mono uppercase font-bold text-slate-950 tracking-wider">Selective Filters</h4>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedBrand('ALL');
                        setPriceRange('ALL');
                        setStockFilter('ALL');
                        setSortBy('RELEVANCE');
                        setSelectedCategory('ALL');
                      }}
                      className="text-[10px] font-mono text-blue-700 hover:text-blue-800 font-bold transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Category Selection in Sidebar */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Category</span>
                    <div className="flex flex-col gap-1">
                      {(['ALL', 'SMARTPHONES', 'LAPTOPS', 'AUDIO'] as const).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{cat === 'ALL' ? 'All Categories' : cat.charAt(0) + cat.slice(1).toLowerCase()}</span>
                          {selectedCategory === cat && <span className="text-blue-700 font-bold">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Brand / Maker</span>
                    <div className="flex flex-col gap-1">
                      {(['ALL', 'Apple', 'Samsung', 'Sony'] as const).map(brand => (
                        <button
                          key={brand}
                          onClick={() => setSelectedBrand(brand)}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                            selectedBrand === brand
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{brand === 'ALL' ? 'All Brands' : brand}</span>
                          {selectedBrand === brand && <span className="text-blue-700 font-bold">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Price Range</span>
                    <div className="flex flex-col gap-1">
                      {[
                        { id: 'ALL', label: 'All Prices' },
                        { id: 'under-500k', label: 'Under ₦500k' },
                        { id: '500k-1.2m', label: '₦500k - ₦1.2M' },
                        { id: 'over-1.2m', label: 'Over ₦1.2M' }
                      ].map(range => (
                        <button
                          key={range.id}
                          onClick={() => setPriceRange(range.id as any)}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                            priceRange === range.id
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{range.label}</span>
                          {priceRange === range.id && <span className="text-blue-700 font-bold">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stock Level Filter */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Availability</span>
                    <div className="flex flex-col gap-1">
                      {[
                        { id: 'ALL', label: 'All Availability' },
                        { id: 'in-stock', label: 'In Stock Only' },
                        { id: 'low-stock', label: 'Low Stock Alerts' }
                      ].map(stockOpt => (
                        <button
                          key={stockOpt.id}
                          onClick={() => setStockFilter(stockOpt.id as any)}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                            stockFilter === stockOpt.id
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{stockOpt.label}</span>
                          {stockFilter === stockOpt.id && <span className="text-blue-700 font-bold">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Selector */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Sort By</span>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-300 cursor-pointer appearance-none"
                      >
                        <option value="RELEVANCE">Default / Relevance</option>
                        <option value="PRICE_ASC">Price: Low to High</option>
                        <option value="PRICE_DESC">Price: High to Low</option>
                        <option value="RATING_DESC">Top Customer Rated</option>
                      </select>
                      <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400">
                        <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                      </div>
                    </div>
                  </div>
                </aside>
              )}

              {/* Products List/Grid side area */}
              <div className={`${isFilterPanelOpen ? 'lg:col-span-9' : 'lg:col-span-12'} transition-all duration-300 w-full`}>
                {filteredProducts.length > 0 ? (
                  <div className={`grid grid-cols-1 sm:grid-cols-2 ${isFilterPanelOpen ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
                    {filteredProducts.map(product => {
                      const inCartQty = cart.find(item => item.product.id === product.id)?.quantity || 0;
                      const isOutOfStock = product.stock === 0;
                      const isLowStock = product.stock > 0 && product.stock <= 4;

                      return (
                        <div 
                          key={product.id} 
                          className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-slate-300 hover:shadow-md relative animate-fade-in"
                        >
                          {/* Stock Alerts */}
                          {isOutOfStock ? (
                            <span className="absolute top-3 left-3 bg-red-50 border border-red-100 text-red-700 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full z-10">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="absolute top-3 left-3 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full z-10 animate-pulse">
                              Low Stock: Only {product.stock} left
                            </span>
                          ) : (
                            <span className="absolute top-3 left-3 bg-green-50 border border-green-100 text-green-700 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full z-10">
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
                            className="relative bg-slate-50 h-52 w-full flex items-center justify-center p-4 overflow-hidden border-b border-slate-100 cursor-pointer"
                          >
                            <img 
                              src={product.imageSrc} 
                              alt={product.imageAlt}
                              className="h-full object-contain group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-100/20 to-transparent pointer-events-none" />
                            
                            {/* View Specs & Details Hover Overlay */}
                            <div className="absolute inset-0 bg-slate-950/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                              <span className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-900 tracking-wide shadow flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                View Specs & Reviews →
                              </span>
                            </div>
                          </div>

                          {/* Details Area */}
                          <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-amber-500 text-xs font-semibold">★</span>
                                  <span className="text-[11px] font-mono font-bold text-slate-600">{product.rating}</span>
                                </div>
                              </div>
                              <h3 
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setSelectedStorage('256GB');
                                  setSelectedColor(colorsForCategory(product.category)[0]?.name || '');
                                }}
                                className="font-bold text-base text-slate-950 group-hover:text-blue-700 transition-colors cursor-pointer"
                              >
                                {product.name}
                              </h3>
                              <p className="text-xs text-slate-500 leading-relaxed font-light line-clamp-2">{product.description}</p>
                            </div>

                            {/* Specs badges */}
                            <div className="flex flex-wrap gap-1.5 py-1">
                              {product.specs.slice(0, 3).map((spec, i) => (
                                <span key={i} className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                                  {spec}
                                </span>
                              ))}
                            </div>

                            <div className="border-t border-slate-150 pt-4 flex items-center justify-between">
                              <div>
                                <span className="text-slate-400 text-[10px] block uppercase font-mono tracking-wider font-bold">Lekki/Ikeja Hub</span>
                                <span className="text-lg font-black text-slate-950">₦{product.price.toLocaleString()}</span>
                              </div>

                              {inCartQty > 0 ? (
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
                                  <button 
                                    onClick={() => updateQty(product.id, -1)}
                                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-all"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="text-xs font-mono font-bold px-1 text-slate-900">{inCartQty}</span>
                                  <button 
                                    onClick={() => updateQty(product.id, 1)}
                                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-all"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  disabled={isOutOfStock}
                                  onClick={() => addToCart(product)}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                                    isOutOfStock 
                                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                                      : 'bg-blue-700 text-white hover:bg-blue-800'
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
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-950 animate-pulse">No products match your search</h3>
                    <p className="text-xs text-slate-500">Try checking your spelling, choosing another category, or ask Aisha our AI Assistant to check stock details for you!</p>
                    <button 
                      onClick={() => { 
                        setSelectedCategory('ALL'); 
                        setSelectedBrand('ALL'); 
                        setPriceRange('ALL'); 
                        setStockFilter('ALL'); 
                        setSearchQuery(''); 
                      }}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Detailed Individual Product Page View */
          <div className="space-y-8 animate-scale-up">
            
            {/* Back Button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-slate-900 group transition-all cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-xl w-fit shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-blue-700" />
              <span>Back to Catalog</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Image & Reviews */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Big Image Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden h-96 group shadow-xs">
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <span className="bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full">
                      {selectedProduct.category}
                    </span>
                    {selectedProduct.stock > 0 && selectedProduct.stock <= 4 ? (
                      <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                        Low Stock: {selectedProduct.stock} left
                      </span>
                    ) : selectedProduct.stock === 0 ? (
                      <span className="bg-red-50 border border-red-200 text-red-700 text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full">
                        Sold Out
                      </span>
                    ) : (
                      <span className="bg-green-50 border border-green-200 text-green-700 text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full">
                        In Stock (Hub GRA)
                      </span>
                    )}
                  </div>

                  <img 
                    src={selectedProduct.imageSrc} 
                    alt={selectedProduct.imageAlt}
                    className="h-64 object-contain group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-4 text-center">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Premium Tech Hub Spec</p>
                  </div>
                </div>

                {/* Reviews Block */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">Customer Reviews</h4>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-amber-500">★</span>
                      <span className="text-slate-900 font-bold font-mono">{selectedProduct.rating}</span>
                      <span className="text-slate-400">/ 5.0</span>
                    </div>
                  </div>

                  {/* Review list */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                    {((productReviews[selectedProduct.id] || []).length > 0) ? (
                      (productReviews[selectedProduct.id] || []).map((rev, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-850">{rev.author}</span>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, rIdx) => (
                              <span key={rIdx} className={rIdx < rev.rating ? 'text-amber-400' : 'text-slate-200'}>★</span>
                            ))}
                          </div>
                          <p className="text-slate-600 font-light leading-relaxed">{rev.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-xs italic py-2 pl-1">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>

                  {/* Submit Review Form */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <h5 className="font-bold text-xs text-slate-900">Write a customer review</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        id="review-author"
                        className="bg-white border border-slate-250 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400"
                      />
                      <select 
                        id="review-rating"
                        className="bg-white border border-slate-250 focus:outline-none rounded-xl px-2 py-1.5 text-xs text-slate-900 font-bold cursor-pointer"
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
                      className="w-full bg-white border border-slate-250 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 resize-none font-light"
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
                      className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Configurations */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Title & Price Box */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-blue-700 uppercase tracking-widest font-extrabold">TechHub Original Model</span>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400">★</span>
                        <span className="text-xs font-mono font-bold text-slate-900">{selectedProduct.rating} Rating</span>
                      </div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-950 leading-tight">{selectedProduct.name}</h2>
                    <p className="text-sm text-slate-600 font-light leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider block font-bold">Configured Price</span>
                      <span className="text-2xl font-black text-slate-950">
                        ₦{getDynamicPrice(selectedProduct, selectedStorage).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        disabled={selectedProduct.stock === 0}
                        onClick={handleAddCustomProductToCart}
                        className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                          selectedProduct.stock === 0
                            ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-700 text-white hover:bg-blue-800'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add Configuration to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Specs Interactive Customizer */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
                  <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 pb-2">
                    1. Choose Custom Specifications
                  </h4>
                  
                  {/* Storage Selector */}
                  {(selectedProduct.category === 'SMARTPHONES' || selectedProduct.category === 'LAPTOPS') && (
                    <div className="space-y-2">
                      <span className="text-[11px] text-slate-500 font-bold block">Storage Capacity:</span>
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
                                  ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-950 hover:border-slate-400'
                              }`}
                            >
                              <span className="text-xs font-bold block">{storage}</span>
                              <span className="text-[9px] font-mono text-slate-400 block mt-1 font-semibold">{offsetLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Color Selector */}
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-500 font-bold block">Color & Finish:</span>
                    <div className="flex flex-wrap gap-2.5">
                      {colorsForCategory(selectedProduct.category).map(color => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`px-3.5 py-2 border rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                            selectedColor === color.name
                              ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-950 hover:border-slate-400'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-xs" style={{ backgroundColor: color.hex }} />
                          <span>{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Technical Specs Highlights */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                  <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 pb-2">
                    2. Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProduct.specs.map((spec, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs">
                        <div className="w-2 h-2 rounded-full bg-blue-700 shadow-xs" />
                        <span className="text-slate-700 font-light">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aisha AI Product Copilot Card */}
                <div className="bg-gradient-to-br from-blue-500/[0.03] to-slate-50 border border-blue-100 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-xs">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/[0.05] rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-700 animate-pulse" />
                    <span className="font-bold text-xs text-slate-950">Ask Aisha about the {selectedProduct.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
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
                      className="flex-1 bg-white border border-slate-200 focus:outline-none rounded-xl px-3 py-2 text-[11px] text-slate-900 placeholder-slate-400"
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
                      className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 transition-colors shadow-sm"
                    >
                      Ask AI
                    </button>
                  </div>
                </div>

                {/* Delivery Policies Box */}
                <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-500 font-semibold">
                  <p className="text-slate-800 font-bold">Lagos Hub Logistics Dispatch Policy:</p>
                  <p className="font-light">🚀 Same-Day dispatch to Lekki Phase 1, Victoria Island, Ikeja GRA, and Ikoyi for orders locked before 2:00 PM.</p>
                  <p className="font-light">🛡️ 1-Year official brand warranty handled by local Ikeja service node.</p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Existing Order History tracker quick-link */}
        {existingOrders.some(o => placedOrderIds.includes(o.id)) && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-950 flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-green-600" />
                <span>Your Live Store Orders ({existingOrders.filter(o => placedOrderIds.includes(o.id)).length})</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Lagos Delivery Fleet Active
              </span>
            </div>

            <div className="divide-y divide-slate-150">
              {existingOrders.filter(o => placedOrderIds.includes(o.id)).map(o => (
                <div key={o.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-cyan-700 font-bold">{o.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        o.status === 'DELIVERED' ? 'bg-green-50 border border-green-100 text-green-700' :
                        o.status === 'SHIPPED' ? 'bg-blue-50 border border-blue-100 text-blue-700' :
                        'bg-amber-50 border border-amber-200 text-amber-700'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="text-slate-800 font-bold">{o.product}</p>
                    <p className="text-slate-400 text-[10px] font-semibold">Destination: {o.location} • Value: ₦{o.value.toLocaleString()}</p>
                  </div>

                  <button 
                    onClick={() => onSelectOrder(o)}
                    className="text-xs text-blue-700 hover:text-blue-800 border border-blue-200 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer flex items-center gap-1 font-bold"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between p-6 z-10 animate-slide-left">
            
            <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-6">
              {/* Cart Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-slate-950" />
                  <h3 className="font-black text-lg text-slate-950">Your Shopping Cart</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl relative">
                      <img 
                        src={item.product.imageSrc} 
                        alt={item.product.imageAlt} 
                        className="w-16 h-16 object-contain bg-white border border-slate-100 p-1 rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                      
                      <div className="flex-1 space-y-1 text-xs">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-slate-950 text-sm leading-tight pr-4">{item.product.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-blue-700 font-extrabold text-sm">₦{item.product.price.toLocaleString()}</p>
                        
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400 font-mono font-bold">Stock limit: {item.product.stock}</span>
                          
                          <div className="flex items-center gap-2 bg-white border border-slate-250 rounded-lg p-0.5">
                            <button 
                              onClick={() => updateQty(item.product.id, -1)}
                              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-bold px-1.5 text-slate-900">{item.quantity}</span>
                            <button 
                              onClick={() => updateQty(item.product.id, 1)}
                              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-all"
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
                  <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950">Your cart is empty</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Explore the catalog or chat with Aisha our AI shopping assistant to add premium products directly!</p>
                  </div>
                  <button 
                    onClick={() => { setIsCartOpen(false); setIsAiOpen(true); }}
                    className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    Let Aisha assist your shopping →
                  </button>
                </div>
              )}
            </div>

            {/* Financial Overview & Checkout Trigger */}
            {cart.length > 0 && (
              <div className="border-t border-slate-200 pt-4 space-y-4 text-xs">
                
                {/* Promo Code Input */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="PROMO CODE (e.g. RETAILFLOW10)" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 font-medium"
                  />
                  <button 
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-250 font-bold cursor-pointer transition-all"
                  >
                    Apply
                  </button>
                </div>
                {discountError && <p className="text-rose-600 text-[10px] pl-1">{discountError}</p>}
                {appliedDiscount && <p className="text-green-700 text-[10px] pl-1 font-bold">✓ Promo '{appliedDiscount.code}' Applied successfully! ({appliedDiscount.percent}% off)</p>}

                {/* Money breakdown */}
                <div className="space-y-2 font-mono bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-500">
                  <div className="flex justify-between">
                    <span className="font-bold">Subtotal:</span>
                    <span className="text-slate-900 font-extrabold">₦{subtotal.toLocaleString()}</span>
                  </div>

                  {isBulkEligible && (
                    <div className="flex justify-between text-green-700 text-[11px] font-bold">
                      <span>Lagos Bulk Discount (5%):</span>
                      <span>-₦{bulkDiscountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {appliedDiscount && (
                    <div className="flex justify-between text-green-700 text-[11px] font-bold">
                      <span>Promo Discount ({appliedDiscount.percent}%):</span>
                      <span>-₦{promoDiscountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="font-bold">Dispatch Logistics Charge:</span>
                    <span className="text-slate-900 font-extrabold">₦{deliveryFee.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-slate-200 my-2 pt-2 flex justify-between text-sm font-bold">
                    <span className="text-slate-950 font-black">Estimated Total:</span>
                    <span className="text-blue-700 font-black text-base">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all text-sm cursor-pointer shadow-sm"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative animate-scale-up">
            
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                <CreditCard className="w-4.5 h-4.5 text-blue-700" />
                <span>Secure Checkout • dispatch from Ikeja HUB</span>
              </h3>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-150 pb-1.5">1. Delivery Destination (Lagos Fleet)</h4>
                
                <div className="grid grid-cols-2 gap-2">
                  {['Lekki Phase 1', 'Ikeja GRA', 'Victoria Island', 'Other'].map(loc => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setDeliveryLocation(loc);
                        if (loc !== 'Other') setCustomLocation('');
                      }}
                      className={`py-2 px-3 border rounded-xl text-left font-bold transition-all ${
                        deliveryLocation === loc 
                          ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900'
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
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none rounded-xl px-3 py-2 text-slate-950 font-medium"
                  />
                )}
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-150 pb-1.5">2. Customer Details</h4>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Full Name (e.g. Tunde Adeyemi)" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none rounded-xl px-3 py-2 text-slate-950 font-medium"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:outline-none rounded-xl px-3 py-2 text-slate-950 font-medium"
                    />
                    <input 
                      type="tel" 
                      placeholder="Phone Number (e.g. +234...)" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:outline-none rounded-xl px-3 py-2 text-slate-950 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-150 pb-1.5">3. Payment Dispatch Preference</h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['TRANSFER', 'CARD', 'POS_DELIVERY'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 border rounded-xl text-center font-bold tracking-wider transition-all uppercase text-[10px] ${
                        paymentMethod === method 
                          ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {method === 'TRANSFER' && 'Bank Transfer'}
                      {method === 'CARD' && 'Secure Pay'}
                      {method === 'POS_DELIVERY' && 'POS Terminal'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 font-mono text-slate-500 flex items-center justify-between text-xs bg-slate-50 p-4 rounded-xl border border-slate-150">
                <div>
                  <p className="font-bold">Order Delivery Cargo Value:</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Includes Lagos Express Delivery Logistics Fee</p>
                </div>
                <span className="text-base font-black text-blue-700">₦{total.toLocaleString()}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all text-sm cursor-pointer shadow-sm"
              >
                Confirm Purchase Manifest
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Success Screen */}
      {orderComplete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-green-200 max-w-md w-full rounded-2xl p-6 text-center space-y-6 shadow-2xl relative overflow-hidden animate-scale-up">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-pulse" />
            
            <div className="w-14 h-14 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-green-600 uppercase tracking-widest font-black">Purchase Manifest Registered</span>
              <h3 className="font-black text-xl text-slate-950">Order Successfully Dispatched!</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Thank you, <span className="font-extrabold text-slate-900">{orderComplete.customerName}</span>. Your shipment <span className="font-mono text-cyan-700 font-bold bg-cyan-50 border border-cyan-100 px-1.5 py-0.5 rounded">{orderComplete.id}</span> is loaded onto our dynamic logistics fleet.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-500 text-left space-y-1.5">
              <div className="flex justify-between">
                <span>Value:</span>
                <span className="text-slate-950 font-bold">₦{orderComplete.value.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-slate-950 font-bold">{orderComplete.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-600 font-extrabold">DISPATCHING (IKEJA HUB)</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onSelectOrder(orderComplete);
                  setOrderComplete(null);
                }}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                Track Delivery Real-Time
              </button>

              <button
                onClick={() => setOrderComplete(null)}
                className="w-full border border-slate-250 hover:bg-slate-100 text-slate-600 font-bold py-3 rounded-xl transition-all text-xs cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Assistant Panel */}
      {isAiOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] md:w-[400px] h-[550px] bg-white border border-slate-250 rounded-2xl shadow-2xl flex flex-col justify-between z-50 overflow-hidden animate-slide-up">
          
          {/* AI Panel Header */}
          <div className="bg-gradient-to-r from-blue-500/[0.05] to-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-950 text-xs leading-none">Aisha AI Concierge</h4>
                <span className="text-[9px] font-mono text-cyan-700 mt-1 block uppercase tracking-wider font-extrabold">Shopper Copilot</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsAiOpen(false)}
              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-lg transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AI Thread Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 no-scrollbar bg-slate-50/50">
            {aiThread.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar icon */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  msg.sender === 'user' ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 shadow-xs'
                }`}>
                  {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : 'A'}
                </div>

                <div className="space-y-1.5">
                  <div className={`rounded-2xl p-3.5 text-xs font-light leading-relaxed shadow-xs ${
                    msg.sender === 'user' 
                      ? 'bg-blue-700 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}>
                    {/* Render simple bullets for AI markdown look */}
                    {msg.text.split('\n').map((line, lidx) => {
                      if (line.startsWith('* **')) {
                        // Bold bullet line
                        return <p key={lidx} className="my-1.5 pl-2 border-l-2 border-cyan-500 text-slate-900 font-bold">{line.replace(/\* \*\*/g, '• ').replace(/\*\*/g, '')}</p>;
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
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <ShoppingCart className="w-3 h-3" /> Add {msg.actionProduct.name} to Cart
                      </button>
                    </div>
                  )}

                  <span className="text-[9px] font-mono text-slate-400 block text-right pr-1 font-bold">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold shrink-0 shadow-xs">
                  A
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Preset Prompts Buttons */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-150 flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { label: 'Compare phones', text: 'Compare iPhone and Galaxy S24 Ultra' },
              { label: 'Suggest laptop', text: 'Show me MacBook Air M3 details' },
              { label: 'Any discounts?', text: 'Are there any discount or promo codes?' },
              { label: 'Logistics / VI shipping', text: 'How is same day delivery to Victoria Island?' }
            ].map((p, pidx) => (
              <button
                key={pidx}
                onClick={(e) => handleSendAiMessage(undefined, p.text)}
                className="shrink-0 bg-white hover:bg-slate-100 border border-slate-250 text-slate-500 hover:text-slate-900 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* AI Input Area */}
          <form onSubmit={handleSendAiMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask Aisha (e.g. Can I get a discount?)..." 
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400"
            />
            <button 
              type="submit" 
              className="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
