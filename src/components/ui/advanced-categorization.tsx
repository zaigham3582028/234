import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderPlus,
  Tag,
  Wand2,
  Brain,
  Search,
  Filter,
  Plus,
  X,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Music,
  Video,
  Image,
  FileText,
  Archive,
  Star,
  Heart,
  Clock,
  Calendar,
  User,
  MapPin,
  Palette,
  Camera,
  Mic,
  Monitor,
  Smartphone,
  Settings,
  Zap,
  Target,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppStore, Category } from '@/store/useAppStore';

interface AdvancedCategorizationProps {
  onClose: () => void;
}

const AdvancedCategorization: React.FC<AdvancedCategorizationProps> = ({ onClose }) => {
  const { 
    files, 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    autoCategorizeBySingers,
    autoCategorizeByContent
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'manual' | 'auto' | 'ai'>('manual');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('folder');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');
  const [searchTerms, setSearchTerms] = useState<string[]>(['']);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  // Auto categorization settings
  const [autoSettings, setAutoSettings] = useState({
    byArtist: true,
    byGenre: true,
    byYear: true,
    byFileType: true,
    bySize: false,
    byDuration: false,
    byResolution: false,
    byLocation: false,
    byDate: true,
    byKeywords: true
  });

  // AI categorization settings
  const [aiSettings, setAiSettings] = useState({
    apiKey: '',
    model: 'gpt-3.5-turbo',
    categories: 10,
    confidence: 0.7,
    includeMetadata: true,
    includeContent: false
  });

  const iconOptions = [
    { name: 'folder', icon: Folder },
    { name: 'music', icon: Music },
    { name: 'video', icon: Video },
    { name: 'image', icon: Image },
    { name: 'document', icon: FileText },
    { name: 'archive', icon: Archive },
    { name: 'star', icon: Star },
    { name: 'heart', icon: Heart },
    { name: 'user', icon: User },
    { name: 'calendar', icon: Calendar },
    { name: 'clock', icon: Clock },
    { name: 'location', icon: MapPin },
    { name: 'palette', icon: Palette },
    { name: 'camera', icon: Camera },
    { name: 'mic', icon: Mic },
    { name: 'monitor', icon: Monitor },
    { name: 'smartphone', icon: Smartphone },
    { name: 'tag', icon: Tag }
  ];

  const colorOptions = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
    '#f97316', '#6366f1', '#14b8a6', '#eab308',
    '#a855f7', '#f43f5e', '#0ea5e9', '#22c55e'
  ];

  const handleCreateCategory = useCallback(() => {
    if (!newCategoryName.trim()) return;

    const matchingFiles = files.filter(file => {
      return searchTerms.some(term => {
        if (!term.trim()) return false;
        const searchTerm = term.toLowerCase();
        return (
          file.name.toLowerCase().includes(searchTerm) ||
          file.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      });
    });

    addCategory({
      name: newCategoryName,
      icon: newCategoryIcon,
      count: matchingFiles.length,
      color: newCategoryColor,
      rules: searchTerms.filter(term => term.trim())
    });

    // Reset form
    setNewCategoryName('');
    setNewCategoryIcon('folder');
    setNewCategoryColor('#3b82f6');
    setSearchTerms(['']);
  }, [newCategoryName, newCategoryIcon, newCategoryColor, searchTerms, files, addCategory]);

  const handleAutoCategorizeBySingers = useCallback(() => {
    const singers = new Set<string>();
    
    files.forEach(file => {
      const name = file.name.toLowerCase();
      const commonSingers = [
        'arijit singh', 'shreya ghoshal', 'rahat fateh ali khan', 'atif aslam',
        'kishore kumar', 'lata mangeshkar', 'mohd rafi', 'sonu nigam',
        'armaan malik', 'neha kakkar', 'honey singh', 'badshah',
        'guru randhawa', 'diljit dosanjh', 'hardy sandhu', 'b praak'
      ];

      commonSingers.forEach(singer => {
        if (name.includes(singer)) {
          singers.add(singer);
        }
      });
    });

    singers.forEach(singer => {
      const matchingFiles = files.filter(file =>
        file.name.toLowerCase().includes(singer) ||
        file.tags.some(tag => tag.toLowerCase().includes(singer))
      );

      const categoryName = singer.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      addCategory({
        name: categoryName,
        icon: 'music',
        count: matchingFiles.length,
        color: '#3b82f6',
        rules: [singer]
      });
    });
  }, [files, addCategory]);

  const handleAutoCategorizeByGenre = useCallback(() => {
    const genres = new Set<string>();
    
    files.forEach(file => {
      const name = file.name.toLowerCase();
      const tags = file.tags.map(tag => tag.toLowerCase());
      const commonGenres = [
        'bollywood', 'punjabi', 'classical', 'rock', 'pop', 'jazz',
        'hip hop', 'electronic', 'folk', 'devotional', 'ghazal',
        'qawwali', 'sufi', 'romantic', 'sad', 'party', 'dance'
      ];

      commonGenres.forEach(genre => {
        if (name.includes(genre) || tags.includes(genre)) {
          genres.add(genre);
        }
      });
    });

    genres.forEach(genre => {
      const matchingFiles = files.filter(file =>
        file.name.toLowerCase().includes(genre) ||
        file.tags.some(tag => tag.toLowerCase().includes(genre))
      );

      const categoryName = genre.charAt(0).toUpperCase() + genre.slice(1);

      addCategory({
        name: categoryName,
        icon: 'music',
        count: matchingFiles.length,
        color: '#10b981',
        rules: [genre]
      });
    });
  }, [files, addCategory]);

  const handleAutoCategorizeByFileType = useCallback(() => {
    const typeCategories = [
      { type: 'video', name: 'Videos', icon: 'video', color: '#ef4444' },
      { type: 'image', name: 'Images', icon: 'image', color: '#10b981' },
      { type: 'audio', name: 'Audio', icon: 'music', color: '#f59e0b' },
      { type: 'document', name: 'Documents', icon: 'document', color: '#6366f1' },
      { type: 'archive', name: 'Archives', icon: 'archive', color: '#8b5cf6' }
    ];

    typeCategories.forEach(({ type, name, icon, color }) => {
      const matchingFiles = files.filter(file => file.type === type);
      
      if (matchingFiles.length > 0) {
        addCategory({
          name,
          icon,
          count: matchingFiles.length,
          color,
          rules: [type]
        });
      }
    });
  }, [files, addCategory]);

  const handleAutoCategorizeByDate = useCallback(() => {
    const dateCategories = new Map<string, any[]>();
    
    files.forEach(file => {
      const year = file.createdAt.getFullYear();
      const month = file.createdAt.getMonth();
      const yearKey = year.toString();
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      
      if (!dateCategories.has(yearKey)) {
        dateCategories.set(yearKey, []);
      }
      dateCategories.get(yearKey)!.push(file);
    });

    dateCategories.forEach((files, year) => {
      addCategory({
        name: `Year ${year}`,
        icon: 'calendar',
        count: files.length,
        color: '#06b6d4',
        rules: [year]
      });
    });
  }, [files, addCategory]);

  const handleAICategorizationPreview = useCallback(async () => {
    if (!aiSettings.apiKey) {
      alert('Please enter your OpenAI API key');
      return;
    }

    // This would integrate with OpenAI API
    // For now, we'll simulate the response
    const simulatedCategories = [
      { name: 'Romantic Songs', count: 15, confidence: 0.85 },
      { name: 'Party Music', count: 12, confidence: 0.78 },
      { name: 'Classical Music', count: 8, confidence: 0.92 },
      { name: 'Nature Videos', count: 6, confidence: 0.88 },
      { name: 'Travel Photos', count: 20, confidence: 0.75 }
    ];

    console.log('AI Categorization Preview:', simulatedCategories);
  }, [aiSettings]);

  const addSearchTerm = () => {
    setSearchTerms([...searchTerms, '']);
  };

  const updateSearchTerm = (index: number, value: string) => {
    const newTerms = [...searchTerms];
    newTerms[index] = value;
    setSearchTerms(newTerms);
  };

  const removeSearchTerm = (index: number) => {
    if (searchTerms.length > 1) {
      setSearchTerms(searchTerms.filter((_, i) => i !== index));
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 rounded-xl border border-white/10 w-full max-w-6xl h-[90vh] flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wand2 className="h-6 w-6" />
            Advanced Categorization
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {[
              { id: 'manual', label: 'Manual', icon: Settings },
              { id: 'auto', label: 'Auto Rules', icon: Zap },
              { id: 'ai', label: 'AI Powered', icon: Brain }
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                onClick={() => setActiveTab(id as any)}
                variant="ghost"
                className={cn(
                  "flex-1 flex items-center gap-2 text-white/70 hover:bg-white/10",
                  activeTab === id && "bg-white/10 text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'manual' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Create Custom Category</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Category Name</label>
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter category name..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Icon</label>
                        <div className="grid grid-cols-6 gap-2">
                          {iconOptions.map(({ name, icon: Icon }) => (
                            <Button
                              key={name}
                              onClick={() => setNewCategoryIcon(name)}
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "text-white/70 hover:bg-white/10",
                                newCategoryIcon === name && "bg-white/20 text-white"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Color</label>
                        <div className="grid grid-cols-8 gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              onClick={() => setNewCategoryColor(color)}
                              className={cn(
                                "w-8 h-8 rounded-lg border-2",
                                newCategoryColor === color ? "border-white" : "border-white/20"
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Search Terms</label>
                      <div className="space-y-2">
                        {searchTerms.map((term, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={term}
                              onChange={(e) => updateSearchTerm(index, e.target.value)}
                              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter search term..."
                            />
                            {searchTerms.length > 1 && (
                              <Button
                                onClick={() => removeSearchTerm(index)}
                                variant="ghost"
                                size="icon"
                                className="text-white/70 hover:bg-white/10 hover:text-red-400"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          onClick={addSearchTerm}
                          variant="ghost"
                          size="sm"
                          className="text-white/70 hover:bg-white/10 hover:text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Search Term
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleCreateCategory}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!newCategoryName.trim()}
                    >
                      Create Category
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'auto' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Automatic Categorization Rules</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={handleAutoCategorizeBySingers}
                      className="p-4 h-auto flex flex-col items-start gap-2 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      <div className="flex items-center gap-2 text-white">
                        <Music className="h-5 w-5" />
                        <span className="font-medium">By Artists/Singers</span>
                      </div>
                      <p className="text-sm text-white/60 text-left">
                        Automatically categorize music files by artist names found in filenames
                      </p>
                    </Button>

                    <Button
                      onClick={handleAutoCategorizeByGenre}
                      className="p-4 h-auto flex flex-col items-start gap-2 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      <div className="flex items-center gap-2 text-white">
                        <Tag className="h-5 w-5" />
                        <span className="font-medium">By Genre</span>
                      </div>
                      <p className="text-sm text-white/60 text-left">
                        Group files by music genres and content types
                      </p>
                    </Button>

                    <Button
                      onClick={handleAutoCategorizeByFileType}
                      className="p-4 h-auto flex flex-col items-start gap-2 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      <div className="flex items-center gap-2 text-white">
                        <Layers className="h-5 w-5" />
                        <span className="font-medium">By File Type</span>
                      </div>
                      <p className="text-sm text-white/60 text-left">
                        Create categories for videos, images, audio, and documents
                      </p>
                    </Button>

                    <Button
                      onClick={handleAutoCategorizeByDate}
                      className="p-4 h-auto flex flex-col items-start gap-2 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      <div className="flex items-center gap-2 text-white">
                        <Calendar className="h-5 w-5" />
                        <span className="font-medium">By Date</span>
                      </div>
                      <p className="text-sm text-white/60 text-left">
                        Organize files by creation date and time periods
                      </p>
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-white mb-3">Auto-Categorization Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(autoSettings).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-2 text-white/70">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setAutoSettings({...autoSettings, [key]: e.target.checked})}
                          className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">AI-Powered Categorization</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">OpenAI API Key</label>
                      <input
                        type="password"
                        value={aiSettings.apiKey}
                        onChange={(e) => setAiSettings({...aiSettings, apiKey: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your OpenAI API key..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Model</label>
                        <select
                          value={aiSettings.model}
                          onChange={(e) => setAiSettings({...aiSettings, model: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          <option value="gpt-4">GPT-4</option>
                          <option value="gpt-4-turbo">GPT-4 Turbo</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Max Categories</label>
                        <input
                          type="number"
                          value={aiSettings.categories}
                          onChange={(e) => setAiSettings({...aiSettings, categories: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Confidence Threshold: {aiSettings.confidence}</label>
                      <input
                        type="range"
                        value={aiSettings.confidence}
                        onChange={(e) => setAiSettings({...aiSettings, confidence: parseFloat(e.target.value)})}
                        className="w-full"
                        min="0.1"
                        max="1"
                        step="0.1"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-white/70">
                        <input
                          type="checkbox"
                          checked={aiSettings.includeMetadata}
                          onChange={(e) => setAiSettings({...aiSettings, includeMetadata: e.target.checked})}
                          className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">Include file metadata in analysis</span>
                      </label>
                      <label className="flex items-center gap-2 text-white/70">
                        <input
                          type="checkbox"
                          checked={aiSettings.includeContent}
                          onChange={(e) => setAiSettings({...aiSettings, includeContent: e.target.checked})}
                          className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">Analyze file content (slower, more accurate)</span>
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleAICategorizationPreview}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={!aiSettings.apiKey}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Preview AI Categories
                      </Button>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        disabled={!aiSettings.apiKey}
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Apply AI Categories
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Existing Categories */}
          <div className="w-80 border-l border-white/10 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Existing Categories</h3>
            
            {categories.length === 0 ? (
              <div className="text-center text-white/50 py-8">
                <Folder className="h-12 w-12 mx-auto mb-2" />
                <p>No categories yet</p>
                <p className="text-sm">Create your first category</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    className="p-3 rounded-lg border border-white/10 bg-white/5"
                    layout
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-white text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-white/50 text-xs">{category.count}</span>
                        <Button
                          onClick={() => deleteCategory(category.id)}
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-white/50 hover:bg-white/10 hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {category.rules && category.rules.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {category.rules.map((rule, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded"
                          >
                            {rule}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedCategorization;