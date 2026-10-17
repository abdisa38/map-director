import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { SessionOrder } from './OrderTracking';
import type { CartLine } from './FoodDetails';
import './admin.css';

// SVG Icons (Lucide-style)
function AdminIcon({ name, size = 18 }: { name: string; size?: number }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>,
    orders: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
    menu: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></>,
    categories: <><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M14 14h7v7h-7z"/><path d="M3 14h7v7H3z"/></>,
    tables: <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" x2="9" y1="4" y2="20"/><line x1="15" x2="15" y1="4" y2="20"/><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/></>,
    staff: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    reports: <><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    alert: <><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></>,
    chevronRight: <polyline points="9 18 15 12 9 6"/>,
    chevronDown: <polyline points="6 9 12 15 18 9"/>,
    close: <><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></>,
    printer: <><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></>,
    external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>,
    volume: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></>,
    volumeX: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/></>,
    user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name] || icons.dashboard}
    </svg>
  );
}

const money = (n: number) => `ETB ${n.toLocaleString()}`;
const formatTime = (iso: string) => new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

const initialOperationalOrders: SessionOrder[] = [
  {
    reference: 'DEMO-AK-8F92B104',
    placedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    status: 'Received',
    lines: [
      {
        key: 'item-1',
        dish: { id: 1, name: 'Doro Wat', description: 'Slow-simmered chicken in berbere sauce.', price: 680, category: 'Ethiopian Food', image: 'photo-1746716447103-e1618bbd0669' },
        quantity: 2,
        unitPrice: 740,
        portion: 'Regular',
        extras: ['Extra egg'],
        instructions: 'Less spicy berbere if possible, please.'
      },
      {
        key: 'item-2',
        dish: { id: 7, name: 'Fresh Mango Juice', description: 'Freshly blended ripe mango.', price: 180, category: 'Drinks', image: 'photo-1622597467836-f3285f2131b8' },
        quantity: 2,
        unitPrice: 180,
        portion: 'Standard',
        extras: [],
        instructions: 'Served with cold ice'
      }
    ]
  },
  {
    reference: 'DEMO-AK-9A4401C2',
    placedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'Accepted',
    lines: [
      {
        key: 'item-3',
        dish: { id: 2, name: 'Sizzling Beef Tibs', description: 'Tender beef, rosemary, peppers and onions.', price: 720, category: 'Ethiopian Food', image: 'photo-1544025162-d76694265947' },
        quantity: 1,
        unitPrice: 765,
        portion: 'Regular',
        extras: ['Extra injera'],
        instructions: 'Extra well-done beef'
      }
    ]
  },
  {
    reference: 'DEMO-AK-3A10C921',
    placedAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    status: 'Preparing',
    lines: [
      {
        key: 'item-4',
        dish: { id: 3, name: 'The Garden Beyaynetu', description: 'Colourful spread of lentils and seasonal greens.', price: 460, category: 'Ethiopian Food', image: 'photo-1593252719532-53f183016149' },
        quantity: 1,
        unitPrice: 460,
        portion: 'Regular',
        extras: [],
        instructions: 'Strictly vegan'
      },
      {
        key: 'item-5',
        dish: { id: 5, name: 'Abay Signature Burger', description: 'Grilled beef, cheddar and house sauce.', price: 580, category: 'Burgers', image: 'photo-1568901346375-23c9450c58cd' },
        quantity: 1,
        unitPrice: 580,
        portion: 'Single patty',
        extras: [],
        instructions: 'No onions'
      }
    ]
  },
  {
    reference: 'DEMO-AK-1102D7F8',
    placedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    status: 'Ready',
    lines: [
      {
        key: 'item-6',
        dish: { id: 4, name: 'Herb-Grilled Chicken', description: 'Flame-grilled chicken and garden vegetables.', price: 650, category: 'Main Courses', image: 'photo-1670398564097-0762e1b30b3a' },
        quantity: 2,
        unitPrice: 650,
        portion: 'Regular',
        extras: [],
        instructions: 'Sauce on the side'
      }
    ]
  },
  {
    reference: 'DEMO-AK-0789E3B4',
    placedAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    status: 'Completed',
    feedback: true,
    lines: [
      {
        key: 'item-7',
        dish: { id: 6, name: 'Garden Margherita', description: 'Stone-baked dough, tomato and fresh mozzarella.', price: 620, category: 'Pizza', image: 'photo-1574071318508-1cdbab80d002' },
        quantity: 1,
        unitPrice: 620,
        portion: 'Regular',
        extras: [],
        instructions: ''
      }
    ]
  }
];

type Props = {
  sharedOrders: SessionOrder[];
  onUpdateOrders: (orders: SessionOrder[]) => void;
  onNavigateToCustomer: () => void;
};

export default function AdminDashboard({ sharedOrders, onUpdateOrders, onNavigateToCustomer }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders'>('overview');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [tableFilter, setTableFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<SessionOrder | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<SessionOrder | null>(null);
  const [rejectReason, setRejectReason] = useState('Kitchen at maximum capacity');
  const [toast, setToast] = useState<string | null>(null);
  const [busyOrder, setBusyOrder] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifDropdown, setNotifDropdown] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'today' | 'yesterday' | 'week'>('today');
  
  // Prototype simulation states
  const [connected, setConnected] = useState(true);
  const [simulateConflict, setSimulateConflict] = useState(false);

  // Combine shared customer orders with restaurant demonstration orders
  const orders = useMemo(() => {
    const combined = [...sharedOrders];
    for (const init of initialOperationalOrders) {
      if (!combined.some(o => o.reference === init.reference)) {
        combined.push(init);
      }
    }
    return combined;
  }, [sharedOrders]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  // Status Counts
  const counts = useMemo(() => {
    return {
      all: orders.length,
      received: orders.filter(o => o.status === 'Received').length,
      accepted: orders.filter(o => o.status === 'Accepted').length,
      preparing: orders.filter(o => o.status === 'Preparing').length,
      ready: orders.filter(o => o.status === 'Ready').length,
      completed: orders.filter(o => o.status === 'Completed').length,
      cancelled: orders.filter(o => ['Cancelled', 'Rejected'].includes(o.status)).length,
    };
  }, [orders]);

  // Operational metrics
  const totalSalesRecorded = useMemo(() => {
    return orders
      .filter(o => !['Cancelled', 'Rejected'].includes(o.status))
      .reduce((sum, o) => sum + o.lines.reduce((sub, l) => sub + l.unitPrice * l.quantity, 0), 0) + 16800; // baseline
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'New'
          ? o.status === 'Received'
          : statusFilter === 'Cancelled'
          ? ['Cancelled', 'Rejected'].includes(o.status)
          : o.status === statusFilter;

      const matchesSearch =
        o.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.lines.some(l => l.dish.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        'table 08'.includes(searchQuery.toLowerCase());

      const matchesTable = tableFilter === 'All' ? true : tableFilter === '08';

      return matchesStatus && matchesSearch && matchesTable;
    });
  }, [orders, statusFilter, searchQuery, tableFilter]);

  // Workflow transition
  const handleAdvanceStatus = (order: SessionOrder, nextStatus: string) => {
    if (!connected) {
      showToast('Action failed: Real-time connection interrupted.');
      return;
    }
    if (simulateConflict) {
      showToast(`Conflict error: Order ${order.reference} was already modified by Server Marta.`);
      setSimulateConflict(false);
      return;
    }

    setBusyOrder(order.reference);
    setTimeout(() => {
      const updated = orders.map(o => (o.reference === order.reference ? { ...o, status: nextStatus } : o));
      onUpdateOrders(updated);
      setBusyOrder(null);
      if (selectedOrder?.reference === order.reference) {
        setSelectedOrder({ ...selectedOrder, status: nextStatus });
      }
      showToast(`Order ${order.reference} status updated to “${nextStatus}”`);
    }, 450);
  };

  const handleConfirmReject = () => {
    if (!rejectingOrder) return;
    const updated = orders.map(o => (o.reference === rejectingOrder.reference ? { ...o, status: 'Rejected' } : o));
    onUpdateOrders(updated);
    if (selectedOrder?.reference === rejectingOrder.reference) {
      setSelectedOrder({ ...selectedOrder, status: 'Rejected' });
    }
    showToast(`Order ${rejectingOrder.reference} rejected: ${rejectReason}`);
    setRejectingOrder(null);
  };

  const simulateNewIncomingOrder = () => {
    const newRef = `DEMO-AK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newOrder: SessionOrder = {
      reference: newRef,
      placedAt: new Date().toISOString(),
      status: 'Received',
      lines: [
        {
          key: `sim-${Date.now()}`,
          dish: {
            id: 1,
            name: 'Doro Wat',
            description: 'Slow-simmered chicken in rich berbere.',
            price: 680,
            category: 'Ethiopian Food',
            image: 'photo-1746716447103-e1618bbd0669'
          },
          quantity: 1,
          unitPrice: 740,
          portion: 'Regular',
          extras: ['Extra egg'],
          instructions: 'Urgent table request'
        }
      ]
    };
    onUpdateOrders([newOrder, ...orders]);
    showToast(`New QR order received at Table 04 (${newRef})`);
  };

  return (
    <div className="admin-shell">
      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <a href="#" className="admin-brand" onClick={e => { e.preventDefault(); setActiveTab('overview'); }}>
            <span style={{ color: 'var(--gold)' }}>gebeta</span>QR
            <span className="admin-brand-badge">SaaS</span>
          </a>
          <div className="admin-restaurant-selector" title="Switch Restaurant Branch">
            <div>
              <strong>Abay Kitchen</strong>
              <small>Bole Branch · Addis Ababa</small>
            </div>
            <AdminIcon name="chevronDown" size={14} />
          </div>
        </div>

        <nav className="admin-nav" aria-label="Main Admin Navigation">
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
            {counts.received > 0 && <span className="admin-nav-badge">{counts.received}</span>}
          </button>

          <button className="admin-nav-item" onClick={() => showToast('Menu Management will be released in Module 03B')}>
            <AdminIcon name="menu" size={18} />
            <span>Menu Management</span>
            <span className="admin-nav-soon">03B</span>
          </button>

          <button className="admin-nav-item" onClick={() => showToast('Categories & Item options will be released in Module 03B')}>
            <AdminIcon name="categories" size={18} />
            <span>Categories</span>
            <span className="admin-nav-soon">03B</span>
          </button>

          <button className="admin-nav-item" onClick={() => showToast('Tables & QR Code Generator will be released in Module 03C')}>
            <AdminIcon name="tables" size={18} />
            <span>Tables & QR Codes</span>
            <span className="admin-nav-soon">03C</span>
          </button>

          <button className="admin-nav-item" onClick={() => showToast('Staff & Role Management will be released in Module 03D')}>
            <AdminIcon name="staff" size={18} />
            <span>Staff</span>
            <span className="admin-nav-soon">03D</span>
          </button>

          <button className="admin-nav-item" onClick={() => showToast('Reports & Sales Analytics will be released in Module 03E')}>
            <AdminIcon name="reports" size={18} />
            <span>Reports</span>
            <span className="admin-nav-soon">03E</span>
          </button>

          <button className="admin-nav-item" onClick={() => showToast('Restaurant & VAT Settings will be released in Module 03F')}>
            <AdminIcon name="settings" size={18} />
            <span>Restaurant Settings</span>
            <span className="admin-nav-soon">03F</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <span className="admin-user-avatar">AB</span>
            <div className="admin-user-info">
              <span className="admin-user-name">Abebe Bekele</span>
              <span className="admin-user-role">General Manager</span>
            </div>
            <button
              className="admin-logout-btn"
              title="Sign Out of GebetaQR Admin"
              onClick={() => showToast('Sign Out clicked (Session preserved in demo)')}
              aria-label="Sign Out"
            >
              <AdminIcon name="logout" size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="admin-workspace">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <AdminIcon name="dashboard" size={18} />
            </button>
            <div className="admin-breadcrumb">
              <span>Abay Kitchen</span>
              <span>/</span>
              <strong>{activeTab === 'overview' ? 'Operational Overview' : 'Live Order Management'}</strong>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className={`admin-connection-pill ${!connected ? 'disconnected' : ''}`} title="Live WebSocket link to dining tables">
              <i />
              <span>{connected ? 'Live Sync Active' : 'Disconnected'}</span>
            </div>

            <button
              className="admin-live-link"
              onClick={onNavigateToCustomer}
              title="Switch to Customer Dine-in Digital Menu view (Table 08)"
            >
              <AdminIcon name="external" size={14} />
              <span>Customer View (Table 08)</span>
            </button>

            <button
              className="admin-icon-btn"
              title={soundEnabled ? 'Mute new order chime' : 'Enable new order chime'}
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                showToast(soundEnabled ? 'Order sound chime muted' : 'Order sound chime enabled');
              }}
              aria-label="Notification sound toggle"
            >
              <AdminIcon name={soundEnabled ? 'volume' : 'volumeX'} size={17} />
            </button>

            <button
              className="admin-icon-btn"
              onClick={() => setNotifDropdown(!notifDropdown)}
              title="Notifications"
              aria-label="Notifications"
            >
              <AdminIcon name="bell" size={17} />
              {counts.received > 0 && <span className="admin-notif-dot" />}
            </button>
          </div>
        </header>

        {/* New Order Alert Banner */}
        {counts.received > 0 && (
          <div className="admin-new-banner" role="alert">
            <div className="admin-new-banner-left">
              <span className="admin-new-banner-badge">{counts.received} NEW</span>
              <span>You have {counts.received} incoming order{counts.received > 1 ? 's' : ''} awaiting staff acceptance.</span>
            </div>
            <button
              className="admin-action-btn primary"
              style={{ background: 'var(--gold)', color: '#10261b', minHeight: '32px', fontSize: '11px' }}
              onClick={() => { setActiveTab('orders'); setStatusFilter('New'); }}
            >
              Review Incoming Orders →
            </button>
          </div>
        )}

        {/* Content Area */}
        <main className="admin-content">
          {activeTab === 'overview' ? (
            /* ================= 1. OVERVIEW DASHBOARD ================= */
            <>
              <div className="admin-page-header">
                <div>
                  <h1>Today's Service Overview</h1>
                  <p>Real-time dining room flow, kitchen capacity, and recorded table orders.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="admin-action-btn secondary"
                    onClick={simulateNewIncomingOrder}
                    title="Simulate a new QR scan and order placed at Table 04"
                  >
                    + Simulate Incoming QR Order
                  </button>
                  <button
                    className="admin-action-btn primary"
                    onClick={() => setActiveTab('orders')}
                  >
                    Manage Orders ({orders.length}) →
                  </button>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                  <div className="admin-kpi-top">
                    <span>ORDERS TODAY</span>
                    <AdminIcon name="orders" size={15} />
                  </div>
                  <strong>{orders.length + 32}</strong>
                  <div className="admin-kpi-foot pos">
                    <AdminIcon name="check" size={12} />
                    <span>+14% vs yesterday</span>
                  </div>
                </div>

                <div className={`admin-kpi-card ${counts.received > 0 ? 'urgent' : ''}`}>
                  <div className="admin-kpi-top">
                    <span>AWAITING ACTION</span>
                    <AdminIcon name="alert" size={15} />
                  </div>
                  <strong style={{ color: counts.received > 0 ? '#b83b3b' : 'var(--brand)' }}>
                    {counts.received}
                  </strong>
                  <div className="admin-kpi-foot">
                    <span>{counts.received > 0 ? 'Requires prompt review' : 'No pending orders'}</span>
                  </div>
                </div>

                <div className="admin-kpi-card highlight">
                  <div className="admin-kpi-top">
                    <span>IN PREPARATION</span>
                    <AdminIcon name="clock" size={15} />
                  </div>
                  <strong>{counts.preparing}</strong>
                  <div className="admin-kpi-foot">
                    <span>Avg prep time: ~18 mins</span>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-top">
                    <span>COMPLETED ORDERS</span>
                    <AdminIcon name="check" size={15} />
                  </div>
                  <strong>{counts.completed + 28}</strong>
                  <div className="admin-kpi-foot">
                    <span>Fulfilled & cleared</span>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-top">
                    <span>RECORDED SALES</span>
                    <span style={{ fontSize: '10px', color: 'var(--muted)' }}>VAT INCL.</span>
                  </div>
                  <strong>{money(totalSalesRecorded)}</strong>
                  <div className="admin-kpi-foot">
                    <span>Dine-in recorded · Pay at table</span>
                  </div>
                </div>
              </div>

              {/* Overview Analytics & Operational Columns */}
              <div className="admin-overview-grid">
                {/* Left Column: Hourly Chart + Incoming Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="admin-panel">
                    <div className="admin-panel-head">
                      <div>
                        <h2>Order Activity Hourly Distribution</h2>
                        <small>Peak meal volume across breakfast, lunch, and dinner shifts</small>
                      </div>
                      <div className="admin-status-tabs" style={{ padding: '2px' }}>
                        <button
                          className={`admin-tab-btn ${chartPeriod === 'today' ? 'active' : ''}`}
                          style={{ minHeight: '28px', padding: '4px 10px', fontSize: '11px' }}
                          onClick={() => setChartPeriod('today')}
                        >
                          Today
                        </button>
                        <button
                          className={`admin-tab-btn ${chartPeriod === 'yesterday' ? 'active' : ''}`}
                          style={{ minHeight: '28px', padding: '4px 10px', fontSize: '11px' }}
                          onClick={() => setChartPeriod('yesterday')}
                        >
                          Yesterday
                        </button>
                        <button
                          className={`admin-tab-btn ${chartPeriod === 'week' ? 'active' : ''}`}
                          style={{ minHeight: '28px', padding: '4px 10px', fontSize: '11px' }}
                          onClick={() => setChartPeriod('week')}
                        >
                          7 Days
                        </button>
                      </div>
                    </div>

                    <div className="admin-chart-bars">
                      {[
                        { time: '11 AM', height: '28%', count: 4 },
                        { time: '12 PM', height: '65%', count: 12 },
                        { time: '1 PM', height: '88%', count: 18, accent: true },
                        { time: '2 PM', height: '45%', count: 8 },
                        { time: '3 PM', height: '20%', count: 3 },
                        { time: '4 PM', height: '24%', count: 4 },
                        { time: '5 PM', height: '35%', count: 6 },
                        { time: '6 PM', height: '70%', count: 14 },
                        { time: '7 PM', height: '95%', count: 21, accent: true },
                        { time: '8 PM', height: '60%', count: 11 },
                        { time: '9 PM', height: '30%', count: 5 }
                      ].map(bar => (
                        <div className="admin-chart-col" key={bar.time}>
                          <div className="admin-bar-wrap">
                            <div
                              className={`admin-bar-fill ${bar.accent ? 'accent' : ''}`}
                              style={{ height: bar.height }}
                              title={`${bar.count} orders at ${bar.time}`}
                            />
                          </div>
                          <span>{bar.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Active Orders Preview */}
                  <div className="admin-panel">
                    <div className="admin-panel-head">
                      <div>
                        <h2>Live Orders in Service</h2>
                        <small>Showing active orders requiring kitchen or server attention</small>
                      </div>
                      <button
                        className="admin-action-btn secondary"
                        style={{ minHeight: '32px', fontSize: '11px' }}
                        onClick={() => setActiveTab('orders')}
                      >
                        View Full Screen →
                      </button>
                    </div>

                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>ORDER</th>
                            <th>TABLE</th>
                            <th>ITEMS & SPECIAL NOTES</th>
                            <th>TOTAL</th>
                            <th>STATUS</th>
                            <th style={{ textAlign: 'right' }}>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 4).map(o => (
                            <tr
                              key={o.reference}
                              className={o.status === 'Received' ? 'row-new' : ''}
                              onClick={() => setSelectedOrder(o)}
                            >
                              <td className="admin-order-ref">
                                <strong>{o.reference}</strong>
                                <small>{formatTime(o.placedAt)}</small>
                              </td>
                              <td>
                                <span className="admin-table-tag">Table 08</span>
                              </td>
                              <td className="admin-items-summary">
                                <strong>{o.lines.reduce((n, l) => n + l.quantity, 0)} items</strong>
                                <p>{o.lines.map(l => `${l.quantity}× ${l.dish.name}`).join(', ')}</p>
                                {o.lines.some(l => l.instructions) && (
                                  <span className="admin-table-instruction">
                                    Note: “{o.lines.find(l => l.instructions)?.instructions}”
                                  </span>
                                )}
                              </td>
                              <td style={{ fontWeight: 600, color: 'var(--brand)' }}>
                                {money(o.lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0))}
                              </td>
                              <td>
                                <span className={`admin-status-badge ${o.status.toLowerCase()}`}>
                                  {o.status}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                                {o.status === 'Received' && (
                                  <button
                                    className="admin-action-btn primary"
                                    disabled={busyOrder === o.reference}
                                    onClick={() => handleAdvanceStatus(o, 'Accepted')}
                                  >
                                    Accept Order
                                  </button>
                                )}
                                {o.status === 'Accepted' && (
                                  <button
                                    className="admin-action-btn primary"
                                    disabled={busyOrder === o.reference}
                                    onClick={() => handleAdvanceStatus(o, 'Preparing')}
                                  >
                                    Start Prep
                                  </button>
                                )}
                                {o.status === 'Preparing' && (
                                  <button
                                    className="admin-action-btn primary"
                                    disabled={busyOrder === o.reference}
                                    onClick={() => handleAdvanceStatus(o, 'Ready')}
                                  >
                                    Mark Ready
                                  </button>
                                )}
                                {o.status === 'Ready' && (
                                  <button
                                    className="admin-action-btn secondary"
                                    disabled={busyOrder === o.reference}
                                    onClick={() => handleAdvanceStatus(o, 'Completed')}
                                  >
                                    Complete
                                  </button>
                                )}
                                {['Completed', 'Rejected', 'Cancelled'].includes(o.status) && (
                                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Archived</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Column: Kitchen Workload & Popular Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Kitchen Workload Progress */}
                  <div className="admin-panel">
                    <div className="admin-panel-head">
                      <h2>Kitchen Station Workload</h2>
                      <small>Live throughput</small>
                    </div>
                    <div className="admin-workload-bars">
                      <div className="admin-workload-item">
                        <div className="admin-workload-labels">
                          <span>Hot Kitchen (Tibs, Doro Wat)</span>
                          <strong>4 active tickets</strong>
                        </div>
                        <div className="admin-progress-bg">
                          <div className="admin-progress-fill" style={{ width: '65%', background: '#23734b' }} />
                        </div>
                      </div>

                      <div className="admin-workload-item">
                        <div className="admin-workload-labels">
                          <span>Grill & Burger Station</span>
                          <strong>2 active tickets</strong>
                        </div>
                        <div className="admin-progress-bg">
                          <div className="admin-progress-fill" style={{ width: '35%', background: 'var(--gold)' }} />
                        </div>
                      </div>

                      <div className="admin-workload-item">
                        <div className="admin-workload-labels">
                          <span>Beverage & Juice Bar</span>
                          <strong>3 active tickets</strong>
                        </div>
                        <div className="admin-progress-bg">
                          <div className="admin-progress-fill" style={{ width: '45%', background: '#30699a' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Popular Dishes */}
                  <div className="admin-panel">
                    <div className="admin-panel-head">
                      <h2>Top Ordered Dishes Today</h2>
                      <small>By portion volume</small>
                    </div>
                    <div className="admin-popular-list">
                      {[
                        { name: 'Doro Wat', category: 'Ethiopian Food', count: 18, img: 'photo-1746716447103-e1618bbd0669' },
                        { name: 'Sizzling Beef Tibs', category: 'Ethiopian Food', count: 14, img: 'photo-1544025162-d76694265947' },
                        { name: 'The Garden Beyaynetu', category: 'Ethiopian Food', count: 11, img: 'photo-1593252719532-53f183016149' },
                        { name: 'Fresh Mango Juice', category: 'Drinks', count: 24, img: 'photo-1622597467836-f3285f2131b8' }
                      ].map(dish => (
                        <div className="admin-popular-dish" key={dish.name}>
                          <div className="admin-popular-left">
                            <img src={`https://images.unsplash.com/${dish.img}?w=100&auto=format&fit=crop&q=80`} alt={dish.name} />
                            <div>
                              <strong>{dish.name}</strong>
                              <small>{dish.category}</small>
                            </div>
                          </div>
                          <b>{dish.count} ordered</b>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Notes */}
                  <div className="admin-panel" style={{ background: '#fafbf8' }}>
                    <div className="admin-panel-head">
                      <h2>Staff Shift Notes</h2>
                      <small>Active Team: 5</small>
                    </div>
                    <p style={{ fontSize: '11px', lineHeight: '1.7', color: 'var(--muted)', margin: 0 }}>
                      Dinner prep begins at 4:30 PM. All tables currently active on QR code ordering. Table 08 flagged with allergy precaution (Egg allergy).
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ================= 2. DEDICATED ORDERS MANAGEMENT SCREEN ================= */
            <>
              <div className="admin-page-header">
                <div>
                  <h1>Table Order Management</h1>
                  <p>Real-time orders received from table QR codes. Review, prepare, and update status.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="admin-action-btn secondary" onClick={simulateNewIncomingOrder}>
                    + Simulate Incoming QR Order
                  </button>
                  <button
                    className="admin-action-btn primary"
                    onClick={() => showToast('Order ticket batch sent to Kitchen Display')}
                  >
                    <AdminIcon name="printer" size={14} />
                    <span>Print Kitchen Batch</span>
                  </button>
                </div>
              </div>

              {/* Status Tabs and Search Controls */}
              <div className="admin-orders-controls">
                <div className="admin-status-tabs" role="tablist" aria-label="Order status filter tabs">
                  {[
                    { key: 'All', label: 'All Orders', count: counts.all },
                    { key: 'New', label: 'New', count: counts.received },
                    { key: 'Accepted', label: 'Accepted', count: counts.accepted },
                    { key: 'Preparing', label: 'Preparing', count: counts.preparing },
                    { key: 'Ready', label: 'Ready', count: counts.ready },
                    { key: 'Completed', label: 'Completed', count: counts.completed },
                    { key: 'Cancelled', label: 'Cancelled', count: counts.cancelled },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      role="tab"
                      aria-selected={statusFilter === tab.key}
                      className={`admin-tab-btn ${statusFilter === tab.key ? 'active' : ''}`}
                      onClick={() => setStatusFilter(tab.key)}
                    >
                      <span>{tab.label}</span>
                      <span className="admin-tab-count">{tab.count}</span>
                    </button>
                  ))}
                </div>

                <div className="admin-filter-row">
                  <div className="admin-search-input">
                    <AdminIcon name="search" size={16} />
                    <input
                      type="text"
                      placeholder="Search ref, dish, table…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      aria-label="Search orders"
                    />
                  </div>

                  <select
                    className="admin-select"
                    value={tableFilter}
                    onChange={e => setTableFilter(e.target.value)}
                    aria-label="Filter by dining table"
                  >
                    <option value="All">All Tables</option>
                    <option value="08">Table 08</option>
                    <option value="04">Table 04</option>
                    <option value="12">Table 12</option>
                  </select>
                </div>
              </div>

              {/* Orders Data Table */}
              <div className="admin-table-wrap">
                {filteredOrders.length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>REFERENCE & TIME</th>
                        <th>TABLE</th>
                        <th>ORDER SUMMARY</th>
                        <th>INSTRUCTIONS</th>
                        <th>TOTAL</th>
                        <th>PAYMENT</th>
                        <th>STATUS</th>
                        <th style={{ textAlign: 'right' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => {
                        const subtotal = order.lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);
                        const hasNote = order.lines.some(l => l.instructions);
                        const isSelected = selectedOrder?.reference === order.reference;

                        return (
                          <tr
                            key={order.reference}
                            className={`${order.status === 'Received' ? 'row-new' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedOrder(order)}
                          >
                            <td className="admin-order-ref">
                              <strong>{order.reference}</strong>
                              <small>{formatTime(order.placedAt)}</small>
                            </td>

                            <td>
                              <span className="admin-table-tag">Table 08</span>
                            </td>

                            <td className="admin-items-summary">
                              <strong>{order.lines.reduce((n, l) => n + l.quantity, 0)} items</strong>
                              <p>{order.lines.map(l => `${l.quantity}× ${l.dish.name}`).join(', ')}</p>
                            </td>

                            <td>
                              {hasNote ? (
                                <span className="admin-table-instruction" title="Special customer instruction">
                                  {order.lines.find(l => l.instructions)?.instructions}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--muted)', fontSize: '11px' }}>—</span>
                              )}
                            </td>

                            <td style={{ fontWeight: 600, color: 'var(--brand)' }}>
                              {money(subtotal)}
                            </td>

                            <td>
                              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                                Settle at table · Unpaid
                              </span>
                            </td>

                            <td>
                              <span className={`admin-status-badge ${order.status.toLowerCase()}`}>
                                {order.status}
                              </span>
                            </td>

                            <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                              {order.status === 'Received' && (
                                <button
                                  className="admin-action-btn primary"
                                  disabled={busyOrder === order.reference}
                                  onClick={() => handleAdvanceStatus(order, 'Accepted')}
                                >
                                  Accept Order
                                </button>
                              )}
                              {order.status === 'Accepted' && (
                                <button
                                  className="admin-action-btn primary"
                                  disabled={busyOrder === order.reference}
                                  onClick={() => handleAdvanceStatus(order, 'Preparing')}
                                >
                                  Start Prep
                                </button>
                              )}
                              {order.status === 'Preparing' && (
                                <button
                                  className="admin-action-btn primary"
                                  disabled={busyOrder === order.reference}
                                  onClick={() => handleAdvanceStatus(order, 'Ready')}
                                >
                                  Mark Ready
                                </button>
                              )}
                              {order.status === 'Ready' && (
                                <button
                                  className="admin-action-btn secondary"
                                  disabled={busyOrder === order.reference}
                                  onClick={() => handleAdvanceStatus(order, 'Completed')}
                                >
                                  Mark Completed
                                </button>
                              )}
                              {['Completed', 'Rejected', 'Cancelled'].includes(order.status) && (
                                <button
                                  className="admin-action-btn secondary"
                                  style={{ padding: '4px 10px', fontSize: '10px' }}
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  View Details
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="admin-empty-state">
                    <AdminIcon name="orders" size={38} />
                    <h3>No orders match your filter</h3>
                    <p>Try clearing your search query or selecting a different status tab above.</p>
                    <button
                      className="admin-action-btn secondary"
                      onClick={() => { setSearchQuery(''); setStatusFilter('All'); setTableFilter('All'); }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Developer Annotations & Prototype Controls (03A) */}
          <details className="admin-prototype-details" open>
            <summary>
              <span>03A — Restaurant Admin Dashboard & Order Management · Prototype Controls & Architecture Notes</span>
              <AdminIcon name="chevronDown" size={16} />
            </summary>
            <div className="admin-prototype-content">
              <div className="admin-prototype-actions">
                <button
                  className="admin-action-btn secondary"
                  onClick={() => setConnected(!connected)}
                >
                  Toggle Connection: {connected ? 'Online (Live Sync)' : 'Simulate Interruption'}
                </button>

                <button
                  className="admin-action-btn secondary"
                  onClick={() => {
                    setSimulateConflict(true);
                    showToast('Concurrency conflict armed for next order status action');
                  }}
                >
                  Arm Optimistic Concurrency Conflict
                </button>

                <button
                  className="admin-action-btn secondary"
                  onClick={simulateNewIncomingOrder}
                >
                  Trigger Simulated Incoming Order (+ Table 04)
                </button>

                <button
                  className="admin-action-btn primary"
                  onClick={onNavigateToCustomer}
                >
                  Jump to Live Customer Menu & Tracking
                </button>
              </div>

              <div className="admin-annotation-box">
                <strong>1. Operational State Transitions & Backend Validation:</strong>
                Status changes (Received → Accepted → Preparing → Ready → Completed) cannot be triggered arbitrarily. In production, each transition is verified by the backend against business rules (e.g. an order cannot move from Received directly to Ready). State transitions must write to an immutable order event log with the acting staff ID and timestamp.
              </div>

              <div className="admin-annotation-box">
                <strong>2. Real-Time Communication & Concurrency:</strong>
                Incoming table orders stream in via WebSockets or Server-Sent Events (SSE). To prevent race conditions when multiple staff members manage the same ticket, status mutations require an optimistic locking token (ETag or updated_at version). If another server accepts the order first, the update is rejected and the client refreshes cleanly.
              </div>

              <div className="admin-annotation-box">
                <strong>3. Dine-In Payment Settlement Integrity:</strong>
                All totals are calculated and validated exclusively on the server. Table orders are treated as uncollected liabilities (Unpaid) until the server receives cash, POS card confirmation, or mobile money transfer. The dashboard never assumes an order is paid merely because an order was placed.
              </div>
            </div>
          </details>
        </main>
      </div>

      {/* Slide-over Order Detail Drawer */}
      {selectedOrder && (
        <div className="admin-drawer-backdrop" onClick={() => setSelectedOrder(null)}>
          <aside
            className="admin-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-order-title"
            onClick={e => e.stopPropagation()}
          >
            <div className="admin-drawer-head">
              <div>
                <h2 id="drawer-order-title">Order {selectedOrder.reference}</h2>
                <small>Table 08 · Placed at {formatTime(selectedOrder.placedAt)} ({new Date(selectedOrder.placedAt).toLocaleDateString()})</small>
              </div>
              <button
                className="admin-drawer-close"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details drawer"
              >
                <AdminIcon name="close" size={20} />
              </button>
            </div>

            <div className="admin-drawer-body">
              {/* Status Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span className={`admin-status-badge ${selectedOrder.status.toLowerCase()}`} style={{ fontSize: '12px', padding: '6px 12px' }}>
                  Current Status: {selectedOrder.status}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  Server Assigned: Marta K.
                </span>
              </div>

              {/* Prominent Special Instructions Alert */}
              {selectedOrder.lines.some(l => l.instructions) && (
                <div className="admin-instruction-alert" role="note">
                  <AdminIcon name="alert" size={20} />
                  <div>
                    <strong>Guest Special Instructions</strong>
                    {selectedOrder.lines.filter(l => l.instructions).map(l => (
                      <p key={l.key}>
                        <strong>{l.dish.name}:</strong> “{l.instructions}”
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="admin-drawer-section-title">ORDERED ITEMS ({selectedOrder.lines.reduce((n, l) => n + l.quantity, 0)})</div>
              {selectedOrder.lines.map(line => (
                <div className="admin-drawer-item" key={line.key}>
                  <img src={`https://images.unsplash.com/${line.dish.image}?w=120&auto=format&fit=crop&q=80`} alt={line.dish.name} />
                  <div className="admin-drawer-item-details">
                    <h4>{line.quantity}× {line.dish.name}</h4>
                    <p>{[line.portion, ...line.extras].filter(Boolean).join(' · ') || 'Standard Serving'}</p>
                    {line.instructions && (
                      <small>Note: “{line.instructions}”</small>
                    )}
                  </div>
                  <div className="admin-drawer-item-price">
                    {money(line.unitPrice * line.quantity)}
                    <small>{money(line.unitPrice)} ea</small>
                  </div>
                </div>
              ))}

              {/* Financial Calculation */}
              <div className="admin-drawer-summary">
                <div className="admin-summary-line">
                  <span>Subtotal</span>
                  <strong>{money(selectedOrder.lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0))}</strong>
                </div>
                <div className="admin-summary-line">
                  <span>Applicable VAT & Service</span>
                  <span>Inclusive</span>
                </div>
                <div className="admin-summary-line">
                  <span>Payment Method</span>
                  <strong>Pay at Table · Settle with Server</strong>
                </div>
                <div className="admin-summary-line total">
                  <span>Total Amount</span>
                  <span>{money(selectedOrder.lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0))}</span>
                </div>
              </div>
            </div>

            {/* Operational Action Bar Footer */}
            <div className="admin-drawer-footer">
              {selectedOrder.status === 'Received' && (
                <>
                  <button
                    className="admin-action-btn danger"
                    onClick={() => setRejectingOrder(selectedOrder)}
                  >
                    Reject Order
                  </button>
                  <button
                    className="admin-action-btn primary"
                    disabled={busyOrder === selectedOrder.reference}
                    onClick={() => handleAdvanceStatus(selectedOrder, 'Accepted')}
                  >
                    Accept Order →
                  </button>
                </>
              )}

              {selectedOrder.status === 'Accepted' && (
                <>
                  <button
                    className="admin-action-btn secondary"
                    onClick={() => showToast(`Kitchen order ticket printed for ${selectedOrder.reference}`)}
                  >
                    <AdminIcon name="printer" size={14} /> Print KOT
                  </button>
                  <button
                    className="admin-action-btn primary"
                    disabled={busyOrder === selectedOrder.reference}
                    onClick={() => handleAdvanceStatus(selectedOrder, 'Preparing')}
                  >
                    Start Preparation →
                  </button>
                </>
              )}

              {selectedOrder.status === 'Preparing' && (
                <button
                  className="admin-action-btn primary"
                  disabled={busyOrder === selectedOrder.reference}
                  onClick={() => handleAdvanceStatus(selectedOrder, 'Ready')}
                >
                  Mark Order Ready for Serving →
                </button>
              )}

              {selectedOrder.status === 'Ready' && (
                <button
                  className="admin-action-btn primary"
                  disabled={busyOrder === selectedOrder.reference}
                  onClick={() => handleAdvanceStatus(selectedOrder, 'Completed')}
                >
                  Mark Order Completed & Cleared ✓
                </button>
              )}

              {['Completed', 'Rejected', 'Cancelled'].includes(selectedOrder.status) && (
                <button
                  className="admin-action-btn secondary"
                  style={{ width: '100%' }}
                  onClick={() => setSelectedOrder(null)}
                >
                  Close Ticket
                </button>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Reject Order Modal */}
      {rejectingOrder && (
        <div className="admin-modal-backdrop" onClick={() => setRejectingOrder(null)}>
          <div className="admin-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <h3>Reject Order {rejectingOrder.reference}</h3>
            <p>
              Please provide an operational reason. This status will notify the guest seated at Table 08 on their phone screen.
            </p>
            <div className="admin-modal-field">
              <label htmlFor="reject-reason">Operational Reason</label>
              <select
                id="reject-reason"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
              >
                <option value="Kitchen at maximum capacity">Kitchen at maximum capacity</option>
                <option value="Ingredient out of stock (Doro Wat)">Ingredient out of stock</option>
                <option value="Table 08 unoccupied / Accidental scan">Table unoccupied / Invalid scan</option>
                <option value="Customer requested cancellation">Customer requested cancellation</option>
              </select>
            </div>
            <div className="admin-modal-actions">
              <button className="admin-action-btn secondary" onClick={() => setRejectingOrder(null)}>
                Cancel
              </button>
              <button className="admin-action-btn danger" onClick={handleConfirmReject}>
                Confirm Rejection
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
