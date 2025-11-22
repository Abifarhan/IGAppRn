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
