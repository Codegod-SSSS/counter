import React, { createContext, useContext, useEffect, useState } from 'react';
import { Expense, Category, SavingsGoal, UserSettings } from './types';
import { auth, db } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { handleFirestoreError, OperationType } from './lib/firestore-error';

interface BudgetContextType {
  settings: UserSettings;
  expenses: Expense[];
  categories: Category[];
  goals: SavingsGoal[];
  setSettings: (settings: UserSettings) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => Promise<void>;
  updateGoal: (goal: SavingsGoal) => Promise<void>;
  resetData: () => Promise<void>;
  loading: boolean;
  currentUser: User | null;
}

const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Food', color: '#ef4444', icon: 'Utensils', monthlyLimit: 500 },
  { name: 'Transport', color: '#3b82f6', icon: 'Car', monthlyLimit: 300 },
  { name: 'Rent', color: '#10b981', icon: 'Home', monthlyLimit: 1200 },
  { name: 'Health', color: '#f59e0b', icon: 'Activity', monthlyLimit: 200 },
  { name: 'Utilities', color: '#8b5cf6', icon: 'Zap', monthlyLimit: 200 },
  { name: 'Shopping', color: '#ec4899', icon: 'ShoppingBag', monthlyLimit: 400 },
];

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettingsState] = useState<UserSettings>({ 
    budgetAmount: 0, budgetType: 'monthly', currency: 'GHS', onboarded: false, theme: 'light', welcomed: false, isAuthenticated: false, language: 'en' 
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  // 1. Test connection on boot
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // 2. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setLoading(false);
        // Reset state on logout
        setExpenses([]);
        setCategories([]);
        setGoals([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // 3. Data Sync
  useEffect(() => {
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);
    const expensesRef = collection(db, 'users', currentUser.uid, 'expenses');
    const categoriesRef = collection(db, 'users', currentUser.uid, 'categories');
    const goalsRef = collection(db, 'users', currentUser.uid, 'goals');

    const unsubSettings = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserSettings;
        setSettingsState({ ...data, isAuthenticated: true });
      } else {
        // First time user initialization could happen here or in Login
        setLoading(false);
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`));

    const unsubExpenses = onSnapshot(query(expensesRef, orderBy('date', 'desc')), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Expense));
      setExpenses(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${currentUser.uid}/expenses`));

    const unsubCategories = onSnapshot(categoriesRef, (snapshot) => {
      if (snapshot.empty) {
        // Initialize default categories if none exist
        DEFAULT_CATEGORIES.forEach(async (cat, i) => {
          const id = `cat-${i}`;
          await setDoc(doc(db, 'users', currentUser.uid, 'categories', id), { ...cat, id });
        });
      } else {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Category));
        setCategories(data);
      }
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${currentUser.uid}/categories`));

    const unsubGoals = onSnapshot(goalsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as SavingsGoal));
      setGoals(data);
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${currentUser.uid}/goals`));

    return () => {
      unsubSettings();
      unsubExpenses();
      unsubCategories();
      unsubGoals();
    };
  }, [currentUser]);

  // 4. Theme handling
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'gold');

    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }
  }, [settings.theme]);

  // 5. Actions
  const setSettings = async (newSettings: UserSettings) => {
    setSettingsState(newSettings);
    if (!currentUser) return;
    const path = `users/${currentUser.uid}`;
    try {
      // Filter out non-serializable or unnecessary fields for Firestore
      const { isAuthenticated, ...serializableSettings } = newSettings;
      await setDoc(doc(db, path), serializableSettings, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/expenses`;
    try {
      const docRef = await addDoc(collection(db, path), expense);
      await updateDoc(docRef, { id: docRef.id });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const removeExpense = async (id: string) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/expenses/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const updateExpense = async (expense: Expense) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/expenses/${expense.id}`;
    try {
      await setDoc(doc(db, path), expense);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/categories`;
    try {
      const docRef = await addDoc(collection(db, path), category);
      await updateDoc(docRef, { id: docRef.id });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const removeCategory = async (id: string) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/categories/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const addGoal = async (goal: Omit<SavingsGoal, 'id'>) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/goals`;
    try {
      const docRef = await addDoc(collection(db, path), goal);
      await updateDoc(docRef, { id: docRef.id });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateGoal = async (goal: SavingsGoal) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/goals/${goal.id}`;
    try {
      await setDoc(doc(db, path), goal);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const resetData = async () => {
    // For Firebase, this usually means logging out or deleting the user's data
    // Here we'll just log out for safety, as deleting subcollections requires recursion
    await auth.signOut();
    window.location.reload();
  };

  return (
    <BudgetContext.Provider value={{
      settings, expenses, categories, goals, loading, currentUser,
      setSettings, addExpense, removeExpense, updateExpense,
      addCategory, removeCategory, addGoal, updateGoal, resetData
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudget must be used within a BudgetProvider');
  return context;
};
