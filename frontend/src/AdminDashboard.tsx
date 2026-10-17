import React, { useState, useMemo } from 'react';
import type { SessionOrder } from './OrderTracking';
import './admin.css';

// SVG Icons (Clean & recognizable)
function AdminIcon({ name, size = 18 }: { name: string; size?: number }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>,
    orders: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
    menu: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></>,
    categories: <><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M14 14h7v7h-7z"/><path d="M3 14h7v7H3z"/></>,
    tables: <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" x2="9" y1="4" y2="20"/><line x1="15" x2="15" y1="4" y2="20"/></>,
    staff: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></>,
    reports: <><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    plus: <><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    edit: <><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    close: <><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name] || icons.dashboard}
    </svg>
  );
}

const money = (n: number) => `ETB ${n.toLocaleString()}`;

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  tag?: string;
  portions?: { name: string; price: number }[];
  extras?: { name: string; price: number }[];
};

const defaultDishes: MenuItem[] = [
  {
    id: 1,
    name: 'Doro Wat',
    description: 'Slow-cooked chicken in berbere sauce with boiled egg and injera.',
    price: 680,
    category: 'Ethiopian Food',
    image: 'photo-1746716447103-e1618bbd0669',
    available: true,
    tag: 'House favourite',
    portions: [{ name: 'Regular', price: 0 }, { name: 'Large', price: 180 }],
    extras: [{ name: 'Extra egg', price: 60 }, { name: 'Extra injera', price: 45 }]
  },
  {
    id: 2,
    name: 'Sizzling Beef Tibs',
    description: 'Tender beef sautéed with rosemary, peppers and fresh injera.',
    price: 720,
    category: 'Ethiopian Food',
    image: 'photo-1544025162-d76694265947',
    available: true,
    tag: 'Popular',
    portions: [{ name: 'Regular', price: 0 }, { name: 'Large', price: 200 }],
    extras: [{ name: 'Extra injera', price: 45 }, { name: 'Awaze sauce', price: 40 }]
  },
  {
    id: 3,
    name: 'The Garden Beyaynetu',
    description: 'Colourful combination of lentils and spiced vegetables on injera.',
    price: 460,
    category: 'Ethiopian Food',
    image: 'photo-1593252719532-53f183016149',
    available: true,
    tag: 'Plant-based'
  },
  {
    id: 4,
    name: 'Herb-Grilled Chicken',
    description: 'Flame-grilled chicken served with seasonal garden vegetables.',
    price: 650,
    category: 'Main Courses',
    image: 'photo-1670398564097-0762e1b30b3a',
    available: true
  },
  {
    id: 5,
    name: 'Abay Signature Burger',
    description: 'Grilled beef patty, cheddar, caramelised onions and fries.',
    price: 580,
    category: 'Burgers',
    image: 'photo-1568901346375-23c9450c58cd',
    available: true,
    portions: [{ name: 'Single patty', price: 0 }, { name: 'Double patty', price: 160 }],
    extras: [{ name: 'Extra cheese', price: 50 }, { name: 'Extra fries', price: 90 }]
  },
  {
    id: 6,
    name: 'Garden Margherita',
    description: 'Stone-baked pizza dough, fresh tomatoes, mozzarella and basil.',
    price: 620,
    category: 'Pizza',
    image: 'photo-1574071318508-1cdbab80d002',
    available: true,
    tag: 'Vegetarian'
  },
  {
    id: 7,
    name: 'Fresh Mango Juice',
    description: 'Freshly squeezed sweet ripe mango with no added sugar.',
    price: 180,
    category: 'Drinks',
    image: 'photo-1622597467836-f3285f2131b8',
    available: true
  },
  {
    id: 8,
    name: 'Chocolate Indulgence',
    description: 'Warm chocolate cake with soft centre and vanilla ice cream.',
    price: 320,
    category: 'Desserts',
    image: 'photo-1578985545062-69928b1d9587',
    available: false,
    tag: 'Sold Out'
  },
  {
    id: 9,
    name: 'Morning Shakshuka',
    description: 'Eggs slow-cooked in spiced tomato sauce with sourdough bread.',
    price: 340,
    category: 'Breakfast',
    image: 'photo-1525351484163-7529414344d8',
    available: true
  }
];

const initialCategories = [
  'All Items',
  'Ethiopian Food',
  'Main Courses',
  'Breakfast',
  'Burgers',
  'Pizza',
  'Drinks',
  'Desserts'
];

type Props = {
  sharedOrders: SessionOrder[];
  onUpdateOrders: (orders: SessionOrder[]) => void;
  onNavigateToCustomer: () => void;
};

export default function AdminDashboard({ sharedOrders, onUpdateOrders, onNavigateToCustomer }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'categories'>('overview');
  const [dishes, setDishes] = useState<MenuItem[]>(defaultDishes);
  const [categories, setCategories] = useState<string[]>(initialCategories);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchFood, setSearchFood] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'soldout'>('all');

  // Modals & Drawers
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [previewItem, setPreviewItem] = useState<MenuItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // 1-Click Availability Toggle
  const toggleAvailability = (id: number) => {
    setDishes(prev =>
      prev.map(d => {
        if (d.id === id) {
          const nextState = !d.available;
          showToast(`${d.name} marked as ${nextState ? 'Available' : 'Sold Out'}`);
          return { ...d, available: nextState };
        }
        return d;
      })
    );
  };

  // Filtered Food List
  const filteredDishes = useMemo(() => {
    return dishes.filter(d => {
      const matchesCat = selectedCategory === 'All Items' || d.category === selectedCategory;
      const matchesSearch =
        d.name.toLowerCase().includes(searchFood.toLowerCase()) ||
        d.description.toLowerCase().includes(searchFood.toLowerCase());
      const matchesAvail =
        availabilityFilter === 'all'
          ? true
          : availabilityFilter === 'available'
          ? d.available
          : !d.available;
      return matchesCat && matchesSearch && matchesAvail;
    });
  }, [dishes, selectedCategory, searchFood, availabilityFilter]);

  // Open Form to Add New Dish
  const handleOpenAdd = () => {
    setIsNewItem(true);
    setEditingItem({
      id: Date.now(),
      name: '',
      description: '',
      price: 350,
      category: 'Ethiopian Food',
      image: 'photo-1544025162-d76694265947',
      available: true,
      portions: [{ name: 'Regular', price: 0 }],
      extras: []
    });
  };

  // Save Item (Create or Update)
  const handleSaveItem = () => {
    if (!editingItem) return;
    if (!editingItem.name.trim()) {
      showToast('Please enter a food name');
      return;
    }
    if (!editingItem.price || editingItem.price <= 0) {
      showToast('Please enter a valid price in ETB');
      return;
    }

    if (isNewItem) {
      setDishes([editingItem, ...dishes]);
      showToast(`${editingItem.name} added to menu!`);
    } else {
      setDishes(dishes.map(d => (d.id === editingItem.id ? editingItem : d)));
      showToast(`${editingItem.name} updated!`);
    }
    setEditingItem(null);
  };

  // Delete Dish
  const handleDeleteItem = (id: number, name: string) => {
    setDishes(dishes.filter(d => d.id !== id));
    showToast(`${name} removed from menu`);
  };

  // Category Add
  const handleAddCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      showToast('This category already exists');
      return;
    }
    setCategories([...categories, trimmed]);
    setNewCatName('');
    showToast(`Category "${trimmed}" created!`);
  };

  // Category Delete
  const handleConfirmDeleteCategory = () => {
    if (!deletingCategory) return;
    const count = dishes.filter(d => d.category === deletingCategory).length;
    if (count > 0) {
      showToast(`Cannot delete "${deletingCategory}": Reassign the ${count} dishes first`);
      setDeletingCategory(null);
      return;
    }
    setCategories(categories.filter(c => c !== deletingCategory));
    showToast(`Category "${deletingCategory}" deleted`);
    setDeletingCategory(null);
  };

  return (
    <div className="admin-shell">
      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <a href="#" className="admin-brand" onClick={e => { e.preventDefault(); setActiveTab('overview'); }}>
            <span style={{ color: 'var(--gold)' }}>gebeta</span>QR
            <span className="admin-brand-badge">Admin</span>
          </a>
          <div className="admin-restaurant-selector" title="Active Branch">
            <div>
              <strong>Abay Kitchen</strong>
              <small>Bole · Addis Ababa</small>
            </div>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Restaurant Management Menu">
          <button
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
          >
            <AdminIcon name="dashboard" size={18} />
            <span>Overview</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
          >
            <AdminIcon name="orders" size={18} />
            <span>Orders</span>
            {sharedOrders.filter(o => o.status === 'Received').length > 0 && (
              <span className="admin-nav-badge">{sharedOrders.filter(o => o.status === 'Received').length}</span>
            )}
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => { setActiveTab('menu'); setMobileMenuOpen(false); }}
          >
            <AdminIcon name="menu" size={18} />
            <span>Food Menu</span>
            <span className="admin-nav-badge" style={{ background: '#23734b', color: '#fff' }}>{dishes.length}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }}
          >
            <AdminIcon name="categories" size={18} />
            <span>Categories</span>
          </button>

          <button className="admin-nav-item" onClick={() => showToast('Table QR Code Generator (Coming in 03C)')}>
            <AdminIcon name="tables" size={18} />
            <span>Tables & QR</span>
            <span className="admin-nav-soon">03C</span>
          </button>

          <button className="admin-nav-item" onClick={() => showToast('Staff Accounts (Coming in 03D)')}>
            <AdminIcon name="staff" size={18} />
            <span>Staff</span>
            <span className="admin-nav-soon">03D</span>
          </button>

          <button className="admin-nav-item" onClick={() => showToast('Sales Reports (Coming in 03E)')}>
            <AdminIcon name="reports" size={18} />
            <span>Reports</span>
            <span className="admin-nav-soon">03E</span>
          </button>

          <button className="admin-nav-item" onClick={() => showToast('Settings (Coming in 03F)')}>
            <AdminIcon name="settings" size={18} />
            <span>Settings</span>
            <span className="admin-nav-soon">03F</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <span className="admin-user-avatar">AB</span>
            <div className="admin-user-info">
              <span className="admin-user-name">Abebe Bekele</span>
              <span className="admin-user-role">Manager</span>
            </div>
            <button
              className="admin-logout-btn"
              title="Sign Out"
              onClick={() => showToast('Signed out (demo)')}
              aria-label="Sign out"
            >
              <AdminIcon name="logout" size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <AdminIcon name="dashboard" size={18} />
            </button>
            <div className="admin-breadcrumb">
              <span>Abay Kitchen</span>
              <span>/</span>
              <strong>
                {activeTab === 'overview'
                  ? 'Overview'
                  : activeTab === 'orders'
                  ? 'Orders'
                  : activeTab === 'menu'
                  ? 'Food Menu'
                  : 'Categories'}
              </strong>
            </div>
          </div>

          <div className="admin-topbar-right">
            <button className="admin-live-link" onClick={onNavigateToCustomer} title="View live customer menu">
              <AdminIcon name="external" size={14} />
              <span>Customer Menu (Table 08)</span>
            </button>
          </div>
        </header>

        <main className="admin-content">
          {/* =========================================================
              TAB 1: MENU MANAGEMENT (03B)
             ========================================================= */}
          {activeTab === 'menu' && (
            <>
              <div className="admin-page-header">
                <div>
                  <h1>Menu Management</h1>
                  <p>Add new dishes, change prices, and toggle available items instantly.</p>
                </div>
                <button className="admin-action-btn primary" onClick={handleOpenAdd} style={{ minHeight: '44px', padding: '0 20px' }}>
                  <AdminIcon name="plus" size={16} />
                  <span>Add New Dish</span>
                </button>
              </div>

              {/* Filter and Search Bar */}
              <div className="admin-orders-controls">
                <div className="admin-status-tabs">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`admin-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      <span>{cat}</span>
                      <span className="admin-tab-count">
                        {cat === 'All Items' ? dishes.length : dishes.filter(d => d.category === cat).length}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="admin-filter-row">
                  <div className="admin-search-input">
                    <AdminIcon name="search" size={16} />
                    <input
                      type="text"
                      placeholder="Search food name…"
                      value={searchFood}
                      onChange={e => setSearchFood(e.target.value)}
                    />
                  </div>

                  <select
                    className="admin-select"
                    value={availabilityFilter}
                    onChange={e => setAvailabilityFilter(e.target.value as any)}
                  >
                    <option value="all">All Items</option>
                    <option value="available">Only Available</option>
                    <option value="soldout">Only Sold Out</option>
                  </select>
                </div>
              </div>

              {/* Spacious Dish Cards Grid */}
              <div className="admin-menu-grid">
                {filteredDishes.map(dish => (
                  <div className={`admin-food-card ${!dish.available ? 'unavailable' : ''}`} key={dish.id}>
                    <div className="admin-food-thumb">
                      <img src={`https://images.unsplash.com/${dish.image}?w=500&auto=format&fit=crop&q=80`} alt={dish.name} />
                      {dish.tag && <span className="admin-food-tag">{dish.tag}</span>}
                      {!dish.available && <div className="admin-soldout-badge">TEMPORARILY SOLD OUT</div>}
                    </div>

                    <div className="admin-food-body">
                      <div className="admin-food-title-row">
                        <h3>{dish.name}</h3>
                        <span className="admin-food-category-badge">{dish.category}</span>
                      </div>
                      <p className="admin-food-desc">{dish.description}</p>

                      <div className="admin-food-meta">
                        <span className="admin-food-price">{money(dish.price)}</span>
                        {/* 1-Click Availability Switch */}
                        <div className="admin-toggle-wrap">
                          <button
                            className={`admin-toggle ${dish.available ? 'on' : ''}`}
                            onClick={() => toggleAvailability(dish.id)}
                            title={dish.available ? 'Click to mark as Sold Out' : 'Click to make Available'}
                            aria-label={`Toggle availability for ${dish.name}`}
                          >
                            <span className="admin-toggle-knob" />
                          </button>
                          <span style={{ color: dish.available ? '#23734b' : '#b83b3b' }}>
                            {dish.available ? 'Available' : 'Sold Out'}
                          </span>
                        </div>
                      </div>

                      <div className="admin-food-actions">
                        <button
                          className="admin-action-btn secondary"
                          onClick={() => setPreviewItem(dish)}
                          title="Preview how this appears to customers"
                        >
                          <AdminIcon name="eye" size={14} /> Preview
                        </button>
                        <button
                          className="admin-action-btn secondary"
                          onClick={() => { setIsNewItem(false); setEditingItem({ ...dish }); }}
                          title="Edit dish details"
                        >
                          <AdminIcon name="edit" size={14} /> Edit
                        </button>
                        <button
                          className="admin-action-btn danger"
                          onClick={() => handleDeleteItem(dish.id, dish.name)}
                          title="Delete dish"
                        >
                          <AdminIcon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDishes.length === 0 && (
                <div className="admin-empty-state">
                  <AdminIcon name="menu" size={40} />
                  <h3>No dishes found</h3>
                  <p>Try clearing your search or category filter.</p>
                  <button className="admin-action-btn secondary" onClick={() => { setSearchFood(''); setSelectedCategory('All Items'); }}>
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}

          {/* =========================================================
              TAB 2: CATEGORY MANAGEMENT (03B)
             ========================================================= */}
          {activeTab === 'categories' && (
            <>
              <div className="admin-page-header">
                <div>
                  <h1>Menu Categories</h1>
                  <p>Organize how dishes appear to customers browsing on their phones.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="New category name…"
                    className="admin-select"
                    style={{ width: '220px' }}
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                  />
                  <button className="admin-action-btn primary" onClick={handleAddCategory}>
                    <AdminIcon name="plus" size={15} /> Add Category
                  </button>
                </div>
              </div>

              <div className="admin-category-grid">
                {categories.filter(c => c !== 'All Items').map(cat => {
                  const count = dishes.filter(d => d.category === cat).length;
                  return (
                    <div className="admin-category-card" key={cat}>
                      <div className="admin-category-card-top">
                        <div>
                          <h3>{cat}</h3>
                          <p>{count} dish{count === 1 ? '' : 'es'} in menu</p>
                        </div>
                        <span className="admin-category-count">{count} items</span>
                      </div>

                      <div className="admin-category-actions">
                        <button
                          className="admin-action-btn secondary"
                          style={{ flex: 1 }}
                          onClick={() => { setSelectedCategory(cat); setActiveTab('menu'); }}
                        >
                          View Dishes
                        </button>
                        <button
                          className="admin-action-btn danger"
                          onClick={() => setDeletingCategory(cat)}
                          title="Delete category"
                        >
                          <AdminIcon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* =========================================================
              TAB 3: ORDERS MANAGEMENT (03A - Reusable, Uncluttered)
             ========================================================= */}
          {activeTab === 'orders' && (
            <>
              <div className="admin-page-header">
                <div>
                  <h1>Table Orders</h1>
                  <p>Real-time orders received from table QR codes.</p>
                </div>
                <button
                  className="admin-action-btn secondary"
                  onClick={() => {
                    const ref = `DEMO-AK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                    onUpdateOrders([{
                      reference: ref,
                      placedAt: new Date().toISOString(),
                      status: 'Received',
                      lines: [{
                        key: `item-${Date.now()}`,
                        dish: dishes[0],
                        quantity: 1,
                        unitPrice: dishes[0].price,
                        portion: 'Regular',
                        extras: [],
                        instructions: 'Table request'
                      }]
                    }, ...sharedOrders]);
                    showToast('New order placed at Table 08!');
                  }}
                >
                  + Simulate Incoming Order
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ORDER REF</th>
                      <th>TABLE</th>
                      <th>ITEMS</th>
                      <th>TOTAL</th>
                      <th>STATUS</th>
                      <th style={{ textAlign: 'right' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharedOrders.map(order => (
                      <tr key={order.reference}>
                        <td className="admin-order-ref">
                          <strong>{order.reference}</strong>
                          <small>{new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                        </td>
                        <td><span className="admin-table-tag">Table 08</span></td>
                        <td className="admin-items-summary">
                          <strong>{order.lines.reduce((n, l) => n + l.quantity, 0)} items</strong>
                          <p>{order.lines.map(l => `${l.quantity}× ${l.dish.name}`).join(', ')}</p>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--brand)' }}>
                          {money(order.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0))}
                        </td>
                        <td>
                          <span className={`admin-status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {order.status === 'Received' && (
                            <button
                              className="admin-action-btn primary"
                              onClick={() => {
                                onUpdateOrders(sharedOrders.map(o => o.reference === order.reference ? { ...o, status: 'Accepted' } : o));
                                showToast(`Order ${order.reference} accepted!`);
                              }}
                            >
                              Accept
                            </button>
                          )}
                          {order.status === 'Accepted' && (
                            <button
                              className="admin-action-btn primary"
                              onClick={() => {
                                onUpdateOrders(sharedOrders.map(o => o.reference === order.reference ? { ...o, status: 'Preparing' } : o));
                                showToast(`Order ${order.reference} preparing`);
                              }}
                            >
                              Start Prep
                            </button>
                          )}
                          {order.status === 'Preparing' && (
                            <button
                              className="admin-action-btn primary"
                              onClick={() => {
                                onUpdateOrders(sharedOrders.map(o => o.reference === order.reference ? { ...o, status: 'Ready' } : o));
                                showToast(`Order ${order.reference} marked ready!`);
                              }}
                            >
                              Mark Ready
                            </button>
                          )}
                          {order.status === 'Ready' && (
                            <button
                              className="admin-action-btn secondary"
                              onClick={() => {
                                onUpdateOrders(sharedOrders.map(o => o.reference === order.reference ? { ...o, status: 'Completed' } : o));
                                showToast(`Order ${order.reference} completed!`);
                              }}
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* =========================================================
              TAB 4: OVERVIEW SCREEN (Spacious, Uncluttered)
             ========================================================= */}
          {activeTab === 'overview' && (
            <>
              <div className="admin-page-header">
                <div>
                  <h1>Restaurant Overview</h1>
                  <p>Daily activity at Abay Kitchen.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="admin-action-btn secondary" onClick={() => setActiveTab('menu')}>
                    Edit Menu
                  </button>
                  <button className="admin-action-btn primary" onClick={() => setActiveTab('orders')}>
                    View Orders
                  </button>
                </div>
              </div>

              <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                  <div className="admin-kpi-top">
                    <span>ORDERS TODAY</span>
                    <AdminIcon name="orders" size={16} />
                  </div>
                  <strong>{sharedOrders.length + 24}</strong>
                  <div className="admin-kpi-foot pos">
                    <AdminIcon name="check" size={12} /> Live QR Orders
                  </div>
                </div>

                <div className="admin-kpi-card highlight">
                  <div className="admin-kpi-top">
                    <span>ACTIVE DISHES</span>
                    <AdminIcon name="menu" size={16} />
                  </div>
                  <strong>{dishes.filter(d => d.available).length}</strong>
                  <div className="admin-kpi-foot">
                    <span>{dishes.filter(d => !d.available).length} sold out</span>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-top">
                    <span>CATEGORIES</span>
                    <AdminIcon name="categories" size={16} />
                  </div>
                  <strong>{categories.length - 1}</strong>
                  <div className="admin-kpi-foot">
                    <span>All active</span>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-top">
                    <span>RECORDED SALES</span>
                  </div>
                  <strong>ETB 28,400</strong>
                  <div className="admin-kpi-foot">
                    <span>Pay at table</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* =========================================================
          MODAL 1: ADD / EDIT FOOD ITEM (03B)
         ========================================================= */}
      {editingItem && (
        <div className="admin-modal-backdrop" onClick={() => setEditingItem(null)}>
          <div
            className="admin-modal"
            style={{ width: '560px' }}
            role="dialog"
            aria-modal="true"
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>{isNewItem ? 'Add New Dish' : `Edit ${editingItem.name}`}</h3>
              <button
                style={{ background: 'transparent', border: 0, cursor: 'pointer' }}
                onClick={() => setEditingItem(null)}
              >
                <AdminIcon name="close" size={20} />
              </button>
            </div>

            {/* Photo Preview & Simple Selector */}
            <div className="admin-form-group">
              <label>Dish Photo</label>
              <div className="admin-image-preview-wrap">
                <img src={`https://images.unsplash.com/${editingItem.image}?w=600&auto=format&fit=crop&q=80`} alt="Preview" />
                <div className="admin-image-preview-actions">
                  <button
                    className="admin-action-btn secondary"
                    style={{ background: '#fff', fontSize: '11px', minHeight: '32px' }}
                    onClick={() => {
                      // Cycle through realistic food photos
                      const samplePhotos = [
                        'photo-1746716447103-e1618bbd0669',
                        'photo-1544025162-d76694265947',
                        'photo-1593252719532-53f183016149',
                        'photo-1670398564097-0762e1b30b3a',
                        'photo-1568901346375-23c9450c58cd',
                        'photo-1622597467836-f3285f2131b8'
                      ];
                      const next = samplePhotos[(samplePhotos.indexOf(editingItem.image) + 1) % samplePhotos.length];
                      setEditingItem({ ...editingItem, image: next });
                      showToast('Photo changed');
                    }}
                  >
                    <AdminIcon name="image" size={14} /> Change Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Name & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <div className="admin-form-group">
                <label>Dish Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sizzling Tibs"
                  value={editingItem.name}
                  onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Category *</label>
                <select
                  value={editingItem.category}
                  onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                >
                  {categories.filter(c => c !== 'All Items').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Tag */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="admin-form-group">
                <label>Base Price (ETB) *</label>
                <input
                  type="number"
                  placeholder="450"
                  value={editingItem.price || ''}
                  onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="admin-form-group">
                <label>Badge / Tag (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Popular, Plant-based"
                  value={editingItem.tag || ''}
                  onChange={e => setEditingItem({ ...editingItem, tag: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="admin-form-group">
              <label>Description</label>
              <textarea
                rows={3}
                placeholder="Describe ingredients and flavours…"
                value={editingItem.description}
                onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
              />
            </div>

            {/* Availability Switch */}
            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#fafbf8', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div>
                <strong style={{ fontSize: '13px', display: 'block' }}>In Stock & Available</strong>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Guests can order this dish from their table</span>
              </div>
              <button
                className={`admin-toggle ${editingItem.available ? 'on' : ''}`}
                onClick={() => setEditingItem({ ...editingItem, available: !editingItem.available })}
                aria-label="Toggle available"
              >
                <span className="admin-toggle-knob" />
              </button>
            </div>

            {/* Customization Options (Portions & Add-ons) */}
            <div className="admin-form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Portions & Surcharges</span>
                <button
                  type="button"
                  style={{ background: 'transparent', border: 0, color: 'var(--brand)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
                  onClick={() => {
                    const existing = editingItem.portions || [];
                    setEditingItem({
                      ...editingItem,
                      portions: [...existing, { name: 'Large', price: 150 }]
                    });
                  }}
                >
                  + Add Portion
                </button>
              </label>

              <div className="admin-options-builder">
                {(editingItem.portions || []).length > 0 ? (
                  editingItem.portions!.map((p, idx) => (
                    <div className="admin-option-item-row" key={idx}>
                      <input
                        type="text"
                        placeholder="Portion name (e.g. Regular)"
                        value={p.name}
                        onChange={e => {
                          const updated = [...editingItem.portions!];
                          updated[idx].name = e.target.value;
                          setEditingItem({ ...editingItem, portions: updated });
                        }}
                      />
                      <input
                        type="number"
                        placeholder="+ Price ETB"
                        value={p.price}
                        onChange={e => {
                          const updated = [...editingItem.portions!];
                          updated[idx].price = parseFloat(e.target.value) || 0;
                          setEditingItem({ ...editingItem, portions: updated });
                        }}
                      />
                      <button
                        className="admin-remove-option-btn"
                        onClick={() => {
                          setEditingItem({
                            ...editingItem,
                            portions: editingItem.portions!.filter((_, i) => i !== idx)
                          });
                        }}
                      >
                        <AdminIcon name="trash" size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Standard serving only (no portion choices).</span>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="admin-modal-actions">
              <button className="admin-action-btn secondary" onClick={() => setEditingItem(null)}>
                Cancel
              </button>
              <button className="admin-action-btn primary" onClick={handleSaveItem}>
                Save Dish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: CUSTOMER PHONE PREVIEW (03B)
         ========================================================= */}
      {previewItem && (
        <div className="admin-modal-backdrop" onClick={() => setPreviewItem(null)}>
          <div style={{ maxWidth: '380px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', marginBottom: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Guest Mobile View</span>
              <button
                style={{ background: 'transparent', border: 0, color: '#fff', cursor: 'pointer' }}
                onClick={() => setPreviewItem(null)}
              >
                <AdminIcon name="close" size={20} />
              </button>
            </div>

            <div className="admin-phone-wrapper">
              <div className="admin-phone-screen">
                <div className="admin-phone-header">
                  <span>Table 08</span>
                  <span>Abay Kitchen</span>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', background: '#fff' }}>
                    <div style={{ height: '170px', position: 'relative' }}>
                      <img
                        src={`https://images.unsplash.com/${previewItem.image}?w=500&auto=format&fit=crop&q=80`}
                        alt={previewItem.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {previewItem.tag && (
                        <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: 'var(--brand)' }}>
                          {previewItem.tag}
                        </span>
                      )}
                      {!previewItem.available && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(16,38,27,0.7)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 700 }}>
                          Sold Out
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '16px' }}>
                      <h4 style={{ margin: '0 0 6px', fontSize: '16px', color: 'var(--brand)' }}>{previewItem.name}</h4>
                      <p style={{ margin: '0 0 14px', fontSize: '11px', color: 'var(--muted)', lineHeight: '1.6' }}>
                        {previewItem.description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f2eb', paddingTop: '12px' }}>
                        <strong style={{ fontSize: '16px', color: 'var(--brand)' }}>{money(previewItem.price)}</strong>
                        <button
                          disabled={!previewItem.available}
                          style={{
                            background: previewItem.available ? 'var(--brand)' : '#e0e0e0',
                            color: previewItem.available ? '#fff' : '#888',
                            border: 0,
                            borderRadius: '6px',
                            padding: '6px 14px',
                            fontSize: '11px',
                            fontWeight: 600
                          }}
                        >
                          {previewItem.available ? '+ Add' : 'Sold Out'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: DELETE CATEGORY CONFIRMATION (03B)
         ========================================================= */}
      {deletingCategory && (
        <div className="admin-modal-backdrop" onClick={() => setDeletingCategory(null)}>
          <div className="admin-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <h3>Delete Category "{deletingCategory}"?</h3>
            <p>
              Categories with active dishes cannot be deleted. Please reassign the dishes to another category first.
            </p>
            <div className="admin-modal-actions">
              <button className="admin-action-btn secondary" onClick={() => setDeletingCategory(null)}>
                Cancel
              </button>
              <button className="admin-action-btn danger" onClick={handleConfirmDeleteCategory}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toast && (
        <div className="admin-toast" role="status">
          <AdminIcon name="check" size={16} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
