'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Package, ShoppingCart, Image as ImageIcon, Tag } from 'lucide-react';

interface Item {
  id: number;
  name: string;
  description: string;
  quantity: number;
  imageUrl: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  items: Item[];
}

export default function InventoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 0,
    imageUrl: '',
    categoryId: 0,
  });

  const [newCategory, setNewCategory] = useState('');
  const [editItem, setEditItem] = useState<Item | null>(null);

  const fetchCategories = async () => {
    const res = await fetch('/api/category');
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const res = await fetch('/api/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory }),
    });

    if (res.ok) {
      await fetchCategories();
      setNewCategory('');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this category and all its items?');
    if (!confirmed) return;

    const res = await fetch(`/api/category/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      await fetchCategories();
    }
  };

  const handleAddItem = async () => {
    const res = await fetch('/api/item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });

    if (res.ok) {
      await fetchCategories();
      setNewItem({ name: '', description: '', quantity: 0, imageUrl: '', categoryId: 0 });
    }
  };

  const handleDeleteItem = async (id: number) => {
    await fetch(`/api/item/${id}`, { method: 'DELETE' });
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        items: category.items.filter((item) => item.id !== id),
      }))
    );
  };

  const handleEditItem = (item: Item) => {
    setEditItem(item);
  };

  const handleUpdateItem = async () => {
    if (!editItem) return;

    const res = await fetch(`/api/item/${editItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editItem),
    });

    if (res.ok) {
      await fetchCategories();
      setEditItem(null);
    }
  };

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [message, setMessage] = useState('');

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f2027] to-[#203a43] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-4">Inventory Management</h1>
          <p className="text-gray-300 text-lg">Manage your stock, categories, and items</p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-all"
          >
            <Tag className="w-5 h-5" />
            {showAddCategory ? 'Cancel' : 'Add Category'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddItem(!showAddItem)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            {showAddItem ? 'Cancel' : 'Add Item'}
          </motion.button>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Category Form */}
        <AnimatePresence>
          {showAddCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Tag className="w-6 h-6 text-green-400" />
                Add New Category
              </h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  className="flex-1 bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={async () => {
                    await handleAddCategory();
                    showMessage('Category added successfully!');
                  }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-all"
                >
                  Add Category
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Item Form */}
        <AnimatePresence>
          {showAddItem && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-400" />
                Add New Item
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity || ''}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  className="bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newItem.imageUrl}
                  onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                  className="bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newItem.categoryId}
                  onChange={(e) => setNewItem({ ...newItem, categoryId: Number(e.target.value) })}
                  className="bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    color: 'white',
                  }}
                >
                  <option value={0} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Select Category</option>
                  {categories.map((category) => (
                    <option 
                      key={category.id} 
                      value={category.id}
                      style={{ backgroundColor: '#1a1a1a', color: 'white' }}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={async () => {
                  await handleAddItem();
                  showMessage('Item added successfully!');
                  setShowAddItem(false);
                }}
                className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
              >
                Add Item
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category List */}
        {categories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
          >
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400 text-lg">No categories yet. Create your first category to get started!</p>
          </motion.div>
        ) : (
          categories.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Tag className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold">{category.name}</h2>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <button
                  onClick={async () => {
                    if (confirm(`Delete "${category.name}" and all its items?`)) {
                      await handleDeleteCategory(category.id);
                      showMessage('Category deleted successfully!');
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              {category.items.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
                  <p className="text-gray-400">No items in this category yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: itemIndex * 0.05 }}
                      className="group bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:shadow-2xl"
                    >
                      {/* Item Image */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-gray-500" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.quantity < 5 
                              ? 'bg-red-500/80 text-white' 
                              : item.quantity < 20 
                              ? 'bg-yellow-500/80 text-white' 
                              : 'bg-green-500/80 text-white'
                          }`}>
                            {item.quantity} in stock
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.description || 'No description'}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Quantity</p>
                            <p className="text-lg font-semibold">{item.quantity}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mb-4">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-all text-sm"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete "${item.name}"?`)) {
                                await handleDeleteItem(item.id);
                                showMessage('Item deleted successfully!');
                              }
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-all text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>

                        {/* Record Sale */}
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const quantity = Number(formData.get('quantity'));
                            const price = Number(formData.get('price'));
                            if (!quantity || !price) {
                              showMessage('Both quantity and price are required!');
                              return;
                            }

                            // Check if quantity exceeds available stock
                            if (quantity > item.quantity) {
                              showMessage(`Cannot sell ${quantity} items. Only ${item.quantity} available in stock.`);
                              return;
                            }

                            try {
                              const response = await fetch('/api/sale', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ itemId: item.id, quantity, price }),
                              });

                              let data;
                              try {
                                data = await response.json();
                              } catch (jsonError) {
                                console.error('Failed to parse API response:', jsonError);
                                showMessage('Failed to process server response');
                                return;
                              }

                              if (!response.ok) {
                                showMessage(data.error || 'Failed to record sale');
                                return;
                              }

                              // Sale recorded successfully
                              showMessage('Sale recorded successfully!');
                              
                              // Optimistically update the local state
                              try {
                                setCategories(prevCategories => 
                                  prevCategories.map(category => ({
                                    ...category,
                                    items: category.items.map(currentItem => 
                                      currentItem.id === item.id 
                                        ? { ...currentItem, quantity: currentItem.quantity - quantity }
                                        : currentItem
                                    )
                                  }))
                                );
                              } catch (stateError) {
                                console.warn('Failed to update local state:', stateError);
                              }
                              
                              // Clear form fields manually
                              try {
                                const form = e.target as HTMLFormElement;
                                if (form) {
                                  const quantityInput = form.querySelector('input[name="quantity"]') as HTMLInputElement;
                                  const priceInput = form.querySelector('input[name="price"]') as HTMLInputElement;
                                  if (quantityInput) quantityInput.value = '';
                                  if (priceInput) priceInput.value = '';
                                }
                              } catch (formError) {
                                console.warn('Failed to clear form fields:', formError);
                                // Form clearing failed, but sale was successful
                              }
                              
                              // Try to refresh categories from server (but local state is already updated)
                              try {
                                await fetchCategories();
                              } catch (refreshError) {
                                console.warn('Failed to refresh categories from server, but local state updated:', refreshError);
                                // Local state is already updated, so UI reflects the change
                              }
                            } catch (error) {
                              console.error('Sale recording error:', error);
                              showMessage('An error occurred while recording the sale');
                            }
                          }}
                          className="space-y-2 pt-4 border-t border-white/10"
                        >
                          <div className="flex gap-2">
                            <input
                              name="quantity"
                              type="number"
                              placeholder="Qty"
                              className="flex-1 bg-white/10 border border-white/20 px-3 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                              min="1"
                              required
                            />
                            <input
                              name="price"
                              type="number"
                              step="0.01"
                              placeholder="Price"
                              className="flex-1 bg-white/10 border border-white/20 px-3 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                              min="0"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all text-sm"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Record Sale
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}

        {/* Edit Item Modal */}
        <AnimatePresence>
          {editItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
              onClick={() => setEditItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Edit2 className="w-6 h-6 text-yellow-400" />
                    Edit Item
                  </h2>
                  <button
                    onClick={() => setEditItem(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Item Name</label>
                    <input
                      type="text"
                      value={editItem.name}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Description</label>
                    <input
                      type="text"
                      value={editItem.description}
                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={editItem.quantity}
                      onChange={(e) => setEditItem({ ...editItem, quantity: Number(e.target.value) })}
                      className="w-full bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Image URL</label>
                    <input
                      type="text"
                      value={editItem.imageUrl}
                      onChange={(e) => setEditItem({ ...editItem, imageUrl: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Category</label>
                    <select
                      value={editItem.categoryId}
                      onChange={(e) => setEditItem({ ...editItem, categoryId: Number(e.target.value) })}
                      className="w-full bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setEditItem(null)}
                    className="flex-1 px-4 py-3 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await handleUpdateItem();
                      showMessage('Item updated successfully!');
                    }}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                  >
                    Update Item
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
