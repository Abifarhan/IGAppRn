export function mapDocToPost(doc) {
  const data = doc.data ? doc.data() : doc;
  return {
    id: doc.id || data.id || null,
    user: data.user || 'Unknown',
    avatar: data.avatar || null,
    type: data.type || 'text',
    text: data.text || '',
    img: data.img || null,
    time: data.time || (data.createdAt ? data.createdAt.toDate ? data.createdAt.toDate().toISOString() : String(data.createdAt) : null),
  };
}
// Domain entity for a Post
export class Post {
  constructor({ id, user, time, text, type, img, video, avatar }) {
    this.id = id;
    this.user = user;
    this.time = time;
    this.text = text;
    this.type = type; // 'text', 'img', 'video'
    this.img = img;
    this.video = video;
    this.avatar = avatar;
  }
}
