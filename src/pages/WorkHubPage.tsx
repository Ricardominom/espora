import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useFileStore } from '../stores/fileStore';
import { useClientStore } from '../stores/clientStore';
import { Header } from '../components/Header';
import { LogoutDialog } from '../components/LogoutDialog';
import { SelectAccountModalForWorkHub } from '../components/SelectAccountModalForWorkHub';
import { FileNameEditModal } from '../components/FileNameEditModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  FolderOpen, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Download,
  Upload,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';

interface ProjectItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: number;
  modified: Date;
  path: string;
}

const WorkHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { files, loading, error, loadFiles, createFile, deleteFile, renameFile } = useFileStore();
  const { selectedClient } = useClientStore();
  
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showFileNameModal, setShowFileNameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProjectItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'folders' | 'files'>('all');
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!selectedClient) {
      setShowAccountModal(true);
      return;
    }

    loadProjectItems();
  }, [user, selectedClient, navigate]);

  const loadProjectItems = async () => {
    try {
      await loadFiles();
      // Transform files to project items format
      const items: ProjectItem[] = files.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type === 'folder' ? 'folder' : 'file',
        size: file.size,
        modified: new Date(file.lastModified),
        path: file.path
      }));
      setProjectItems(items);
    } catch (error) {
      console.error('Error loading project items:', error);
    }
  };

  const handleCreateNew = (type: 'folder' | 'file') => {
    setSelectedItem({ 
      id: '', 
      name: '', 
      type, 
      modified: new Date(), 
      path: '/' 
    });
    setShowFileNameModal(true);
  };

  const handleEdit = (item: ProjectItem) => {
    setSelectedItem(item);
    setShowFileNameModal(true);
  };

  const handleDelete = (item: ProjectItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleSaveFileName = async (name: string) => {
    if (!selectedItem) return;

    try {
      if (selectedItem.id) {
        // Rename existing item
        await renameFile(selectedItem.id, name);
      } else {
        // Create new item
        await createFile(name, selectedItem.type);
      }
      await loadProjectItems();
      setShowFileNameModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;

    try {
      await deleteFile(selectedItem.id);
      await loadProjectItems();
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const filteredItems = projectItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'folders' && item.type === 'folder') ||
      (filterType === 'files' && item.type === 'file');
    
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header 
          user={user}
          onLogout={() => setShowLogoutDialog(true)}
        />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header 
        user={user}
        onLogout={() => setShowLogoutDialog(true)}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Work Hub</h1>
          <p className="text-gray-600">
            Manage your projects and files for {selectedClient?.name}
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search files and folders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-4 h-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Items</option>
                  <option value="folders">Folders Only</option>
                  <option value="files">Files Only</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Create Actions */}
              <button
                onClick={() => handleCreateNew('folder')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Folder
              </button>
              
              <button
                onClick={() => handleCreateNew('file')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New File
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first folder or file'
                }
              </p>
              {!searchTerm && filterType === 'all' && (
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleCreateNew('folder')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Folder
                  </button>
                  <button
                    onClick={() => handleCreateNew('file')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create File
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center mb-3">
                        {item.type === 'folder' ? (
                          <FolderOpen className="w-8 h-8 text-blue-500" />
                        ) : (
                          <FileText className="w-8 h-8 text-gray-500" />
                        )}
                        <div className="ml-3 flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatDate(item.modified)}
                          </p>
                        </div>
                      </div>
                      
                      {item.size && (
                        <p className="text-xs text-gray-500 mb-3">
                          {formatFileSize(item.size)}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-500 hover:bg-white rounded"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-white rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        {item.type === 'folder' ? (
                          <FolderOpen className="w-5 h-5 text-blue-500 mr-3" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-500 mr-3" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatDate(item.modified)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {item.size && (
                          <span className="text-sm text-gray-500">
                            {formatFileSize(item.size)}
                          </span>
                        )}
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item);
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <SelectAccountModalForWorkHub
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />

      <FileNameEditModal
        isOpen={showFileNameModal}
        onClose={() => {
          setShowFileNameModal(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveFileName}
        initialName={selectedItem?.name || ''}
        type={selectedItem?.type || 'file'}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedItem(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={selectedItem?.name || ''}
        itemType={selectedItem?.type || 'file'}
      />

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      />
    </div>
  );
};

export default WorkHubPage;