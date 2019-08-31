import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from '../model/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private Posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  getPosts() {
    return [...this.Posts];
  }

  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { title: title, content: content };
    this.Posts.push(post);
    this.postUpdated.next([...this.Posts]);
  }
}
