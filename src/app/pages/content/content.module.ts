import { NgModule } from '@angular/core';
import { ContentRoutingModule, routedComponents } from './content-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ngfModule } from 'angular-file';
import { QueryBuilderModule } from "angular2-query-builder";
import { NbDialogModule } from '@nebular/theme';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LightboxModule } from 'ngx-lightbox';

// import { ContentComponent } from './content.component';
// import { PageComponent } from './pages/page.component';

@NgModule({
  declarations: [
    ...routedComponents
  ],
  imports: [
    ContentRoutingModule,
    SharedModule,
    ngfModule,
    QueryBuilderModule,
    NbDialogModule.forChild(),
    CKEditorModule,
    NgxDropzoneModule,
    LightboxModule,
  ],
  exports: [ngfModule]
})
export class ContentModule { }
