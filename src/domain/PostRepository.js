// Domain repository interface for Post
export class PostRepository {
  /**
   * @returns {Promise<Post[]>}
   */
  async getAllPosts() {
    throw new Error('Not implemented');
  }

  /**
   * @param {Post} post
   * @returns {Promise<void>}
   */
  async addPost(post) {
    throw new Error('Not implemented');
  }
}
