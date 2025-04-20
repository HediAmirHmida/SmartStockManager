'use client';

import React, { useEffect, useState } from 'react';

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

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory</h1>

      {/* Add Category Form */}
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded w-full"
          />
          <button
            onClick={handleAddCategory}
            className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
            className="bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newItem.imageUrl}
            onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
            className="bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded"
          />
          <select
            value={newItem.categoryId}
            onChange={(e) => setNewItem({ ...newItem, categoryId: Number(e.target.value) })}
            className="bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded"
          >
            <option value={0}>Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddItem}
          className="mt-4 bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>

      {/* Category List */}
      {categories.map((category) => (
        <div key={category.id} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{category.name}</h2>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
            >
              Delete Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded mb-3 border border-gray-700"
                />
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
                <p className="text-sm mt-1">
                  Quantity: <span className="font-semibold text-white">{item.quantity}</span>
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="text-sm bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
                  >
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
                    if (!quantity || !price) return alert('Both fields required');

                    await fetch('/api/sale', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ itemId: item.id, quantity, price }),
                    });

                    await fetchCategories();
                    alert('Sale recorded!');
                    e.currentTarget.reset();
                  }}
                  className="space-y-2 mt-4"
                >
                  <input
                    name="quantity"
                    type="number"
                    placeholder="Qty sold"
                    className="bg-gray-700 text-white border border-gray-600 px-2 py-1 w-full rounded"
                    min="1"
                    required
                  />
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Price per unit"
                    className="bg-gray-700 text-white border border-gray-600 px-2 py-1 w-full rounded"
                    min="0"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded py-1"
                  >
                    Record Sale
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Edit Item Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">Edit Item</h2>
            <input
              type="text"
              value={editItem.name}
              onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
              className="bg-gray-700 text-white border border-gray-600 px-3 py-2 w-full rounded mb-4"
            />
            <input
              type="text"
              value={editItem.description}
              onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
              className="bg-gray-700 text-white border border-gray-600 px-3 py-2 w-full rounded mb-4"
            />
            <input
              type="number"
              value={editItem.quantity}
              onChange={(e) => setEditItem({ ...editItem, quantity: Number(e.target.value) })}
              className="bg-gray-700 text-white border border-gray-600 px-3 py-2 w-full rounded mb-4"
            />
            <input
              type="text"
              value={editItem.imageUrl}
              onChange={(e) => setEditItem({ ...editItem, imageUrl: e.target.value })}
              className="bg-gray-700 text-white border border-gray-600 px-3 py-2 w-full rounded mb-4"
            />
            <select
              value={editItem.categoryId}
              onChange={(e) => setEditItem({ ...editItem, categoryId: Number(e.target.value) })}
              className="bg-gray-700 text-white border border-gray-600 px-3 py-2 w-full rounded mb-4"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditItem(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateItem}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
