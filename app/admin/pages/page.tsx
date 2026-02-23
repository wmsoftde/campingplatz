'use client';

import { useState, useEffect } from 'react';

interface Page {
  id: string;
  slug: string;
  titleDe: string;
  titleEn: string;
  contentDe: string;
  contentEn: string;
  image: string | null;
  published: boolean;
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    titleDe: '',
    titleEn: '',
    contentDe: '',
    contentEn: '',
    image: '',
    published: false
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const res = await fetch('/api/admin/pages');
    const data = await res.json();
    setPages(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = editingPage ? 'PUT' : 'POST';
    const url = editingPage ? `/api/admin/pages/${editingPage.id}` : '/api/admin/pages';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    setShowForm(false);
    setEditingPage(null);
    fetchPages();
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      titleDe: page.titleDe,
      titleEn: page.titleEn || '',
      contentDe: page.contentDe || '',
      contentEn: page.contentEn || '',
      image: page.image || '',
      published: page.published
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diese Seite wirklich löschen?')) return;
    
    await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
    fetchPages();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold text-gray-800">
          Seiten verwalten
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingPage(null);
            setFormData({
              slug: '',
              titleDe: '',
              titleEn: '',
              contentDe: '',
              contentEn: '',
              image: '',
              published: false
            });
          }}
          className="btn-primary"
        >
          + Neue Seite
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="font-heading text-xl font-bold mb-6">
            {editingPage ? 'Seite bearbeiten' : 'Neue Seite'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL-Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-gray-700">Veröffentlicht</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titel (Deutsch)
                </label>
                <input
                  type="text"
                  value={formData.titleDe}
                  onChange={(e) => setFormData({ ...formData, titleDe: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titel (Englisch)
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bild-URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inhalt (Deutsch)
                </label>
                <textarea
                  value={formData.contentDe}
                  onChange={(e) => setFormData({ ...formData, contentDe: e.target.value })}
                  className="input-field h-40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inhalt (Englisch)
                </label>
                <textarea
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  className="input-field h-40"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                Speichern
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingPage(null);
                }}
                className="btn-secondary"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Laden...</div>
      ) : pages.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-500">Noch keine Seiten vorhanden.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Titel</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Slug</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{page.titleDe}</td>
                  <td className="py-4 px-6 text-gray-500">/{page.slug}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      page.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {page.published ? 'Veröffentlicht' : 'Entwurf'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(page)}
                      className="text-blue-600 hover:underline"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:underline"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
