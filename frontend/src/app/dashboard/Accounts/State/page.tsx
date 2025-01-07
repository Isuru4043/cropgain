"use client"
import React, { useState, useEffect } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import SOPLTable from './SOPLTable';
import SOPLHistory from './SOPLHistory';

// Utility components with TypeScript props
interface AlertProps {
  children: React.ReactNode
  className?: string
}

const Alert: React.FC<AlertProps> = ({ children, className = "" }) => (
  <div className={`p-4 rounded-lg border ${className}`}>
    {children}
  </div>
)

const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm">{children}</div>
)

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
)

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold">{children}</h3>
)

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
)

interface TabsContextType {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType>({ value: "", onChange: () => {} })

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

const Tabs = ({ defaultValue, children, className = "" }: TabsProps) => {
  const [value, setValue] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, onChange: setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`inline-flex items-center justify-center rounded-lg bg-gray-100 p-1 ${className}`}>
    {children}
  </div>
)

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const TabsTrigger = ({ value, children, onClick }: TabsTriggerProps) => {
  const context = React.useContext(TabsContext)
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
        ${context.value === value ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
      onClick={() => {
        context.onChange(value)
        onClick?.()
      }}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const context = React.useContext(TabsContext)
  if (context.value !== value) return null
  return <div>{children}</div>
}

interface Crop {
  name: string;
  income: number;
  isEditable?: boolean;
}

function IncomeTable() {
  const [activeTab, setActiveTab] = useState("income")
  const [crops, setCrops] = useState<Crop[]>([
    { name: "Crop A", income: 50 },
    { name: "Crop B", income: 56 }
  ])
  const [totalIncome, setTotalIncome] = useState(0)
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null)
  const [activeChart, setActiveChart] = useState("bar")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState(false)
  const [trendData] = useState([
    { month: 'Jan', income: 45 },
    { month: 'Feb', income: 52 },
    { month: 'Mar', income: 48 },
    { month: 'Apr', income: 56 },
    { month: 'May', income: 61 },
  ])
  const [stackedData] = useState([
    { month: 'Jan', cropA: 30, cropB: 20 },
    { month: 'Feb', cropA: 40, cropB: 12 },
    { month: 'Mar', cropA: 35, cropB: 13 },
    { month: 'Apr', cropA: 50, cropB: 6 },
    { month: 'May', cropA: 45, cropB: 16 },
  ])

  const COLORS = ["#0ea5e9", "#22c55e", "#eab308", "#ef4444", "#8b5cf6"]

  const showNotification = (message: string, type: string) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleInputChange = (index: number, field: keyof Crop, value: string) => {
    setCrops((prevCrops) =>
      prevCrops.map((crop, i) =>
        i === index
          ? {
              ...crop,
              [field]: field === "income" ? parseFloat(value) || 0 : value,
            }
          : crop
      )
    );
  };

  useEffect(() => {
    const total = crops.reduce((acc, crop) => acc + crop.income, 0)
    setTotalIncome(total)
  }, [crops])

  const addRow = () => {
    setCrops([...crops, { name: "", income: 0 }])
  }

  const deleteRow = (index: number) => {
    const cropName = crops[index].name || "Crop"
    const updatedCrops = crops.filter((_, i) => i !== index)
    setCrops(updatedCrops)
    showNotification(`${cropName} has been deleted successfully`, "success")
  }

  const editRow = (index: number) => {
    const updatedCrops = [...crops]
    if (updatedCrops[index].isEditable) {
      updatedCrops[index].isEditable = false
      showNotification(`${updatedCrops[index].name || "Crop"} has been updated successfully`, "success")
    } else {
      updatedCrops[index].isEditable = true
    }
    setCrops(updatedCrops)
  }

  const ActionBar = () => (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search crops..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors 
            ${filterActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => setFilterActive(!filterActive)}
        >
          <span>Filter</span>
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className={`flex items-center space-x-2 border rounded-lg px-4 py-2 transition-all duration-300
          ${filterActive ? "bg-blue-50" : "bg-gray-100"}`}>
          <span className="text-gray-500">📅</span>
          <input type="date" className="outline-none" value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
          <span>to</span>
          <input type="date" className="outline-none" value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span>Export</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span>Import</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span>Print</span>
        </button>
      </div>
    </div>
  )

  const StatCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {[
        { title: "Total Income", value: `$${totalIncome.toFixed(2)}`, change: "+12.5%", icon: "💰" },
        { title: "Active Crops", value: crops.length, change: "+2", icon: "🌾" },
        { title: "Avg. Income/Crop", value: `$${(totalIncome / crops.length).toFixed(2)}`, change: "+5.3%", icon: "📈" },
        { title: "Top Performer", value: crops.reduce((max, crop) => crop.income > max.income ? crop : max, crops[0]).name || "N/A", change: "No change", icon: "🏆" }
      ].map((stat, index) => (
        <Card key={index} className="flex items-center p-4">
          <div className="text-3xl mr-4">{stat.icon}</div>
          <div>
            <p className="text-sm text-gray-500">{stat.title}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            <p className={`text-sm mt-1 ${stat.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change} from last period
            </p>
          </div>
        </Card>
      ))}
    </div>
  )

  const CropCharts = () => {
    const data = crops.map(crop => ({
      name: crop.name,
      value: crop.income,
      income: crop.income
    }))

    return (
      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap">
            <CardTitle>Income Breakdown</CardTitle>
            <div className="space-x-2 mt-2 sm:mt-0">
              <button
                onClick={() => setActiveChart("pie")}
                className={`px-3 py-1 rounded ${activeChart === "pie" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Pie Chart
              </button>
              <button
                onClick={() => setActiveChart("bar")}
                className={`px-3 py-1 rounded ${activeChart === "bar" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Bar Chart
              </button>
              <button
                onClick={() => setActiveChart("doughnut")}
                className={`px-3 py-1 rounded ${activeChart === "doughnut" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Doughnut Chart
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === "pie" ? (
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              ) : activeChart === "doughnut" ? (
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              ) : (
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#3b82f6">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  const TrendChart = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Income Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )

  const AreaTrendChart = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Cumulative Income Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="income" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIncome)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )

  const StackedBarChartComponent = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Monthly Income by Crop</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cropA" stackId="a" fill="#8884d8" />
              <Bar dataKey="cropB" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )

  const renderIncomeTab = () => (
    <div>
      {notification && (
        <Alert className={`mb-4 ${notification.type === "success" ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <ActionBar />
      <StatCards />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Income from Crops</CardTitle>
          <button
            onClick={addRow}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <span>+ Add Crop</span>
          </button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-2 border border-gray-300 cursor-pointer" onClick={() => {/* Implement sorting */}}>Crop Name</th>
                  <th className="p-2 border border-gray-300 cursor-pointer" onClick={() => {/* Implement sorting */}}>Income</th>
                  <th className="p-2 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {crops
                  .filter(crop => crop.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .filter(crop => {
                    // Implement date range filtering if applicable
                    return true;
                  })
                  .map((crop, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-300">
                        <input
                          type="text"
                          value={crop.name}
                          onChange={(e) => handleInputChange(index, "name", e.target.value)}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly={!crop.isEditable}
                        />
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input
                          type="number"
                          value={crop.income}
                          onChange={(e) => handleInputChange(index, "income", e.target.value)}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly={!crop.isEditable}
                        />
                      </td>
                      <td className="p-2 border border-gray-300">
                        {!crop.isEditable ? (
                          <>
                            <button
                              onClick={() => editRow(index)}
                              className="mr-2 text-blue-500 hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteRow(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => editRow(index)}
                            className="text-green-500 hover:text-green-700"
                          >
                            Save
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                <tr className="bg-gray-50">
                  <td className="p-2 border border-gray-300 font-bold">Total Income</td>
                  <td className="p-2 border border-gray-300">{totalIncome.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <CropCharts />
        <TrendChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <AreaTrendChart />
        <StackedBarChartComponent />
      </div>
    </div>
  )

  const renderSOPLTab = () => (
    <SOPLTable />
  );

  const renderHistoryTab = () => (
     <SOPLHistory />
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <Tabs defaultValue="income" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-6">
          <TabsTrigger value="income" onClick={() => setActiveTab("income")}>Income</TabsTrigger>
          <TabsTrigger value="sopl" onClick={() => setActiveTab("sopl")}>SOPL</TabsTrigger>
          <TabsTrigger value="history" onClick={() => setActiveTab("history")}>History</TabsTrigger>
        </TabsList>

        <TabsContent value="income">{renderIncomeTab()}</TabsContent>
        <TabsContent value="sopl">{renderSOPLTab()}</TabsContent>
        <TabsContent value="history">{renderHistoryTab()}</TabsContent>
      </Tabs>
    </div>
  )
}

export default IncomeTable
