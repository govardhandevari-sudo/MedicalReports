import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, Activity, DollarSign, Calendar, Building2, UserCheck, Target, ArrowLeft, ChevronDown, FileText, Package, Stethoscope, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

// Export functions
const exportToExcel = (data, filename) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report'); 
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

const exportToPDF = (reportTitle, tableId) => {
  const element = document.getElementById(tableId);
  if (!element) return;
  
  // Create a new window for printing
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>' + reportTitle + '</title>');
  printWindow.document.write('<style>');
  printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
  printWindow.document.write('h1 { color: #8B5CF6; margin-bottom: 20px; }');
  printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
  printWindow.document.write('th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }');
  printWindow.document.write('th { background-color: #8B5CF6; color: white; font-weight: bold; }');
  printWindow.document.write('tr:nth-child(even) { background-color: #f9f9f9; }');
  printWindow.document.write('tr:hover { background-color: #f5f5f5; }');
  printWindow.document.write('@media print { button { display: none; } }');
  printWindow.document.write('</style></head><body>');
  printWindow.document.write('<h1>' + reportTitle + '</h1>');
  printWindow.document.write(element.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
  }, 250);
};

const ExcelTable = ({ headers, data, id }) => (
  <div className="overflow-x-auto" id={id}>
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gradient-to-r from-purple-600 to-pink-600">
          {headers.map((header, idx) => (
            <th 
              key={idx} 
              className="border border-gray-300 py-3 px-4 text-left font-bold text-white text-sm"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr 
            key={rowIdx} 
            className={`${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-purple-50 transition-colors`}
          >
            {Object.values(row).map((cell, cellIdx) => (
              <td 
                key={cellIdx} 
                className="border border-gray-300 py-3 px-4 text-sm text-gray-700"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ExportButtons = ({ onExportExcel, onExportPDF, reportName }) => (
  <div className="flex gap-3 mb-6">
    <button
      onClick={onExportExcel}
      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
    >
      <FileSpreadsheet className="w-5 h-5" />
      Export to Excel
    </button>
    <button
      onClick={onExportPDF}
      className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
    >
      <Download className="w-5 h-5" />
      Export to PDF
    </button>
  </div>
);

const DashboardUI = ({
  kpis,
  centers,
  selectedCenters,
  setSelectedCenters,
  dateRange,
  setDateRange
}) => {
 
  const [activeView, setActiveView] = useState('dashboard');
  const [showCenterDropdown, setShowCenterDropdown] = useState(false);

  //const [loading, setLoading] = useState(true);
  const [drillDownData, setDrillDownData] = useState(null);


  const toggleCenter = (id) => {
    setSelectedCenters(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const selectAllCenters = () => {
    setSelectedCenters(centers.map(c => c.id));
  };

  // Generate sample data based on filters
  const generateSampleData = (reportType) => {
    const centerMultiplier = selectedCenters.length / centers.length;
    
    switch(reportType) {
      case 'revenue':
        return Array.from({ length: 6 }, (_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
          lab: Math.floor((Math.random() * 50000 + 30000) * centerMultiplier),
          radiology: Math.floor((Math.random() * 40000 + 25000) * centerMultiplier),
          centerWise: centers
            .filter(c => selectedCenters.includes(c.id))
            .map(c => ({
              center: c.name,
              revenue: Math.floor(Math.random() * 30000 + 20000)
            }))
        }));
      
      case 'doctors':
        return Array.from({ length: 10 }, (_, i) => ({
          doctor: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Martinez', 'Garcia', 'Rodriguez', 'Wilson', 'Anderson'][i]}`,
          referrals: Math.floor((Math.random() * 100 + 50) * centerMultiplier),
          revenue: Math.floor((Math.random() * 200000 + 100000) * centerMultiplier),
          specialty: ['Cardiology', 'Orthopedics', 'General', 'Neurology', 'Pediatrics', 'Oncology', 'Dermatology', 'ENT', 'Gastro', 'Radiology'][i],
          tests: Math.floor((Math.random() * 150 + 75) * centerMultiplier)
        })).sort((a, b) => b.referrals - a.referrals);
      
      case 'sales':
        return Array.from({ length: 8 }, (_, i) => ({
          name: ['John Anderson', 'Sarah Mitchell', 'Michael Chen', 'Emily Roberts', 'David Kumar', 'Lisa Wang', 'James Brown', 'Maria Garcia'][i],
          revenue: Math.floor((Math.random() * 200000 + 300000) * centerMultiplier),
          target: 500000,
          deals: Math.floor((Math.random() * 30 + 20) * centerMultiplier),
          centers: selectedCenters.map(id => 
            centers.find(c => c.id === id).name
          ).join(', ')
        })).map(s => ({ ...s, achievement: Math.round((s.revenue / s.target) * 100) }));
      
      case 'referralVsNon':
        const totalPatients = Math.floor(1000 * centerMultiplier);
        const referralPatients = Math.floor(totalPatients * 0.65);
        return [
          { 
            type: 'Doctor Referral', 
            count: referralPatients, 
            revenue: Math.floor((referralPatients * 2000) * centerMultiplier),
            percentage: 65,
            avgValue: 2000
          },
          { 
            type: 'Walk-in', 
            count: totalPatients - referralPatients, 
            revenue: Math.floor(((totalPatients - referralPatients) * 1500) * centerMultiplier),
            percentage: 35,
            avgValue: 1500
          }
        ];
      
      case 'tests':
        return Array.from({ length: 15 }, (_, i) => ({
          test: ['CBC', 'Lipid Profile', 'Blood Sugar', 'Thyroid Panel', 'Liver Function', 'Kidney Function', 'X-Ray Chest', 'ECG', 'Ultrasound', 'CT Scan', 'MRI', 'Vitamin D', 'Iron Studies', 'HbA1c', 'Urine Analysis'][i],
          count: Math.floor((Math.random() * 200 + 100) * centerMultiplier),
          revenue: Math.floor((Math.random() * 50000 + 30000) * centerMultiplier),
          category: i < 6 ? 'Lab' : i < 11 ? 'Radiology' : 'Lab',
          avgPrice: Math.floor(Math.random() * 1000 + 500)
        })).sort((a, b) => b.count - a.count);
      
      case 'collection':
        return Array.from({ length: 6 }, (_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
          total: Math.floor((Math.random() * 500000 + 400000) * centerMultiplier),
          collected: Math.floor((Math.random() * 400000 + 350000) * centerMultiplier),
          pending: Math.floor((Math.random() * 100000 + 50000) * centerMultiplier),
          collectionRate: Math.floor(Math.random() * 15 + 80)
        }));
      
      default:
        return [];
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
    <div 
      onClick={onClick}
      className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
          {subtitle && <p className="text-white/70 text-xs">{subtitle}</p>}
        </div>
        <div className="bg-white/20 p-3 rounded-xl">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ReportCard = ({ title, description, icon: Icon, color, onClick }) => (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 group"
    >
      <div className={`bg-gradient-to-br ${color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );

  const FilterSection = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="inline w-4 h-4 mr-1" />
            Diagnostic Centers
          </label>
          <div className="relative">
            <button
              onClick={() => setShowCenterDropdown(!showCenterDropdown)}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-left flex justify-between items-center hover:border-purple-400 transition-colors"
            >
              <span className="text-gray-700">
                {selectedCenters.length === centers.length 
                  ? 'All Centers' 
                  : `${selectedCenters.length} Selected`}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
            {showCenterDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-2">
                <button
                  onClick={selectAllCenters}
                  className="w-full text-left px-3 py-2 hover:bg-purple-50 rounded-lg text-sm text-purple-600 font-medium"
                >
                  Select All
                </button>
                {centers.map(center => (
                  <label key={center.id} className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCenters.includes(center.id)}
                      onChange={() => toggleCenter(center.id)}
                      className="w-4 h-4 text-purple-600 rounded mr-3"
                    />
                    <span className="text-gray-700">{center.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Start Date
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            End Date
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  // Revenue Report
  if (activeView === 'revenue') {
    const data = generateSampleData('revenue');
    const totalRevenue = data.reduce((sum, d) => sum + d.lab + d.radiology, 0);
    const labRevenue = data.reduce((sum, d) => sum + d.lab, 0);
    const radiologyRevenue = data.reduce((sum, d) => sum + d.radiology, 0);

    if (drillDownData?.type === 'center') {
      const centerData = data[0]?.centerWise || [];
      
      const exportData = centerData.map(c => ({
        'Center Name': c.center,
        'Revenue (₹)': c.revenue,
        'Percentage': ((c.revenue / centerData.reduce((s, center) => s + center.revenue, 0)) * 100).toFixed(1) + '%'
      }));

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => setDrillDownData(null)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Revenue Report
            </button>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
              Center-wise Revenue Breakdown
            </h1>

            <ExportButtons 
              onExportExcel={() => exportToExcel(exportData, 'Center_Wise_Revenue')}
              onExportPDF={() => exportToPDF('Center-wise Revenue Breakdown', 'revenue-center-table')}
              reportName="Center Revenue"
            />

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={centerData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="center" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Breakdown</h2>
              <ExcelTable 
                id="revenue-center-table"
                headers={['Center Name', 'Revenue (₹)', 'Percentage of Total']}
                data={centerData.map(center => ({
                  'Center Name': center.center,
                  'Revenue (₹)': '₹' + (center.revenue / 1000).toFixed(0) + 'K',
                  'Percentage': ((center.revenue / centerData.reduce((s, c) => s + c.revenue, 0)) * 100).toFixed(1) + '%'
                }))}
              />
            </div>
          </div>
        </div>
      );
    }

    const monthlyExportData = data.map(d => ({
      'Month': d.month,
      'Lab Revenue (₹)': d.lab,
      'Radiology Revenue (₹)': d.radiology,
      'Total Revenue (₹)': d.lab + d.radiology
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            Revenue Analysis Report
          </h1>

          <FilterSection />

          <ExportButtons 
            onExportExcel={() => exportToExcel(monthlyExportData, 'Revenue_Analysis')}
            onExportPDF={() => exportToPDF('Revenue Analysis Report', 'revenue-table')}
            reportName="Revenue Analysis"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Total Revenue" 
              value={`₹${(totalRevenue / 1000).toFixed(0)}K`}
              subtitle="+12% from last period"
              icon={DollarSign} 
              color="from-purple-500 to-purple-700"
              onClick={() => setDrillDownData({ type: 'center' })}
            />
            <StatCard 
              title="Lab Revenue" 
              value={`₹${(labRevenue / 1000).toFixed(0)}K`}
              subtitle={`${((labRevenue/totalRevenue)*100).toFixed(0)}% of total`}
              icon={Activity} 
              color="from-pink-500 to-pink-700" 
            />
            <StatCard 
              title="Radiology Revenue" 
              value={`₹${(radiologyRevenue / 1000).toFixed(0)}K`}
              subtitle={`${((radiologyRevenue/totalRevenue)*100).toFixed(0)}% of total`}
              icon={TrendingUp} 
              color="from-blue-500 to-blue-700" 
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLab" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorRad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Legend />
                <Area type="monotone" dataKey="lab" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorLab)" name="Lab Revenue" />
                <Area type="monotone" dataKey="radiology" stroke="#EC4899" fillOpacity={1} fill="url(#colorRad)" name="Radiology Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Revenue Data</h2>
            <ExcelTable 
              id="revenue-table"
              headers={['Month', 'Lab Revenue (₹)', 'Radiology Revenue (₹)', 'Total Revenue (₹)']}
              data={data.map(d => ({
                'Month': d.month,
                'Lab Revenue': '₹' + (d.lab / 1000).toFixed(0) + 'K',
                'Radiology Revenue': '₹' + (d.radiology / 1000).toFixed(0) + 'K',
                'Total Revenue': '₹' + ((d.lab + d.radiology) / 1000).toFixed(0) + 'K'
              }))}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Revenue Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Lab', value: labRevenue },
                      { name: 'Radiology', value: radiologyRevenue }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    <Cell fill="#8B5CF6" />
                    <Cell fill="#EC4899" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Comparison</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                  <Legend />
                  <Bar dataKey="lab" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Lab" />
                  <Bar dataKey="radiology" fill="#EC4899" radius={[8, 8, 0, 0]} name="Radiology" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Doctor Referrals Report
  if (activeView === 'doctors') {
    const data = generateSampleData('doctors');
    const totalReferrals = data.reduce((sum, d) => sum + d.referrals, 0);
    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

    if (drillDownData?.doctor) {
      const doctor = data.find(d => d.doctor === drillDownData.doctor);
      const monthlyData = Array.from({ length: 6 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
        referrals: Math.floor(Math.random() * 30 + 10),
        revenue: Math.floor(Math.random() * 50000 + 20000)
      }));

      const exportData = monthlyData.map(m => ({
        'Month': m.month,
        'Referrals': m.referrals,
        'Revenue (₹)': m.revenue
      }));

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => setDrillDownData(null)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Doctor Referrals
            </button>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
              {doctor.doctor} - Detailed Performance
            </h1>

            <ExportButtons 
              onExportExcel={() => exportToExcel(exportData, `${doctor.doctor.replace(' ', '_')}_Performance`)}
              onExportPDF={() => exportToPDF(`${doctor.doctor} - Performance Details`, 'doctor-detail-table')}
              reportName="Doctor Performance"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <StatCard 
                title="Specialty" 
                value={doctor.specialty}
                subtitle="Medical field"
                icon={Stethoscope} 
                color="from-purple-500 to-purple-700" 
              />
              <StatCard 
                title="Total Referrals" 
                value={doctor.referrals}
                subtitle="Last 6 months"
                icon={Users} 
                color="from-pink-500 to-pink-700" 
              />
              <StatCard 
                title="Total Revenue" 
                value={`₹${(doctor.revenue / 1000).toFixed(0)}K`}
                subtitle="Generated"
                icon={DollarSign} 
                color="from-blue-500 to-blue-700" 
              />
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Referral Trend</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                  <Legend />
                  <Line type="monotone" dataKey="referrals" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 5 }} name="Referrals" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Revenue</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                  <Bar dataKey="revenue" fill="#EC4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Performance Data</h2>
              <ExcelTable 
                id="doctor-detail-table"
                headers={['Month', 'Referrals', 'Revenue (₹)']}
                data={monthlyData.map(m => ({
                  'Month': m.month,
                  'Referrals': m.referrals,
                  'Revenue': '₹' + (m.revenue / 1000).toFixed(0) + 'K'
                }))}
              />
            </div>
          </div>
        </div>
      );
    }

    const doctorExportData = data.map(d => ({
      'Doctor Name': d.doctor,
      'Specialty': d.specialty,
      'Referrals': d.referrals,
      'Tests': d.tests,
      'Revenue (₹)': d.revenue
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            Doctor Referrals Report
          </h1>

          <FilterSection />

          <ExportButtons 
            onExportExcel={() => exportToExcel(doctorExportData, 'Doctor_Referrals')}
            onExportPDF={() => exportToPDF('Doctor Referrals Report', 'doctors-table')}
            reportName="Doctor Referrals"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Total Referrals" 
              value={totalReferrals}
              subtitle="Across all doctors"
              icon={Users} 
              color="from-green-500 to-green-700" 
            />
            <StatCard 
              title="Top Doctor" 
              value={data[0].doctor}
              subtitle={`${data[0].referrals} referrals`}
              icon={UserCheck} 
              color="from-orange-500 to-orange-700" 
            />
            <StatCard 
              title="Total Revenue" 
              value={`₹${(totalRevenue / 1000000).toFixed(2)}M`}
              subtitle="From referrals"
              icon={DollarSign} 
              color="from-blue-500 to-blue-700" 
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Top 10 Referring Doctors</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis dataKey="doctor" type="category" width={120} stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Bar dataKey="referrals" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Doctor Performance - Click to Drill Down</h2>
            <ExcelTable 
              id="doctors-table"
              headers={['Doctor Name', 'Specialty', 'Referrals', 'Tests', 'Revenue (₹)']}
              data={data.map((doctor, idx) => ({
                'Doctor Name': doctor.doctor,
                'Specialty': doctor.specialty,
                'Referrals': doctor.referrals,
                'Tests': doctor.tests,
                'Revenue': '₹' + (doctor.revenue / 1000).toFixed(0) + 'K'
              }))}
            />
          </div>
        </div>
      </div>
    );
  }

  // Sales Performance Report
  if (activeView === 'sales') {
    const data = generateSampleData('sales');
    const avgAchievement = data.reduce((sum, s) => sum + s.achievement, 0) / data.length;
    const topPerformer = data.reduce((max, s) => s.achievement > max.achievement ? s : max);
    const totalDeals = data.reduce((sum, s) => sum + s.deals, 0);

    if (drillDownData?.salesperson) {
      const person = data.find(d => d.name === drillDownData.salesperson);
      const monthlyPerformance = Array.from({ length: 6 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
        revenue: Math.floor(Math.random() * 100000 + 50000),
        target: 83333,
        deals: Math.floor(Math.random() * 10 + 5)
      }));

      const exportData = monthlyPerformance.map(m => ({
        'Month': m.month,
        'Revenue (₹)': m.revenue,
        'Target (₹)': m.target,
        'Achievement (%)': ((m.revenue / m.target) * 100).toFixed(1),
        'Deals': m.deals
      }));

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => setDrillDownData(null)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Sales Performance
            </button>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
              {person.name} - Performance Details
            </h1>

            <ExportButtons 
              onExportExcel={() => exportToExcel(exportData, `${person.name.replace(' ', '_')}_Performance`)}
              onExportPDF={() => exportToPDF(`${person.name} - Performance Details`, 'sales-detail-table')}
              reportName="Sales Performance"
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Achievement" 
                value={`${person.achievement}%`}
                subtitle="Of target"
                icon={Target} 
                color={person.achievement >= 100 ? 'from-green-500 to-green-700' : 'from-orange-500 to-orange-700'} 
              />
              <StatCard 
                title="Revenue" 
                value={`₹${(person.revenue / 1000).toFixed(0)}K`}
                subtitle={`Target: ₹${(person.target / 1000).toFixed(0)}K`}
                icon={DollarSign} 
                color="from-purple-500 to-purple-700" 
              />
              <StatCard 
                title="Deals Closed" 
                value={person.deals}
                subtitle="This period"
                icon={Activity} 
                color="from-blue-500 to-blue-700" 
              />
              <StatCard 
                title="Avg Deal Size" 
                value={`₹${Math.floor(person.revenue / person.deals / 1000)}K`}
                subtitle="Per deal"
                icon={TrendingUp} 
                color="from-pink-500 to-pink-700" 
              />
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Performance vs Target</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Revenue" />
                  <Bar dataKey="target" fill="#EC4899" radius={[8, 8, 0, 0]} name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Deals Closed by Month</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                  <Line type="monotone" dataKey="deals" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Performance Data</h2>
              <ExcelTable 
                id="sales-detail-table"
                headers={['Month', 'Revenue (₹)', 'Target (₹)', 'Achievement (%)', 'Deals']}
                data={monthlyPerformance.map(m => ({
                  'Month': m.month,
                  'Revenue': '₹' + (m.revenue / 1000).toFixed(0) + 'K',
                  'Target': '₹' + (m.target / 1000).toFixed(0) + 'K',
                  'Achievement': ((m.revenue / m.target) * 100).toFixed(1) + '%',
                  'Deals': m.deals
                }))}
              />
            </div>
          </div>
        </div>
      );
    }

    const salesExportData = data.map(s => ({
      'Salesperson': s.name,
      'Revenue (₹)': s.revenue,
      'Target (₹)': s.target,
      'Achievement (%)': s.achievement,
      'Deals': s.deals
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            Sales Performance Report
          </h1>

          <FilterSection />

          <ExportButtons 
            onExportExcel={() => exportToExcel(salesExportData, 'Sales_Performance')}
            onExportPDF={() => exportToPDF('Sales Performance Report', 'sales-table')}
            reportName="Sales Performance"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Top Performer" 
              value={topPerformer.name}
              subtitle={`${topPerformer.achievement}% achievement`}
              icon={Target} 
              color="from-green-500 to-green-700" 
            />
            <StatCard 
              title="Avg Achievement" 
              value={`${avgAchievement.toFixed(0)}%`}
              subtitle="Team average"
              icon={TrendingUp} 
              color="from-blue-500 to-blue-700" 
            />
            <StatCard 
              title="Total Deals" 
              value={totalDeals}
              subtitle="This period"
              icon={Activity} 
              color="from-orange-500 to-orange-700" 
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales vs Target</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" angle={-20} textAnchor="end" height={100} />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Legend />
                <Bar dataKey="revenue" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Actual Revenue" />
                <Bar dataKey="target" fill="#EC4899" radius={[8, 8, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Team Performance - Click to Drill Down</h2>
            <ExcelTable 
              id="sales-table"
              headers={['Salesperson', 'Revenue (₹)', 'Target (₹)', 'Achievement (%)', 'Deals']}
              data={data.map((person, idx) => ({
                'Salesperson': person.name,
                'Revenue': '₹' + (person.revenue / 1000).toFixed(0) + 'K',
                'Target': '₹' + (person.target / 1000).toFixed(0) + 'K',
                'Achievement': person.achievement + '%',
                'Deals': person.deals
              }))}
            />
          </div>
        </div>
      </div>
    );
  }

  // Referral vs Non-Referral Report
  if (activeView === 'referralVsNon') {
    const data = generateSampleData('referralVsNon');
    const totalPatients = data.reduce((sum, d) => sum + d.count, 0);
    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

    const exportData = data.map(d => ({
      'Type': d.type,
      'Patient Count': d.count,
      'Revenue (₹)': d.revenue,
      'Percentage': d.percentage + '%',
      'Avg Value per Patient (₹)': d.avgValue
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            Referral vs Non-Referral Analysis
          </h1>

          <FilterSection />

          <ExportButtons 
            onExportExcel={() => exportToExcel(exportData, 'Referral_vs_NonReferral')}
            onExportPDF={() => exportToPDF('Referral vs Non-Referral Analysis', 'referral-table')}
            reportName="Referral Analysis"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Total Patients" 
              value={totalPatients}
              subtitle="All sources"
              icon={Users} 
              color="from-purple-500 to-purple-700" 
            />
            <StatCard 
              title="Referral Rate" 
              value={`${data[0].percentage}%`}
              subtitle="Of total patients"
              icon={UserCheck} 
              color="from-pink-500 to-pink-700" 
            />
            <StatCard 
              title="Total Revenue" 
              value={`₹${(totalRevenue / 1000000).toFixed(2)}M`}
              subtitle="Combined sources"
              icon={DollarSign} 
              color="from-blue-500 to-blue-700" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type}: ${percentage}%`}
                    outerRadius={100}
                    dataKey="count"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Revenue Comparison</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="type" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                  <Bar dataKey="revenue" fill="#EC4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Comparison</h2>
            <ExcelTable 
              id="referral-table"
              headers={['Type', 'Patient Count', 'Revenue (₹)', 'Percentage', 'Avg Value/Patient (₹)']}
              data={data.map(d => ({
                'Type': d.type,
                'Patient Count': d.count,
                'Revenue': '₹' + (d.revenue / 1000).toFixed(0) + 'K',
                'Percentage': d.percentage + '%',
                'Avg Value': '₹' + d.avgValue
              }))}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{item.type}</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Patient Count</span>
                    <span className="font-bold text-2xl text-gray-800">{item.count}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Revenue Generated</span>
                    <span className="font-bold text-2xl text-gray-800">₹{(item.revenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Avg Value per Patient</span>
                    <span className="font-bold text-2xl text-gray-800">₹{item.avgValue}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Share of Total</span>
                    <span className="font-bold text-2xl text-gray-800">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Test Analysis Report
  if (activeView === 'tests') {
    const data = generateSampleData('tests');
    const totalTests = data.reduce((sum, d) => sum + d.count, 0);
    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
    const labTests = data.filter(d => d.category === 'Lab');
    const radTests = data.filter(d => d.category === 'Radiology');

    if (drillDownData?.category) {
      const categoryData = data.filter(d => d.category === drillDownData.category);
      
      const exportData = categoryData.map(t => ({
        'Test Name': t.test,
        'Count': t.count,
        'Avg Price (₹)': t.avgPrice,
        'Revenue (₹)': t.revenue
      }));

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => setDrillDownData(null)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Test Analysis
            </button>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
              {drillDownData.category} Tests Breakdown
            </h1>

            <ExportButtons 
              onExportExcel={() => exportToExcel(exportData, `${drillDownData.category}_Tests`)}
              onExportPDF={() => exportToPDF(`${drillDownData.category} Tests Breakdown`, 'test-category-table')}
              reportName={`${drillDownData.category} Tests`}
            />

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Tests by Volume</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="test" stroke="#6B7280" angle={-20} textAnchor="end" height={100} />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Test Information</h2>
              <ExcelTable 
                id="test-category-table"
                headers={['Test Name', 'Count', 'Avg Price (₹)', 'Revenue (₹)']}
                data={categoryData.map(test => ({
                  'Test Name': test.test,
                  'Count': test.count,
                  'Avg Price': '₹' + test.avgPrice,
                  'Revenue': '₹' + (test.revenue / 1000).toFixed(0) + 'K'
                }))}
              />
            </div>
          </div>
        </div>
      );
    }

    const testExportData = data.map(t => ({
      'Test Name': t.test,
      'Category': t.category,
      'Count': t.count,
      'Avg Price (₹)': t.avgPrice,
      'Revenue (₹)': t.revenue
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            Test Analysis Report
          </h1>

          <FilterSection />

          <ExportButtons 
            onExportExcel={() => exportToExcel(testExportData, 'Test_Analysis')}
            onExportPDF={() => exportToPDF('Test Analysis Report', 'tests-table')}
            reportName="Test Analysis"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Total Tests" 
              value={totalTests}
              subtitle="All categories"
              icon={Activity} 
              color="from-purple-500 to-purple-700" 
            />
            <StatCard 
              title="Lab Tests" 
              value={labTests.reduce((s, t) => s + t.count, 0)}
              subtitle="Click to drill down"
              icon={Package} 
              color="from-pink-500 to-pink-700"
              onClick={() => setDrillDownData({ category: 'Lab' })}
            />
            <StatCard 
              title="Radiology Tests" 
              value={radTests.reduce((s, t) => s + t.count, 0)}
              subtitle="Click to drill down"
              icon={Stethoscope} 
              color="from-blue-500 to-blue-700"
              onClick={() => setDrillDownData({ category: 'Radiology' })}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Top 15 Tests by Volume</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="test" stroke="#6B7280" angle={-20} textAnchor="end" height={100} />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Test Category Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Lab', value: labTests.reduce((s, t) => s + t.count, 0) },
                      { name: 'Radiology', value: radTests.reduce((s, t) => s + t.count, 0) }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    <Cell fill="#8B5CF6" />
                    <Cell fill="#EC4899" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Revenue by Test Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { category: 'Lab', revenue: labTests.reduce((s, t) => s + t.revenue, 0) },
                  { category: 'Radiology', revenue: radTests.reduce((s, t) => s + t.revenue, 0) }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="category" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                  <Bar dataKey="revenue" fill="#EC4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Tests Performance</h2>
            <ExcelTable 
              id="tests-table"
              headers={['Test Name', 'Category', 'Count', 'Avg Price (₹)', 'Revenue (₹)']}
              data={data.map(test => ({
                'Test Name': test.test,
                'Category': test.category,
                'Count': test.count,
                'Avg Price': '₹' + test.avgPrice,
                'Revenue': '₹' + (test.revenue / 1000).toFixed(0) + 'K'
              }))}
            />
          </div>
        </div>
      </div>
    );
  }

  // Collection Report
  if (activeView === 'collection') {
    const data = generateSampleData('collection');
    const totalBilled = data.reduce((sum, d) => sum + d.total, 0);
    const totalCollected = data.reduce((sum, d) => sum + d.collected, 0);
    const totalPending = data.reduce((sum, d) => sum + d.pending, 0);
    const avgCollectionRate = data.reduce((sum, d) => sum + d.collectionRate, 0) / data.length;

    const exportData = data.map(d => ({
      'Month': d.month,
      'Total Billed (₹)': d.total,
      'Collected (₹)': d.collected,
      'Pending (₹)': d.pending,
      'Collection Rate (%)': d.collectionRate
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            Collection Report
          </h1>

          <FilterSection />

          <ExportButtons 
            onExportExcel={() => exportToExcel(exportData, 'Collection_Report')}
            onExportPDF={() => exportToPDF('Collection Report', 'collection-table')}
            reportName="Collection Report"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Billed" 
              value={`₹${(totalBilled / 1000000).toFixed(2)}M`}
              subtitle="Last 6 months"
              icon={FileText} 
              color="from-purple-500 to-purple-700" 
            />
            <StatCard 
              title="Collected" 
              value={`₹${(totalCollected / 1000000).toFixed(2)}M`}
              subtitle={`${((totalCollected/totalBilled)*100).toFixed(0)}% of billed`}
              icon={DollarSign} 
              color="from-green-500 to-green-700" 
            />
            <StatCard 
              title="Pending" 
              value={`₹${(totalPending / 1000).toFixed(0)}K`}
              subtitle={`${((totalPending/totalBilled)*100).toFixed(0)}% of billed`}
              icon={TrendingUp} 
              color="from-orange-500 to-orange-700" 
            />
            <StatCard 
              title="Avg Collection Rate" 
              value={`${avgCollectionRate.toFixed(0)}%`}
              subtitle="Across all months"
              icon={Target} 
              color="from-blue-500 to-blue-700" 
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Collection Trend</h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Legend />
                <Area type="monotone" dataKey="collected" stroke="#10B981" fillOpacity={1} fill="url(#colorCollected)" name="Collected" />
                <Area type="monotone" dataKey="pending" stroke="#F59E0B" fillOpacity={1} fill="url(#colorPending)" name="Pending" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Collection Rate Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                  <Line type="monotone" dataKey="collectionRate" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 5 }} name="Collection Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Overall Collection Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Collected', value: totalCollected },
                      { name: 'Pending', value: totalPending }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#F59E0B" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Breakdown</h2>
            <ExcelTable 
              id="collection-table"
              headers={['Month', 'Total Billed (₹)', 'Collected (₹)', 'Pending (₹)', 'Collection Rate (%)']}
              data={data.map(month => ({
                'Month': month.month,
                'Total Billed': '₹' + (month.total / 1000).toFixed(0) + 'K',
                'Collected': '₹' + (month.collected / 1000).toFixed(0) + 'K',
                'Pending': '₹' + (month.pending / 1000).toFixed(0) + 'K',
                'Collection Rate': month.collectionRate + '%'
              }))}
            />
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  const revenueData = generateSampleData('revenue');
  const doctorData = generateSampleData('doctors');
  const salesData = generateSampleData('sales');
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.lab + d.radiology, 0);
  const totalReferrals = doctorData.reduce((sum, d) => sum + d.referrals, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Diagnostic Centers Dashboard
          </h1>
          <p className="text-gray-600">Comprehensive analytics and reporting system</p>
        </div>

        <FilterSection />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Revenue" 
            value={`₹${(totalRevenue / 1000).toFixed(0)}K`}
            subtitle="Last 6 months"
            icon={DollarSign} 
            color="from-purple-500 to-purple-700" 
          />
          <StatCard 
            title="Doctor Referrals" 
            value={totalReferrals}
            subtitle="Active referrals"
            icon={Users} 
            color="from-pink-500 to-pink-700" 
          />
          <StatCard 
            title="Active Centers" 
            value={selectedCenters.length}
            subtitle={`of ${centers.length} total`}
            icon={Building2} 
            color="from-blue-500 to-blue-700" 
          />
          <StatCard 
            title="Sales Team" 
            value={salesData.length}
            subtitle="Active members"
            icon={Target} 
            color="from-green-500 to-green-700" 
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard
              title="Revenue Analysis"
              description="Lab & Radiology revenue breakdown with monthly trends and center-wise drill-down"
              icon={DollarSign}
              color="from-purple-500 to-purple-700"
              onClick={() => setActiveView('revenue')}
            />
            <ReportCard
              title="Doctor Referrals"
              description="Top referring doctors, performance metrics, and individual doctor drill-down"
              icon={UserCheck}
              color="from-pink-500 to-pink-700"
              onClick={() => setActiveView('doctors')}
            />
            <ReportCard
              title="Sales Performance"
              description="Sales team targets, achievements, and individual performance tracking"
              icon={Target}
              color="from-green-500 to-green-700"
              onClick={() => setActiveView('sales')}
            />
            <ReportCard
              title="Referral vs Non-Referral"
              description="Compare patient sources, revenue distribution, and conversion metrics"
              icon={Users}
              color="from-blue-500 to-blue-700"
              onClick={() => setActiveView('referralVsNon')}
            />
            <ReportCard
              title="Test Analysis"
              description="Test volume, revenue by category, and individual test performance"
              icon={Activity}
              color="from-orange-500 to-orange-700"
              onClick={() => setActiveView('tests')}
            />
            <ReportCard
              title="Collection Report"
              description="Billing, collection rates, pending amounts, and payment trends"
              icon={FileText}
              color="from-indigo-500 to-indigo-700"
              onClick={() => setActiveView('collection')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Line type="monotone" dataKey="lab" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} name="Lab" />
                <Line type="monotone" dataKey="radiology" stroke="#EC4899" strokeWidth={3} dot={{ fill: '#EC4899', r: 4 }} name="Radiology" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Top 5 Doctors</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={doctorData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="doctor" stroke="#6B7280" angle={-20} textAnchor="end" height={80} />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Bar dataKey="referrals" fill="#EC4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;