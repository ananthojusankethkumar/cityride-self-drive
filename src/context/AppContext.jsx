import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

const AppContext = createContext();

const getPanelFromPath = () => {
  return window.location.pathname.startsWith('/admin') ? 'admin' : 'customer';
};

export const AppProvider = ({ children }) => {
  const [activePanel, setActivePanel] = useState(getPanelFromPath);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('drivepulse_theme') || 'dark');

  // Data from Firestore
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth state
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Modal states
  const [selectedCarForBooking, setSelectedCarForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  // ── Firestore real-time listeners ─────────────────────────────────────────

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'cars'), orderBy('createdAt', 'desc')),
      snap => {
        setCars(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      err => { console.error('cars listener:', err); setLoading(false); }
    );
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'bookings'), orderBy('createdAt', 'desc')),
      snap => setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      err => console.error('bookings listener:', err)
    );
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'customers'),
      snap => setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      err => console.error('customers listener:', err)
    );
    return unsub;
  }, []);

  // ── Panel routing ──────────────────────────────────────────────────────────

  useEffect(() => {
    const sync = () => setActivePanel(getPanelFromPath());
    window.addEventListener('popstate', sync);
    sync();
    return () => window.removeEventListener('popstate', sync);
  }, []);

  const navigateToPanel = (panel) => {
    window.history.pushState({}, '', panel === 'admin' ? '/admin' : '/');
    setActivePanel(panel);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // ── Theme ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    localStorage.setItem('drivepulse_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // ── Auth ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setAdminUser(user);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const adminLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Invalid email or password.' };
    }
  };

  const adminLogout = async () => {
    await signOut(auth);
    navigateToPanel('customer');
    showToast('Logged out successfully.', 'info');
  };

  // ── Toast ──────────────────────────────────────────────────────────────────

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Fleet actions ──────────────────────────────────────────────────────────

  const addCar = async (newCarData) => {
    try {
      await addDoc(collection(db, 'cars'), {
        ...newCarData,
        status: 'Available',
        rating: 5.0,
        reviewsCount: 1,
        createdAt: serverTimestamp()
      });
      showToast(`Vehicle "${newCarData.name}" added to fleet!`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to add vehicle.', 'error');
    }
  };

  const updateCarStatus = async (carId, newStatus) => {
    try {
      await updateDoc(doc(db, 'cars', carId), { status: newStatus });
      showToast(`Car status updated to ${newStatus}`, 'info');
    } catch (e) {
      console.error(e);
      showToast('Failed to update car status.', 'error');
    }
  };

  const deleteCar = async (carId) => {
    const carName = cars.find(c => c.id === carId)?.name;
    try {
      await deleteDoc(doc(db, 'cars', carId));
      showToast(`Removed "${carName}" from fleet`, 'warning');
    } catch (e) {
      console.error(e);
      showToast('Failed to remove vehicle.', 'error');
    }
  };

  // ── Booking actions ────────────────────────────────────────────────────────

  const createBooking = async (bookingData) => {
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newBooking = {
      ...bookingData,
      id: bookingId,
      status: 'Confirmed',
      createdAt,
      createdAtTimestamp: serverTimestamp()
    };

    try {
      // Save booking with custom ID
      await setDoc(doc(db, 'bookings', bookingId), newBooking);

      // Upsert customer
      const existing = customers.find(
        c => c.email.toLowerCase() === bookingData.customerEmail.toLowerCase()
      );

      if (existing) {
        await updateDoc(doc(db, 'customers', existing.id), {
          totalBookings: (existing.totalBookings || 0) + 1,
          totalSpent: (existing.totalSpent || 0) + bookingData.totalPrice
        });
      } else {
        const custId = `CUST-${Math.floor(100 + Math.random() * 900)}`;
        await setDoc(doc(db, 'customers', custId), {
          id: custId,
          name: bookingData.customerName,
          email: bookingData.customerEmail,
          phone: bookingData.customerPhone,
          licenseNumber: bookingData.licenseNumber,
          verified: true,
          totalBookings: 1,
          totalSpent: bookingData.totalPrice,
          status: 'Verified'
        });
      }

      showToast(`Booking ${bookingId} created successfully!`, 'success');
      return newBooking;
    } catch (e) {
      console.error(e);
      showToast('Failed to create booking.', 'error');
      return null;
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      await updateDoc(doc(db, 'bookings', bookingId), { status: newStatus });

      if (booking) {
        if (newStatus === 'Active') {
          await updateDoc(doc(db, 'cars', booking.carId), { status: 'Rented' });
        } else if (newStatus === 'Completed' || newStatus === 'Cancelled') {
          await updateDoc(doc(db, 'cars', booking.carId), { status: 'Available' });
        }
      }

      showToast(`Booking ${bookingId} marked as ${newStatus}`, 'info');
    } catch (e) {
      console.error(e);
      showToast('Failed to update booking.', 'error');
    }
  };

  const cancelBooking = (bookingId) => updateBookingStatus(bookingId, 'Cancelled');

  const resetAllData = async () => {
    // Just a utility — deletes all docs in all three collections
    try {
      await Promise.all([
        ...cars.map(c => deleteDoc(doc(db, 'cars', c.id))),
        ...bookings.map(b => deleteDoc(doc(db, 'bookings', b.id))),
        ...customers.map(cu => deleteDoc(doc(db, 'customers', cu.id)))
      ]);
      showToast('All data cleared.', 'info');
    } catch (e) {
      console.error(e);
      showToast('Failed to clear data.', 'error');
    }
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
        loading,
        adminUser,
        authLoading,
        adminLogin,
        adminLogout,
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
