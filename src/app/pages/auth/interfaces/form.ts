import { FormControl } from "@angular/forms";

export interface LoginForm {
  accountName: FormControl<string | null>;
  password: FormControl<string | null>;
}
