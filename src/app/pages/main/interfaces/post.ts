import { FormControl } from "@angular/forms";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface PostWithAuthor extends Post{
  author:string;
}

export interface PostForm {
  userId: FormControl<number | null>;
  id: FormControl<number | null>;
  title: FormControl<string | null>;
  body: FormControl<string | null>;
}

