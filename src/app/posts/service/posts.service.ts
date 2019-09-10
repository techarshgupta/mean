import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

import { Post } from '../model/post.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private Posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    // return [...this.Posts];
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          });
        })
      )
      .subscribe(posts => {
        this.Posts = posts;
        this.postUpdated.next([...this.Posts]);
      });
  }

  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    // return { ...this.Posts.find(p => p.id === id) };
    return this.http.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  addPost(title: string, image: File, content: string) {
    // const post: Post = { id: null, title: title, content: content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('image', image, title);
    postData.append('content', content);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe(responseData => {
        console.log(
          'TCL: PostsService -> addPost -> responseData',
          responseData
        );
        const post: Post = {
          id: responseData.post.id,
          title,
          imagePath: responseData.post.imagePath,
          content
        };
        this.Posts.push(post);
        this.postUpdated.next([...this.Posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, image: File | string, content: string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      const postData = new FormData();
      postData.append('title', title);
      postData.append('image', image, title);
      postData.append('content', content);
    } else {
      const postData: Post = {
        id,
        title,
        imagePath: image,
        content
      };
    }

    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.Posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id,
          title,
          imagePath: '',
          content
        };
        updatedPosts[oldPostIndex] = post;
        this.Posts = updatedPosts;
        this.postUpdated.next([...this.Posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(res => {
        console.log('deleted succesfully', res);
        const updatedPosts = this.Posts.filter(post => post.id !== postId);
        this.Posts = updatedPosts;
        this.postUpdated.next([...this.Posts]);
      });
  }
}
