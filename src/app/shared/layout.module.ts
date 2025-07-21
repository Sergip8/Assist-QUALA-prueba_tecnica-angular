import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Ng Zorro imports
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';

// Icons
import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  BankOutline,
  UnorderedListOutline,
  PlusOutline,
  DollarOutline,
  UserOutline,
  SettingOutline,
  LogoutOutline,
  LockOutline,
  MailOutline,
  EyeOutline,
  EyeInvisibleOutline,
  LoginOutline,
  UserAddOutline,
  ExportOutline
} from '@ant-design/icons-angular/icons';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputModule } from 'ng-zorro-antd/input';

const icons = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  BankOutline,
  UnorderedListOutline,
  PlusOutline,
  DollarOutline,
  UserOutline,
  SettingOutline,
  LogoutOutline,
  LockOutline,
  MailOutline,
  EyeOutline,
  EyeInvisibleOutline,
  LoginOutline,
  UserAddOutline,
  ExportOutline
];

@NgModule({
  declarations: [],
  imports: [

    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule.forChild(icons),
    NzAvatarModule,
    NzMessageModule,
    NzButtonModule,
    NzToolTipModule,
    NzBreadCrumbModule,
    NzFormModule,
    NzCheckboxModule,
    NzRadioModule,
    NzDatePickerModule,
    NzSelectModule,
    NzSpinModule,
    NzModalModule,
    NzTableModule,
    NzDropDownModule,
    NzEmptyModule,
    NzImageModule,
    NzTagModule,
    NzInputModule,
   NzCardModule,
   NzGridModule,
   NzProgressModule,
    NzPageHeaderModule,
    NzDescriptionsModule,
    NzDividerModule


  ],
  exports: [
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzAvatarModule,
    NzMessageModule,
    NzButtonModule,
    NzToolTipModule,
    NzBreadCrumbModule,
    NzFormModule,
    NzCheckboxModule,
    NzRadioModule,
    NzDatePickerModule,
    NzSelectModule,
    NzSpinModule,
    NzModalModule,
    NzTableModule,
    NzDropDownModule,
    NzEmptyModule,
    NzImageModule,
    NzTagModule,
    NzInputModule,
    NzCardModule,
   NzGridModule,
    NzProgressModule,
    NzPageHeaderModule,
    NzDescriptionsModule,
    NzDividerModule
  ],
 
})
export class NgZorroModule { }