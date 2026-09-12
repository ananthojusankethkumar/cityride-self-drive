import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_FLEET, INITIAL_BOOKINGS, INITIAL_CUSTOMERS } from '../data/initialData';

const AppContext = createContext();

const getPanelFromPath = () => {
  return window.location.pathname.startsWith('/admin') ? 'admin' : 'customer';
};

export const AppProvider = ({ children }) => {
  // Mode switcher: 'customer' or 'admin'
  const [activePanel, setActivePanel] = useState(getPanelFromPath);

  // Admin sub-tab: 'dashboard', 'fleet', 'bookings', 'customers'
  const [adminTab, setAdminTab] = useState('dashboard');

  // Theme mode: 'dark' or 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('drivepulse_theme') || 'dark';
  });

  // Cars fleet state
  const [cars, setCars] = useState(() => {
    const saved = localStorage.getItem('drivepulse_cars');
    return saved ? JSON.parse(saved) : INITIAL_FLEET;
  });

  // Bookings state
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('drivepulse_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Customers state
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('drivepulse_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  // Active selected car for customer booking modal
  const [selectedCarForBooking, setSelectedCarForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('drivepulse_panel', activePanel);
  }, [activePanel]);

  useEffect(() => {
    const syncPanelWithPath = () => {
      setActivePanel(getPanelFromPath());
    };

    window.addEventListener('popstate', syncPanelWithPath);
    syncPanelWithPath();

    return () => window.removeEventListener('popstate', syncPanelWithPath);
  }, []);

  const navigateToPanel = (panel) => {
    const nextPath = panel === 'admin' ? '/admin' : '/';
    window.history.pushState({}, '', nextPath);
    setActivePanel(panel);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    localStorage.setItem('drivepulse_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('drivepulse_cars', JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem('drivepulse_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('drivepulse_customers', JSON.stringify(customers));
  }, [customers]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fleet Actions
  const addCar = (newCarData) => {
    const newCar = {
      id: `car-${Date.now().toString().slice(-4)}`,
      status: 'Available',
      rating: 5.0,
      reviewsCount: 1,
      ...newCarData
    };
    setCars(prev => [newCar, ...prev]);
    showToast(`Vehicle "${newCar.name}" added to fleet!`, 'success');
  };

  const updateCarStatus = (carId, newStatus) => {
    setCars(prev =>
      prev.map(c => (c.id === carId ? { ...c, status: newStatus } : c))
    );
    showToast(`Car status updated to ${newStatus}`, 'info');
  };

  const deleteCar = (carId) => {
    const carName = cars.find(c => c.id === carId)?.name;
    setCars(prev => prev.filter(c => c.id !== carId));
    showToast(`Removed "${carName}" from fleet`, 'warning');
  };

  // Booking Actions
  const createBooking = (bookingData) => {
    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ...bookingData
    };

    setBookings(prev => [newBooking, ...prev]);

    // Check if customer exists, if not add to customers list
    setCustomers(prev => {
      const existing = prev.find(c => c.email.toLowerCase() === bookingData.customerEmail.toLowerCase());
      if (existing) {
        return prev.map(c =>
          c.id === existing.id
            ? {
                ...c,
                totalBookings: c.totalBookings + 1,
                totalSpent: c.totalSpent + bookingData.totalPrice
              }
            : c
        );
      } else {
        return [
          ...prev,
          {
            id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
            name: bookingData.customerName,
            email: bookingData.customerEmail,
            phone: bookingData.customerPhone,
            licenseNumber: bookingData.licenseNumber,
            verified: true,
            totalBookings: 1,
            totalSpent: bookingData.totalPrice,
            status: 'Verified'
          }
        ];
      }
    });

    showToast(`Booking ${newBooking.id} created successfully!`, 'success');
    return newBooking;
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(prev => {
      const updated = prev.map(b => {
        if (b.id === bookingId) {
          // If status changes to Active, update car status to Rented
          if (newStatus === 'Active') {
            updateCarStatus(b.carId, 'Rented');
          } else if (newStatus === 'Completed' || newStatus === 'Cancelled') {
            updateCarStatus(b.carId, 'Available');
          }
          return { ...b, status: newStatus };
        }
        return b;
      });
      return updated;
    });

    showToast(`Booking ${bookingId} marked as ${newStatus}`, 'info');
  };

  const cancelBooking = (bookingId) => {
    updateBookingStatus(bookingId, 'Cancelled');
  };

  const resetAllData = () => {
    setCars([]);
    setBookings([]);
    setCustomers([]);
    localStorage.removeItem('drivepulse_cars');
    localStorage.removeItem('drivepulse_bookings');
    localStorage.removeItem('drivepulse_customers');
    showToast('Local data cleared.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activePanel,
        setActivePanel,
        navigateToPanel,
        adminTab,
        setAdminTab,
        theme,
        toggleTheme,
        cars,
        addCar,
        updateCarStatus,
        deleteCar,
        bookings,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        customers,
        selectedCarForBooking,
        setSelectedCarForBooking,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isMyBookingsOpen,
        setIsMyBookingsOpen,
        isAddCarModalOpen,
        setIsAddCarModalOpen,
        toast,
        showToast,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
