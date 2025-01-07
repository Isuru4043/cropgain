"use client";
import React, { useState } from 'react';

const PlantNurseryAccounting = () => {
  // Main state management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSection, setActiveSection] = useState('view');

  // Sales data state
  type SalesData = {
    plants: Record<string, { amount: number; quantity: number }>;
    seeds: Record<string, { amount: number; quantity: number }>;
    supplies: Record<string, { amount: number; quantity: number }>;
    services: Record<string, { amount: number; projects: number }>;
  };
  
  const [sales, setSales] = useState<SalesData>({
    plants: {
      flowering: { amount: 25000, quantity: 150 },
      medicinal: { amount: 35000, quantity: 200 },
      decorative: { amount: 45000, quantity: 180 }
    },
    seeds: {
      vegetable: { amount: 15000, quantity: 500 },
      fruit: { amount: 12000, quantity: 300 },
      flower: { amount: 8000, quantity: 400 }
    },
    supplies: {
      pots: { amount: 20000, quantity: 400 },
      fertilizers: { amount: 15000, quantity: 250 },
      tools: { amount: 10000, quantity: 100 }
    },
    services: {
      landscaping: { amount: 50000, projects: 10 },
      maintenance: { amount: 30000, projects: 15 },
      consultation: { amount: 20000, projects: 20 }
    }
  });

  // Expenses data state
  const [expenses, setExpenses] = useState({
    inventory: {
      plants: 40000,
      seeds: 20000,
      supplies: 25000
    },
    utilities: {
      water: 5000,
      electricity: 8000,
      heating: 6000
    },
    salaries: {
      gardeners: 30000,
      sales: 25000,
      delivery: 20000
    },
    maintenance: {
      greenhouse: 15000,
      equipment: 10000,
      vehicles: 8000
    },
    transport: {
      fuel: 12000,
      repairs: 8000,
      insurance: 6000
    },
    marketing: {
      online: 5000,
      events: 8000,
      print: 3000
    }
  });

  // Inventory data state
  const [inventory, setInventory] = useState({
    plants: {
      flowering: { stock: 200, minLevel: 50 },
      medicinal: { stock: 150, minLevel: 40 },
      decorative: { stock: 180, minLevel: 45 }
    },
    seeds: {
      vegetable: { stock: 1000, minLevel: 200 },
      fruit: { stock: 800, minLevel: 150 },
      flower: { stock: 900, minLevel: 180 }
    },
    supplies: {
      pots: { stock: 500, minLevel: 100 },
      fertilizers: { stock: 300, minLevel: 80 },
      tools: { stock: 150, minLevel: 30 }
    }
  });

  // Custom Card Component with Green Theme
  const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ children, className = '' }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 ${className}`}>
      {children}
    </div>
  );

  // Dashboard Component
  const Dashboard = () => {
    // Calculate totals
    const totalSales = Object.values(sales).reduce(
      (sum, category) => sum + Object.values(category).reduce((a, b) => a + b.amount, 0),
      0
    );

    const totalExpenses = Object.values(expenses).reduce(
      (sum, category) => sum + Object.values(category).reduce((a, b) => a + b, 0),
      0
    );

    const netProfit = totalSales - totalExpenses;

    // Get low stock alerts
    const lowStockItems = Object.entries(inventory).flatMap(([category, items]) =>
      Object.entries(items)
        .filter(([_, data]) => data.stock <= data.minLevel)
        .map(([item, data]) => ({ category, item, stock: data.stock, minLevel: data.minLevel }))
    );

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <h3 className="text-lg font-semibold text-green-700">Total Sales</h3>
            <p className="text-2xl font-bold text-gray-800">{totalSales.toLocaleString()}</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-green-700">Total Expenses</h3>
            <p className="text-2xl font-bold text-gray-800">{totalExpenses.toLocaleString()}</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-green-700">Net Profit</h3>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netProfit.toLocaleString()}
            </p>
          </Card>
        </div>

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-green-700 mb-4">Low Stock Alerts</h3>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={`${item.category}-${item.item}`} className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="text-gray-800">
                    {item.category} - {item.item}
                  </span>
                  <span className="text-red-600 font-medium">
                    Stock: {item.stock} (Min: {item.minLevel})
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Category Performance */}
        <Card>
          <h3 className="text-lg font-semibold text-green-700 mb-4">Category Performance</h3>
          <div className="space-y-4">
            {Object.entries(sales).map(([category, data]) => {
              const categoryTotal = Object.values(data).reduce((sum, item) => sum + item.amount, 0);
              const percentage = ((categoryTotal / totalSales) * 100).toFixed(1);
              
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="capitalize">{category}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  };

  // Sales Form Component
  const SalesForm: React.FC<{ category: string; data: any; onUpdate: (category: string, values: any) => void }> = ({ category, data, onUpdate }) => {
    const [values, setValues] = useState(data);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onUpdate(category, values);
      setActiveSection('view');
    };

    return (
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700 capitalize mb-4">{category} Sales</h3>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-600 capitalize">{key}</label>
                <input
                  type="number"
                  value={values[key].amount}
                  onChange={(e) => setValues({
                    ...values,
                    [key]: { ...values[key], amount: Number(e.target.value) }
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Quantity/Projects</label>
                <input
                  type="number"
                  value={values[key].quantity || values[key].projects}
                  onChange={(e) => setValues({
                    ...values,
                    [key]: { 
                      ...values[key], 
                      [values[key].quantity ? 'quantity' : 'projects']: Number(e.target.value)
                    }
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setActiveSection('view')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Card>
    );
  };

  // Sales Component
  const Sales = () => {
    const handleUpdateSales = (category: string, values: any) => {
      setSales({
        ...sales,
        [category]: values
      });
    };

    if (activeSection.startsWith('edit-')) {
      const category = activeSection.replace('edit-', '');
      return <SalesForm category={category} data={(sales as any)[category]} onUpdate={handleUpdateSales} />;
    }

    if (activeSection.startsWith('edit-')) {
      const category = activeSection.replace('edit-', '');
      return <SalesForm category={category} data={sales[category as keyof SalesData]} onUpdate={handleUpdateSales} />;
    }

    return (
      <div className="space-y-6">
        {Object.entries(sales).map(([category, data]) => (
          <Card key={category}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-700 capitalize">{category}</h3>
              <button
                onClick={() => setActiveSection(`edit-${category}`)}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Update
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Item</th>
                    <th className="text-right p-2">Amount</th>
                    <th className="text-right p-2">
                      {category === 'services' ? 'Projects' : 'Quantity'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data).map(([item, values]) => (
                    <tr key={item} className="border-b">
                      <td className="p-2 capitalize">{item}</td>
                      <td className="p-2 text-right">{values.amount.toLocaleString()}</td>
                      <td className="p-2 text-right">
                        {values.quantity?.toLocaleString() || values.projects?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    );
  };

// expenses form component
  const ExpensesForm: React.FC<{ category: string; data: any; onUpdate: (category: string, values: any) => void }> = ({ category, data, onUpdate }) => {
    const [values, setValues] = useState(data);
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onUpdate(category, values);
      setActiveSection('view');
    };
  
    return (
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700 capitalize mb-4">{category} Expenses</h3>
          {Object.entries(data).map(([item, amount]) => (
            <div key={item} className="grid grid-cols-2 gap-4">
              <label className="text-sm text-gray-600 capitalize">{item}</label>
              <input
                type="number"
                value={values[item]}
                onChange={(e) => setValues({ ...values, [item]: Number(e.target.value) })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          ))}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setActiveSection('view')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Card>
    );
  };

  //expenses component
  const Expenses = () => {
    const handleUpdateExpenses = (category: string, values: any) => {
      setExpenses({
        ...expenses,
        [category]: values,
      });
    };
  
    if (activeSection.startsWith('edit-')) {
      const category = activeSection.replace('edit-', '');
      return <ExpensesForm category={category} data={(expenses as any)[category]} onUpdate={handleUpdateExpenses} />;
    }
  
    return (
      <div className="space-y-6">
        {Object.entries(expenses).map(([category, data]) => (
          <Card key={category}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-700 capitalize">{category}</h3>
              <button
                onClick={() => setActiveSection(`edit-${category}`)}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Update
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Item</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data).map(([item, amount]) => (
                    <tr key={item} className="border-b">
                      <td className="p-2 capitalize">{item}</td>
                      <td className="p-2 text-right">{amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  

  //inventory form component
  const InventoryForm: React.FC<{ category: string; data: any; onUpdate: (category: string, values: any) => void }> = ({ category, data, onUpdate }) => {
    const [values, setValues] = useState(data);
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onUpdate(category, values);
      setActiveSection('view');
    };
  
    return (
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700 capitalize mb-4">{category} Inventory</h3>
          {Object.entries(data).map(([item, details]) => (
            <div key={item} className="grid grid-cols-3 gap-4">
              <label className="text-sm text-gray-600 capitalize">{item}</label>
              <input
                type="number"
                value={values[item].stock}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [item]: { ...values[item], stock: Number(e.target.value) },
                  })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="number"
                value={values[item].minLevel}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [item]: { ...values[item], minLevel: Number(e.target.value) },
                  })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          ))}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setActiveSection('view')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Card>
    );
  };
  
  //inventory component
  const Inventory = () => {
  const handleUpdateInventory = (category: string, values: any) => {
    setInventory({
      ...inventory,
      [category]: values,
    });
  };

  if (activeSection.startsWith('edit-')) {
    const category = activeSection.replace('edit-', '');
    return <InventoryForm category={category} data={(inventory as any)[category]} onUpdate={handleUpdateInventory} />;
  }

  return (
    <div className="space-y-6">
      {Object.entries(inventory).map(([category, data]) => (
        <Card key={category}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-green-700 capitalize">{category}</h3>
            <button
              onClick={() => setActiveSection(`edit-${category}`)}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              Update
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item</th>
                  <th className="text-right p-2">Stock</th>
                  <th className="text-right p-2">Min Level</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data).map(([item, details]) => (
                  <tr key={item} className="border-b">
                    <td className="p-2 capitalize">{item}</td>
                    <td className="p-2 text-right">{details.stock}</td>
                    <td className="p-2 text-right">{details.minLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  );
};

  

  // Custom Tab Component
  const Tab: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button
      className={`px-4 py-2 rounded-lg ${
        active 
          ? 'bg-green-500 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Plant Nursery Accounting</h1>
      
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
          label="Sales" 
          active={activeTab === 'sales'} 
          onClick={() => {
            setActiveTab('sales');
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
        <Tab 
          label="Inventory" 
          active={activeTab === 'inventory'} 
          onClick={() => {
            setActiveTab('inventory');
            setActiveSection('view');
          }} 
        />
      </div>

      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'sales' && <Sales />}
      {activeTab === 'expenses' && <Expenses />} {/* Render Expenses */}
      {activeTab === 'inventory' && <Inventory />} {/* Render Inventory */}
    </div>
  );
};

export default PlantNurseryAccounting;