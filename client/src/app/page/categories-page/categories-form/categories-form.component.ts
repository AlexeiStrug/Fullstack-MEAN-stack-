import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoriesService} from '../../../services/categories.service';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {MaterialService} from '../../../shared/clasess/material.service';
import {Category} from '../../../shared/interfaces';
import {error} from 'util';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  // @ts-ignore
  @ViewChild('input') inputRef: ElementRef;
  isNew = true;
  form: FormGroup;
  image: File;
  imagePreview = '';
  category: Category;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoryService: CategoriesService) {
  }

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });
    this.form.disable();

    this.route.params.pipe(switchMap((params: Params) => {
        if (params.id) {
          this.isNew = false;
          return this.categoryService.getById(params.id);
        }
        return of(null);
      }
      )
    ).subscribe(category => {
        if (category) {
          this.category = category;
          this.form.patchValue({
            name: category.name
          });
          this.imagePreview = category.imageSrc;
          MaterialService.updateTextInputs();
        }
        this.form.enable();
      },
      error => MaterialService.toast(error.error.message)
    );
  }

  onSubmit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.categoryService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.categoryService.update(this.category._id, this.form.value.name, this.image);
    }

    obs$.subscribe(category => {
        this.category = category;
        MaterialService.toast('Changes are implemented');
        this.form.enable();
      },
      error => {
        this.form.enable();
        MaterialService.toast(error.error.message);
      }
    );
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      // @ts-ignore
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  deleteCategory() {
    const decision = window.confirm(`Are you sure, that you want to delete category -> ${this.category.name}?`);
    if (decision) {
      this.categoryService.delete(this.category._id).subscribe(
        response => MaterialService.toast(response.message),
        error => MaterialService.toast(error.error.message),
        () => this.router.navigate(['/category'])
      )
      ;
    }
  }


}
