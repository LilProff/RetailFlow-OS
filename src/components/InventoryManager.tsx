import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle, 
  SlidersHorizontal,
  X,
  Check,
  RotateCcw,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Product } from '../types';

interface InventoryManagerProps {
  products: Product[];
  onUpdateProducts: (updatedProducts: Product[]) => void;
}

export default function InventoryManager({ 
  products, 
  onUpdateProducts 
}: InventoryManagerProps) {
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | Product['category']>('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  
  // Form states for adding a new product
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newCategory, setNewCategory] = useState<Product['category']>('SMARTPHONES');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSpecs, setNewSpecs] = useState('');
  const [newImagePreset, setNewImagePreset] = useState<'iphone' | 'macbook' | 'galaxy' | 'sony' | 'generic'>('generic');
  
  // States for Editing Product
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  // Image Presets mapping for easy UI additions
  const IMAGE_PRESETS = {
    iphone: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACm1vI6517WYewxDTg2auSvpyj7xgsqzWKNP7LLb4Xc4Pr347NJwo8P7ug7_DRg1IM4EndhkYIkvgRdfD4sCi4VUvZ-3aGhvGuatRiNBiMTn6rIMTbiMDR0-v66QKZbOd8sxb0XBhkOch6UaDVGxl08Pih-4RdSc3WToKDilDoqQnJdpy4yDS6vKiIg7R5xcNRerBWHC5YEmVfJ3nG0TAov6D-uYJ7ev3YDwmkV2Yvaf-brC98U_bcLrtoyO_h9_TvVN70SEm50PPS',
    macbook: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2wLJrTOOXpIbR85h_Vq3T4uhObAdOUoK4B0c4_JTsTD84DkpLOIMJGHcKfXw72n14XI0nnEu_UStQPjDrGuMBauLRgB7u3KoTKTZRnOGyI0Xw5NOuGbQF4iEHxzYWciHy_Pus60DzmUCPBf6Lfjdw2_RjVzjQcvX-chCsBGDH3bxZaEb6XPXAWVcLO0v89D_WWMPjvUtoNwU4iU844gtLIH22S8SPfhamB0N-eZO7zrlFTBJHDgGTPcXZVoR7e0wTIWURlJzYG8St',
    galaxy: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-CKG0sXaXLqs8s4uiELYGLHrF5ViZzsn2Pk2UwOhGrTJli26wlM7KvbEiRjpVo79OCZqG9FF-XQEcJgvz7zK2LklI1MCErEAm-4_o00kb_2jB278tlucXO6RiH2KovUV0zw2Kvj_ImVNeDgPFVYAReJeZSuUsRz73DkNTpaP2acgLWF8ZeTLp1jRusN25YvkYMp-GUD7PxJ3XUBL00msWXsL4TRNCgTZCEXxmvS3M_kP4L_tkRuVSp88738zzeS5iosdlCvfZBkA_',
    sony: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpSo-qg0LALUphRXdRe-bsRaIds-8jQj-MtVAuAPXIh2vKmm2KTOZc0kcUFMokT3itbLfn_H83Zm1DCAQeGC7sBhq2ulSwQpE4WASIP9cTfyH5JdtxXt-YdCpKNg4TAEOFtlf126jAss1dSqAEp-2ma23R5V8jFC7NdXih_aCKvg17lBr8q61sx33ZWe_-G_ZJ7GYhINBcaiSCDY8awcEq6WHjFdhugGI_uh7m8civA-YjBj-gl4aLmzyfwDmJ-gLjsKUffpFaM9Yo',
    generic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpSo-qg0LALUphRXdRe-bsRaIds-8jQj-MtVAuAPXIh2vKmm2KTOZc0kcUFMokT3itbLfn_H83Zm1DCAQeGC7sBhq2ulSwQpE4WASIP9cTfyH5JdtxXt-YdCpKNg4TAEOFtlf126jAss1dSqAEp-2ma23R5V8jFC7NdXih_aCKvg17lBr8q61sx33ZWe_-G_ZJ7GYhINBcaiSCDY8awcEq6WHjFdhugGI_uh7m8civA-YjBj-gl4aLmzyfwDmJ-gLjsKUffpFaM9Yo'
  };

  // Portfolio aggregates
  const totalStockCount = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 4);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.specs.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    
    let matchesStock = true;
    if (stockStatusFilter === 'IN_STOCK') {
      matchesStock = p.stock > 4;
    } else if (stockStatusFilter === 'LOW_STOCK') {
      matchesStock = p.stock > 0 && p.stock <= 4;
    } else if (stockStatusFilter === 'OUT_OF_STOCK') {
      matchesStock = p.stock === 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Actions: Add new product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newPrice.trim() || !newStock.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const priceNum = parseInt(newPrice.replace(/,/g, ''), 10);
    const stockNum = parseInt(newStock, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price.');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      alert('Please enter a valid stock count.');
      return;
    }

    const newProductItem: Product = {
      id: `prod-${Date.now()}`,
      name: newProductName.trim(),
      category: newCategory,
      price: priceNum,
      stock: stockNum,
      rating: 5.0,
      description: newDescription.trim() || `${newProductName.trim()} - Premium premium retail offering from TechHub GRA Ikeja.`,
      imageSrc: IMAGE_PRESETS[newImagePreset],
      imageAlt: newProductName.trim(),
      specs: newSpecs ? newSpecs.split(',').map(s => s.trim()).filter(Boolean) : ['High Quality', 'Lagos Verified']
    };

    onUpdateProducts([...products, newProductItem]);
    setIsAddFormOpen(false);

    // Reset Form
    setNewProductName('');
    setNewPrice('');
    setNewStock('');
    setNewDescription('');
    setNewSpecs('');
    setNewImagePreset('generic');
  };

  // Action: Quick Inline Edit Save
  const startEditing = (p: Product) => {
    setEditingProductId(p.id);
    setEditPrice(p.price.toString());
    setEditStock(p.stock.toString());
  };

  const cancelEditing = () => {
    setEditingProductId(null);
  };

  const handleSaveEdit = (productId: string) => {
    const priceNum = parseInt(editPrice, 10);
    const stockNum = parseInt(editStock, 10);

    if (isNaN(priceNum) || priceNum <= 0 || isNaN(stockNum) || stockNum < 0) {
      alert('Please enter valid numeric values.');
      return;
    }

    const updated = products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          price: priceNum,
          stock: stockNum
        };
      }
      return p;
    });

    onUpdateProducts(updated);
    setEditingProductId(null);
  };

  // Action: Decrement / Increment stock level quickly
  const adjustStock = (productId: string, delta: number) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stock: Math.max(0, p.stock + delta)
        };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  // Action: Delete product item
  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`Are you sure you want to remove "${productName}" from your active inventory catalog?`)) {
      const updated = products.filter(p => p.id !== productId);
      onUpdateProducts(updated);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Inventory Analytics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold mb-1 block">
            Total Unique SKUs
          </span>
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-700" />
            {products.length}
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-semibold font-mono">
            Across 3 Category Nodes
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold mb-1 block">
            Total Physical Units
          </span>
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {totalStockCount.toLocaleString()}
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-mono font-semibold">
            Average stock per SKU: {Math.round(totalStockCount / (products.length || 1))} units
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold mb-1 block">
            Active Valuation
          </span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-500 tracking-tight">
            ₦{totalValue.toLocaleString()}
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-mono font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> High Liquid Assets
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold mb-1 block">
            Replenishment Status
          </span>
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {outOfStockProducts.length > 0 ? (
              <span className="text-red-600 dark:text-red-500 flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-6 h-6" /> {outOfStockProducts.length} Out
              </span>
            ) : lowStockProducts.length > 0 ? (
              <span className="text-amber-600 dark:text-amber-500 flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-6 h-6" /> {lowStockProducts.length} Low
              </span>
            ) : (
              <span className="text-green-600 dark:text-green-500 font-bold">100% OK</span>
            )}
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-mono font-semibold">
            {lowStockProducts.length} low-stock SKUs require attention.
          </p>
        </div>

      </div>

      {/* Main Stock Table and Form */}
      <div className="bg-white border border-slate-200/80 rounded-2xl flex flex-col overflow-hidden shadow-sm dark:bg-slate-900 dark:border-slate-800">
        
        {/* Table Filters & Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-700" /> Ikeja Storage Hub & Catalog
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Add new inventory, adjust prices, edit physical units, and monitor active stock metrics.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 lg:flex-initial min-w-[180px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search catalog SKUs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs rounded-xl pl-9 pr-3 py-1.5 focus:border-blue-700 outline-none text-slate-900 dark:text-white"
              />
            </div>
            
            {/* Category Filter */}
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 outline-none cursor-pointer font-semibold"
            >
              <option value="ALL">All Categories</option>
              <option value="SMARTPHONES">Smartphones</option>
              <option value="LAPTOPS">Laptops</option>
              <option value="AUDIO">Audio Devices</option>
            </select>

            {/* Stock Level Filter */}
            <select 
              value={stockStatusFilter} 
              onChange={(e) => setStockStatusFilter(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 outline-none cursor-pointer font-semibold"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">Healthy Stock ({`>4`})</option>
              <option value="LOW_STOCK">Low Stock (1-4)</option>
              <option value="OUT_OF_STOCK">Out of Stock (0)</option>
            </select>

            <button 
              onClick={() => setIsAddFormOpen(!isAddFormOpen)}
              className="bg-blue-700 text-white hover:bg-blue-800 transition-all px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm ml-auto"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>

        {/* Add Product Collapsible Form */}
        {isAddFormOpen && (
          <div className="p-6 bg-slate-50 border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-700" /> Provision New Catalog SKU (Lagos Storage)
              </h4>
              <button 
                onClick={() => setIsAddFormOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-slate-400 block">Product Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. iPad Mini 2026"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-blue-700 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-slate-400 block">Category *</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-blue-700 font-semibold cursor-pointer"
                >
                  <option value="SMARTPHONES">Smartphones</option>
                  <option value="LAPTOPS">Laptops</option>
                  <option value="AUDIO">Audio</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-slate-400 block">Image Preset *</label>
                <select 
                  value={newImagePreset}
                  onChange={(e) => setNewImagePreset(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-blue-700 font-semibold cursor-pointer"
                >
                  <option value="generic">Generic Electronic Device</option>
                  <option value="iphone">iPhone Mockup Asset</option>
                  <option value="macbook">MacBook Aluminum Body</option>
                  <option value="galaxy">Galaxy S-Ultra Layout</option>
                  <option value="sony">Sony ANC Headphones</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-slate-400 block">Retail Price (₦ Naira) *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. 850000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-blue-700 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-slate-400 block">Initial Physical Units *</label>
                <input 
                  type="number"
                  required
                  placeholder="e.g. 10"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-blue-700 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-slate-400 block">Product Specs (Comma Separated)</label>
                <input 
                  type="text"
                  placeholder="e.g. 120Hz display, 12GB RAM, 512GB SSD"
                  value={newSpecs}
                  onChange={(e) => setNewSpecs(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-blue-700 font-medium"
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-slate-400 block">Description</label>
                <textarea 
                  rows={2}
                  placeholder="Provide retail specifications and warranty tags for Ikeja customer node storefront display."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-blue-700 font-light"
                />
              </div>

              <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold cursor-pointer dark:bg-slate-900 dark:border-slate-850 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm"
                >
                  Confirm Provisioning
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Catalog Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="p-4 font-extrabold">Item Model Details</th>
                <th className="p-4 font-extrabold">Category</th>
                <th className="p-4 font-extrabold">Stock Level</th>
                <th className="p-4 font-extrabold">Availability</th>
                <th className="p-4 font-extrabold text-right">Unit Price (₦)</th>
                <th className="p-4 font-extrabold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-850">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 dark:text-slate-500">
                    No items in your Ikeja warehouse matched the current search filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const isEditing = editingProductId === product.id;
                  const isOutOfStock = product.stock === 0;
                  const isLowStock = product.stock > 0 && product.stock <= 4;

                  return (
                    <tr 
                      key={product.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                    >
                      {/* Product identity cell */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img 
                              src={product.imageSrc} 
                              alt={product.imageAlt} 
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-950 dark:text-white text-sm leading-tight">{product.name}</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex flex-wrap gap-1 mt-0.5">
                              {product.specs.slice(0, 3).map((spec, sIdx) => (
                                <span key={sIdx} className="bg-slate-100 dark:bg-slate-850 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-800">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category cell */}
                      <td className="p-4 font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {product.category}
                      </td>

                      {/* Stock Level cell with interactive add/minus */}
                      <td className="p-4">
                        {isEditing ? (
                          <input 
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            className="w-16 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-xs text-slate-900 dark:text-white font-mono font-bold"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => adjustStock(product.id, -1)}
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold transition-all border border-transparent cursor-pointer"
                              title="Decrement Stock"
                            >
                              -
                            </button>
                            <span className="font-mono font-black text-slate-900 dark:text-white text-sm w-8 text-center">
                              {product.stock}
                            </span>
                            <button 
                              onClick={() => adjustStock(product.id, 1)}
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold transition-all border border-transparent cursor-pointer"
                              title="Increment Stock"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Status badge cell */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isOutOfStock ? 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30' :
                          isLowStock ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30 animate-pulse' :
                          'bg-green-50 text-green-700 border border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${
                            isOutOfStock ? 'bg-red-500' :
                            isLowStock ? 'bg-amber-500' :
                            'bg-green-500'
                          }`} />
                          {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'Active Stock'}
                        </span>
                      </td>

                      {/* Dynamic Price Cell */}
                      <td className="p-4 text-right font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-1">
                            <span className="text-xs text-slate-400">₦</span>
                            <input 
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-24 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-xs text-right text-slate-900 dark:text-white font-mono font-bold"
                            />
                          </div>
                        ) : (
                          `₦${product.price.toLocaleString()}`
                        )}
                      </td>

                      {/* Action buttons (Edit/Delete) */}
                      <td className="p-4 text-right">
                        {isEditing ? (
                          <div className="inline-flex gap-1">
                            <button 
                              onClick={() => handleSaveEdit(product.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/25 rounded transition-all cursor-pointer"
                              title="Save Changes"
                            >
                              <Check className="w-4.5 h-4.5" />
                            </button>
                            <button 
                              onClick={cancelEditing}
                              className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 rounded transition-all cursor-pointer"
                              title="Cancel Edit"
                            >
                              <X className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex gap-1">
                            <button 
                              onClick={() => startEditing(product)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg transition-all cursor-pointer"
                              title="Quick Edit Unit/Price"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/25 rounded-lg transition-all cursor-pointer"
                              title="Remove Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer aggregate info */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
            Ikeja Warehouse Node • Central Real-time Sync Active
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing {filteredProducts.length} of {products.length} registered SKUs.
          </span>
        </div>

      </div>

    </div>
  );
}
