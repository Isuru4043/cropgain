"use client"
import React, { useState, useEffect } from 'react';

// Re-using custom components from the original file
const Alert = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 rounded-lg border ${className}`}>
    {children}
  </div>
);

const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm">{children}</div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 pb-4">{children}</div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold">{children}</h3>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 pt-0">{children}</div>
);

// Types
interface SOPLHistoryEntry {
  id: string;
  date: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  netProfitLoss: number;
  incomes: any[];
  expenses: any[];
}

const SOPLHistory = () => {
  const [entries, setEntries] = useState<SOPLHistoryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<SOPLHistoryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedEntry, setSelectedEntry] = useState<SOPLHistoryEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof SOPLHistoryEntry; direction: 'asc' | 'desc' } | null>(null);

  // Mock data - replace with actual data fetching
  useEffect(() => {
    const mockData: SOPLHistoryEntry[] = [
      {
        id: '1',
        date: '2024-01-01',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        totalIncome: 50000,
        totalExpenses: 30000,
        netProfitLoss: 20000,
        incomes: [],
        expenses: []
      },
      {
        id: '2',
        date: '2024-02-01',
        startDate: '2024-02-01',
        endDate: '2024-02-29',
        totalIncome: 55000,
        totalExpenses: 35000,
        netProfitLoss: 20000,
        incomes: [],
        expenses: []
      }
    ];
    setEntries(mockData);
    setFilteredEntries(mockData);
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    filterEntries(searchTerm, dateRange);
  };

  const handleDateRangeChange = (start: string, end: string) => {
    const newRange = { start, end };
    setDateRange(newRange);
    filterEntries(searchTerm, newRange);
  };

  const filterEntries = (term: string, range: { start: string; end: string }) => {
    let filtered = [...entries];

    // Apply search term filter
    if (term) {
      filtered = filtered.filter(entry =>
        entry.date.includes(term) ||
        entry.netProfitLoss.toString().includes(term)
      );
    }

    // Apply date range filter
    if (range.start && range.end) {
      filtered = filtered.filter(entry =>
        entry.date >= range.start && entry.date <= range.end
      );
    }

    setFilteredEntries(filtered);
  };

  const handleSort = (key: keyof SOPLHistoryEntry) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });

    const sorted = [...filteredEntries].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredEntries(sorted);
  };

  const handleView = (entry: SOPLHistoryEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleDownload = (entry: SOPLHistoryEntry) => {
    // Create CSV content
    const csvContent = `
      Date,${entry.date}
      Start Date,${entry.startDate}
      End Date,${entry.endDate}
      Total Income,${entry.totalIncome}
      Total Expenses,${entry.totalExpenses}
      Net Profit/Loss,${entry.netProfitLoss}
    `.trim();

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOPL_${entry.date}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('SOPL downloaded successfully!', 'success');
  };

  const handlePrint = (entry: SOPLHistoryEntry) => {
    const printContent = `
      <html>
        <head>
          <title>SOPL ${entry.date}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; margin-bottom: 20px; }
            .data { margin-bottom: 20px; }
            .total { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Statement of Profit or Loss</h1>
            <p>${entry.startDate} to ${entry.endDate}</p>
          </div>
          <div class="data">
            <p>Total Income: ${entry.totalIncome}</p>
            <p>Total Expenses: ${entry.totalExpenses}</p>
            <p class="total">Net ${entry.netProfitLoss >= 0 ? 'Profit' : 'Loss'}: ${Math.abs(entry.netProfitLoss)}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <Alert className={`mb-4 ${notification.type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>SOPL History</CardTitle>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-3 py-1 border rounded"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  className="px-3 py-1 border rounded"
                  value={dateRange.start}
                  onChange={(e) => handleDateRangeChange(e.target.value, dateRange.end)}
                />
                <span>to</span>
                <input
                  type="date"
                  className="px-3 py-1 border rounded"
                  value={dateRange.end}
                  onChange={(e) => handleDateRangeChange(dateRange.start, e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th 
                    className="p-2 border border-gray-300 text-left cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-2 border border-gray-300 text-right cursor-pointer"
                    onClick={() => handleSort('totalIncome')}
                  >
                    Income {sortConfig?.key === 'totalIncome' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-2 border border-gray-300 text-right cursor-pointer"
                    onClick={() => handleSort('totalExpenses')}
                  >
                    Expenses {sortConfig?.key === 'totalExpenses' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-2 border border-gray-300 text-right cursor-pointer"
                    onClick={() => handleSort('netProfitLoss')}
                  >
                    Net Profit/Loss {sortConfig?.key === 'netProfitLoss' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 border border-gray-300 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="p-2 border border-gray-300">{entry.date}</td>
                    <td className="p-2 border border-gray-300 text-right">{entry.totalIncome.toFixed(2)}</td>
                    <td className="p-2 border border-gray-300 text-right">{entry.totalExpenses.toFixed(2)}</td>
                    <td className="p-2 border border-gray-300 text-right">
                      {entry.netProfitLoss >= 0 ? '+' : ''}{entry.netProfitLoss.toFixed(2)}
                    </td>
                    <td className="p-2 border border-gray-300 text-center">
                      <button
                        onClick={() => handleView(entry)}
                        className="mr-2 text-blue-500 hover:text-blue-700"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(entry)}
                        className="mr-2 text-green-500 hover:text-green-700"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handlePrint(entry)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">SOPL Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Period:</p>
                <p>{selectedEntry.startDate} to {selectedEntry.endDate}</p>
              </div>
              
              <div>
                <p className="font-semibold">Total Income:</p>
                <p>{selectedEntry.totalIncome.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="font-semibold">Total Expenses:</p>
                <p>{selectedEntry.totalExpenses.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="font-semibold">Net {selectedEntry.netProfitLoss >= 0 ? 'Profit' : 'Loss'}:</p>
                <p>{Math.abs(selectedEntry.netProfitLoss).toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => handleDownload(selectedEntry)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Download
              </button>
              <button
                onClick={() => handlePrint(selectedEntry)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOPLHistory;