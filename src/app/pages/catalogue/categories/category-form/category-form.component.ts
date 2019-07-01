import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CategoryService } from '../services/category.service';
import { ConfigService } from '../../../shared/services/config.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, OnChanges {
  @Input() category: any;
  form: FormGroup;
  roots = [];
  languages = [];
  config = {
    placeholder: '',
    tabsize: 2,
    height: 300,
    uploadImagePath: '',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  };
  showRemoveButton = true;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.categoryService.getListOfCategories()
      .subscribe(res => {
        res.sort((a, b) => {
          if (a.code < b.code)
            return -1;
          if (a.code > b.code)
            return 1;
          return 0;
        });
        this.roots = [...res];
      });
    this.createForm();
    this.configService.getListOfSupportedLanguages()
      .subscribe(res => {
        this.languages = [...res];
        this.addFormArray();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.category.currentValue && changes.category.currentValue.id) {
      if (this.category.id) {
        this.showRemoveButton = false;
      }
      this.fillForm();
      this.fillFormArray();
    }
  }

  private createForm() {
    this.form = this.fb.group({
      root: ['', [Validators.required]],
      visible: [false, [Validators.required]],
      code: ['', [Validators.required]],
      order: [0, [Validators.required]],
      selectedLanguage: ['', [Validators.required]],
      descriptions: this.fb.array([]),
    });
  }

  addFormArray() {
    const control = <FormArray>this.form.controls.descriptions;
    this.languages.forEach(lang => {
      control.push(
        this.fb.group({
          language: [lang.code, [Validators.required]],
          name: ['', [Validators.required]],
          highlight: [''],
          friendlyUrl: [''],
          description: [''],
          title: [''],
          keyWords: [''],
          metaDescription: [''],
        })
      );
    });
  }

  fillForm() {
    this.form.patchValue({
      root: this.category.parent,
      visible: this.category.visible,
      code: this.category.code,
      order: this.category.sortOrder,
      selectedLanguage: 'en',
      descriptions: [],
    });
  }

  fillFormArray() {
    this.form.value.descriptions.forEach((desc, index) => {
      if (desc.language === 'en') {
        (<FormArray>this.form.get('descriptions')).removeAt(index);
        const control = <FormArray>this.form.controls.descriptions;
        control.push(
          this.fb.group({
            language: this.form.value.selectedLanguage,
            name: this.category.description.name,
            highlight: this.category.description.highlights,
            friendlyUrl: this.category.description.friendlyUrl,
            description: this.category.description.description,
            title: this.category.description.title,
            keyWords: this.category.description.keyWords,
            metaDescription: this.category.description.metaDescription,
          })
        );
      }
    });
  }

  get selectedLanguage() {
    return this.form.get('selectedLanguage');
  }

  save() {
    const categoryObject = this.form.value;
    categoryObject.descriptions.forEach(el => {
      el.friendlyUrl = el.friendlyUrl.replace(/ /g, '-').toLowerCase();
    });
    console.log('save', categoryObject);
  }

  remove() {
    this.categoryService.deleteCategory(this.category.id)
      .subscribe(res => {
        console.log(res);
        this.toastr.success('Category successfully removed.', 'Success');
        this.router.navigate(['pages/store-management/stores-list']);
      });
  }

}
