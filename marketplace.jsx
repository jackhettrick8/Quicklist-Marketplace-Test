import React, { useState, useRef, useEffect } from 'react';
import { Camera, Search, Plus, X, Loader2, ImagePlus, Sparkles, TrendingUp, DollarSign, Tag, Image, ShoppingCart, Heart, ArrowLeft, CreditCard, Truck, Edit2, Save, Package, MapPin, User, Mail, Phone, CheckCircle, MessageCircle, Send, Check, XCircle, Navigation } from 'lucide-react';

export default function MarketplaceApp() {
  const [view, setView] = useState('home');
  const [listings, setListings] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchImage, setSearchImage] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [cart, setCart] = useState([]);
  const [userBehavior, setUserBehavior] = useState({
    searches: [],
    views: [],
    categories: {}
  });
  const [isEditing, setIsEditing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [billingInfo, setBillingInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const fileInputRef = useRef(null);
  const searchImageRef = useRef(null);

  // Initialize with test listings
  useEffect(() => {
    if (listings.length === 0) {
      setListings(generateTestListings());
    }
  }, []);

  // Messaging state
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [offerAmount, setOfferAmount] = useState('');

  // Location state
  const [userLocation, setUserLocation] = useState({ zipCode: '', lat: null, lng: null });
  const [searchRadius, setSearchRadius] = useState(25); // miles
  const [showLocalOnly, setShowLocalOnly] = useState(false);

  // Track user behavior
  const trackSearch = (query) => {
    setUserBehavior(prev => ({
      ...prev,
      searches: [...prev.searches, { query, timestamp: Date.now() }].slice(-20)
    }));
  };

  const trackView = (listing) => {
    setUserBehavior(prev => {
      const newCategories = { ...prev.categories };
      newCategories[listing.category] = (newCategories[listing.category] || 0) + 1;
      
      return {
        ...prev,
        views: [...prev.views, { id: listing.id, category: listing.category, timestamp: Date.now() }].slice(-50),
        categories: newCategories
      };
    });
  };

  const getPersonalizedListings = () => {
    if (listings.length === 0) return [];
    
    // Get user's favorite categories
    const topCategories = Object.entries(userBehavior.categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => cat);
    
    if (topCategories.length === 0) {
      return listings.slice(0, 6);
    }
    
    // Prioritize listings from favorite categories
    const personalized = listings.filter(l => topCategories.includes(l.category));
    const others = listings.filter(l => !topCategories.includes(l.category));
    
    return [...personalized, ...others].slice(0, 6);
  };

  const addToCart = (listing) => {
    if (!cart.find(item => item.id === listing.id)) {
      setCart([...cart, listing]);
    }
  };

  const removeFromCart = (listingId) => {
    setCart(cart.filter(item => item.id !== listingId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.suggestedPrice, 0);

  // Generate test listings
  const generateTestListings = () => {
    const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys & Games', 'Automotive', 'Music'];
    const conditions = ['Excellent', 'Good', 'Fair'];
    const locations = [
      { city: 'San Francisco', state: 'CA', zipCode: '94102', lat: 37.7749, lng: -122.4194 },
      { city: 'Los Angeles', state: 'CA', zipCode: '90001', lat: 34.0522, lng: -118.2437 },
      { city: 'New York', state: 'NY', zipCode: '10001', lat: 40.7128, lng: -74.0060 },
      { city: 'Austin', state: 'TX', zipCode: '73301', lat: 30.2672, lng: -97.7431 },
      { city: 'Seattle', state: 'WA', zipCode: '98101', lat: 47.6062, lng: -122.3321 },
      { city: 'Miami', state: 'FL', zipCode: '33101', lat: 25.7617, lng: -80.1918 },
      { city: 'Chicago', state: 'IL', zipCode: '60601', lat: 41.8781, lng: -87.6298 },
      { city: 'Denver', state: 'CO', zipCode: '80201', lat: 39.7392, lng: -104.9903 }
    ];

    const sampleListings = [
      { title: 'iPhone 14 Pro Max 256GB', desc: 'Space Black, unlocked, barely used with original box', cat: 'Electronics', price: 899, min: 850, max: 950, features: ['Unlocked for all carriers', 'Original packaging included', 'Battery health 100%', 'No scratches or dents'] },
      { title: 'Sony WH-1000XM5 Headphones', desc: 'Premium noise-canceling headphones, lightly used', cat: 'Electronics', price: 299, min: 280, max: 320, features: ['Active noise cancellation', 'Includes carrying case', '30-hour battery life', 'Excellent sound quality'] },
      { title: 'Vintage Levi\'s 501 Jeans', desc: 'Classic fit, size 32x32, perfect worn-in look', cat: 'Fashion', price: 85, min: 70, max: 100, features: ['Authentic vintage', 'Perfect fade', 'No holes or tears', 'Size 32x32'] },
      { title: 'Nike Air Jordan 1 Retro High', desc: 'Size 10, Chicago colorway, mint condition', cat: 'Fashion', price: 450, min: 400, max: 500, features: ['Size 10 US', 'Chicago colorway', 'Includes original box', 'Worn 3 times'] },
      { title: 'KitchenAid Stand Mixer', desc: 'Artisan Series 5-Qt, Empire Red, like new', cat: 'Home & Garden', price: 280, min: 250, max: 300, features: ['10-speed settings', 'Includes accessories', 'Barely used', 'Empire Red color'] },
      { title: 'Dyson V11 Cordless Vacuum', desc: 'Powerful suction, excellent for pet hair', cat: 'Home & Garden', price: 399, min: 375, max: 425, features: ['60-min runtime', 'LCD screen', 'Great for pet hair', 'Includes 5 attachments'] },
      { title: 'Mountain Bike - Trek X-Caliber', desc: '29er hardtail, aluminum frame, medium size', cat: 'Sports', price: 650, min: 600, max: 700, features: ['29-inch wheels', 'Medium frame', 'Recently tuned', 'Shimano components'] },
      { title: 'Fender Stratocaster Electric Guitar', desc: 'Sunburst finish, American Professional series', cat: 'Music', price: 1200, min: 1100, max: 1300, features: ['American made', 'V-Mod pickups', 'Includes hard case', 'Sunburst finish'] },
      { title: 'PlayStation 5 Digital Edition', desc: 'Like new, includes extra controller', cat: 'Electronics', price: 399, min: 375, max: 425, features: ['Digital edition', 'Extra DualSense controller', 'Original packaging', 'Perfect condition'] },
      { title: 'MacBook Air M2 2023', desc: '13-inch, 16GB RAM, 512GB SSD, Midnight color', cat: 'Electronics', price: 1099, min: 1050, max: 1150, features: ['M2 chip', '16GB RAM', '512GB storage', 'AppleCare+ included'] },
      { title: 'Patagonia Down Jacket', desc: 'Men\'s Large, Navy Blue, excellent insulation', cat: 'Fashion', price: 180, min: 160, max: 200, features: ['Size Large', '700-fill down', 'Water resistant', 'Like new condition'] },
      { title: 'Herman Miller Aeron Chair', desc: 'Size B, fully loaded, graphite frame', cat: 'Home & Garden', price: 650, min: 600, max: 700, features: ['Size B (medium)', 'Fully adjustable', 'PostureFit support', 'Excellent condition'] },
      { title: 'Canon EOS R6 Camera Body', desc: 'Full-frame mirrorless, low shutter count', cat: 'Electronics', price: 1899, min: 1850, max: 1950, features: ['Full-frame sensor', 'Only 2K shutter count', 'Dual card slots', 'Includes battery'] },
      { title: 'Supreme Box Logo Hoodie', desc: 'FW22, Black, Size Large, brand new with tags', cat: 'Fashion', price: 650, min: 600, max: 700, features: ['Size Large', 'Never worn', 'Tags attached', 'FW22 release'] },
      { title: 'Instant Pot Duo Plus', desc: '6-quart pressure cooker, barely used', cat: 'Home & Garden', price: 79, min: 70, max: 90, features: ['6-quart capacity', '9-in-1 functions', 'Includes accessories', 'Like new'] },
      { title: 'Nintendo Switch OLED', desc: 'White model, includes Joy-Cons and dock', cat: 'Electronics', price: 299, min: 280, max: 320, features: ['OLED screen', 'White version', 'Original packaging', 'Excellent condition'] },
      { title: 'Adidas Ultraboost 22', desc: 'Women\'s size 8.5, Cloud White, worn twice', cat: 'Fashion', price: 120, min: 110, max: 135, features: ['Size 8.5 women\'s', 'Cloud White colorway', 'Worn twice', 'Boost cushioning'] },
      { title: 'Espresso Machine - Breville Barista', desc: 'Pro model, stainless steel, like new', cat: 'Home & Garden', price: 499, min: 475, max: 525, features: ['Built-in grinder', 'Dual boiler', 'Professional quality', 'Barely used'] },
      { title: 'Yeti Tundra 45 Cooler', desc: 'White, bear-resistant, perfect for camping', cat: 'Sports', price: 275, min: 250, max: 300, features: ['45-quart capacity', 'Bear-resistant', 'Keeps ice for days', 'Excellent condition'] },
      { title: 'Kindle Paperwhite Signature', desc: '32GB, auto-adjusting light, no ads', cat: 'Electronics', price: 139, min: 130, max: 150, features: ['32GB storage', 'Auto-adjusting light', 'No ads', 'Waterproof'] },
      { title: 'Ray-Ban Aviator Sunglasses', desc: 'Classic gold frame, gradient lenses', cat: 'Fashion', price: 120, min: 110, max: 130, features: ['Gold frame', 'Gradient lenses', 'Includes case', 'Authentic'] },
      { title: 'GoPro Hero 11 Black', desc: 'Action camera with accessories bundle', cat: 'Electronics', price: 349, min: 330, max: 370, features: ['5.3K video', 'Waterproof', 'Includes mounts', 'Extra batteries'] },
      { title: 'Lululemon Align Leggings', desc: 'Size 6, Diamond Dye, never worn', cat: 'Fashion', price: 75, min: 70, max: 85, features: ['Size 6', 'Diamond Dye pattern', 'Never worn', 'Tags attached'] },
      { title: 'Weber Genesis II Gas Grill', desc: '3-burner, stainless steel, well maintained', cat: 'Home & Garden', price: 599, min: 550, max: 650, features: ['3 burners', 'Stainless steel', 'Side tables', 'Works perfectly'] },
      { title: 'Apple Watch Series 8 GPS', desc: '45mm, Midnight aluminum, AppleCare+', cat: 'Electronics', price: 329, min: 310, max: 350, features: ['45mm case', 'GPS model', 'AppleCare+ included', 'Like new'] },
      { title: 'Carhartt Duck Canvas Jacket', desc: 'Men\'s XL, brown, classic work jacket', cat: 'Fashion', price: 95, min: 85, max: 110, features: ['Size XL', 'Duck canvas', 'Quilted lining', 'Great condition'] },
      { title: 'Peloton Bike Basic Package', desc: 'Indoor cycling bike, screen included', cat: 'Sports', price: 1200, min: 1100, max: 1300, features: ['HD touchscreen', 'Adjustable seat', 'Clip-in pedals', 'Barely used'] },
      { title: 'Bose SoundLink Revolve+', desc: 'Portable Bluetooth speaker, 360° sound', cat: 'Electronics', price: 199, min: 185, max: 215, features: ['360-degree sound', '16-hour battery', 'Water resistant', 'Excellent bass'] },
      { title: 'Le Creuset Dutch Oven 5.5Qt', desc: 'Cherry red, enameled cast iron, pristine', cat: 'Home & Garden', price: 250, min: 230, max: 270, features: ['5.5-quart capacity', 'Cherry red', 'Cast iron', 'Like new'] },
      { title: 'Oakley Holbrook Sunglasses', desc: 'Matte black frame, Prizm lenses', cat: 'Fashion', price: 110, min: 100, max: 125, features: ['Matte black', 'Prizm lenses', 'Original case', 'Excellent condition'] }
    ];

    return sampleListings.map((item, idx) => {
      const location = locations[idx % locations.length];
      const condition = conditions[idx % conditions.length];
      
      return {
        id: Date.now() + idx,
        title: item.title,
        description: item.desc,
        condition: condition,
        priceMin: item.min,
        priceMax: item.max,
        suggestedPrice: item.price,
        category: item.cat,
        features: item.features,
        images: [generatePlaceholderImage(item.cat, idx)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: location,
        seller: {
          name: `User${1000 + idx}`,
          rating: (4 + Math.random()).toFixed(1),
          sales: Math.floor(Math.random() * 100)
        }
      };
    });
  };

  const generatePlaceholderImage = (category, seed) => {
    const colors = {
      'Electronics': '#6366f1',
      'Fashion': '#ec4899',
      'Home & Garden': '#10b981',
      'Sports': '#f59e0b',
      'Books': '#8b5cf6',
      'Toys & Games': '#ef4444',
      'Automotive': '#3b82f6',
      'Music': '#14b8a6'
    };
    
    const color = colors[category] || '#64748b';
    const svg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="${color}"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="24" fill="white" opacity="0.8">
          ${category}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Messaging functions
  const startConversation = (listing) => {
    const existingConv = conversations.find(c => c.listingId === listing.id);
    if (existingConv) {
      setSelectedConversation(existingConv);
      setView('messages');
      return;
    }

    const newConv = {
      id: Date.now(),
      listingId: listing.id,
      listing: listing,
      seller: listing.seller,
      messages: [],
      offers: []
    };
    
    setConversations([...conversations, newConv]);
    setSelectedConversation(newConv);
    setView('messages');
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: 'buyer',
      timestamp: new Date().toISOString()
    };

    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    ));

    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage]
    });

    setMessageInput('');

    // Simulate seller response
    setTimeout(() => {
      const responses = [
        "Thanks for your interest! Let me know if you have any questions.",
        "Happy to answer any questions about the item!",
        "Feel free to make an offer if you're interested.",
        "I'm flexible on the price. What were you thinking?"
      ];
      
      const sellerMessage = {
        id: Date.now(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'seller',
        timestamp: new Date().toISOString()
      };

      setConversations(conversations.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, messages: [...conv.messages, sellerMessage] }
          : conv
      ));

      setSelectedConversation(prev => ({
        ...prev,
        messages: [...prev.messages, sellerMessage]
      }));
    }, 2000);
  };

  const sendOffer = () => {
    if (!offerAmount || !selectedConversation) return;

    const newOffer = {
      id: Date.now(),
      amount: parseInt(offerAmount),
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, offers: [...conv.offers, newOffer] }
        : conv
    ));

    setSelectedConversation({
      ...selectedConversation,
      offers: [...selectedConversation.offers, newOffer]
    });

    setOfferAmount('');

    // Simulate seller response to offer
    setTimeout(() => {
      const accepted = Math.random() > 0.5;
      const updatedOffer = { ...newOffer, status: accepted ? 'accepted' : 'declined' };

      setConversations(conversations.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, offers: conv.offers.map(o => o.id === newOffer.id ? updatedOffer : o) }
          : conv
      ));

      setSelectedConversation(prev => ({
        ...prev,
        offers: prev.offers.map(o => o.id === newOffer.id ? updatedOffer : o)
      }));
    }, 3000);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImages(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSearchImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSearchImage(event.target.result);
        performImageSearch(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeImages = async () => {
    if (uploadedImages.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                ...uploadedImages.map(img => ({
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: "image/jpeg",
                    data: img.split(',')[1]
                  }
                })),
                {
                  type: "text",
                  text: `Analyze these images of an item being sold. Create a marketplace listing with:
1. A catchy, descriptive title (max 60 chars)
2. A detailed description (2-3 sentences)
3. Condition rating (Excellent/Good/Fair/Poor)
4. Estimated price range in USD
5. Category
6. Key features (3-5 bullet points)

Return ONLY valid JSON in this exact format:
{
  "title": "string",
  "description": "string",
  "condition": "string",
  "priceMin": number,
  "priceMax": number,
  "suggestedPrice": number,
  "category": "string",
  "features": ["string", "string", "string"]
}`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const textContent = data.content.find(item => item.type === 'text')?.text || '';
      
      // Extract JSON from response
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const listingData = JSON.parse(jsonMatch[0]);
        
        const newListing = {
          id: Date.now(),
          ...listingData,
          images: uploadedImages,
          createdAt: new Date().toISOString()
        };
        
        setCurrentListing(newListing);
        setIsEditing(true);
        setView('edit');
      }
    } catch (error) {
      console.error('Error analyzing images:', error);
      alert('Failed to analyze images. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateListingField = (field, value) => {
    setCurrentListing(prev => ({ ...prev, [field]: value }));
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...currentListing.features];
    newFeatures[index] = value;
    setCurrentListing(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setCurrentListing(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setCurrentListing(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const publishListing = () => {
    if (currentListing) {
      setListings(prev => [currentListing, ...prev]);
      setCurrentListing(null);
      setUploadedImages([]);
      setIsEditing(false);
      setView('browse');
    }
  };

  const viewListing = (listing) => {
    setSelectedListing(listing);
    trackView(listing);
    setView('listing');
  };

  const startCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep(1);
    setView('checkout');
  };

  const completeOrder = () => {
    setView('orderComplete');
    setCart([]);
    setShippingInfo({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    });
    setBillingInfo({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    });
  };

  const performImageSearch = async (imageData) => {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: "image/jpeg",
                    data: imageData.split(',')[1]
                  }
                },
                {
                  type: "text",
                  text: "Describe this item in 3-5 keywords for searching. Return only the keywords separated by spaces, no other text."
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const keywords = data.content.find(item => item.type === 'text')?.text || '';
      const cleanKeywords = keywords.trim();
      setSearchQuery(cleanKeywords);
      trackSearch(cleanKeywords);
    } catch (error) {
      console.error('Error analyzing search image:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) trackSearch(query);
  };

  const filteredListings = listings.filter(listing => {
    // Search filter
    if (searchQuery || searchImage) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.category.toLowerCase().includes(query) ||
        listing.features.some(f => f.toLowerCase().includes(query))
      );
      if (!matchesSearch) return false;
    }

    // Location filter
    if (showLocalOnly && userLocation.lat && userLocation.lng) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        listing.location.lat,
        listing.location.lng
      );
      if (distance > searchRadius) return false;
    }

    return true;
  });

  const conditionColors = {
    'Excellent': 'bg-emerald-500',
    'Good': 'bg-blue-500',
    'Fair': 'bg-amber-500',
    'Poor': 'bg-red-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  QuickList AI
                </h1>
                <p className="text-xs text-slate-400">Intelligent Marketplace</p>
              </div>
            </div>
            
            <nav className="flex gap-2 items-center">
              <button
                onClick={() => setView('create')}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  view === 'create' 
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Sell
              </button>
              <button
                onClick={() => setView('browse')}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  view === 'browse' 
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Search className="w-4 h-4 inline mr-2" />
                Browse
              </button>
              <button
                onClick={() => setView('messages')}
                className={`relative px-5 py-2.5 rounded-lg font-medium transition-all ${
                  view === 'messages' 
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Messages
                {conversations.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-fuchsia-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {conversations.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setView('cart')}
                className="relative px-5 py-2.5 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
              >
                <ShoppingCart className="w-4 h-4 inline mr-2" />
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* HOME PAGE */}
        {view === 'home' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h2 className="text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Welcome to the Future
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  of Selling
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
                Upload photos, let AI create your listing, and start selling in seconds. 
                The smartest way to buy and sell anything.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setView('create')}
                  className="px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-semibold text-lg hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-lg shadow-violet-500/25 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Start Selling
                </button>
                <button
                  onClick={() => setView('browse')}
                  className="px-8 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Browse Items
                </button>
              </div>
            </div>

            {/* Personalized Recommendations */}
            {listings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Recommended For You</h3>
                    <p className="text-slate-400">Based on your browsing history</p>
                  </div>
                  <button
                    onClick={() => setView('browse')}
                    className="text-violet-400 hover:text-violet-300 font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getPersonalizedListings().map(listing => (
                    <ListingCard key={listing.id} listing={listing} onView={viewListing} userLocation={userLocation} showDistance={showLocalOnly} />
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center p-8 rounded-2xl bg-slate-900/30 border border-slate-800">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-violet-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Smart Photo Analysis</h4>
                <p className="text-slate-400">AI examines your photos to generate accurate descriptions and pricing</p>
              </div>
              <div className="text-center p-8 rounded-2xl bg-slate-900/30 border border-slate-800">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-fuchsia-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Instant Listings</h4>
                <p className="text-slate-400">From upload to published in under a minute with AI-powered automation</p>
              </div>
              <div className="text-center p-8 rounded-2xl bg-slate-900/30 border border-slate-800">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <Search className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Visual Search</h4>
                <p className="text-slate-400">Find items by uploading photos or searching by keywords</p>
              </div>
            </div>
          </div>
        )}

        {/* CREATE LISTING PAGE */}
        {view === 'create' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Upload. Analyze. Sell.
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                AI-powered listing creation that analyzes your photos and generates professional descriptions instantly
              </p>
            </div>

            {/* Upload Area */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {uploadedImages.length === 0 ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-700 rounded-2xl p-16 hover:border-violet-500/50 hover:bg-slate-900/50 transition-all group"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-10 h-10 text-violet-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">Add Photos of Your Item</h3>
                    <p className="text-slate-400 mb-4">Upload multiple angles for best results</p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 text-white rounded-lg font-medium group-hover:bg-violet-600 transition-colors">
                      <ImagePlus className="w-5 h-5" />
                      Choose Files
                    </div>
                  </div>
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                        <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-slate-700 rounded-xl hover:border-violet-500/50 hover:bg-slate-900/50 transition-all flex items-center justify-center group"
                    >
                      <div className="text-center">
                        <Plus className="w-8 h-8 text-slate-400 group-hover:text-violet-400 mx-auto mb-2 transition-colors" />
                        <span className="text-sm text-slate-400 group-hover:text-violet-400 transition-colors">Add More</span>
                      </div>
                    </button>
                  </div>

                  <button
                    onClick={analyzeImages}
                    disabled={isAnalyzing}
                    className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-semibold text-lg hover:from-violet-600 hover:to-fuchsia-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-violet-500/25"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        Generate Listing with AI
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* EDIT LISTING PAGE */}
        {view === 'edit' && currentListing && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Edit Your Listing</h2>
              <button
                onClick={() => { setView('create'); setCurrentListing(null); setIsEditing(false); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6 backdrop-blur-xl">
              {/* Image Gallery */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">Product Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentListing.images.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                      <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                <input
                  type="text"
                  value={currentListing.title}
                  onChange={(e) => updateListingField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500/50 transition-all"
                  placeholder="Enter listing title..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                <textarea
                  value={currentListing.description}
                  onChange={(e) => updateListingField('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                  placeholder="Describe your item..."
                />
              </div>

              {/* Condition and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Condition</label>
                  <select
                    value={currentListing.condition}
                    onChange={(e) => updateListingField('condition', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500/50 transition-all"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                  <input
                    type="text"
                    value={currentListing.category}
                    onChange={(e) => updateListingField('category', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500/50 transition-all"
                    placeholder="e.g., Electronics, Fashion, Home & Garden"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Minimum Price ($)</label>
                  <input
                    type="number"
                    value={currentListing.priceMin}
                    onChange={(e) => updateListingField('priceMin', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Maximum Price ($)</label>
                  <input
                    type="number"
                    value={currentListing.priceMax}
                    onChange={(e) => updateListingField('priceMax', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Suggested Price ($)</label>
                  <input
                    type="number"
                    value={currentListing.suggestedPrice}
                    onChange={(e) => updateListingField('suggestedPrice', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">Key Features</label>
                <div className="space-y-3">
                  {currentListing.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(idx, e.target.value)}
                        className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500/50 transition-all"
                        placeholder={`Feature ${idx + 1}`}
                      />
                      <button
                        onClick={() => removeFeature(idx)}
                        className="px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addFeature}
                    className="w-full py-3 border-2 border-dashed border-slate-700 text-slate-400 rounded-lg hover:border-violet-500/50 hover:text-violet-400 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Feature
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-800">
                <button
                  onClick={() => setView('preview')}
                  className="flex-1 py-3 border border-slate-700 text-slate-300 rounded-xl font-semibold hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Preview
                </button>
                <button
                  onClick={publishListing}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Publish Listing
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'preview' && currentListing && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Preview Your Listing</h2>
              <button
                onClick={() => { setView('home'); setCurrentListing(null); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
              {/* Image Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2">
                {currentListing.images.map((img, idx) => (
                  <div key={idx} className={`${idx === 0 ? 'col-span-2 md:col-span-2 row-span-2' : ''} aspect-square rounded-xl overflow-hidden`}>
                    <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Listing Details */}
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${conditionColors[currentListing.condition]}`}>
                        {currentListing.condition}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                        {currentListing.category}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{currentListing.title}</h3>
                    <p className="text-slate-300 text-lg leading-relaxed">{currentListing.description}</p>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800/50 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-medium text-slate-400">Suggested Price</span>
                      </div>
                      <p className="text-3xl font-bold text-white">${currentListing.suggestedPrice}</p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-medium text-slate-400">Price Range</span>
                      </div>
                      <p className="text-2xl font-bold text-white">${currentListing.priceMin} - ${currentListing.priceMax}</p>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-5 h-5 text-violet-400" />
                        <span className="text-sm font-medium text-slate-400">Category</span>
                      </div>
                      <p className="text-xl font-bold text-white">{currentListing.category}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Key Features</h4>
                  <ul className="space-y-2">
                    {currentListing.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => setView('edit')}
                    className="flex-1 py-3 border border-slate-700 text-slate-300 rounded-xl font-semibold hover:bg-slate-800/50 transition-all"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={publishListing}
                    className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-lg shadow-violet-500/25"
                  >
                    Publish Listing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'browse' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search listings by keyword..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
                
                <input
                  ref={searchImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSearchImageUpload}
                  className="hidden"
                />
                
                <button
                  onClick={() => searchImageRef.current?.click()}
                  className={`px-6 py-4 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    searchImage 
                      ? 'bg-violet-500 text-white' 
                      : 'bg-slate-900/50 border border-slate-800 text-slate-300 hover:border-violet-500/50'
                  }`}
                >
                  <Image className="w-5 h-5" />
                  {searchImage ? 'Clear' : 'Image Search'}
                </button>
              </div>

              {/* Location Filter */}
              <div className="flex gap-3 items-center">
                <div className="flex-1 flex gap-3">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="ZIP Code or City"
                      value={userLocation.zipCode}
                      onChange={(e) => setUserLocation({...userLocation, zipCode: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                  
                  <select
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                    className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-violet-500/50 transition-all"
                  >
                    <option value={5}>5 miles</option>
                    <option value={10}>10 miles</option>
                    <option value={25}>25 miles</option>
                    <option value={50}>50 miles</option>
                    <option value={100}>100 miles</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowLocalOnly(!showLocalOnly)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    showLocalOnly
                      ? 'bg-violet-500 text-white'
                      : 'bg-slate-900/50 border border-slate-800 text-slate-300 hover:border-violet-500/50'
                  }`}
                >
                  <Navigation className="w-5 h-5" />
                  Local Only
                </button>
              </div>
              
              {searchImage && (
                <div className="mt-4 flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <img src={searchImage} alt="Search" className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Searching for similar items</p>
                    <p className="text-xs text-slate-400">Query: {searchQuery}</p>
                  </div>
                  <button
                    onClick={() => { setSearchImage(null); setSearchQuery(''); }}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800/50 flex items-center justify-center">
                  <Search className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">No listings yet</h3>
                <p className="text-slate-400 mb-6">Create your first listing to get started</p>
                <button
                  onClick={() => setView('home')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} onView={viewListing} userLocation={userLocation} showDistance={showLocalOnly} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* INDIVIDUAL LISTING PAGE */}
        {view === 'listing' && selectedListing && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            <button
              onClick={() => setView('browse')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Browse
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-800">
                  <img src={selectedListing.images[0]} alt={selectedListing.title} className="w-full h-full object-cover" />
                </div>
                {selectedListing.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {selectedListing.images.slice(1).map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-slate-800">
                        <img src={img} alt={`${selectedListing.title} ${idx + 2}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Listing Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${conditionColors[selectedListing.condition]}`}>
                      {selectedListing.condition}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                      {selectedListing.category}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4">{selectedListing.title}</h1>
                  <p className="text-2xl font-bold text-violet-400 mb-6">${selectedListing.suggestedPrice}</p>
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">{selectedListing.description}</p>
                </div>

                {/* Seller Info */}
                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Seller Information</h3>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{selectedListing.seller.name}</p>
                          <p className="text-xs text-slate-400">{selectedListing.seller.sales} sales</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-white font-semibold">{selectedListing.seller.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-violet-400" />
                    <span>{selectedListing.location.city}, {selectedListing.location.state}</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {selectedListing.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-400">Price Range</span>
                      <span className="text-lg font-bold text-white">${selectedListing.priceMin} - ${selectedListing.priceMax}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => startConversation(selectedListing)}
                    className="flex-1 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-semibold text-lg hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Make Offer
                  </button>
                  <button
                    onClick={() => addToCart(selectedListing)}
                    className="flex-1 py-4 border-2 border-violet-500 text-violet-300 rounded-xl font-semibold text-lg hover:bg-violet-500/10 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button className="px-6 py-4 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800/50 transition-all">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CART PAGE */}
        {view === 'cart' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-white">Shopping Cart</h2>

            {cart.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800/50 flex items-center justify-center">
                  <ShoppingCart className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h3>
                <p className="text-slate-400 mb-6">Add some items to get started</p>
                <button
                  onClick={() => setView('browse')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors"
                >
                  Browse Items
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex gap-6">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-slate-400 text-sm mb-2 line-clamp-1">{item.description}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${conditionColors[item.condition]}`}>
                          {item.condition}
                        </span>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <p className="text-2xl font-bold text-white">${item.suggestedPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium text-slate-400">Subtotal</span>
                    <span className="text-2xl font-bold text-white">${cartTotal}</span>
                  </div>
                  <button
                    onClick={startCheckout}
                    className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-semibold text-lg hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-lg shadow-violet-500/25"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHECKOUT PAGE */}
        {view === 'checkout' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-white">Checkout</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${checkoutStep >= 1 ? 'bg-violet-500' : 'bg-slate-700'}`}>
                      <Truck className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Shipping Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                      className="col-span-2 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className="col-span-2 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${checkoutStep >= 2 ? 'bg-violet-500' : 'bg-slate-700'}`}>
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Payment Information</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={billingInfo.cardNumber}
                      onChange={(e) => setBillingInfo({...billingInfo, cardNumber: e.target.value})}
                      className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                    />
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={billingInfo.cardName}
                      onChange={(e) => setBillingInfo({...billingInfo, cardName: e.target.value})}
                      className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={billingInfo.expiryDate}
                        onChange={(e) => setBillingInfo({...billingInfo, expiryDate: e.target.value})}
                        className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={billingInfo.cvv}
                        onChange={(e) => setBillingInfo({...billingInfo, cvv: e.target.value})}
                        className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.title}</p>
                          <p className="text-slate-400 text-xs">${item.suggestedPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-800 pt-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-white font-semibold">${cartTotal}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400">Shipping</span>
                      <span className="text-white font-semibold">$0</span>
                    </div>
                    <div className="flex items-center justify-between text-lg">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-white font-bold">${cartTotal}</span>
                    </div>
                  </div>
                  <button
                    onClick={completeOrder}
                    className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-lg shadow-violet-500/25"
                  >
                    Complete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MESSAGES PAGE */}
        {view === 'messages' && (
          <div className="max-w-6xl mx-auto animate-fadeIn">
            <h2 className="text-3xl font-bold text-white mb-8">Messages</h2>

            {conversations.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800/50 flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">No conversations yet</h3>
                <p className="text-slate-400 mb-6">Start a conversation by making an offer on a listing</p>
                <button
                  onClick={() => setView('browse')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors"
                >
                  Browse Listings
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversations List */}
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-lg font-semibold text-white mb-4">Conversations</h3>
                  {conversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedConversation?.id === conv.id
                          ? 'bg-violet-500/20 border border-violet-500/50'
                          : 'bg-slate-900/50 border border-slate-800 hover:border-violet-500/30'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                          <img src={conv.listing.images[0]} alt={conv.listing.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">{conv.listing.title}</p>
                          <p className="text-sm text-slate-400 truncate">{conv.seller.name}</p>
                          {conv.messages.length > 0 && (
                            <p className="text-xs text-slate-500 truncate mt-1">
                              {conv.messages[conv.messages.length - 1].text}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Window */}
                <div className="lg:col-span-2">
                  {selectedConversation ? (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden h-[600px] flex flex-col">
                      {/* Chat Header */}
                      <div className="p-6 border-b border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800">
                            <img
                              src={selectedConversation.listing.images[0]}
                              alt={selectedConversation.listing.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white">{selectedConversation.listing.title}</h3>
                            <p className="text-slate-400">{selectedConversation.seller.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-violet-400">${selectedConversation.listing.suggestedPrice}</p>
                            <p className="text-xs text-slate-500">Listed price</p>
                          </div>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {selectedConversation.messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                                msg.sender === 'buyer'
                                  ? 'bg-violet-500 text-white'
                                  : 'bg-slate-800 text-slate-200'
                              }`}
                            >
                              <p>{msg.text}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Offers */}
                        {selectedConversation.offers.map((offer, idx) => (
                          <div key={idx} className="flex justify-center">
                            <div className={`px-6 py-4 rounded-xl border-2 ${
                              offer.status === 'accepted'
                                ? 'border-emerald-500 bg-emerald-500/10'
                                : offer.status === 'declined'
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-violet-500 bg-violet-500/10'
                            }`}>
                              <div className="flex items-center gap-3">
                                {offer.status === 'accepted' && <Check className="w-5 h-5 text-emerald-400" />}
                                {offer.status === 'declined' && <XCircle className="w-5 h-5 text-red-400" />}
                                {offer.status === 'pending' && <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />}
                                <div>
                                  <p className="font-semibold text-white">Offer: ${offer.amount}</p>
                                  <p className="text-sm text-slate-400">
                                    {offer.status === 'accepted' && 'Accepted by seller'}
                                    {offer.status === 'declined' && 'Declined by seller'}
                                    {offer.status === 'pending' && 'Waiting for response...'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Make Offer Section */}
                      <div className="p-6 border-t border-slate-800 space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={offerAmount}
                            onChange={(e) => setOfferAmount(e.target.value)}
                            placeholder="Enter offer amount"
                            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                          />
                          <button
                            onClick={sendOffer}
                            disabled={!offerAmount}
                            className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <DollarSign className="w-5 h-5" />
                            Send Offer
                          </button>
                        </div>

                        {/* Message Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                          />
                          <button
                            onClick={sendMessage}
                            disabled={!messageInput.trim()}
                            className="px-6 py-3 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl h-[600px] flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">Select a conversation to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORDER COMPLETE PAGE */}
        {view === 'orderComplete' && (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fadeIn py-12">
            <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Order Complete!</h2>
              <p className="text-xl text-slate-400">Thank you for your purchase</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <p className="text-slate-300 mb-6">Your order has been successfully placed. You will receive a confirmation email shortly with tracking information.</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setView('home')}
                  className="px-6 py-3 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => setView('browse')}
                  className="px-6 py-3 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800/50 transition-all"
                >
                  Browse More
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

// Reusable ListingCard Component
function ListingCard({ listing, onView, userLocation, showDistance }) {
  const conditionColors = {
    'Excellent': 'bg-emerald-500',
    'Good': 'bg-blue-500',
    'Fair': 'bg-amber-500',
    'Poor': 'bg-red-500'
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const distance = showDistance && userLocation?.lat && userLocation?.lng
    ? calculateDistance(userLocation.lat, userLocation.lng, listing.location.lat, listing.location.lng)
    : null;

  return (
    <div
      onClick={() => onView(listing)}
      className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all group cursor-pointer backdrop-blur-xl"
    >
      <div className="aspect-square overflow-hidden bg-slate-800 relative">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {distance !== null && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-slate-900/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-white flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {distance.toFixed(1)} mi
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${conditionColors[listing.condition]}`}>
            {listing.condition}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
            {listing.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{listing.title}</h3>
        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{listing.description}</p>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <MapPin className="w-3 h-3" />
          <span>{listing.location.city}, {listing.location.state}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">${listing.suggestedPrice}</p>
            <p className="text-xs text-slate-500">${listing.priceMin} - ${listing.priceMax}</p>
          </div>
          <button className="px-4 py-2 bg-violet-500/20 text-violet-300 rounded-lg font-medium hover:bg-violet-500/30 transition-colors">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
