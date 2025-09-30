import React, { useState, useMemo } from 'react';
import { Home, MapPin, DollarSign, Building, TrendingUp, Users } from 'lucide-react';
import { HousingData, processCSVData, csvData } from './components/DataProcessor';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';
import FilterPanel from './components/FilterPanel';
import PriceDistributionChart from './components/PriceDistributionChart';
import CountyDistributionChart from './components/CountyDistributionChart';
import BedroomAnalysisChart from './components/BedroomAnalysisChart';
import AvailabilityDonutChart from './components/AvailabilityDonutChart';

function App() {
  const [sortBy, setSortBy] = useState<'projects' | 'units' | 'price'>('projects');
  const [filters, setFilters] = useState({
    county: '',
    category: '',
    status: '',
    search: ''
  });

  // Process the CSV data
  const housingData = useMemo(() => processCSVData(csvData), []);

  // Filter the data based on current filters
  const filteredData = useMemo(() => {
    return housingData.filter(item => {
      return (
        (!filters.county || item.county === filters.county) &&
        (!filters.category || item.category === filters.category) &&
        (!filters.status || item.projectStatus === filters.status) &&
        (!filters.search || 
          item.projectName.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.location.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    });
  }, [housingData, filters]);

  // Extract unique values for filters
  const uniqueCounties = useMemo(() => 
    [...new Set(housingData.map(item => item.county))].sort(), [housingData]);
  
  const uniqueCategories = useMemo(() => 
    [...new Set(housingData.map(item => item.category))].filter(Boolean).sort(), [housingData]);
  
  const uniqueStatuses = useMemo(() => 
    [...new Set(housingData.map(item => item.projectStatus))].sort(), [housingData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProjects = new Set(filteredData.map(item => item.projectName)).size;
    const totalUnits = filteredData.reduce((sum, item) => sum + (item.totalUnits || 1), 0);
    const averagePrice = filteredData.reduce((sum, item) => sum + item.price, 0) / filteredData.length;
    const availableUnits = filteredData.filter(item => item.availableUnits === 'Available').length;
    const soldOutUnits = filteredData.filter(item => item.availableUnits === 'Sold Out').length;
    const avgMonthlyPayment = filteredData
      .filter(item => item.tpsPerMonth)
      .reduce((sum, item) => sum + (item.tpsPerMonth || 0), 0) / 
      filteredData.filter(item => item.tpsPerMonth).length;

    return {
      totalProjects,
      totalUnits,
      averagePrice,
      availableUnits,
      soldOutUnits,
      avgMonthlyPayment,
      totalCounties: new Set(filteredData.map(item => item.county)).size
    };
  }, [filteredData]);

  // Price distribution by category
  const priceDistribution = useMemo(() => {
    const categoryData: { [key: string]: { prices: number[]; count: number } } = {};
    
    filteredData.forEach(item => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = { prices: [], count: 0 };
      }
      categoryData[item.category].prices.push(item.price);
      categoryData[item.category].count++;
    });

    const colors = {
      'Social': '#2563EB',
      'Affordable': '#059669',
      'Market': '#EA580C',
      'Other': '#6B7280'
    };

    return Object.entries(categoryData).map(([category, data]) => ({
      category,
      avgPrice: data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length,
      count: data.count,
      color: colors[category as keyof typeof colors] || '#6B7280'
    })).sort((a, b) => a.avgPrice - b.avgPrice);
  }, [filteredData]);

  // County distribution
  const countyDistribution = useMemo(() => {
    const countyData: { [key: string]: { projects: Set<string>; totalUnits: number; prices: number[] } } = {};
    
    filteredData.forEach(item => {
      if (!countyData[item.county]) {
        countyData[item.county] = { projects: new Set(), totalUnits: 0, prices: [] };
      }
      countyData[item.county].projects.add(item.projectName);
      countyData[item.county].totalUnits += item.totalUnits || 1;
      countyData[item.county].prices.push(item.price);
    });

    return Object.entries(countyData).map(([county, data]) => ({
      county,
      totalProjects: data.projects.size,
      totalUnits: data.totalUnits,
      avgPrice: data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length
    }));
  }, [filteredData]);

  // Bedroom analysis
  const bedroomAnalysis = useMemo(() => {
    const bedroomData: { [key: string]: { count: number; prices: number[]; monthlyPayments: number[] } } = {};
    
    filteredData.forEach(item => {
      let bedroomCategory = 'Unknown';
      if (item.bedrooms === 0) bedroomCategory = 'Studio';
      else if (item.bedrooms === 1) bedroomCategory = '1 Bedroom';
      else if (item.bedrooms === 2) bedroomCategory = '2 Bedrooms';
      else if (item.bedrooms === 3) bedroomCategory = '3 Bedrooms';
      else if (item.bedrooms === 4) bedroomCategory = '4+ Bedrooms';
      else if (item.unitType.toLowerCase().includes('room')) {
        if (item.unitType.includes('1')) bedroomCategory = '1 Room';
        else if (item.unitType.includes('2')) bedroomCategory = '2 Rooms';
        else if (item.unitType.includes('3')) bedroomCategory = '3 Rooms';
      }
      
      if (!bedroomData[bedroomCategory]) {
        bedroomData[bedroomCategory] = { count: 0, prices: [], monthlyPayments: [] };
      }
      bedroomData[bedroomCategory].count++;
      bedroomData[bedroomCategory].prices.push(item.price);
      if (item.tpsPerMonth) {
        bedroomData[bedroomCategory].monthlyPayments.push(item.tpsPerMonth);
      }
    });

    return Object.entries(bedroomData)
      .filter(([category]) => category !== 'Unknown')
      .map(([bedrooms, data]) => ({
        bedrooms,
        count: data.count,
        avgPrice: data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length,
        avgMonthlyPayment: data.monthlyPayments.length > 0 
          ? data.monthlyPayments.reduce((sum, payment) => sum + payment, 0) / data.monthlyPayments.length 
          : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);

  // Availability analysis
  const availabilityAnalysis = useMemo(() => {
    const statusCount: { [key: string]: number } = {};
    
    filteredData.forEach(item => {
      statusCount[item.availableUnits] = (statusCount[item.availableUnits] || 0) + 1;
    });

    const total = Object.values(statusCount).reduce((sum, count) => sum + count, 0);
    const colors = {
      'Available': '#059669',
      'Sold Out': '#DC2626',
      'Other': '#6B7280'
    };

    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
      percentage: (count / total) * 100,
      color: colors[status as keyof typeof colors] || colors.Other
    }));
  }, [filteredData]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/Kenya-National-Reit-Logo (1).png" 
                alt="Kenya National Reit Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kenya National Reit</h1>
                <p className="text-sm text-gray-600">Affordable Housing Project 2025 Data Visualization Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <FilterPanel
          counties={uniqueCounties}
          categories={uniqueCategories}
          statuses={uniqueStatuses}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            subtitle="Across Kenya"
            icon={<Building className="w-5 h-5" />}
          />
          <StatCard
            title="Total Housing Units"
            value={stats.totalUnits}
            subtitle={`In ${stats.totalCounties} counties`}
            icon={<Home className="w-5 h-5" />}
          />
          <StatCard
            title="Average Price"
            value={`KES ${(stats.averagePrice / 1000000).toFixed(1)}M`}
            subtitle="Per unit"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatCard
            title="Available Units"
            value={stats.availableUnits}
            subtitle={`${stats.soldOutUnits} sold out`}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard
            title="Price Distribution by Category"
            subtitle="Average prices across housing categories"
          >
            <PriceDistributionChart data={priceDistribution} />
          </ChartCard>

          <ChartCard
            title="Unit Availability Status"
            subtitle="Current availability across all units"
          >
            <AvailabilityDonutChart data={availabilityAnalysis} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard
            title="County Distribution"
            subtitle={`Sorted by ${sortBy === 'projects' ? 'number of projects' : sortBy === 'units' ? 'total units' : 'average price'}`}
            className="relative"
          >
            <div className="absolute top-6 right-6">
              <select
                className="text-sm border border-gray-300 rounded px-2 py-1"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'projects' | 'units' | 'price')}
              >
                <option value="projects">By Projects</option>
                <option value="units">By Units</option>
                <option value="price">By Price</option>
              </select>
            </div>
            <CountyDistributionChart data={countyDistribution} sortBy={sortBy} />
          </ChartCard>

          <ChartCard
            title="Bedroom Analysis"
            subtitle="Unit count and pricing by bedroom configuration"
          >
            <BedroomAnalysisChart data={bedroomAnalysis} />
          </ChartCard>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Average Monthly Payment"
            value={`KES ${(stats.avgMonthlyPayment / 1000).toFixed(0)}K`}
            subtitle="Based on available data"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatCard
            title="Most Active County"
            value={countyDistribution.sort((a, b) => b.totalProjects - a.totalProjects)[0]?.county || 'N/A'}
            subtitle={`${countyDistribution.sort((a, b) => b.totalProjects - a.totalProjects)[0]?.totalProjects || 0} projects`}
            icon={<MapPin className="w-5 h-5" />}
          />
          <StatCard
            title="Largest Project"
            value={Math.max(...filteredData.filter(d => d.totalUnits).map(d => d.totalUnits!)).toLocaleString()}
            subtitle="Units in single project"
            icon={<Users className="w-5 h-5" />}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
