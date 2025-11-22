import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { IPostRepository } from '../domain/PostRepository';

export class FirestorePostRepository extends IPostRepository {
  async getAllPosts() {
    const postsCollection = collection(db, 'posts');
    const snapshot = await getDocs(postsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async addPost(post) {
    const postsCollection = collection(db, 'posts');
    return await addDoc(postsCollection, post);
  }
}
