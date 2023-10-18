import { FormControl } from "@angular/forms";

export interface ProfileForm{
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  zipcode: FormControl<string | null>;
  phone: FormControl<string | null>;
  password: FormControl<string | null>;
}
