'use client';

import { useState, useEffect, useRef } from 'react';

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await fetch('/api/admin/media');
    const data = await res.json();
    setFiles(data);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      await fetch('/api/admin/media', {
        method: 'POST',
        body: formData
      });
      fetchFiles();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diese Datei wirklich löschen?')) return;
    
    await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
    fetchFiles();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold text-gray-800">
          Medienverwaltung
        </h1>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary"
          >
            {uploading ? 'Hochladen...' : '+ Datei hochladen'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Laden...</div>
      ) : files.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-500">Noch keine Dateien vorhanden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file) => (
            <div key={file.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {file.mimeType.startsWith('image/') ? (
                  <img 
                    src={file.path} 
                    alt={file.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">📄</span>
                )}
              </div>
              <p className="text-sm font-medium truncate">{file.originalName}</p>
              <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
              <button
                onClick={() => handleDelete(file.id)}
                className="mt-2 text-red-600 text-sm hover:underline w-full text-center"
              >
                Löschen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
