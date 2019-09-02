import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

import { Post } from '../model/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private Posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {
  }

  getPosts() {
    // return [...this.Posts];
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
          };
        });
      }))
      .subscribe((posts) => {
        this.Posts = posts;
        this.postUpdated.next([...this.Posts]);
      });
  }

  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
      });
    this.Posts.push(post);
    this.postUpdated.next([...this.Posts]);
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe((res) => {
        console.log('deleted succesfully', res);
        // const updatedPosts = this.Posts.filter((post) => {
        //   post.id = postId;
        // });
        // this.Posts = updatedPosts;
        // this.postUpdated.next([...this.Posts]);
      });
  }
}
