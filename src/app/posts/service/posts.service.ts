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
  private postUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    // return [...this.Posts];
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedData => {
        this.Posts = transformedData.posts;
        this.postUpdated.next({
          posts: [...this.Posts],
          postCount: transformedData.maxPosts
        });
      });
  }

  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    // return { ...this.Posts.find(p => p.id === id) };
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/api/posts/' + id);
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
        // console.log(
        //   'TCL: PostsService -> addPost -> responseData',
        //   responseData
        // );
        // const post: Post = {
        //   id: responseData.post.id,
        //   title,
        //   imagePath: responseData.post.imagePath,
        //   content
        // };
        // this.Posts.push(post);
        // this.postUpdated.next([...this.Posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, image: File | string, content: string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('image', image, title);
      postData.append('content', content);
    } else {
      postData = {
        id,
        title,
        imagePath: image,
        content
      };
    }
    console.log('TCL: PostsService -> updatePost -> postData', postData);
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        // const updatedPosts = [...this.Posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = {
        //   id,
        //   title,
        //   imagePath: '',
        //   content
        // };
        // updatedPosts[oldPostIndex] = post;
        // this.Posts = updatedPosts;
        // this.postUpdated.next([...this.Posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
    // .subscribe(res => {
    //   console.log('deleted succesfully', res);
    //   const updatedPosts = this.Posts.filter(post => post.id !== postId);
    //   this.Posts = updatedPosts;
    //   this.postUpdated.next([...this.Posts]);
    // });
  }
}
