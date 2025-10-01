'use client';

import { useState } from 'react';

/**
 * Interface untuk data dokumen pengguna
 */
interface UserDocument {
  id: string;
  userId: string;
  documentType: string;
  documentNumber: string;
  documentName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook untuk mengambil dokumen pengguna dari API
 * @returns {Object} Objek yang berisi dokumen, loading state, error, dan fungsi untuk mengambil dokumen
 */
export const useUserDocuments = () => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fungsi untuk mengambil dokumen pengguna dari API
   * @param {string} userId - ID pengguna
   */
  const fetchUserDocuments = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v2/users/${userId}/documents`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Terjadi kesalahan saat mengambil dokumen pengguna'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk menambahkan dokumen pengguna
   * @param {string} userId - ID pengguna
   * @param {FormData} formData - Data dokumen yang akan ditambahkan
   */
  const addUserDocument = async (userId: string, formData: FormData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v2/users/${userId}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const newDocument = await response.json();
      setDocuments(prev => [...prev, newDocument]);
      return newDocument;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Terjadi kesalahan saat menambahkan dokumen'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk menghapus dokumen pengguna
   * @param {string} userId - ID pengguna
   * @param {string} documentId - ID dokumen yang akan dihapus
   */
  const deleteUserDocument = async (userId: string, documentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v2/users/${userId}/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Terjadi kesalahan saat menghapus dokumen'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk memverifikasi dokumen pengguna
   * @param {string} userId - ID pengguna
   * @param {string} documentId - ID dokumen yang akan diverifikasi
   */
  const verifyUserDocument = async (userId: string, documentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v2/users/${userId}/documents/${documentId}/verify`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedDocument = await response.json();
      setDocuments(prev => prev.map(doc => doc.id === documentId ? updatedDocument : doc));
      return updatedDocument;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Terjadi kesalahan saat memverifikasi dokumen'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    loading,
    error,
    fetchUserDocuments,
    addUserDocument,
    deleteUserDocument,
    verifyUserDocument
  };
};