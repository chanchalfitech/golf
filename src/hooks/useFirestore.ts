import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export function useFirestore<T extends { id?: string }>(
  collectionName: string,
  p0: string[][],
  pageSize: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);


  const fetchData = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, collectionName),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      setData(items);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === pageSize);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchNextPage = async () => {
    if (!lastDoc || !hasMore) return;

    try {
      setLoading(true);

      const q = query(
        collection(db, collectionName),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );

      const querySnapshot = await getDocs(q);

      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

      // append to existing list
      setData(prev => [...prev, ...items]);

      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);

      // no more pages
      setHasMore(querySnapshot.docs.length === pageSize);
    } catch (err) {
      console.error('Error fetching next page:', err);
      setError('Failed to load more');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<T, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...item,
        createdAt: serverTimestamp()
      });
      await fetchData();
    } catch (err) {
      console.error('Error adding document:', err);
      setError('Failed to add item');
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>) => {
    try {
      await updateDoc(doc(db, collectionName, id), updates);
      await fetchData();
    } catch (err) {
      console.error('Error updating document:', err);
      setError('Failed to update item');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      await fetchData();
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete item');
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName]);

  return {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refetch: fetchData,
    fetchNextPage,
    hasMore
  };
}