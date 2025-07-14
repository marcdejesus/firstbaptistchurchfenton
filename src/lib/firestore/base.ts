import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  QueryConstraint,
  DocumentData,
  Query,
  DocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface PaginationOptions {
  pageSize?: number;
  lastDocument?: DocumentSnapshot<DocumentData>;
}

export interface QueryOptions {
  where?: Array<[string, any, any]>;
  orderBy?: Array<[string, 'asc' | 'desc']>;
  limit?: number;
}

export class BaseFirestoreService {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected getCollection() {
    return collection(db, this.collectionName);
  }

  protected getDocRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  async create(data: any): Promise<string> {
    try {
      const docRef = await addDoc(this.getCollection(), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<any | null> {
    try {
      const docSnap = await getDoc(this.getDocRef(id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error(`Error getting document ${id} from ${this.collectionName}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<any>): Promise<void> {
    try {
      await updateDoc(this.getDocRef(id), {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error(`Error updating document ${id} in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(this.getDocRef(id));
    } catch (error) {
      console.error(`Error deleting document ${id} from ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getAll(options?: QueryOptions): Promise<any[]> {
    try {
      const constraints: QueryConstraint[] = [];
      
      if (options?.where) {
        options.where.forEach(([field, operator, value]) => {
          constraints.push(where(field, operator, value));
        });
      }
      
      if (options?.orderBy) {
        options.orderBy.forEach(([field, direction]) => {
          constraints.push(orderBy(field, direction));
        });
      }
      
      if (options?.limit) {
        constraints.push(limit(options.limit));
      }

      const q = query(this.getCollection(), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getPaginated(pagination: PaginationOptions = {}, options?: QueryOptions): Promise<{
    data: any[];
    hasMore: boolean;
    lastDocument?: DocumentSnapshot<DocumentData>;
  }> {
    try {
      const { pageSize = 10, lastDocument } = pagination;
      const constraints: QueryConstraint[] = [];
      
      if (options?.where) {
        options.where.forEach(([field, operator, value]) => {
          constraints.push(where(field, operator, value));
        });
      }
      
      if (options?.orderBy) {
        options.orderBy.forEach(([field, direction]) => {
          constraints.push(orderBy(field, direction));
        });
      }
      
      constraints.push(limit(pageSize + 1));
      
      if (lastDocument) {
        constraints.push(startAfter(lastDocument));
      }

      const q = query(this.getCollection(), ...constraints);
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs;
      
      const hasMore = docs.length > pageSize;
      const data = docs.slice(0, pageSize).map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        data,
        hasMore,
        lastDocument: hasMore ? docs[pageSize - 1] : undefined
      };
    } catch (error) {
      console.error(`Error getting paginated documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  protected timestampToDate(timestamp: any): Date | null {
    if (!timestamp) return null;
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    return null;
  }
}