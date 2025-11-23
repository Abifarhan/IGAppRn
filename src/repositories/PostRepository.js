import { collection, getDocs, addDoc } from 'firebase/firestore';

export class FirestorePostRepository {
  constructor(db) {
    this.db = db;
  }

  async getAllPosts({ orderBy = null, limit = null, where = null } = {}) {
    const postsCollection = collection(this.db, 'posts');
    // For now just a simple getDocs. Ordering/pagination will be added in next step.
    const snapshot = await getDocs(postsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async addPost(post) {
    const postsCollection = collection(this.db, 'posts');
    return await addDoc(postsCollection, post);
  }
}
