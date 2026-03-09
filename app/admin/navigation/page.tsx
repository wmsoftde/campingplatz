'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';

interface NavLink {
  id: string;
  labelDe: string;
  labelEn: string;
  url: string;
  position: number;
  location: string;
  parentId: string | null;
  children?: NavLink[];
}

export default function NavigationPage() {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<NavLink | null>(null);
  const [activeTab, setActiveTab] = useState<'navbar' | 'footer'>('navbar');
  const [formData, setFormData] = useState({
    labelDe: '',
    labelEn: '',
    url: '',
    position: 0,
    location: 'navbar',
    parentId: ''
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const res = await fetch('/api/admin/navigation');
    const data = await res.json();
    setLinks(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      position: parseInt(formData.position as unknown as string) || 0,
      parentId: formData.parentId || null
    };

    const method = editingLink ? 'PUT' : 'POST';
    const url = editingLink ? `/api/admin/navigation/${editingLink.id}` : '/api/admin/navigation';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setShowForm(false);
    setEditingLink(null);
    setFormData({
      labelDe: '',
      labelEn: '',
      url: '',
      position: 0,
      location: 'navbar',
      parentId: ''
    });
    fetchLinks();
  };

  const handleEdit = (link: NavLink) => {
    setEditingLink(link);
    setFormData({
      labelDe: link.labelDe,
      labelEn: link.labelEn,
      url: link.url,
      position: link.position,
      location: link.location,
      parentId: link.parentId || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Link wirklich löschen?')) return;
    
    await fetch(`/api/admin/navigation/${id}`, { method: 'DELETE' });
    fetchLinks();
  };

  const moveLink = async (id: string, direction: 'up' | 'down') => {
    await fetch(`/api/admin/navigation/${id}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction })
    });
    fetchLinks();
  };

  const navbarLinks = links.filter(l => l.location === 'navbar').sort((a, b) => a.position - b.position);
  const footerLinks = links.filter(l => l.location === 'footer').sort((a, b) => a.position - b.position);

  const renderLinks = (allLinks: NavLink[], items: NavLink[], level = 0) => {
    return items.map((link) => (
      <div key={link.id} className="space-y-2">
        <div className={clsx(
          "flex items-center gap-2 p-2 bg-gray-50 rounded border-l-4",
          level > 0 ? "border-primary/30 ml-8" : "border-primary"
        )}>
          <div className="flex-1">
            <div className="font-medium">
              {level > 0 && <span className="text-gray-400 mr-2">↳</span>}
              {link.labelDe}
            </div>
            <div className="text-sm text-gray-500">{link.url}</div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => moveLink(link.id, 'up')} className="p-1 text-gray-500 hover:text-primary" title="Nach oben">
              ↑
            </button>
            <button onClick={() => moveLink(link.id, 'down')} className="p-1 text-gray-500 hover:text-primary" title="Nach unten">
              ↓
            </button>
            <button onClick={() => handleEdit(link)} className="p-1 text-blue-500 hover:text-blue-700">
              Bearbeiten
            </button>
            <button onClick={() => handleDelete(link.id)} className="p-1 text-red-500 hover:text-red-700">
              Löschen
            </button>
          </div>
        </div>
        {/* Render children recursively */}
        {allLinks.filter(child => child.parentId === link.id).length > 0 && (
          <div className="space-y-2">
            {renderLinks(
              allLinks,
              allLinks
                .filter(child => child.parentId === link.id)
                .sort((a, b) => a.position - b.position),
              level + 1
            )}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold text-gray-800">
          Navigation verwalten
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingLink(null);
            setFormData({
              labelDe: '',
              labelEn: '',
              url: '',
              position: activeTab === 'navbar' ? navbarLinks.length : footerLinks.length,
              location: activeTab,
              parentId: ''
            });
          }}
          className="btn-primary"
        >
          + Neuer Link
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('navbar')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'navbar' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
        >
          Navigation
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'footer' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
        >
          Footer
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="font-heading text-xl font-bold mb-6">
            {editingLink ? 'Link bearbeiten' : 'Neuer Link'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label (Deutsch)
                </label>
                <input
                  type="text"
                  value={formData.labelDe}
                  onChange={(e) => setFormData({ ...formData, labelDe: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label (Englisch)
                </label>
                <input
                  type="text"
                  value={formData.labelEn}
                  onChange={(e) => setFormData({ ...formData, labelEn: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL / Slug
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="input-field"
                placeholder="/about"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position (Reihenfolge)
                </label>
                <input
                  type="number"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Übergeordneter Link (optional)
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="input-field"
                >
                  <option value="">Kein (Hauptlink)</option>
                  {navbarLinks.filter(l => !l.parentId).map(link => (
                    <option key={link.id} value={link.id}>{link.labelDe}</option>
                  ))}
                </select>
              </div>
            </div>

            <input type="hidden" value={activeTab} />

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                Speichern
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingLink(null);
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
      ) : (
        <div className="space-y-8">
          {activeTab === 'navbar' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold mb-4">Navigation</h2>
              {navbarLinks.length === 0 ? (
                <p className="text-gray-500">Noch keine Links vorhanden.</p>
              ) : (
                <div className="space-y-2">
                  {renderLinks(
                    navbarLinks,
                    navbarLinks.filter(l => !l.parentId)
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold mb-4">Footer</h2>
              {footerLinks.length === 0 ? (
                <p className="text-gray-500">Noch keine Links vorhanden.</p>
              ) : (
                <div className="space-y-2">
                  {renderLinks(
                    footerLinks,
                    footerLinks.filter(l => !l.parentId)
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
