import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export type BinCategory = 'waste' | 'compost' | 'recycle';

export interface ScanResult {
  id: string;
  itemName: string;
  binCategory: BinCategory;
  confidence: number;
  explanation: string;
  timestamp: Date;
  pointsEarned: number;
}

export interface Bin {
  id: string;
  type: BinCategory;
  lat: number;
  lng: number;
  address: string;
  distance?: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  isCurrentUser?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  rank: number;
  avatarUrl?: string;
}

interface AppContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;

  // Scan state
  scanHistory: ScanResult[];
  currentScan: ScanResult | null;
  isScanning: boolean;
  performScan: (imageData: string) => Promise<void>;
  
  // Map state
  bins: Bin[];
  filteredBins: Bin[];
  binFilters: BinCategory[];
  toggleBinFilter: (category: BinCategory) => void;

  // Leaderboard state
  leaderboardScope: 'local' | 'national' | 'worldwide';
  setLeaderboardScope: (scope: 'local' | 'national' | 'worldwide') => void;
  leaderboardData: LeaderboardEntry[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data generators
const generateMockBins = (): Bin[] => [
  { id: '1', type: 'recycle', lat: 37.7749, lng: -122.4194, address: '123 Market St, San Francisco, CA', distance: 0.2 },
  { id: '2', type: 'waste', lat: 37.7739, lng: -122.4312, address: '456 Mission St, San Francisco, CA', distance: 0.5 },
  { id: '3', type: 'compost', lat: 37.7849, lng: -122.4074, address: '789 Pine St, San Francisco, CA', distance: 0.8 },
  { id: '4', type: 'recycle', lat: 37.7699, lng: -122.4264, address: '321 Howard St, San Francisco, CA', distance: 0.4 },
  { id: '5', type: 'waste', lat: 37.7889, lng: -122.4124, address: '654 Geary St, San Francisco, CA', distance: 1.2 },
  { id: '6', type: 'compost', lat: 37.7779, lng: -122.4184, address: '987 Post St, San Francisco, CA', distance: 0.3 },
];

const generateMockLeaderboard = (scope: string, currentUserId: string): LeaderboardEntry[] => {
  const baseUsers = [
    { username: 'EcoWarrior2024', points: 15420 },
    { username: 'GreenThumb', points: 12350 },
    { username: 'RecyclePro', points: 10890 },
    { username: 'EarthSaver', points: 9560 },
    { username: 'ZeroWasteKing', points: 8745 },
    { username: 'CompostChamp', points: 7920 },
    { username: 'SustainableLife', points: 6850 },
    { username: 'PlanetFirst', points: 5940 },
    { username: 'GreenHero', points: 5120 },
    { username: 'YouTheUser', points: 4280 },
  ];

  return baseUsers.map((user, index) => ({
    rank: index + 1,
    username: user.username,
    points: user.points,
    isCurrentUser: user.username === 'YouTheUser',
  }));
};

const generateMockScanHistory = (): ScanResult[] => [
  {
    id: '1',
    itemName: 'Plastic Water Bottle',
    binCategory: 'recycle',
    confidence: 95,
    explanation: 'PET plastic bottles are recyclable. Please empty and rinse before recycling.',
    timestamp: new Date('2026-02-14T10:30:00'),
    pointsEarned: 10,
  },
  {
    id: '2',
    itemName: 'Banana Peel',
    binCategory: 'compost',
    confidence: 98,
    explanation: 'Fruit peels are compostable organic waste. Great for nutrient-rich soil!',
    timestamp: new Date('2026-02-13T15:45:00'),
    pointsEarned: 10,
  },
  {
    id: '3',
    itemName: 'Coffee Cup (with lid)',
    binCategory: 'waste',
    confidence: 87,
    explanation: 'Most coffee cups have plastic lining and cannot be recycled. Lid should be separated.',
    timestamp: new Date('2026-02-12T09:15:00'),
    pointsEarned: 10,
  },
  {
    id: '4',
    itemName: 'Cardboard Box',
    binCategory: 'recycle',
    confidence: 99,
    explanation: 'Flatten cardboard boxes before recycling to save space.',
    timestamp: new Date('2026-02-11T14:20:00'),
    pointsEarned: 10,
  },
  {
    id: '5',
    itemName: 'Apple Core',
    binCategory: 'compost',
    confidence: 97,
    explanation: 'Fruit cores are perfect for composting.',
    timestamp: new Date('2026-02-10T12:00:00'),
    pointsEarned: 10,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [bins] = useState<Bin[]>(generateMockBins());
  const [binFilters, setBinFilters] = useState<BinCategory[]>(['waste', 'compost', 'recycle']);
  const [leaderboardScope, setLeaderboardScope] = useState<'local' | 'national' | 'worldwide'>('local');

  // Mock login function
  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      username: 'YouTheUser',
      email: email,
      points: 4280,
      rank: 10,
      avatarUrl: undefined,
    };
    
    setUser(mockUser);
    setScanHistory(generateMockScanHistory());
  };

  // Mock signup function
  const signup = async (email: string, password: string, username: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      username: username,
      email: email,
      points: 0,
      rank: 999,
      avatarUrl: undefined,
    };
    
    setUser(mockUser);
    setScanHistory([]);
  };

  // Mock guest login
  const loginAsGuest = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: 'guest',
      username: 'Guest User',
      email: 'guest@sortify.app',
      points: 0,
      rank: 999,
      avatarUrl: undefined,
    };
    
    setUser(mockUser);
    setScanHistory([]);
  };

  const logout = () => {
    setUser(null);
    setScanHistory([]);
    setCurrentScan(null);
  };

  // Mock scan function
  const performScan = async (imageData: string) => {
    setIsScanning(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random mock result
    const mockResults = [
      {
        itemName: 'Plastic Bottle',
        binCategory: 'recycle' as BinCategory,
        confidence: 94,
        explanation: 'Clean plastic bottles can be recycled. Remove cap and rinse before recycling.',
      },
      {
        itemName: 'Food Waste',
        binCategory: 'compost' as BinCategory,
        confidence: 91,
        explanation: 'Organic food scraps are perfect for composting.',
      },
      {
        itemName: 'Pizza Box (soiled)',
        binCategory: 'waste' as BinCategory,
        confidence: 88,
        explanation: 'Grease-stained pizza boxes cannot be recycled and should go to waste.',
      },
      {
        itemName: 'Aluminum Can',
        binCategory: 'recycle' as BinCategory,
        confidence: 99,
        explanation: 'Aluminum cans are highly recyclable. Rinse before recycling.',
      },
    ];
    
    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    
    const newScan: ScanResult = {
      id: Date.now().toString(),
      ...randomResult,
      timestamp: new Date(),
      pointsEarned: 10,
    };
    
    setCurrentScan(newScan);
    setScanHistory(prev => [newScan, ...prev]);
    
    // Update user points
    if (user) {
      setUser({
        ...user,
        points: user.points + 10,
      });
    }
    
    setIsScanning(false);
  };

  const toggleBinFilter = (category: BinCategory) => {
    setBinFilters(prev => {
      if (prev.includes(category)) {
        // Don't allow removing all filters
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const filteredBins = bins.filter(bin => binFilters.includes(bin.type));
  
  const leaderboardData = user 
    ? generateMockLeaderboard(leaderboardScope, user.id)
    : [];

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        loginAsGuest,
        logout,
        scanHistory,
        currentScan,
        isScanning,
        performScan,
        bins,
        filteredBins,
        binFilters,
        toggleBinFilter,
        leaderboardScope,
        setLeaderboardScope,
        leaderboardData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
