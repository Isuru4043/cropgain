"use client";
import React, { useState } from 'react';

const TouristBunglowAccount = () => {
  // Main application state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSection, setActiveSection] = useState('view'); // 'view' or 'add'
  
  // State for different data types
  const [bookings, setBookings] = useState([
    { id: 1, room: '101', guest: 'John Doe', checkIn: '2024-01-07', checkOut: '2024-01-10', amount: 1500 },
    { id: 2, room: '102', guest: 'Jane Smith', checkIn: '2024-01-08', checkOut: '2024-01-12', amount: 2000 },
  ]);

  type IncomeCategories = {
    roomRentals: {
      standardRooms: number;
      deluxeRooms: number;
      suites: number;
    };
    foodBeverages: {
      restaurant: number;
      roomService: number;
      bar: number;
    };
    events: {
      conferences: number;
      weddings: number;
      parties: number;
    };
    miscellaneous: {
      tours: number;
      souvenirs: number;
      other: number;
    };
  };
  
  
  const [income, setIncome] = useState<IncomeCategories>({
    roomRentals: {
      standardRooms: 25000,
      deluxeRooms: 35000,
      suites: 45000
    },
    foodBeverages: {
      restaurant: 15000,
      roomService: 8000,
      bar: 12000
    },
    events: {
      conferences: 20000,
      weddings: 50000,
      parties: 15000
    },
    miscellaneous: {
      tours: 5000,
      souvenirs: 3000,
      other: 2000
    }
  });

  type ExpenseCategories = {
    maintenance: {
      repairs: number;
      cleaning: number;
      equipment: number;
    };
    utilities: {
      electricity: number;
      water: number;
      gas: number;
    };
    staff: {
      salaries: number;
      benefits: number;
      training: number;
    };
    consumables: {
      foodStock: number;
      toiletries: number;
      supplies: number;
    };
    marketing: {
      advertising: number;
      promotions: number;
      website: number;
    };
    insurance: {
      property: number;
      liability: number;
      employee: number;
    };
  };

  const [expenses, setExpenses] = useState<ExpenseCategories>({
    maintenance: {
      repairs: 10000,
      cleaning: 5000,
      equipment: 8000
    },
    utilities: {
      electricity: 15000,
      water: 5000,
      gas: 3000
    },
    staff: {
      salaries: 30000,
      benefits: 5000,
      training: 2000
    },
    consumables: {
      foodStock: 20000,
      toiletries: 5000,
      supplies: 3000
    },
    marketing: {
      advertising: 8000,
      promotions: 5000,
      website: 2000
    },
    insurance: {
      property: 10000,
      liability: 5000,
      employee: 3000
    }
  });

  // Form for new booking
  const BookingForm = () => {
    const [newBooking, setNewBooking] = useState({
      room: '',
      guest: '',
      checkIn: '',
      checkOut: '',
      amount: ''
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setBookings([...bookings, { ...newBooking, id: bookings.length + 1, amount: Number(newBooking.amount) }]);
      setNewBooking({ room: '', guest: '', checkIn: '', checkOut: '', amount: '' });
      setActiveSection('view');
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">New Booking</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Room Number"
            value={newBooking.room}
            onChange={(e) => setNewBooking({ ...newBooking, room: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Guest Name"
            value={newBooking.guest}
            onChange={(e) => setNewBooking({ ...newBooking, guest: e.target.value })}
        className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={newBooking.amount}
            onChange={(e) => setNewBooking({ ...newBooking, amount: e.target.value })}
            className="p-2 border rounded"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setActiveSection('view')}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Booking
          </button>
        </div>
      </form>
    );
  };

  // Form for income/expense entry
  const FinanceForm = ({ type, category }: { type: 'income' | 'expense'; category: keyof IncomeCategories | keyof ExpenseCategories }) => {
    const [values, setValues] = useState<{ [key: string]: number }>({});
    const data = type === 'income' ? income : expenses;
    const setData = type === 'income' ? setIncome : setExpenses;
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (type === 'income' && category in income) {
        setIncome((prevIncome) => ({
          ...prevIncome,
          [category]: {
            ...(prevIncome[category as keyof IncomeCategories]),
            ...values,
          },
        }));
      } else if (type === 'expense' && category in expenses) {
        setExpenses((prevExpenses) => ({
          ...prevExpenses,
          [category]: {
            ...(prevExpenses[category as keyof ExpenseCategories]),
            ...values,
          },
        }));
      }
  
      setValues({});
      setActiveSection('view');
    };
  
    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Update {category}</h3>
          <div className="space-y-4">
            {/* Narrowing the type with type assertions */}
            {type === 'income' && category in income && (
              Object.keys((income[category as keyof IncomeCategories] as { [key: string]: number })).map((key) => (
                <div key={key} className="grid grid-cols-2 gap-4">
                  <label className="text-gray-700">{key}</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={values[key] || ''}
                    onChange={(e) => setValues({ ...values, [key]: Number(e.target.value) })}
                    className="p-2 border rounded"
                    required
                  />
                </div>
              ))
            )}
            {type === 'expense' && category in expenses && (
              Object.keys((expenses[category as keyof ExpenseCategories] as { [key: string]: number })).map((key) => (
                <div key={key} className="grid grid-cols-2 gap-4">
                  <label className="text-gray-700">{key}</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={values[key] || ''}
                    onChange={(e) => setValues({ ...values, [key]: Number(e.target.value) })}
                    className="p-2 border rounded"
                    required
                  />
                </div>
              ))
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setActiveSection('view')}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update {category}
            </button>
          </div>
        </form>
      );
    };
  
  // Modified Dashboard Component
  const Dashboard = () => {
    const totalIncome = Object.values(income).reduce(
      (sum, category) => sum + Object.values(category).reduce((a, b) => a + b, 0),
      0
    );

    const totalExpenses = Object.values(expenses).reduce(
      (sum, category) => sum + Object.values(category).reduce((a, b) => a + b, 0),
      0
    );

    const occupancyRate = (bookings.length / 10 * 100).toFixed(0); // Assuming 10 total rooms

    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Room Bookings" 
            value={`${occupancyRate}%`}
            description="Current occupancy rate"
          />
          <StatCard 
            title="Total Income" 
            value={totalIncome.toLocaleString()}
            description="All categories"
          />
          <StatCard 
            title="Total Expenses" 
            value={totalExpenses.toLocaleString()}
            description="All categories"
          />
          <StatCard 
            title="Net Income" 
            value={(totalIncome - totalExpenses).toLocaleString()}
            description="Income - Expenses"
          />
        </div>

        {/* Current Bookings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Current Bookings</h3>
            <button
              onClick={() => setActiveSection('addBooking')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Booking
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Room</th>
                  <th className="text-left p-2">Guest</th>
                  <th className="text-left p-2">Check In</th>
                  <th className="text-left p-2">Check Out</th>
                  <th className="text-right p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id} className="border-b">
                    <td className="p-2">{booking.room}</td>
                    <td className="p-2">{booking.guest}</td>
                    <td className="p-2">{booking.checkIn}</td>
                    <td className="p-2">{booking.checkOut}</td>
                    <td className="p-2 text-right">{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Modified Income Tracking Component
  const IncomeTracking = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(income).map(([category, values]) => (
          <div key={category} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{category}</h3>
              <button
                onClick={() => setActiveSection(`update-income-${category}`)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
            <div className="space-y-2">
              {Object.entries(values).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-500">{key}</span>
                  <span className="font-medium">{value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Modified Expense Tracking Component
  const ExpenseTracking = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(expenses).map(([category, values]) => (
          <div key={category} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{category}</h3>
              <button
                onClick={() => setActiveSection(`update-expense-${category}`)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
            <div className="space-y-2">
              {Object.entries(values).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-500">{key}</span>
                  <span className="font-medium">{value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Reusable Components
  const StatCard = ({ title, value, description }: { title: string; value: string; description: string }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );

  // Custom Tab Component
  const Tab = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      className={`px-4 py-2 rounded-lg ${
        active 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  // Render appropriate form or view based on activeSection
  const renderContent = () => {
    if (activeSection === 'addBooking') {
      return <BookingForm />;
    }

    if (activeSection.startsWith('update-income-')) {
      const category = activeSection.replace('update-income-', '') as keyof typeof income;
      return <FinanceForm type="income" category={category} />;
    }

    if (activeSection.startsWith('update-expense-')) {
      const category = activeSection.replace('update-expense-', '');
      return <FinanceForm type="expense" category={category as keyof typeof expenses} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'income':
        return <IncomeTracking />;
      case 'expenses':
        return <ExpenseTracking />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tourist Bunglow Account</h1>
      
      <div className="flex space-x-4 mb-6">
        <Tab 
          label="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => {
            setActiveTab('dashboard');
            setActiveSection('view');
          }} 
        />
        <Tab 
          label="Income" 
          active={activeTab === 'income'} 
          onClick={() => {
            setActiveTab('income');
            setActiveSection('view');
          }} 
        />
        <Tab 
          label="Expenses" 
          active={activeTab === 'expenses'} 
          onClick={() => {
            setActiveTab('expenses');
            setActiveSection('view');
          }} 
        />
      </div>

      {renderContent()}

      {/* Add a save changes notification */}
      <div className="fixed bottom-4 right-4">
        {activeSection !== 'view' && (
          <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">
              Remember to save your changes before switching tabs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristBunglowAccount