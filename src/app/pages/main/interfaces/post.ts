import { FormControl } from "@angular/forms";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
export interface Comment {
  author: string;
  text: string;
  date: string; // you can use Date if you prefer
}
export interface PostWithAuthor extends Post{
  author:string;
  image?: string | null; 
  isNew?: boolean;
  comments: Comment[];
  commentsHidden?: boolean;
}

export interface PostForm {
  userId: FormControl<number | null>;
  id: FormControl<number | null>;
  title: FormControl<string | null>;
  body: FormControl<string | null>;
}



