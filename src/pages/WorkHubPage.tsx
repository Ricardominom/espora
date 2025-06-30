import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, User, Building2, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { storage } from '../utils/storage';

interface ProjectItem {
  id: number;
  name: string;
  type: 'project' | 'task' | 'document';
  status: 'active' | 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  dueDate: string;
  client: string;
}

interface Account {
  id: number;
  name: string;
}

const WorkHubPage: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'project' | 'task' | 'document'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProjectItems, setFilteredProjectItems] = useState<ProjectItem[]>([]);
  const [groupedItems, setGroupedItems] = useState<Record<string, ProjectItem[]>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Mock data for demonstration
  const mockProjectItems: ProjectItem[] = [
    {
      id: 1,
      name: 'Website Redesign',
      type: 'project',
      status: 'active',
      priority: 'high',
      assignee: 'John Doe',
      dueDate: '2024-02-15',
      client: 'Tech Corp'
    },
    {
      id: 2,
      name: 'Database Migration',
      type: 'task',
      status: 'pending',
      priority: 'medium',
      assignee: 'Jane Smith',
      dueDate: '2024-02-20',
      client: 'Tech Corp'
    },
    {
      id: 3,
      name: 'Project Requirements',
      type: 'document',
      status: 'completed',
      priority: 'low',
      assignee: 'Mike Johnson',
      dueDate: '2024-01-30',
      client: 'Design Studio'
    }
  ];

  useEffect(() => {
    // Load selected account from storage
    const savedAccount = storage.getItem<Account>('selectedWorkHubAccount');
    if (savedAccount) {
      setSelectedAccount(savedAccount);
      loadAccountData(savedAccount.id);
    }
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      filterAndGroupItems();
    }
  }, [searchTerm, filterType, filterStatus, selectedAccount]);

  const loadAccountData = (accountId: number) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setFilteredProjectItems(mockProjectItems);
      setIsLoading(false);
    }, 800);
  };

  const handleSelectAccount = (accountId: number, accountName: string) => {
    setSelectedAccount({ id: accountId, name: accountName });
    
    // Clear previous data
    setFilteredProjectItems([]);
    setGroupedItems({});
    
    setIsLoading(true);
    
    // Save selected account to localStorage
    storage.setItem('selectedWorkHubAccount', { id: accountId, name: accountName });

    // Extract client name from account name
    const clientName = accountName.split(' - ')[0];
    
    // Add to clients list if not already there
    const clientsList = storage.getItem<string[]>('clientsList') || [];
    if (!clientsList.includes(clientName)) {
      clientsList.push(clientName);
      storage.setItem('clientsList', clientsList);
    }
    
    setTimeout(() => {
      // In a real application, we would load data for the selected account here
      setIsLoading(false);
    }, 800);
  };

  const filterAndGroupItems = () => {
    let filtered = mockProjectItems;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    setFilteredProjectItems(filtered);

    // Group by client
    const grouped = filtered.reduce((acc, item) => {
      if (!acc[item.client]) {
        acc[item.client] = [];
      }
      acc[item.client].push(item);
      return acc;
    }, {} as Record<string, ProjectItem[]>);

    setGroupedItems(grouped);
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'completed': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return <Building2 className="w-4 h-4" />;
      case 'task': return <Clock className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Account</h2>
            <p className="text-gray-600 mb-6">
              Please select an account to access WorkHub features.
            </p>
            <button
              onClick={() => {
                // This would open account selection modal
                handleSelectAccount(1, 'Tech Corp - Main Account');
              }}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Select Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">WorkHub</h1>
                <p className="text-sm text-gray-500">{selectedAccount.name}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedAccount(null)}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Change Account
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects, tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="project">Projects</option>
              <option value="task">Tasks</option>
              <option value="document">Documents</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading account data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(groupedItems).length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">
                  {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'No projects, tasks, or documents available for this account.'}
                </p>
              </div>
            ) : (
              Object.entries(groupedItems).map(([clientName, items]) => (
                <div key={clientName} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleGroup(clientName)}
                    className="w-full px-6 py-4 bg-gray-50 border-b flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {expandedGroups[clientName] ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                      <h3 className="text-lg font-medium text-gray-900">{clientName}</h3>
                      <span className="bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded-full">
                        {items.length} items
                      </span>
                    </div>
                  </button>

                  {expandedGroups[clientName] && (
                    <div className="divide-y divide-gray-200">
                      {items.map((item) => (
                        <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 mt-1">
                                {getTypeIcon(item.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-medium text-gray-900 mb-2">
                                  {item.name}
                                </h4>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <User className="w-4 h-4" />
                                    <span>{item.assignee}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                                {item.priority}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkHubPage;