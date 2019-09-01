import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../model/post.model';
import { PostsService } from '../service/posts.service';

@Component({
  selector: 'app-post-lists',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'first post', content: "this is the first post's content" },
  //   { title: 'second post', content: "this is the second post's content" },
  //   { title: 'third post', content: "this is the third post's content" },
  //   { title: 'fourth post', content: "this is the fourth post's content" },
  //   { title: 'fifth post', content: "this is the fifth post's content" },
  //   { title: 'sixth post', content: "this is the sixth post's content" }
  // ];
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {  }

  ngOnInit() {
    this.postsService.getPosts();
    this.postsService.getPostUpdateListner().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
