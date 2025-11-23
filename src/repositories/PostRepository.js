import { collection, getDocs, addDoc, query as fbQuery, orderBy as fbOrderBy, limit as fbLimit, startAfter as fbStartAfter } from 'firebase/firestore';
import { mapDocToPost } from '../domain/Post';

export class FirestorePostRepository {
  constructor(db) {
    this.db = db;
  }

  async getAllPosts({ orderBy = null, limit = null, cursor = null, where = null } = {}) {
    const postsCollection = collection(this.db, 'posts');

    // Build query clauses
    const clauses = [];

    if (orderBy && orderBy.field) {
      // orderBy: { field: 'createdAt', direction: 'desc' }
      clauses.push(fbOrderBy(orderBy.field, orderBy.direction || 'desc'));
    }

    if (limit && Number.isInteger(limit)) {
      clauses.push(fbLimit(limit));
    }

    if (cursor) {
      // cursor should be a document snapshot or a value; prefer snapshot
      clauses.push(fbStartAfter(cursor));
    }

    const q = clauses.length > 0 ? fbQuery(postsCollection, ...clauses) : postsCollection;
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => mapDocToPost(doc));
    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    return { posts, lastDoc };
  }

  async addPost(post) {
    const postsCollection = collection(this.db, 'posts');
    return await addDoc(postsCollection, post);
  }

  getPostsRealtime({ orderBy = null, limit = null } = {}, onUpdate) {
    const postsCollection = collection(this.db, 'posts');
    const clauses = [];
    if (orderBy && orderBy.field) {
      clauses.push(fbOrderBy(orderBy.field, orderBy.direction || 'desc'));
    }
    if (limit && Number.isInteger(limit)) {
      clauses.push(fbLimit(limit));
    }
    const q = clauses.length > 0 ? fbQuery(postsCollection, ...clauses) : postsCollection;
    // onSnapshot returns an unsubscribe function
    const unsubscribe = require('firebase/firestore').onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => mapDocToPost(doc));
      onUpdate(posts, snapshot);
    });
    return unsubscribe;
  }
}
